import React, {useState, useEffect} from 'react';
import './BurgerMenu.css';

export function BurgerMenu(props) {
	const [clicked, setclicked] = useState(false);

	useEffect(
		() => {
			setclicked(props.activated);
		},
		[props.activated]
	);

	return (
		<div
			id="BurgerMenu"
			className={clicked ? 'clicked' : null}
			onClick={() => {
				setclicked(!clicked);
				if (props.onClick != null) {
					props.onClick();
				}
			}}
		>
			<span />
			<span />
			<span />
		</div>
	);
}

export default BurgerMenu;
