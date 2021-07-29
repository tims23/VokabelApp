import React, {useRef} from 'react';
import './Pattern.css';

import {CSSTransition} from 'react-transition-group';
import {DetailView} from './DetailView';
import {TurnableCard} from './TurnableCard';
import usePatternLogic from './PatternLogic';
import {useTimeFunctions} from '../Datum';

export function Pattern(props = {group: {}}) {
	const detailViewRef = useRef(null);
	const gridViewRef = useRef(null);

	const [
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
	] = usePatternLogic(props);
	const [date, currentDay, completeCurrentDay, timestamp, completeTimestamp, addDays] = useTimeFunctions();

	const {Datum, Vokabeln} = newGroup;

	return (
		<div className="Pattern" style={{width: '100%'}}>
			<div className="Pattern-Progress">
				<p>
					{Datum > timestamp ? (
						'Heute bereits gelernt!'
					) : (
						<span>
							<span>{subbmitted}</span>/<span>{Vokabeln.length}</span>
						</span>
					)}
				</p>
			</div>
			<CSSTransition
				in={gridView}
				unmountOnExit
				timeout={300}
				classNames="Pattern_GridView"
				nodeRef={gridViewRef}
				onExited={() => setdetailView(true)}
			>
				<div className="Pattern_gridContainer" ref={gridViewRef}>
					{Vokabeln.map((vokabel, index) => (
						<TurnableCard
							key={index}
							index={index}
							vokabel={vokabel}
							subbmit={subbmit}
							switchView={switchView}
							clicked={Datum > timestamp} //die Vokabel soll nur dann bestätigt werden können wenn sie heute
							//heute nicht schon gelernt wurde.
						/>
					))}
				</div>
			</CSSTransition>
			<CSSTransition
				in={detailView}
				unmountOnExit
				timeout={300}
				classNames="Pattern_DetailView"
				nodeRef={detailViewRef}
				onExited={() => setgridView(true)}
			>
				<DetailView
					ref={detailViewRef}
					switchView={switchView}
					vokabel={Vokabeln[detailViewItem]}
					index={detailViewItem}
					subbmit={subbmit}
					clicked={Datum > timestamp}
				/>
			</CSSTransition>
		</div>
	);
}

export default Pattern;
