import {firestore} from 'firebase';
import React, {createContext, useContext, useState, useEffect} from 'react';
import CookieFunktionen from './CookieFunktionen';

const uid = 'HXNM1uYn6jPll9IShBUc0fGYnMV2';
//TODO: get UID dynamically

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

//Es wird ausgelesen wann der Nutzer das letzte Mal auf dem Gerät online war.
//Falls er noch nicht auf dem Gerät online war wird das frühset mögliche Datum gewählt.
const lastLoginCookie = new Date(
	CookieFunktionen.getCookie('lastLogin').length > 0 ? CookieFunktionen.getCookie('lastLogin') : 0
);
const lastLoginTimestamp = firestore.Timestamp.fromDate(lastLoginCookie);

const timestamp = firestore.Timestamp.fromDate(currentDay);
const completeTimestamp = firestore.Timestamp.fromDate(completeCurrentDay);

export function useVokabeln() {
	//custom hook to get access to vokabeln (content)
	return useContext(VokabelContext);
}

export async function addVokabel(vok) {
	vok.LastModified = completeCurrentDay;
	const res = await firestore().collection('Deutsch-Englisch').add(vok);
	firestore().collection('Vokabelgruppen').where('Fuellung', '<', 7).get({source: 'cache'}).then((vk) => {
		if (vk.docs.length > 0) {
			const group = vk.docs[0];
			var groupData = vk.docs[0].data();
			if (group.data().Level < 2) {
				groupData.Vokabeln = groupData.Vokabeln.concat({ID: res.id});
				groupData.LastModified = completeTimestamp;
				groupData.Fuellung = groupData.Fuellung + 1;

				firestore().collection('Vokabelgruppen').doc(group.id).set(groupData);
			}
		} else {
			const groupData = {
				Vokabeln: [{ID: res.id}],
				LastModified: completeTimestamp,
				Fuellung: 1,
				Datum: timestamp,
				UID: uid,
				Level: 0
			};
			firestore().collection('Vokabelgruppen').add(groupData);
		}
	});
	return res.id;
}

export function updateVokabel(ref, vok) {
	console.log('updated');
	vok.LastModified = completeCurrentDay;
	firestore().collection('Deutsch-Englisch').doc(ref).set(vok);
}

function VokabelProvider({children}) {
	const [groupID, setgroupID] = useState(0);
	const [groups, setgroups] = useState([]);

	const connect = async () => {
		const res = await firestore()
			.collection('Vokabelgruppen')
			.where('Datum', '<', timestamp) //Lädt Vokabelgruppen aus dem Cache, die
			.where('UID', '==', uid) //heute gelernt werden sollen.
			.get({source: 'cache'});

		var groupPromise; //Es wird ein Promise benötigt, da die Daten asynchron von den Datenbank gelesen werden.
		if (res.docs.length > 0) {
			//Wenn es Vokabelgruppen gibt, die an diesem Tag gelernt werden sollen

			groupPromise = new Promise((resolve) => {
				var vokabelGruppen = []; //Array mit allen zu lernenden Vokabelgruppen gefüllt mit den konkreten Vokabeln

				res.docs.forEach(async (group) => {
					//jede ungefüllte Vokabelgruppe wird gefüllt
					const groupObj = await getGroup(group); //"getGroup" befüllt die Gruppe
					vokabelGruppen.push(groupObj); //die gefüllte Gruppe wird dem ErgebnisArray hinzugefügt
					if (vokabelGruppen.length >= res.docs.length) {
						// Wenn der Ergebnis-Array so lang ist wie der Array an unbefüllten Vokabelgruppen wird das Promise resolved
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
		//nimmt Vokabelgruppe als Eingabe und ersetzt VokabelIDs mit den konkreten Vokabel-Objekten
		//var vokIDs = [];
		//var vokPositions = [];
		var groupData = group.data();
		groupData.ID = group.id;

		console.log(groupData);

		const res = new Promise((resove) => {
			var vokContent = [];
			groupData.Vokabeln.forEach(async (vokabel) => {
				//vokIDs.push(vokabel.ID);
				var vok = await getVok(vokabel.ID);
				vok.ID = vokabel.ID;
				vokContent.push(vok);
				if (vokContent.length >= groupData.Vokabeln.length) {
					resove(vokContent);
				}
				//vokPositions.push(vokabel.Position == undefined ? ' ' : vokabel.Position);
			});
		});

		//const vokContent = await getVok(vokIDs, vokPositions); //Vokabeln werden mit ihren jeweilgen Positionen zusammengeführt

		//groupData.Vokabeln = vokContent;
		groupData.Vokabeln = await res;
		//console.log(vokContent);
		return groupData;
	};

	const getVok = async (vokID) => {
		const vok = await firestore().collection('Deutsch-Englisch').doc(vokID).get();
		return vok.data();
		/*
		const res = new Promise((resolve) => {
			var vokContent = [];
			vokIDs.forEach(async (element, index) => {
				const vok = await firestore().collection('Deutsch-Englisch').doc(element).get();
				console.log(vok.data());
				const vokData = vok.data();
				const vokObj = {
					Position: vokPositions[index],
					Deutsch: vokData.Deutsch,
					Englisch: vokData.Englisch
				};
				vokContent.push(vokObj);
			});

			if (vokContent.length >= vokIDs.length) {
				console.log(vokContent);
				resolve(vokContent);
			}
		});
		return res;

		// const vok = await firestore().collection('Deutsch-Englisch').where('ID', 'in', vokIDs).get({source: 'cache'});
		// var vokContent = [];
		// var index = 0;
		// vok.forEach((element) => {
		// 	const vokData = element.data();
		// 	const vokObj = {
		// 		Position: vokPositions[index],
		// 		Deutsch: vokData.Deutsch,
		// 		Englisch: vokData.Englisch
		// 	};
		// 	vokContent.push(vokObj);
		// 	index = index + 1;
		// });
		// return vokContent;
		*/
	};

	useEffect(() => {
		//wenn Vokabelprovider instanziiert wird

		firestore().settings({cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED});
		firestore()
			.enablePersistence() /*Ergebnisse werden in Cache gespeichert */
			.catch((err) => {
				//connect(); //Funktion welche die aktuellen Vokabeln ausliest
				if (err.code == 'failed-precondition') {
					console.log(
						'Initialisierung der Offline Datenbank fehlgeschlagen, da zu viele Tabs geöffnet sind.'
					);
					// Multiple tabs open, persistence can only be enabled in one tab at a a time.
				} else if (err.code == 'unimplemented') {
					console.log(
						'Initialisierung der Offline Datenbank fehlgeschlagen, da der Browser dies nicht unterstützt.'
					);
					// Browser muckt
				}
			})
			.then(() => {
				//Wenn Offline-Funktion aktiviert wurde
				firestore()
					.collection('Vokabelgruppen')
					.where('UID', '==', uid)
					.where('LastModified', '>', lastLoginTimestamp)
					.onSnapshot((res) => {
						//Lädt neue Vokabelgruppen und Veränderungen in den Cache. Durch "onSnapshot" Echtzeit-Aktualisierung.
						CookieFunktionen.setCookie('lastLogin', completeCurrentDay, 300);
						console.log('Vokabelgruppen aktualisiert: ' + res.docs.length + ' Veränderungen ');
						connect(); //Funktion, welche Vokabelgruppen mit konkreten Vokabeln aufbereitet und in "groups" dem Kontext zur Verfügung stellt
					});
				firestore()
					.collection('Deutsch-Englisch')
					.where('LastModified', '>', lastLoginTimestamp)
					.onSnapshot((res) => {
						//Lädt neue Vokabeln und Veränderungen in den Cache. Durch "onSnapshot" Echtzeit-Aktualisierung.
						CookieFunktionen.setCookie('lastLogin', completeCurrentDay, 300);
						console.log('Vokabeln aktualisiert: ' + res.docs.length + ' Veränderungen ');
						connect(); //Funktion, welche Vokabelgruppen mit konkreten Vokabeln aufbereitet und in "groups" dem Kontext zur Verfügung stellt
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
