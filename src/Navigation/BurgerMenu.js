import React, {Component} from 'react';
import './BurgerMenu.css';

export class BurgerMenu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			clicked: false
		};
	}

	render() {
		return (
			<div
				id="BurgerMenu"
				className={this.state.clicked ? 'clicked' : null}
				onClick={() => {
					this.setState({clicked: !this.state.clicked});
					if (this.props.onClick != null) {
						this.props.onClick();
					}
				}}
			>
				<span />
				<span />
				<span />
			</div>
		);
	}
}

export default BurgerMenu;
