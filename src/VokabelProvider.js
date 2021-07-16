import {firestore} from 'firebase';
import React, {createContext, useContext, useState, useEffect} from 'react';
import CookieFunktionen from './CookieFunktionen';

const uid = 'HXNM1uYn6jPll9IShBUc0fGYnMV2';
//TODO: get UID dynamically

const VokabelContext = createContext();
const LearnedVokabelContext = createContext();

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

export function useLearnedVokabeln() {
	//custom hook um auf gelernte Vokkabeln zurückzugreifen

	return useContext(LearnedVokabelContext);
}

export async function addVokabel(vok) {
	//Funktion zum hochladen neuer Vokabeln
	//werden automatisch in Gruppe eingefügt
	vok.LastModified = completeCurrentDay;
	const res = await firestore().collection('Deutsch-Englisch').add(vok);
	firestore().collection('Vokabelgruppen').where('Fuellung', '<', 7).get({source: 'cache'}).then((vk) => {
		if (vk.docs.length > 0) {
			//wenn es eine vorhandene Vokabelgruppe mit weniger als 7 Einträgen gibt wird die Vokabel hier eingefügt
			const group = vk.docs[0];
			var groupData = vk.docs[0].data();
			if (group.data().Level < 2) {
				groupData.Vokabeln = groupData.Vokabeln.concat({ID: res.id, Position: ''});
				groupData.LastModified = completeTimestamp;
				groupData.Fuellung = groupData.Fuellung + 1;

				firestore().collection('Vokabelgruppen').doc(group.id).set(groupData);
			}
		} else {
			//wenn es keine vorhandene Vokabelgruppe mit weniger als 7 Einträgen gibt wird eine neue erstellt
			const groupData = {
				Vokabeln: [{ID: res.id, Position: ''}],
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
	const [groups, setgroups] = useState([]);
	const [learnedGroups, setlearnedGroups] = useState([]);

	const getToLearn = async () => {
		// Funktion, welche zu lernende Vokabelgruppen als Contex in einem Array speichert

		const resToLearn = await firestore()
			.collection('Vokabelgruppen')
			.where('Datum', '<', timestamp) //Lädt Vokabelgruppen aus dem Cache, die
			.where('UID', '==', uid) //heute gelernt werden sollen.
			.get({source: 'cache'});

		const resToLearnGroups = await getRawGroup(resToLearn);

		setgroups(resToLearnGroups);
	};

	const getLearned = async () => {
		// Funktion, welche die bereits gelernten Vokabelgruppen als Contex in einem Array speichert

		console.log('done');

		const resLearned = await firestore()
			.collection('Vokabelgruppen')
			.where('Gelernt', '==', timestamp) //Lädt Vokabelgruppen aus dem Cache, die
			.where('UID', '==', uid) //heute gelernt wurden.
			.get({source: 'cache'});

		const resLearnedGroups = await getRawGroup(resLearned);

		setlearnedGroups(resLearnedGroups);
	};

	const getRawGroup = async (res) => {
		//
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
			groupPromise = [];
		}
		const resGroups = await groupPromise;
		return resGroups;
	};

	const getGroup = async (group) => {
		//Funktion, die eine leere Gruppe als Eingabe nimmt und die vokIDs durch konkrete Vokabeln ersetzt
		var groupData = group.data();
		groupData.ID = group.id;

		const res = new Promise((resove) => {
			var vokContent = [];
			groupData.Vokabeln.forEach(async (vokabel) => {
				//zu jeder ID in der Liste wird die Vokabel mit "getVok(ID)" gesucht
				var vok = await getVok(vokabel.ID);
				vok.ID = vokabel.ID;
				vok.Position = vokabel.Position;
				vokContent.push(vok);
				if (vokContent.length >= groupData.Vokabeln.length) {
					resove(vokContent);
				}
			});
		});

		groupData.Vokabeln = await res;
		return groupData;
	};

	const getVok = async (vokID) => {
		//Funktion, eine ID als Eingabe nimmt und die dazugehörige Vokabel ausgibt
		const vok = await firestore().collection('Deutsch-Englisch').doc(vokID).get({source: 'cache'});
		return vok.data();
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

				getLearned(); //zuerst werden alle heute bereits gelernten Vokabeln aufgerufen. Dies geschieht einmalig beim aufrufen der App
				//und wird nicht bei jeder Veränderung neu ausgeführt. So wird vermieden, dass sich Gruppen in der GUI doppeln.

				firestore()
					.collection('Vokabelgruppen')
					.where('UID', '==', uid)
					.where('LastModified', '>', lastLoginTimestamp)
					.onSnapshot((res) => {
						//Lädt neue Vokabelgruppen und Veränderungen in den Cache. Durch "onSnapshot" Echtzeit-Aktualisierung.
						CookieFunktionen.setCookie('lastLogin', completeCurrentDay, 300);
						console.log('Vokabelgruppen aktualisiert: ' + res.docs.length + ' Veränderungen ');
						getToLearn(); //Funktion, welche Vokabelgruppen mit konkreten Vokabeln aufbereitet und in "groups" dem Kontext zur Verfügung stellt
					});
				firestore()
					.collection('Deutsch-Englisch')
					.where('LastModified', '>', lastLoginTimestamp)
					.onSnapshot((res) => {
						//Lädt neue Vokabeln und Veränderungen in den Cache. Durch "onSnapshot" Echtzeit-Aktualisierung.
						CookieFunktionen.setCookie('lastLogin', completeCurrentDay, 300);
						console.log('Vokabeln aktualisiert: ' + res.docs.length + ' Veränderungen ');
						getToLearn(); //Funktion, welche Vokabelgruppen mit konkreten Vokabeln aufbereitet und in "groups" dem Kontext zur Verfügung stellt
					});
			});
	}, []);

	return (
		<div>
			<VokabelContext.Provider value={groups}>
				<LearnedVokabelContext.Provider value={learnedGroups}>{children}</LearnedVokabelContext.Provider>
			</VokabelContext.Provider>
		</div>
	);
}

export default VokabelProvider;
