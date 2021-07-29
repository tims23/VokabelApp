import React, {useState, useEffect} from 'react';
import './App.css';
import {SuspenseWithPerf} from 'reactfire';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import GroupVisualizer from './GroupVisualizer';
import SideBar from './Navigation/SideBar';
import VokabelProvider from './VokabelProvider';
import VokInputList from './VokInputList/VokInputList';
import SettingsProvider from './Settings/SettingsProvider';
import Test from './Test';

function App() {
	const refreshHandler = () => {
		window.location.reload(true);
	};

	return (
		<div className="App">
			<Router>
				<SettingsProvider>
					<VokabelProvider>
						<div className="App_flexLayout">
							<SideBar />

							<div id="content">
								<Switch>
									<Route path="/Lernen">
										<SuspenseWithPerf
											fallback={<p>loading burrito status...</p>}
											traceId={'load-burrito-status'}
										>
											<GroupVisualizer />
										</SuspenseWithPerf>
									</Route>
									<Route path="/Eingabe">
										<p>Eingabe</p>
										<VokInputList />
									</Route>
									<Route path="/Test">
										<Test />
									</Route>
									<Route path="/" exact>
										<button onClick={refreshHandler}>reload</button>
									</Route>
								</Switch>
							</div>
						</div>
					</VokabelProvider>
				</SettingsProvider>
			</Router>
		</div>
	);
}

export default App;
