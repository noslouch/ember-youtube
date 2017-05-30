# ember-youtube

An Ember.js component to play and control YouTube videos using the iframe API. Pass it a YouTube video ID and you're good to go! Every day this component is being used on [Radio4000](https://radio4000.com).

You can see a demonstration at [ember-youtube.surge.sh](http://ember-youtube.surge.sh).





```hbs
{{ember-youtube
	ytid="123"
}}
```

## Actions

onPlayerReady(player)
onPlayerError(err)
onPlayerStateChange(player)



















## Features

- Full support for all YouTube player events (and errors)
- Custom (external) controls (make your own buttons)
- Custom progress bar in full sync with the YouTube player
- Extra: custom time properties (for instance "4:31 / 7:58") formatted with Moment.js

[![TravisCI Build Status][travis-badge]][travis-badge-url]

[travis-badge]: https://travis-ci.org/oskarrough/ember-youtube.svg?branch=master
[travis-badge-url]: https://travis-ci.org/oskarrough/ember-youtube


## Quick start

Inside your Ember CLI project run:

```bash
ember install ember-youtube
```

Use the component like this:

```hbs
{{ember-youtube ytid="fZ7MhTRmJ60"}}
```

Here's another example with all options. Only `ytid` is required.

```hbs
{{ember-youtube
	ytid="fZ7MhTRmJ60"
	volume=100
	playerVars=customPlayerVars
	showDebug=false
	showControls=false
	showProgress=false
	lazyload=false
	playerCreated="savePlayer"
	playing="ytPlaying"
	paused="ytPaused"
	ended="ytEnded"
	buffering="ytBuffering"}}
```

## YouTube player options

The YouTube API allows you to define an object of options called [playerVars](https://developers.google.com/youtube/player_parameters). With ember-youtube, you can optionally set this object on the component:

```javascript
// controller.js
myPlayerVars: {
	autoplay: 1,
	showinfo: 0
}
```

```hbs
{{ember-youtube ytid="fZ7MhTRmJ60" playerVars=myPlayerVars}}
```

## External controls

If you want your own buttons to control the player, the ember-youtube components sends a `playerCreated` action with two arguments. First the YouTube player instance, secondly the ember-youtube component instance. With these, you should be able to do pretty much anything the YouTube iframe API allows. Here's an example:

```hbs
{{ember-youtube ytid="fZ7MhTRmJ60" playerCreated="savePlayer"}}
<button {{action "togglePlay" target=emberYoutube}}>
	{{#if emberYoutube.isPlaying}}Pause{{else}}Play{{/if}}
</button>
<button {{action "toggleVolume" target="emberYoutube"}}>
	{{#if emberYoutube.isMuted}}Unmute{{else}}Mute{{/if}}
</button>
```

... and then in your controller do:

```
actions: {
  savePlayer(player emberYoutube) {
    this.set('player', player');
    this.set('emberYoutube', emberYoutube');
  }
}
```

## Seeking

Here's an example of seeking to a certain timestamp in a video. It accepts a number of seconds.

```hbs
<button {{action "seekTo" 90 target=emberYoutube}}>Seek to 01:30</button>
{{ember-youtube ytid="fZ7MhTRmJ60" playerCreated="savePlayer"}}
```

## Events

The ember-youtube component send four different actions: `playing`, `paused`, `ended` and `buffering`. You should map them to your own actions like this:

```hbs
{{ember-youtube ytid="fZ7MhTRmJ60"
	playing="ytPlaying"
	paused="ytPaused"
	ended="ytEnded"
	buffering="ytBuffering"}}
```

```JavaScript
actions: {
  ytPlaying() {
    Ember.debug('on playing from controller');
  },
  ytPaused() {
    Ember.debug('on paused from controller');
  },
  ytEnded() {
    Ember.debug('on ended from controller');
    // here you could load another video by changing the youTubeId
  },
  ytBuffering() {
    Ember.debug('on buffering from controller');
  }
}
```

## Lazy load

Even if you don't supply an `ytid` to the ember-youtube component, it will make sure the iframe player is created as soon as possible. But if you set `lazyload=true`, it will wait for an `ytid`. This will, in some cases, improve the initial render performance. Example:

```hbs
{{ember-youtube lazyload=true}}
```

## Custom timestamps

Let's write a component with two custom formatted timestamps such as "13:37". First make sure moment and moment-duration-format are installed. Then create a new component with the following template:

```hbs
{{ember-youtube ytid=youTubeId playerCreated="savePlayer"}}
<p>Timestamps: {{currentTimeFormatted}} / {{durationFormatted}}</p>
```

And here's the JavaScript part of the component:

```javascript
export default Ember.Component.extend({
	currentTimeFormat: 'mm:ss',
	durationFormat: 'mm:ss',

	// returns a momentJS formated date based on "currentTimeFormat" property
	currentTimeFormatted: computed('emberYoutube.currentTime', 'currentTimeFormat', function () {
		let time = this.get('emberYoutube.currentTime');
		let format = this.get('currentTimeFormat');
		if (!time || !format) {
			return null;
		}
		let duration = moment.duration(time, 'seconds');
		return duration.format(format);
	}),

	// returns a momentJS formated date based on "durationFormat" property
	durationFormatted: computed('emberYoutube.duration', 'durationFormat', function () {
		let duration = this.get('emberYoutube.duration');
		let format = this.get('durationFormat');
		if (!duration || !format) {
			return null;
		}
		let time = moment.duration(duration, 'seconds');
		return time.format(format);
	})
});
```

## Autoplay on iOS

On iOS autoplay of videos is disabled by Apple to save your precious data. I haven't been able to circumvent this. The user needs to tap the video itself before we can call the player's play/load methods. If anyone has a workaround, let me know.

## Development

* `git clone` this repository
* `npm install; bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Similar projects

* https://www.npmjs.com/package/react-youtube
* http://cejast.github.io/ng-youtube/
* https://github.com/brandly/angular-youtube-embed
* https://github.com/gilesvangruisen/Swift-YouTube-Player
* https://github.com/mikecrittenden/tangletube

**Please file an issue if you have any feedback or would like to contribute.**

Thanks to https://github.com/oskarrough/ember-youtube/graphs/contributors.
