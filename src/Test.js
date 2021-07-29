import React, {Component} from 'react';

export class Test extends Component {
	render() {
		return (
			<div style={{display: 'flex'}}>
				<div style={{flex: 'auto', width: '80%'}}>
					<p>div 1</p>
				</div>
				<div style={{flex: 'auto'}}>
					<p>div 2</p>
				</div>
			</div>
		);
	}
}

export default Test;
