import React from 'react';
import logo from './logo.svg';
import './App.css';
import {SuspenseWithPerf} from 'reactfire';
import Burrito from './Burrito';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

function App() {
	return (
		<div className="App">
			<Router>
				<Switch>
					<Route path="/header">
						<header className="App-header">
							<img src={logo} className="App-logo" alt="logo" />
							<p>Eine leere WebApp</p>
							<SuspenseWithPerf
								fallback={<p>loading burrito status...</p>}
								traceId={'load-burrito-status'}
							>
								<Burrito />
							</SuspenseWithPerf>
						</header>
					</Route>
					<Route path="/another">
						<p>Hi</p>
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
