import React, {useState} from 'react';
import './App.css';
import {firestore, SuspenseWithPerf} from 'reactfire';
import Burrito from './Burrito';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Mathis from './Mathis';
import Pattern from './Pattern';
import LoadedPattern from './LoadedPattern';
import ProgressBar from './ProgressBar';
import Test from './Test';
import BurgerMenu from './BurgerMenu';
import SideBar from './SideBar';
import VokabelProvider from './VokabelProvider';
import VokInput from './VokInput';
import VokInputList from './VokInputList';

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
									<Test />
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
