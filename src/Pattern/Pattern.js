import React, {Component} from 'react';
import './Pattern.css';
import exchange from '../pics/exchange.png';
import resize from '../pics/resize.png';
import yes from '../pics/yes.png';
import no from '../pics/no.png';
import {firestore} from 'firebase';

/* 
Datei besitzt zwei Komponenten:
Pattern: zur Datstellung einer Vokabelgruppe
Vokabel: zur Darstellung einzelner Vokabeln in der Vokabelgruppe

exportiert wird Pattern.
*/

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
			right: 0
		};

		this.subbmit = this.subbmit.bind(this);
		this.updateRef = this.updateRef.bind(this);
	}

	updateRef(level) {
		//Funktion, die den nächsten Lerntag in die Datenbank einträgt.
		//Je nach Level der Vokabelgruppe werden die Intervalle länger
		var next = currentDay;
		switch (level) {
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
				break;
		}
		this.props.group.Datum = next;
		this.props.group.Gelernt = timestamp;
		this.props.group.Level = level + 1;
		this.props.group.LastModified = completeTimestamp;
	}

	subbmit(res) {
		//wird von Vokabelkomponente aufgerufen wenn der Nuter bestätig dass er die Vokabel konnte oder nicht.
		if (res) {
			if (this.state.right + 1 >= this.props.group.Vokabeln.length) {
				this.updateRef(this.props.group.Level);
				this.props.subbmit(this.props.group); //veranlasst auf Parent, dass nächste Gruppe angezeigt werden kann. Übergibt bearbeite Gruppe
			}
			this.setState({right: this.state.right + 1});
		}
	}

	componentDidMount() {
		console.log(this.props.group);
	}

	render() {
		return (
			<div id="Pattern">
				<div className="Pattern-Progress">
					<p>
						{this.props.group.Datum > timestamp ? (
							'Heute bereits gelernt!'
						) : (
							<span>
								<span>{this.state.right}</span>/<span>{this.props.group.Vokabeln.length}</span>
							</span>
						)}
					</p>
				</div>
				<div className="grid-container">
					{this.props.group.Vokabeln.map((vokabel, index) => (
						<Vokabel
							key={index}
							english={vokabel.Englisch}
							german={vokabel.Deutsch}
							gridColumn={vokabel.Position}
							subbmit={this.subbmit}
							clicked={this.props.group.Datum > timestamp} //die Vokabel soll nur dann bestätigt werden können wenn sie heute
							//heute nicht schon gelernt wurde.
						/>
					))}
				</div>
			</div>
		);
	}
}

export class Vokabel extends Component {
	constructor(props) {
		super(props);

		this.state = {
			side: true,
			clicked: this.props.clicked //bestimmt ob eingabeoptionen eingeblendet werden sollen
		};
		this.exchange = this.exchange.bind(this);
	}

	exchange() {
		//Funktion um das Vokabelkärtchen zu drehen
		this.setState({side: !this.state.side});
	}

	render() {
		return (
			<div className="grid-item" style={{gridColumn: this.props.gridColumn}}>
				<div className={this.state.side ? 'card' : 'card clicked'}>
					<div className={this.state.side ? 'side-english selected' : 'side-english unselected'}>
						<img className="exchange" src={exchange} onClick={this.exchange} />
						<img className="resize" src={resize} />
						<h4>Englisch</h4>
						<h2>{this.props.english}</h2>
					</div>
					<div className={this.state.side ? 'side-german unselected' : 'side-german selected'}>
						<img className="exchange" src={exchange} onClick={this.exchange} />
						<img className="resize" src={resize} />
						<h4>Deutsch</h4>
						<h2>{this.props.german}</h2>
						{this.state.clicked === false ? (
							<div className="answer">
								<div
									className="correct"
									onClick={() => {
										this.setState({clicked: true});
										this.props.subbmit(true);
									}}
								>
									<img src={yes} />
								</div>
								<div className="wrong" onClick={() => this.props.subbmit(false)}>
									<img src={no} />
								</div>
							</div>
						) : null}
					</div>
				</div>
			</div>
		);
	}
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
