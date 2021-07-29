import {useState} from 'react';

import {useCompleteTimestamp, useCurrentDay, useTimeFunctions, useTimestamp} from '../Datum';

export function usePatternLogic(props = {}) {
	const {group} = props;

	const [subbmitted, setsubbmitted] = useState(0);
	const [right, setright] = useState(0);
	const [gridView, setgridView] = useState(true);
	const [detailView, setdetailView] = useState(false);
	const [detailViewItem, setdetailViewItem] = useState(null);
	const [newGroup, setnewGroup] = useState(group);

	const {Level, Vokabeln} = newGroup;

	const [date, currentDay, completeCurrentDay, timestamp, completeTimestamp, addDays] = useTimeFunctions();

	const updateRef = (done) => {
		//Funktion, die den nächsten Lerntag in die Datenbank einträgt.
		//Je nach Level der Vokabelgruppe werden die Intervalle länger
		var next = currentDay;
		var localGroup = group;
		switch (done ? Level : null) {
			case 0:
				next = addDays(next, 1);
				break;
			case 1:
				next = addDays(next, 1);
				break;
			case 2:
				next = addDays(next, 3);
				break;
			case 3:
				next = addDays(next, 7);
				break;
			case 4:
				next = addDays(next, 14);
				break;

			case 5:
				next = addDays(next, 30);
				break;

			case 6:
				next = addDays(next, 90);
				break;

			default:
				next = addDays(next, 1);
				break;
		}
		localGroup.Datum = next;
		localGroup.Gelernt = timestamp;
		localGroup.Level = done ? Level + 1 : Level > 1 ? Level - 1 : 1;
		localGroup.LastModified = completeTimestamp;

		setnewGroup(localGroup);
	};

	const subbmit = (res = null) => {
		//wird von Vokabelkomponente aufgerufen wenn der Nuter bestätig dass er die Vokabel konnte oder nicht.

		if (res !== null) {
			var localSubbmitted = subbmitted;
			var localRight = right;

			//updated state der Komponente
			if (res) {
				localSubbmitted = localSubbmitted + 1;
				localRight = localRight + 1;
				setsubbmitted(localSubbmitted);
				setright(right);
			} else {
				localSubbmitted = localSubbmitted + 1;
				setsubbmitted(localSubbmitted);
			}

			//kontrolliert ob alle Vokabeln bearbeitet wurden und updated die Gruppe daraufbasierend ob alle richtig waren
			if (localSubbmitted + 1 >= Vokabeln.length) {
				if (localSubbmitted === localRight) updateRef(true);
				else this.updateRef(false);

				console.log(group);
				props.subbmit(group); //veranlasst auf Parent, dass nächste Gruppe angezeigt werden kann. Übergibt bearbeite Gruppe
			}
		} else throw new Error('die Funktion benötigt einen gülztigen Parameter als Eingabe');
	};

	const switchView = (index = null) => {
		//switched zwischen DetailView und GridView

		if (index !== null) {
			setdetailViewItem(index);
			setgridView(false);
		} else setdetailView(false);
	};
	return [
		subbmitted,
		right,
		gridView,
		detailView,
		detailViewItem,
		newGroup,
		updateRef,
		subbmit,
		switchView,
		setdetailView,
		setgridView
	];
}

export default usePatternLogic;
