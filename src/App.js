import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
	const burritoRef = useFirestore().collection('tryreactfire').doc('burrito');

	const burrito = useFirestoreDocData(burritoRef);

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>Eine leere WebApp</p>
				<p>The burrito is {burrito.yummy ? 'good' : 'bad'}!</p>
			</header>
		</div>
	);
}

export default App;
