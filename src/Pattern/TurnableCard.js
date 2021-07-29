import React, {useState} from 'react';
import './TurnableCard.css';

import exchange from '../pics/exchange.png';
import resize from '../pics/resize.png';
import {useSettings} from '../Settings/SettingsProvider';
import Answer from './Answer';
import useCardLogic from './CardLogic';

export function TurnableCard(props = {}) {
	const settings = useSettings();
	const [clicked, side, onSwitchHandler, onAnswerHandler, onFlipHandler] = useCardLogic(props);
	const {vokabel: {Englisch, Deutsch, Position}, index} = props;

	const largeDevice = (
		<div className={side ? 'TurnableCard' : 'TurnableCard clicked'}>
			<div className={side ? 'Pattern_sideEnglish selected' : 'Pattern_sideEnglish unselected'}>
				<img className="exchange" src={exchange} onClick={() => onFlipHandler()} />
				<img className="resize" src={resize} onClick={() => onSwitchHandler(index)} />
				<h4>Englisch</h4>
				<h2>{Englisch}</h2>
			</div>
			<div className={side ? 'Pattern_sideGerman unselected' : 'Pattern_sideGerman selected'}>
				<img className="exchange" src={exchange} onClick={() => onFlipHandler()} />
				<img className="resize" src={resize} onClick={() => onSwitchHandler(index)} />
				<h4>Deutsch</h4>
				<h2>{Deutsch}</h2>
				{clicked === false ? <Answer onAnswer={onAnswerHandler} /> : null}
			</div>
		</div>
	);

	const smallDevice = <div className="Vokabel_smallCard" onClick={() => onSwitchHandler(index)} />;

	return (
		<div className="Vokabel grid-item" style={{gridColumn: Position}}>
			{settings.smallDevice ? smallDevice : largeDevice}
		</div>
	);
}
