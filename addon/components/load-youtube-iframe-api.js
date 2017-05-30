/* global YT, window */

import Ember from 'ember'
const { RSVP } = Ember

export default function () {
	const iframeAPIReady = new RSVP.Promise((resolve) => {
		if (window.YT && window.YT.Player && window.YT.Player instanceof Function) {
			resolve(window.YT);
			return;
		}

		const previous = window.onYouTubeIframeAPIReady;

		// The API will call this function when page has finished downloading
		// the JavaScript for the player API.
		window.onYouTubeIframeAPIReady = () => {
			if (previous) {
				previous();
			}
			resolve(window.YT);
		};
	});

	$.getScript('https://www.youtube.com/iframe_api');

	return iframeAPIReady;
}
