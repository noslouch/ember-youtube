/* global YT */
import Ember from 'ember';
import loadYoutubeIframeApi from './load-youtube-iframe-api';
import { task } from 'ember-concurrency';

const { computed, debug, get, set, observer, RSVP } = Ember;

export default Ember.Component.extend({
	classNames: ['EmberYoutube'],
	ytid: null,
	width: 560,
	height: 315,

	playerVars: {
		autoplay: 0,
		playsinline: 1,
		showinfo: 0,
		rel: 0,
		iv_load_policy: 3
	},

	willDestroyElement() {
		this._super(...arguments)
		const player = get(this, 'player');
		if (player) player.destroy()
	},

	createPlayer: task(function* () {
		try {
			yield loadYoutubeIframeApi()
			const iframe = this.$('#EmberYoutube-player').get(0);
			const width = this.get('width');
			const height = this.get('height');
			let playerVars = this.get('playerVars');
			playerVars.origin = window.location.origin;
			const player = new YT.Player(iframe, {
				width,
				height,
				playerVars,
				events: {
					onReady: this.onPlayerReady.bind(this),
					onStateChange: this.onPlayerStateChange.bind(this),
					onError: this.onPlayerError.bind(this)
				}
			});
			set(this, 'player', player);
		} catch (e) {
			this.onError(e)
		}
	}).on('init').drop(),

	loadVideo: task(function* () {
		const player = get(this, 'player')
		if (!player) {
			console.log('loadVideo but no player, creating it')
			yield get(this, 'createPlayer').perform()
		}
		const options = {
			videoId: get(this, 'ytid'),
			startSeconds: get(this, 'startSeconds'),
			endSeconds: get(this, 'endSeconds'),
			suggestedQuality: get(this, 'suggestedQuality')
		}
		if (get(this, 'playerVars.autoplay')) {
			player.loadVideoById(options);
		} else {
			player.cueVideoById(options);
		}
	}),

	// YouTube player events.

	onPlayerReady() {
		this.send('ready');
	},
	onPlayerStateChange(event) {
		const data = event.data
		const { PLAYING, PAUSED, BUFFERING, ENDED, CUED } = window.YT.PlayerState
		console.log(data)
		if (data === PLAYING) this.send('playing')
		if (data === PAUSED) this.send('paused')
		if (data === BUFFERING) this.send('buffering')
		if (data === ENDED) this.send('ended')
		if (data === CUED) this.send('cued')
	},
	onPlayerError(err) {
		this.send('error', err);
	},

	// Abstract YouTube player methods.

	play() {
		if (!this.player) return
		this.player.playVideo();
	},
	pause() {
		if (!this.player) return
		this.player.pauseVideo();
	},
	togglePlayback() {
		if (this.player && this.get('isPlaying')) {
			this.send('pause');
		} else {
			this.send('play');
		}
	},
	mute() {
		if (!this.player) return
		this.player.mute();
		this.set('isMuted', true);
	},
	unMute() {
		if (!this.player) return
		this.player.unMute();
		this.set('isMuted', false);
	},
	toggleVolume() {
		if (this.player.isMuted()) {
			this.unMute()
		} else {
			this.mute();
		}
	},
	seekTo(seconds) {
		if (!this.player) return
			this.player.seekTo(seconds);
		}
	},

	actions: {
		ready() {
			get(this, 'loadVideo').perform()
			const action = get(this, 'onReady')
			const player = get(this, 'player')
			const component = this
			if (action) action(player, component)
		},
		error(ok) {
			console.log(ok)
			const action = get(this, 'onError')
			if (action) action()
		},
		playing() {
			const action = get(this, 'onPlaying')
			if (action) action()
		},
		paused() {
			const action = get(this, 'onPaused')
			if (action) action()
		},
		buffering() {
			const action = get(this, 'onBuffering')
			if (action) action()
		},
		ended() {
			const action = get(this, 'onEnded')
			if (action) action()
		},
		cued() {
			const action = get(this, 'onCued')
			if (action) action()
		}
	}
});
