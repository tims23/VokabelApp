import {useState} from 'react';

export function useCardLogic(props = {clicked: null, switchView: null, subbmit: null}) {
	const {switchView, subbmit} = props;

	const [clicked, setclicked] = useState(props.clicked !== null ? props.clicked : false);
	const [side, setside] = useState(true);

	const onSwitchHandler = (index = null) => {
		//wechselt die Ansicht zwischen DetailView und GridView
		if (switchView !== null && index !== null) return switchView(index);
		if (switchView !== null && index === null) return switchView();
	};

	const onAnswerHandler = (answer = null) => {
		//bei bestätigung der Karte
		if (answer !== null) {
			setclicked(true);
			if (subbmit !== null) return subbmit(answer);
		}
	};

	const onFlipHandler = () => {
		//um die Karte zu drehen (TurnableCard)
		return setside(!side);
	};

	return [clicked, side, onSwitchHandler, onAnswerHandler, onFlipHandler];
}

export default useCardLogic;
