import React, {Component} from 'react';
import {useFirestore, useFirestoreDocData, useUser, useAuth} from 'reactfire';

export function Burrito() {
	const burritoRef = useFirestore().collection('tryreactfire').doc('burrito');

	const burrito = useFirestoreDocData(burritoRef);

	return (
		<div>
			<p
				onClick={() => {
					burrito.yummy = !burrito.yummy;
					burritoRef.update(burrito);
				}}
			>
				The burrito is {burrito.yummy ? 'good' : 'bad'}!
			</p>
		</div>
	);
}

export default Burrito;
