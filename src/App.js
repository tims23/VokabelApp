import React from 'react';
import logo from './logo.svg';
import './App.css';
import {SuspenseWithPerf} from 'reactfire';
import Burrito from './Burrito';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>Eine leere WebApp</p>
				<SuspenseWithPerf fallback={<p>loading burrito status...</p>} traceId={'load-burrito-status'}>
					<Burrito />
				</SuspenseWithPerf>
			</header>
		</div>
	);
}

export default App;
