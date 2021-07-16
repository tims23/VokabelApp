import React, {useState, useEffect} from 'react';
import Pattern from './Pattern/Pattern';
import {useLearnedVokabeln, useVokabeln} from './VokabelProvider';
import {firestore} from 'firebase';
import ProgressBar from './ProgressBar';
import './GroupVisualizer.css';

function GroupVisualizer() {
	const vokabeln = useVokabeln();
	const learnedVokabeln = useLearnedVokabeln();
	const [learnedGroups, setlearnedgroups] = useState([]);
	const [groups, setgroups] = useState([]);
	const [index, setindex] = useState(0);

	const next = (group) => {
		//es wird die nächste Vokabelgruppe angezeigt

		const cloneGroup = Object.assign({}, group); //group wird geklont um kopplung an firebase aufzuheben. Dadurch kann die Datenbank
		//verändert werden und gleichzeitig alle gelernten Gruppen angezeigt werden. Wenn das Objekt nicht kloniert würde, würde es bei
		//Veränderung nicht mehr in der Abfrage auftauchen und die group würde aus der GUI verschwinden.

		firestore()
			.collection('Vokabelgruppen')
			.doc(group.ID)
			.update({Datum: group.Datum, Gelernt: group.Gelernt, Level: group.Level, LastModified: group.LastModified});
		setlearnedgroups(learnedGroups.concat(cloneGroup));

		if (index < groups.length - 1) {
			setindex(index + 1);
		}
	};

	useEffect(
		() => {
			setlearnedgroups(learnedVokabeln.concat(learnedGroups));
		},
		[learnedVokabeln]
	);

	useEffect(
		() => {
			setgroups(learnedGroups.concat(vokabeln));
		},
		[vokabeln]
	);

	useEffect(
		() => {
			console.log(learnedGroups);
			setgroups(learnedGroups.concat(vokabeln));
		},
		[learnedGroups]
	);

	return (
		<div>
			<div className="GroupVisualizer-ProgressBar">
				<ProgressBar progress={learnedGroups.length} count={groups.length} />
			</div>
			<div
				style={index > 0 ? {display: 'block'} : {display: 'none'}}
				className="GroupVisualizer-left"
				onClick={() => {
					if (index > 0) {
						setindex(index - 1);
					}
				}}
			>
				<span />
				<span />
			</div>

			<div
				style={index < groups.length - 1 ? {display: 'block'} : {display: 'none'}}
				className="GroupVisualizer-right"
				onClick={() => {
					if (index < groups.length - 1) {
						setindex(index + 1);
					}
				}}
			>
				<span />
				<span />
			</div>
			<div className="GroupVisualizer-content">
				{groups.map((group, i) => (
					<div style={i === index ? {display: 'block'} : {display: 'none'}} key={i}>
						<Pattern group={group} subbmit={next} />
					</div>
				))}
			</div>
		</div>
	);
}

export default GroupVisualizer;
