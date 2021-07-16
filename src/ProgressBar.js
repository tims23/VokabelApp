import React, {useEffect, useState, useRef} from 'react';
import './ProgressBar.css';

export function ProgressBar(props) {
	const ref = useRef(null);

	useEffect(
		() => {
			const millis = 1000;
			const repeats = 60;
			var p = (props.progress - 1) * repeats;

			if (p >= 0) {
				ref.current.style.width = p * 100 / props.count / repeats + '%';
				var timer = setInterval(() => {
					p = p + 1;
					ref.current.style.width = p * 100 / props.count / repeats + '%';
				}, 1000 / repeats);
				setTimeout(() => {
					clearInterval(timer);
				}, millis);
				return () => {
					clearInterval(timer);
				};
			} else {
				ref.current.style.width = 0 + '%';
			}
		},
		[props.count, props.progress]
	);

	return (
		<div className="ProgressBar">
			<div className="progressBar-progress" ref={ref} />
		</div>
	);
}

export default ProgressBar;
