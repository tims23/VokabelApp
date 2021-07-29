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
		this.onClickHandler = this.onClickHandler.bind(this);
	}

	onClickHandler() {
		this.setState({clicked: !this.state.clicked});
	}

	render() {
		return (
			<div id="SideBar" className="SideBar">
				<nav className={this.state.clicked ? 'clicked' : null}>
					<ul
						style={
							this.state.clicked ? (
								{
									opacity: '1',
									transition: 'opacity ease-in-out 0.2s 0.2s'
								}
							) : null
						}
					>
						<li className="navLink">
							<Link to="Lernen" onClick={this.onClickHandler}>
								<h1 className="navLinkTitle">Lernen</h1>
							</Link>
						</li>
						<hr />
						<li className="navLink" onClick={this.onClickHandler}>
							<Link to="Eingabe">
								<h1 className="navLinkTitle">Eingabe</h1>
							</Link>
						</li>
					</ul>
				</nav>
				<BurgerMenu onClick={this.onClickHandler} activated={this.state.clicked} />
			</div>
		);
	}
}

export default SideBar;
