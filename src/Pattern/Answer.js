import React from 'react';
import './Answer.css';

import yes from '../pics/yes.png';
import no from '../pics/no.png';

function Answer(props) {
	return (
		<div className="Answer">
			<div className="Answer_correct" onClick={() => props.onAnswer(true)}>
				<img src={yes} />
			</div>
			<div className="Answer_wrong" onClick={() => props.onAnswer(false)}>
				<img src={no} />
			</div>
		</div>
	);
}

export default Answer;
