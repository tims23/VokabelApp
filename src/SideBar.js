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
						<li className="navLink">
							<Link to="Lernen">
								<h1 className="navLinkTitle">Lernen</h1>
							</Link>
						</li>
						<hr />
						<li className="navLink">
							<Link to="Eingabe">
								<h1 className="navLinkTitle">Eingabe</h1>
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		);
	}
}

export default SideBar;
