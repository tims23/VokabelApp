import React, {Component} from 'react';
import './Uebersicht.css';

export class Uebersicht extends Component {
	render() {
		return (
			<div id="Uebersicht">
				<div class="grid-container">
					{/* row 1 */}
					<div class="grid-item" style={{gridColumn: '7 / 9'}}>
						<div>
							<h4>Englisch</h4>
							<h2>Houses</h2>
						</div>
					</div>

					{/* row 2 */}
					<div class="grid-item" style={{gridColumn: '6 / 8'}}>
						<div>
							<h4>Englisch</h4>
							<h2>Houses</h2>
						</div>
					</div>
					<div class="grid-item" style={{gridColumn: '8 / 10'}}>
						<div>
							<h4>Englisch</h4>
							<h2>Houses</h2>{' '}
						</div>
					</div>

					{/* row 3 */}
					<div class="grid-item" style={{gridColumn: '5 / 7'}}>
						<div>
							<h4>Englisch</h4>
							<h2>Houses</h2>{' '}
						</div>
					</div>
					<div class="grid-item" style={{gridColumn: '7 / 9'}}>
						<div>
							<h4>Englisch</h4>
							<h2>Houses</h2>{' '}
						</div>
					</div>
					<div class="grid-item" style={{gridColumn: '9 / 11'}}>
						<div>
							<h4>Englisch</h4>
							<h2>Houses</h2>{' '}
						</div>
					</div>

					{/* row 4 */}
					<div class="grid-item" style={{gridColumn: '7 / 9'}}>
						<div>
							<h4>Englisch</h4>
							<h2>Houses</h2>{' '}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Uebersicht;
