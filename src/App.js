import React, {useState} from 'react';
import './App.css';
import {SuspenseWithPerf} from 'reactfire';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import GroupVisualizer from './GroupVisualizer';
import SideBar from './Navigation/SideBar';
import VokabelProvider from './VokabelProvider';
import VokInputList from './VokInputList/VokInputList';

function App() {
	const [width, setwidth] = useState(0);

	return (
		<div className="App">
			<Router>
				<VokabelProvider>
					<SideBar
						activated={() => {
							if (width === 0) {
								setwidth(400);
							} else {
								setwidth(0);
							}
						}}
					/>

					<div
						id="content"
						style={{
							width: window.innerWidth - width + 'px',
							marginLeft: width
						}}
					>
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
						</Switch>
					</div>
				</VokabelProvider>
			</Router>
		</div>
	);
}

export default App;
