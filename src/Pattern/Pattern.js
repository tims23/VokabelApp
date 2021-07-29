import React, {Component, useState, useEffect, useRef} from 'react';
import './Pattern.css';
import exchange from '../pics/exchange.png';
import resize from '../pics/resize.png';
import yes from '../pics/yes.png';
import no from '../pics/no.png';
import {firestore} from 'firebase';
import {useSettings} from '../Settings/SettingsProvider';
import {CSSTransition} from 'react-transition-group';

/* 
Datei besitzt drei Komponenten:
Pattern: zur Datstellung einer Vokabelgruppe
Vokabel: zur Darstellung einzelner Vokabeln im grid der Vokabelgruppe 
DetailView: zur Darstellung einer einzelnen Vokabel in einem großem Fenster
exportiert wird Pattern.
*/

//Funktion in DetailView neu hinzugefügt

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

export class Pattern extends Component {
	constructor(props) {
		super(props);

		this.state = {
			subbmitted: 0,
			right: 0,
			gridView: true,
			detailView: false,
			detailViewItem: null
		};

		this.gridViewRef = React.createRef();
		this.detailViewRef = React.createRef();

		this.subbmit = this.subbmit.bind(this);
		this.updateRef = this.updateRef.bind(this);
		this.switchView = this.switchView.bind(this);
	}

	updateRef(done) {
		//Funktion, die den nächsten Lerntag in die Datenbank einträgt.
		//Je nach Level der Vokabelgruppe werden die Intervalle länger
		const level = this.props.group.Level;
		var next = currentDay;
		switch (done ? level : null) {
			case 0:
				next = addDays(next, 1);
				break;
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
				next = addDays(next, 1);
				break;
		}
		this.props.group.Datum = next;
		this.props.group.Gelernt = timestamp;
		this.props.group.Level = done ? level + 1 : level > 1 ? level - 1 : 1;
		this.props.group.LastModified = completeTimestamp;
	}

	subbmit(res) {
		//wird von Vokabelkomponente aufgerufen wenn der Nuter bestätig dass er die Vokabel konnte oder nicht.

		var subbmitted = this.state.subbmitted;
		var right = this.state.right;

		//updated state der Komponente
		if (res) {
			subbmitted = subbmitted + 1;
			right = right + 1;
			this.setState({subbmitted: subbmitted, right: right});
		} else {
			subbmitted = subbmitted + 1;
			this.setState({subbmitted: subbmitted});
		}

		//kontrolliert ob alle Vokabeln bearbeitet wurden und updated die Gruppe daraufbasierend ob alle richtig waren
		if (subbmitted + 1 >= this.props.group.Vokabeln.length) {
			if (subbmitted === right) {
				this.updateRef(true);
			} else {
				this.updateRef(false);
			}
			console.log(this.props.group);
			this.props.subbmit(this.props.group); //veranlasst auf Parent, dass nächste Gruppe angezeigt werden kann. Übergibt bearbeite Gruppe
		}
	}

	switchView(index) {
		//switched zwischen DetailView und GridView
		if (index !== null && index !== undefined) {
			this.setState({detailViewItem: index, gridView: false});
		} else {
			this.setState({detailView: false});
		}
	}

	render() {
		return (
			<div className="Pattern" style={{width: '100%'}}>
				<div className="Pattern-Progress">
					<p>
						{this.props.group.Datum > timestamp ? (
							'Heute bereits gelernt!'
						) : (
							<span>
								<span>{this.state.subbmitted}</span>/<span>{this.props.group.Vokabeln.length}</span>
							</span>
						)}
					</p>
				</div>
				<CSSTransition
					in={this.state.gridView}
					unmountOnExit
					timeout={300}
					classNames="Pattern_GridView"
					nodeRef={this.gridViewRef}
					onExited={() => this.setState({detailView: true})}
				>
					<div className="Pattern_gridContainer" ref={this.gridViewRef}>
						{this.props.group.Vokabeln.map((vokabel, index) => (
							<Vokabel
								key={index}
								index={index}
								vokabel={vokabel}
								subbmit={this.subbmit}
								switchView={this.switchView}
								clicked={this.props.group.Datum > timestamp} //die Vokabel soll nur dann bestätigt werden können wenn sie heute
								//heute nicht schon gelernt wurde.
							/>
						))}
					</div>
				</CSSTransition>
				<CSSTransition
					in={this.state.detailView}
					unmountOnExit
					timeout={300}
					classNames="Pattern_DetailView"
					nodeRef={this.detailViewRef}
					onExited={() => this.setState({gridView: true})}
				>
					<DetailView
						ref={this.detailViewRef}
						switchView={this.switchView}
						vokabel={this.props.group.Vokabeln[this.state.detailViewItem]}
						index={this.state.detailViewItem}
						subbmit={this.subbmit}
						clicked={this.props.group.Datum > timestamp}
					/>
				</CSSTransition>
			</div>
		);
	}
}

export const DetailView = React.forwardRef((props, ref) => {
	const [clicked, setclicked] = useState(props.clicked !== undefined ? props.clicked : false);
	return (
		<div
			className="DetailView"
			onClick={() => {
				props.switchView();
			}}
			ref={ref}
		>
			<h2 style={{textAlign: 'right'}}>{props.index + 1}</h2>
			<div className="Pattern_sideEnglish">
				<h4>Englisch</h4>
				<h2>{props.vokabel.Englisch}</h2>
			</div>

			<div className="hLine" />

			<div className="Pattern_sideGerman">
				<h4>Deutsch</h4>
				<h2>{props.vokabel.Deutsch}</h2>
			</div>

			{clicked ? null : (
				<div className="answer">
					<div
						className="correct"
						onClick={() => {
							setclicked(true);
							props.subbmit(true);
						}}
					>
						<img src={yes} />
					</div>
					<div
						className="wrong"
						onClick={() => {
							setclicked(true);
							props.subbmit(false);
						}}
					>
						<img src={no} />
					</div>
				</div>
			)}
		</div>
	);
});

export function Vokabel(props) {
	const [side, setside] = useState(true);
	const [clicked, setclicked] = useState(props.clicked);
	const settings = useSettings();

	const turn = () => {
		//Funktion um das Vokabelkärtchen zu drehen
		setside(!side);
	};

	const switchToDetailView = () => {
		//Funktion um Detailansicht in Parent-Komponente aufzurufen.
		props.switchView(props.index);
	};

	const largeDevice = (
		<div className={side ? 'card' : 'card clicked'}>
			<div className={side ? 'Pattern_sideEnglish selected' : 'Pattern_sideEnglish unselected'}>
				<img className="exchange" src={exchange} onClick={turn} />
				<img className="resize" src={resize} onClick={switchToDetailView} />
				<h4>Englisch</h4>
				<h2>{props.vokabel.Englisch}</h2>
			</div>
			<div className={side ? 'Pattern_sideGerman unselected' : 'Pattern_sideGerman selected'}>
				<img className="exchange" src={exchange} onClick={turn} />
				<img className="resize" src={resize} onClick={switchToDetailView} />
				<h4>Deutsch</h4>
				<h2>{props.vokabel.Deutsch}</h2>
				{clicked === false ? (
					<div className="answer">
						<div
							className="correct"
							onClick={() => {
								setclicked(true);
								props.subbmit(true);
							}}
						>
							<img src={yes} />
						</div>
						<div
							className="wrong"
							onClick={() => {
								setclicked(true);
								props.subbmit(false);
							}}
						>
							<img src={no} />
						</div>
					</div>
				) : null}
			</div>
		</div>
	);

	const smallDevice = <div className="Vokabel_smallCard" onClick={switchToDetailView} />;

	return (
		<div className="Vokabel grid-item" style={{gridColumn: props.vokabel.Position}}>
			{settings.smallDevice ? smallDevice : largeDevice}
		</div>
	);
}

const addDays = (date, days) => {
	//Funktion um einen timestamp mehrere Tage später zu datiern
	//Parameter date und days wie viele auf date gerechnet werden müssen
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	var timestamp = firestore.Timestamp.fromDate(result);
	return timestamp;
};

export default Pattern;
