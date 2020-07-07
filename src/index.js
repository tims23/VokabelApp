import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {FirebaseAppProvider} from 'reactfire';

const firebaseConfig = {
	apiKey: 'AIzaSyBPDYXKqmtZyD9e8_W0N98z_2lgdSSh970',
	authDomain: 'vokabelapp-170f6.firebaseapp.com',
	databaseURL: 'https://vokabelapp-170f6.firebaseio.com',
	projectId: 'vokabelapp-170f6',
	storageBucket: 'vokabelapp-170f6.appspot.com',
	messagingSenderId: '624533432759',
	appId: '1:624533432759:web:19a551ee21aafd92636032',
	measurementId: 'G-R80Y8N1NRV'
};

ReactDOM.render(
	<React.StrictMode>
		<FirebaseAppProvider firebaseConfig={firebaseConfig}>
			<App />
		</FirebaseAppProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
