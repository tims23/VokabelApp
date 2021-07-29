import React from 'react';
import './DetailView.css';

import Answer from './Answer';
import useCardLogic from './CardLogic';

export const DetailView = React.forwardRef((props = {vokabel: {Deutsch: '', Englisch: '', index: 0}}, ref = null) => {
	//Komponente zur Detailansicht von Vokabeln

	const [clicked, side, onSwitchHandler, onAnswerHandler, onFlipHandler] = useCardLogic(props);
	const {vokabel: {Deutsch, Englisch}, index} = props;

	return (
		<div className="DetailView" onClick={() => onSwitchHandler()} ref={ref}>
			<h2 style={{textAlign: 'right'}}>{index + 1}</h2>
			<div className="Pattern_sideEnglish">
				<h4>Englisch</h4>
				<h2>{Englisch}</h2>
			</div>

			<div className="DetailView_hLine hLine" />

			<div className="Pattern_sideGerman">
				<h4>Deutsch</h4>
				<h2>{Deutsch}</h2>
			</div>

			{clicked ? null : <Answer onAnswer={onAnswerHandler} />}
		</div>
	);
});

export default DetailView;
