import './VokInput.css';
import resize from './resize.png';

import React, {Component} from 'react';
import {addVokabel, updateVokabel} from './VokabelProvider';

export class VokInput extends Component {
	constructor(props) {
		super(props);

		this.state = {
			eVokValue: '',
			dVokValue: '',
			eSelected: false,
			dSelected: false,
			vok: {},
			uploaded: ''
		};
		this.dVokInput = React.createRef();
		this.eVokInput = React.createRef();

		this.eHandleChange = this.eHandleChange.bind(this);
		this.dHandleChange = this.dHandleChange.bind(this);
		this.dUnFocusListener = this.dUnFocusListener.bind(this);
		this.eUnFocusListener = this.eUnFocusListener.bind(this);
	}

	eHandleChange(event) {
		this.setState({eVokValue: event.target.value});
	}
	dHandleChange(event) {
		this.setState({dVokValue: event.target.value});
	}

	dUnFocusListener = () => {
		setTimeout(async () => {
			if (this.state.eVokValue != '' && this.state.dVokValue != '' && !this.state.eSelected) {
				const vokabel = {Deutsch: this.state.dVokValue, Englisch: this.state.eVokValue};

				if (this.state.uploaded === '') {
					const res = await addVokabel(vokabel);
					this.setState({uploaded: res});
					console.log(res);
				} else if (this.state.vok.Deutsch !== vokabel.Deutsch && this.state.vok.Englisch !== vokabel.Englisch) {
					this.setState({vok: vokabel});
					updateVokabel(this.state.uploaded, vokabel);
				}
			}
			this.setState({dSelected: false});
		}, 500);
	};

	eUnFocusListener = () => {
		setTimeout(async () => {
			if (this.state.eVokValue != '' && this.state.dVokValue != '' && !this.state.dSelected) {
				const vokabel = {Deutsch: this.state.dVokValue, Englisch: this.state.eVokValue};

				if (this.state.uploaded === '') {
					const res = await addVokabel(vokabel);
					this.setState({uploaded: res});
					console.log(res);
				} else if (this.state.vok.Deutsch !== vokabel.Deutsch && this.state.vok.Englisch !== vokabel.Englisch) {
					this.setState({vok: vokabel});
					updateVokabel(this.state.uploaded, vokabel);
				}
			}
			this.setState({eSelected: false});
		}, 500);
	};

	componentDidMount() {
		this.dVokInput.current.addEventListener('focusout', this.dUnFocusListener);
		this.eVokInput.current.addEventListener('focusout', this.eUnFocusListener);
	}

	componentWillUnmount() {
		this.dVokInput.current.removeEventListener('focusout', this.dUnFocusListener);
		this.eVokInput.current.removeEventListener('focusout', this.eUnFocusListener);
	}

	render() {
		return (
			<form
				className="VokInput"
				id={'VokInput-'.concat(this.props.num)}
				style={this.props.num % 2 === 0 ? {backgroundColor: '#333333'} : {backgroundColor: '#292929'}}
			>
				<input
					type="text"
					className="D-VokInput"
					id={'D-VokInput-'.concat(this.props.num)}
					value={this.state.dVokValue}
					onChange={this.dHandleChange}
					ref={this.dVokInput}
					onSelect={() => this.setState({dSelected: true})}
				/>
				<input
					type="text"
					className="E-VokInput"
					id={'E-VokInput-'.concat(this.props.num)}
					value={this.state.eVokValue}
					onChange={this.eHandleChange}
					ref={this.eVokInput}
					onSelect={() => this.setState({eSelected: true})}
				/>
				<div style={{float: 'right'}}>
					<img src={resize} />
				</div>
			</form>
		);
	}
}

export default VokInput;
