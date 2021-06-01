import React, {useEffect, useState} from 'react';
import Pattern from './Pattern';
import {useVokabeln, useVokabelnUpdate} from './VokabelProvider';

function Test() {
	const vokabeln = useVokabeln();
	const [state, setstate] = useState(false);

	useEffect(
		() => {
			if (vokabeln != undefined) {
				setstate(true);
			}
		},
		[vokabeln]
	);

	return (
		<div>
			{state ? (
				<div>
					{vokabeln.map((group) => (
						<div>
							<Pattern group={group} />
						</div>
					))}
				</div>
			) : null}
		</div>
	);
}

export default Test;
