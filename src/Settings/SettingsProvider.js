import React, {createContext, useContext, useState, useEffect} from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
	//custom hook um auf die Einstellungen zurückzugreifen
	return useContext(SettingsContext);
};

const initialSettings = {
	smallDevice: false
};

function SettingsProvider({children}) {
	const [settings, setsettings] = useState(initialSettings);

	const checkDimensions = () => {
		//updated Größe der App alle 30 ms
		var newSettings = Object.assign({}, settings);
		if (window.innerWidth <= 600 && settings.smallDevice === false) {
			newSettings.smallDevice = true;
			setsettings(newSettings);
		} else if (window.innerWidth > 600 && settings.smallDevice) {
			newSettings.smallDevice = false;
			setsettings(newSettings);
		}
	};

	useEffect(() => {
		const timer = setInterval(() => {
			checkDimensions();
		}, 30);
		return () => {
			clearInterval(timer);
		};
	}, []);

	return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export default SettingsProvider;
