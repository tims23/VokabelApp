import React, {Component} from 'react';
import './Pattern.css';
import exchange from './exchange.png';
import resize from './resize.png';
import yes from './yes.png';
import no from './no.png';
import ProgressBar from './ProgressBar';

export class Pattern extends Component {
	constructor(props) {
		super(props);

		this.state = {
			right: 0
		};

		this.subbmit = this.subbmit.bind(this);
	}

	subbmit(res) {
		if (res) {
			if (this.state.right + 1 >= this.props.vokabeln.length) {
				this.props.update(this.props.level);
			}
			this.setState({right: this.state.right + 1});
		}
	}

	render() {
		return (
			<div id="Pattern">
				<div className="Pattern-ProgressBar">
					<ProgressBar progress={this.state.right} count={this.props.group.Vokabeln.length} />
				</div>
				<div className="grid-container">
					{this.props.group.Vokabeln.map((vokabel, index) => (
						<Vokabel
							key={index}
							english={vokabel.Englisch}
							german={vokabel.Deutsch}
							gridColumn={vokabel.Position}
							subbmit={this.subbmit}
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
			clicked: false
		};
		this.exchange = this.exchange.bind(this);
	}

	exchange() {
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

export default Pattern;
