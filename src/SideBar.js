import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import BurgerMenu from './BurgerMenu';
import './SideBar.css';

export class SideBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			clicked: false
		};
	}

	render() {
		return (
			<div id="SideBar">
				<BurgerMenu
					onClick={() => {
						this.setState({clicked: !this.state.clicked});
						this.props.activated();
					}}
				/>
				<nav className={this.state.clicked ? 'clicked' : null}>
					<ul>
						<li>
							<Link to="Lernen">Lernen</Link>
						</li>

						<li>
							<Link to="Eingabe">Eingabe</Link>
						</li>
					</ul>
				</nav>
			</div>
		);
	}
}

export default SideBar;
