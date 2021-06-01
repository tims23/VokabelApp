import {Component} from 'react';

class CookieFunktionen extends Component {
	constructor(props) {
		super(props);

		this.isTrue = this.isTrue.bind(this);
		this.getCookie = this.getCookie.bind(this);
		this.setCookie = this.setCookie.bind(this);
		this.deleteCookie = this.deleteCookie.bind(this);
	}

	static deleteCookie(cname) {
		this.setCookie(cname, '', 0);
	}

	static isTrue(cname) {
		var alreadyUsed = this.getCookie(cname);

		if (alreadyUsed === 'true') {
			return true;
		} else {
			return false;
		}
	}

	static getCookie(cname) {
		var name = cname + '=';
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');

		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length);
			}
		}
		return '';
	}

	static setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
		var expires = 'expires=' + d.toUTCString();
		document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
	}
}

export default CookieFunktionen;
