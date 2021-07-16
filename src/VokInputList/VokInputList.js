import React, {useState} from 'react';
import VokInput from './VokInput';
import './VokInputList.css';

function VokInputList() {
	const [state, setstate] = useState([{}]);

	const listItems = state.map((elm, index) => <VokInput num={index} />);
	return (
		<div className="VokInputList">
			<div className="labels">
				<div>
					<p>Deutsch</p>
				</div>
				<div>
					<p>Englisch</p>
				</div>
			</div>
			<div className="list">{listItems}</div>
			<div
				onClick={() => {
					const currentState = state;
					const nextState = currentState.concat({});
					setstate(nextState);
				}}
			>
				<h1>+</h1>
			</div>
		</div>
	);
}

export default VokInputList;
