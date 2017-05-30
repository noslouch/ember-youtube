import Ember from 'ember';

export default Ember.Controller.extend({
	youTubeId: 'fZ7MhTRmJ60',
	volume: 100,

	customPlayerVars: {
		autoplay: 1,
	},

	actions: {
		togglePlayback() {},
		toggleVolume() {},
		togglePlayback() {},


		// These actions are sent from {{ember-youtube}} in the template.

		// Here we get access to the YouTube player instance,
		// as well as the ember-youtube component.
		ready(player, emberYoutube) {
			console.log('ready controller')
			// this.set('player', player);
			this.set('emberYoutube', emberYoutube);
		},
		playing() {
			Ember.debug('on playing from controller');
		},
		paused() {
			Ember.debug('on paused from controller');
		},
		ended() {
			Ember.debug('on ended from controller');
			// Here you could load another video by changing the youTubeId.
		},
		buffering() {
			Ember.debug('on buffering from controller');
		},
		handleError() {
			Ember.debug('error from yt player - handled in our controller')
		}
	}
});
