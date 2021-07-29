import {firestore} from 'firebase';

const date = new Date();
const currentDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
const completeCurrentDay = new Date(
	date.getFullYear(),
	date.getMonth(),
	date.getDate(),
	date.getHours(),
	date.getMinutes()
);

const timestamp = firestore.Timestamp.fromDate(currentDay);
const completeTimestamp = firestore.Timestamp.fromDate(completeCurrentDay);

export function useTimeFunctions() {
	const addDays = (date, days) => {
		//Funktion um einen timestamp mehrere Tage später zu datiern
		//Parameter date und days wie viele auf date gerechnet werden müssen
		var result = new Date(date);
		result.setDate(result.getDate() + days);
		var timestamp = firestore.Timestamp.fromDate(result);
		return timestamp;
	};

	return [date, currentDay, completeCurrentDay, timestamp, completeTimestamp, addDays];
}
