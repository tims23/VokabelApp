import firebase, {firestore} from 'firebase';
import React, {useEffect, useState} from 'react';

import Pattern from './Pattern';

export function LoadedPattern() {
	const uid = 'HXNM1uYn6jPll9IShBUc0fGYnMV2';

	const date = new Date();
	const currentDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const completeCurrentDay = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		date.getHours(),
		date.getMinutes()
	);

	const lastLogin = new Date(2021, 4, 28);
	const lastLoginTimestamp = firestore.Timestamp.fromDate(lastLogin);

	const timestamp = firestore.Timestamp.fromDate(currentDay);
	const completeTimestamp = firestore.Timestamp.fromDate(completeCurrentDay);

	const [vokIDs, setvokIDs] = useState([]);
	const [vokData, setvokData] = useState([]);
	const [vokPositions, setvokPositions] = useState([]);
	const [groupID, setgroupID] = useState(0);
	const [groupLevel, setgroupLevel] = useState(0);

	const updateRef = (level) => {
		var next = currentDay;
		switch (level) {
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
				break;
		}
		firestore()
			.collection('Vokabelgruppen')
			.doc(groupID)
			.update({Datum: next, Gelernt: timestamp, Level: level + 1});
	};

	const connect = () => {
		/*firestore()
			.collection('Vokabelgruppen')
			.where('LastModified', '<', completeTimestamp)
			.where('Datum', '<', timestamp)
			.where('UID', '==', uid)
			.onSnapshot((res) => {
				console.log(res.docs[0].data());
			});*/
		firestore()
			.collection('Vokabelgruppen')
			.where('Datum', '<', timestamp)
			.where('UID', '==', uid)
			.get({source: 'cache'})
			.then((res) => {
				if (res.docs.length > 0) {
					setgroupID(res.docs[0].id);
					setgroupLevel(res.docs[0].data().Level);
					var loadedVokIDs = [];
					var loadedVokPositions = [];
					res.docs[0].data().Vokabeln.forEach((e2) => {
						loadedVokIDs.push(e2.ID);
						loadedVokPositions.push(e2.Position);
					});
					setvokIDs(loadedVokIDs);
					setvokPositions(loadedVokPositions);
					firestore().collection('Deutsch-Englisch').where('ID', 'in', loadedVokIDs).get().then((vok) => {
						var res = [];
						vok.forEach((element) => {
							res.push(element.data());
						});
						setvokData(res);
					});
				} else {
					console.log('Keine Vokabelgruppen gefunden');
				}
			});
	};

	useEffect(() => {
		firestore().settings({cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED});
		firestore()
			.enablePersistence()
			.catch((err) => {
				connect();
				if (err.code == 'failed-precondition') {
					console.log(
						'Initialisierung der Offline Datenbank fehlgeschlagen, da zu viele Tabs geöffnet sind.'
					);
					// Multiple tabs open, persistence can only be enabled
					// in one tab at a a time.
					// ...
				} else if (err.code == 'unimplemented') {
					console.log(
						'Initialisierung der Offline Datenbank fehlgeschlagen, da der Browser dies nicht unterstützt.'
					);
					// The current browser does not support all of the
					// features required to enable persistence
					// ...
				}
			})
			.then(() => {
				firestore()
					.collection('Vokabelgruppen')
					.where('UID', '==', uid)
					.where('LastModified', '>', lastLoginTimestamp)
					.onSnapshot((res) => {
						console.log('Vokabelgruppen aktualisiert: ' + res.docs.length + ' Veränderungen ');
						connect();
					});
				firestore()
					.collection('Deutsch-Englisch')
					.where('LastModified', '>', lastLoginTimestamp)
					.onSnapshot((res) => {
						console.log('Vokabeln aktualisiert: ' + res.docs.length + ' Veränderungen ');
						connect();
					});
			});
	}, []);

	const addDays = (date, days) => {
		var result = new Date(date);
		result.setDate(result.getDate() + days);
		var timestamp = firestore.Timestamp.fromDate(result);
		return timestamp;
	};
	/*
	----Alte Version----

	const groupRef = useFirestore().collection('Vokabelgruppen').where('Datum', '<', timestamp).where('UID', '==', uid);
	const groupData = useFirestoreCollection(groupRef);

	var vokIDs = [];
	var vokPositions = [];
	const groupID = groupData.docs[0].id;
	groupData.docs[0].data().Vokabeln.forEach((e2) => {
		vokIDs.push(e2.ID);
		vokPositions.push(e2.Position);
	});

	const specificGroupRef = useFirestore().collection('Vokabelgruppen').doc(groupID);
	const updateRef = () => {
		specificGroupRef.update({Datum: addDays(currentDay, 100)});
	};

	console.log(vokIDs);

	const vokRef = useFirestore().collection('Deutsch-Englisch').where('ID', 'in', vokIDs);
	const vokData = useFirestoreCollectionData(vokRef);
*/
	return (
		<Pattern vokabeln={vokData} positions={vokPositions} groupID={groupID} level={groupLevel} update={updateRef} />
	);
}

export default LoadedPattern;
