import {firestore} from 'firebase';
import React, {createContext, useContext, useState, useEffect} from 'react';
import CookieFunktionen from './CookieFunktionen';

const VokabelContext = createContext();
const VokabelUpdateContext = createContext();

const date = new Date();
const currentDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
const completeCurrentDay = new Date(
	date.getFullYear(),
	date.getMonth(),
	date.getDate(),
	date.getHours(),
	date.getMinutes()
);

const lastLoginCookie = new Date(CookieFunktionen.getCookie('lastLogin'));
const lastLoginTimestamp = firestore.Timestamp.fromDate(lastLoginCookie);

const timestamp = firestore.Timestamp.fromDate(currentDay);
const completeTimestamp = firestore.Timestamp.fromDate(completeCurrentDay);

export function useVokabeln() {
	return useContext(VokabelContext);
}

export async function addVokabel(vok) {
	vok.LastModified = completeCurrentDay;
	const res = await firestore().collection('Deutsch-Englisch').add(vok);
	return res.id;
}

export function updateVokabel(ref, vok) {
	console.log('updated');
	vok.LastModified = completeCurrentDay;
	firestore().collection('Deutsch-Englisch').doc(ref).set(vok);
}

function VokabelProvider({children}) {
	const uid = 'HXNM1uYn6jPll9IShBUc0fGYnMV2';

	const [groupID, setgroupID] = useState(0);
	const [groups, setgroups] = useState([]);

	const connect = async () => {
		const res = await firestore()
			.collection('Vokabelgruppen')
			.where('Datum', '<', timestamp)
			.where('UID', '==', uid)
			.get({source: 'cache'});

		if (res.docs.length > 0) {
			var groupPromise = new Promise((resolve) => {
				var vokabelGruppen = [];
				res.docs.forEach(async (group) => {
					const groupObj = await getGroup(group);
					vokabelGruppen.push(groupObj);
					if (vokabelGruppen.length >= res.docs.length) {
						console.log(vokabelGruppen);
						resolve(vokabelGruppen);
					}
				});
			});
		} else {
			console.log('Keine Vokabelgruppen gefunden');
		}
		const resGroups = await groupPromise;
		setgroups(resGroups);
	};

	const getGroup = async (group) => {
		var vokIDs = [];
		var vokPositions = [];
		const groupData = group.data();
		groupData.Vokabeln.forEach((vokabel) => {
			vokIDs.push(vokabel.ID);
			vokPositions.push(vokabel.Position);
		});

		const vokContent = await getVok(vokIDs, vokPositions);

		var groupObj = {
			ID: group.id,
			Level: groupData.Level,
			Vokabeln: vokContent
		};
		return groupObj;
	};

	const getVok = async (vokIDs, vokPositions) => {
		const vok = await firestore().collection('Deutsch-Englisch').where('ID', 'in', vokIDs).get({source: 'cache'});
		var vokContent = [];
		var index = 0;
		vok.forEach((element) => {
			const vokData = element.data();
			const vokObj = {
				Position: vokPositions[index],
				Deutsch: vokData.Deutsch,
				Englisch: vokData.Englisch
			};
			vokContent.push(vokObj);
			index = index + 1;
		});
		return vokContent;
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
						CookieFunktionen.setCookie('lastLogin', completeCurrentDay, 300);
						console.log('Vokabelgruppen aktualisiert: ' + res.docs.length + ' Veränderungen ');
						connect();
					});
				firestore()
					.collection('Deutsch-Englisch')
					.where('LastModified', '>', lastLoginTimestamp)
					.onSnapshot((res) => {
						CookieFunktionen.setCookie('lastLogin', completeCurrentDay, 300);
						console.log('Vokabeln aktualisiert: ' + res.docs.length + ' Veränderungen ');
						connect();
					});
			});
	}, []);

	return (
		<div>
			<VokabelContext.Provider value={groups}>{children}</VokabelContext.Provider>
		</div>
	);
}

export default VokabelProvider;
