(function(root) {
	'use strict';

	var Pizzicato = {};
	var Pz = Pizzicato;
	var commonJS = typeof module === "object" && module.exports;
	var amd = typeof define === "function" && define.amd;

	if (commonJS)
		module.exports = Pizzicato;
	else if (amd)
		define([], Pizzicato);
	else
		root.Pizzicato = root.Pz = Pizzicato;

	var AudioContext = root.AudioContext || root.webkitAudioContext; 

	if (!AudioContext) {
		console.error('No AudioContext found in this environment. Please ensure your window or global object contains a working AudioContext constructor function.');
		return;
	}

	Pizzicato.context = new AudioContext();

	var masterGainNode = Pizzicato.context.createGain();
	masterGainNode.connect(Pizzicato.context.destination);

	Pizzicato.Util = {
	
		isString: function(arg) {
			return toString.call(arg) === '[object String]';
		},
	
		isObject: function(arg) {
			return toString.call(arg) === '[object Object]';
		},
	
		isFunction: function(arg) {
			return toString.call(arg) === '[object Function]';
		},
	
		isNumber: function(arg) {
			return toString.call(arg) === '[object Number]' && arg === +arg;
		},
	
		isArray: function(arg) {
			return toString.call(arg) === '[object Array]';
		},
	
		isInRange: function(arg, min, max) {
			if (!Pz.Util.isNumber(arg) || !Pz.Util.isNumber(min) || !Pz.Util.isNumber(max))
				return false;
	
			return arg >= min && arg <= max;
		},
	
		isBool: function(arg) {
			return typeof(arg) === "boolean";
		},
	
		isOscillator: function(audioNode) {
			return (audioNode && audioNode.toString() === "[object OscillatorNode]");
		},
	
		isAudioBufferSourceNode: function(audioNode) {
			return (audioNode && audioNode.toString() === "[object AudioBufferSourceNode]");
		},
	
		isSound: function(sound) {
			return sound instanceof Pz.Sound;
		},
	
		isEffect: function(effect) {
			for (var key in Pizzicato.Effects)
				if (effect instanceof Pizzicato.Effects[key])
					return true;
	
			return false;
		},
	
		// Takes a number from 0 to 1 and normalizes it to fit within range floor to ceiling
		normalize: function(num, floor, ceil) {
			if (!Pz.Util.isNumber(num) || !Pz.Util.isNumber(floor) || !Pz.Util.isNumber(ceil))
				return;
			
			return ((ceil - floor) * num) / 1 + floor;
		},
	
		getDryLevel: function(mix) {
			if (!Pz.Util.isNumber(mix) || mix > 1 || mix < 0)
				return 0;
	
			if (mix <= 0.5)
				return 1;
	
			return 1 - ((mix - 0.5) * 2);
		},
	
		getWetLevel: function(mix) {
			if (!Pz.Util.isNumber(mix) || mix > 1 || mix < 0)
				return 0;
	
			if (mix >= 0.5)
				return 1;
	
			return 1 - ((0.5 - mix) * 2);
		}
	};
	/* In order to allow an AudioNode to connect to a Pizzicato 
	Effect object, we must shim its connect method */
	var gainNode = Pizzicato.context.createGain();
	var audioNode = Object.getPrototypeOf(Object.getPrototypeOf(gainNode));
	var connect = audioNode.connect;
	
	audioNode.connect = function(node) {
		var endpoint = Pz.Util.isEffect(node) ? node.inputNode : node;
		connect.call(this, endpoint);
		return node;
	};

	Object.defineProperty(Pizzicato, 'volume', {
		enumerable: true,
			
		get: function() {
			return masterGainNode.gain.value;
		},

		set: function(volume) {
			if (Pz.Util.isInRange(volume, 0, 1) && masterGainNode)
				masterGainNode.gain.value = volume;
		}
	});

	Object.defineProperty(Pizzicato, 'masterGainNode', {
		enumerable: false,

		get: function() {
			return masterGainNode;
		},

		set: function(volume) {
			console.error('Can\'t set the master gain node');
		}
	});
		Pizzicato.Events = {
		
			/**
			 * Adds an event handler that will be treated upon
			 * the triggering of that event.
			 */
			on: function(name, callback, context) {
				if (!name || !callback)
					return;
		
				this._events = this._events || {};
				var _event = this._events[name] || (this._events[name] = []);
		
				_event.push({
					callback: callback,
					context: context || this,
					handler: this
				});
			},
		
			/**
			 * Triggers a particular event. If a handler
			 * is linked to that event, the handler will be
			 * executed.
			 */
			trigger: function(name) {
				if (!name)
					return;
		
				var _event, length, args, i;
		
				this._events = this._events || {};
				_event = this._events[name] || (this._events[name] = []);
		
				if (!_event)
					return;
		
				length = Math.max(0, arguments.length - 1);
				args = [];
		
				for (i = 0; i < length; i++) 
					args[i] = arguments[i + 1];
		
				for (i = 0; i < _event.length; i++)
					_event[i].callback.apply(_event[i].context, args);	
			},
		
			/**
			 * Removes an event handler. If no name is provided,
			 * all handlers for this object will be removed.
			 */
			off: function(name) {
				if (name)
					this._events[name] = undefined;
		
				else
					this._events = {};
			}
		
		};
	Pizzicato.Sound = function(description, callback) {
		var self = this;
		var util = Pizzicato.Util;
		var descriptionError = getDescriptionError(description);
		var hasOptions = util.isObject(description) && util.isObject(description.options);
		var defaultAttack = 0.04;
		var defaultRelease = 0.04;
	
		if (descriptionError) {
			console.error(descriptionError);
			throw new Error('Error initializing Pizzicato Sound: ' + descriptionError);
		}
	
		this.detached = hasOptions && description.options.detached;
		this.masterVolume = Pizzicato.context.createGain();
		this.fadeNode = Pizzicato.context.createGain();
		this.fadeNode.gain.value = 0;
	
		if (!this.detached)
			this.masterVolume.connect(Pizzicato.masterGainNode);
	
		this.lastTimePlayed = 0;
		this.effects = [];
		this.effectConnectors = [];
		this.playing = this.paused = false;
		this.loop = hasOptions && description.options.loop;
		this.attack = hasOptions && util.isNumber(description.options.attack) ? description.options.attack : defaultAttack;
		this.volume = hasOptions && util.isNumber(description.options.volume) ? description.options.volume : 1;
	
		if (hasOptions && util.isNumber(description.options.release)) {
			this.release = description.options.release;
		} else if (hasOptions && util.isNumber(description.options.sustain)) {
			console.warn('\'sustain\' is deprecated. Use \'release\' instead.');
			this.release = description.options.sustain;
		} else {
			this.release = defaultRelease;
		}
	
		if (!description)
			(initializeWithWave.bind(this))({}, callback);
	
		else if (util.isString(description))
			(initializeWithUrl.bind(this))(description, callback);
	
		else if (util.isFunction(description))
			(initializeWithFunction.bind(this))(description, callback);
	
		else if (description.source === 'file')
			(initializeWithUrl.bind(this))(description.options.path, callback);
	
		else if (description.source === 'wave')
			(initializeWithWave.bind(this))(description.options, callback);
	
		else if (description.source === 'input')
			(initializeWithInput.bind(this))(description, callback);
	
		else if (description.source === 'script')
			(initializeWithFunction.bind(this))(description.options, callback);
	
		else if (description.source === 'sound')
			(initializeWithSoundObject.bind(this))(description.options, callback);
	
	
		function getDescriptionError(description) {
			var supportedSources = ['wave', 'file', 'input', 'script', 'sound'];
	
			if (description && (!util.isFunction(description) && !util.isString(description) && !util.isObject(description)))
				return 'Description type not supported. Initialize a sound using an object, a function or a string.';
	
			if (util.isObject(description)) {
	
				if (!util.isString(description.source) || supportedSources.indexOf(description.source) === -1)
					return 'Specified source not supported. Sources can be wave, file, input or script';
	
				if (description.source === 'file' && (!description.options || !description.options.path))
					return 'A path is needed for sounds with a file source';
	
				if (description.source === 'script' && (!description.options || !description.options.audioFunction))
					return 'An audio function is needed for sounds with a script source';
			}
		}
	
	
		function initializeWithWave(waveOptions, callback) {
			waveOptions = waveOptions || {};
			this.getRawSourceNode = function() {
				var frequency = this.sourceNode ? this.sourceNode.frequency.value : waveOptions.frequency;
				var node = Pizzicato.context.createOscillator();
				node.type = waveOptions.type || 'sine';
				node.frequency.value = (frequency || 440);
	
				return node;
			};
			this.sourceNode = this.getRawSourceNode();
			this.sourceNode.gainSuccessor = Pz.context.createGain();
			this.sourceNode.connect(this.sourceNode.gainSuccessor);
	
			if (util.isFunction(callback))
				callback();
		}
	
	
		function initializeWithUrl(paths, callback) {
			paths = util.isArray(paths) ? paths : [paths];
	
			var request = new XMLHttpRequest();
			request.open('GET', paths[0], true);
			request.responseType = 'arraybuffer';
	
			request.onload = function(progressEvent) {
	
				Pizzicato.context.decodeAudioData(progressEvent.target.response, (function(buffer) {
	
					self.getRawSourceNode = function() {
						var node = Pizzicato.context.createBufferSource();
						node.loop = this.loop;
						node.buffer = buffer;
						return node;
					};
					if (util.isFunction(callback))
						callback();
	
				}).bind(self), (function(error) {
	
					console.error('Error decoding audio file ' + paths[0]);
	
					if (paths.length > 1) {
						paths.shift();
						initializeWithUrl(paths, callback);
						return;
					}
	
					error = error || new Error('Error decoding audio file ' + paths[0]);
	
					if (util.isFunction(callback))
						callback(error);
	
				}).bind(self));
	
			};
			request.onreadystatechange = function(event) {
	
				if (request.readyState === 4 && request.status !== 200) {
					console.error('Error while fetching ' + paths[0] + '. ' + request.statusText);
				}
			};
			request.send();
		}
	
	
		function initializeWithInput(options, callback) {
			navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
	
			if (!navigator.getUserMedia) {
				console.error('Your browser does not support getUserMedia');
				return;
			}
	
			navigator.getUserMedia({
				audio: true
			}, (function(stream) {
				self.getRawSourceNode = function() {
					return Pizzicato.context.createMediaStreamSource(stream);
				};
				if (util.isFunction(callback))
					callback();
	
			}).bind(self), function(error) {
				if (util.isFunction(callback))
					callback(error);
			});
		}
	
	
		function initializeWithFunction(options, callback) {
			var audioFunction = util.isFunction(options) ? options : options.audioFunction;
			var bufferSize = util.isObject(options) && options.bufferSize ? options.bufferSize : null;
	
			if (!bufferSize) {
				try { // Webkit does not automatically chose the buffer size
					var test = Pizzicato.context.createScriptProcessor();
				} catch (e) {
					bufferSize = 2048;
				}
			}
	
			this.getRawSourceNode = function() {
				var node = Pizzicato.context.createScriptProcessor(bufferSize, 1, 1);
				node.onaudioprocess = audioFunction;
				return node;
			};
		}
	
	
		function initializeWithSoundObject(options, callback) {
			this.getRawSourceNode = options.sound.getRawSourceNode;
	
			if (options.sound.sourceNode && Pz.Util.isOscillator(options.sound.sourceNode)) {
				this.sourceNode = this.getRawSourceNode();
				this.frequency = options.sound.frequency;
			}
		}
	};
	
	
	Pizzicato.Sound.prototype = Object.create(Pizzicato.Events, {
	
		play: {

			enumerable: true,
	
			value: function(when, offset) {
				// changeColor(this.frequency);
	
				if (this.playing)
					return;
	
				if (!Pz.Util.isNumber(offset))
					offset = this.offsetTime || 0;
	
				if (!Pz.Util.isNumber(when))
					when = 0;
	
				this.playing = true;
				this.paused = false;
				this.sourceNode = this.getSourceNode();
	
				this.applyAttack();
	
				if (Pz.Util.isFunction(this.sourceNode.start)) {
					this.lastTimePlayed = Pizzicato.context.currentTime - offset;
					this.sourceNode.start(Pz.context.currentTime + when, offset);
				}
	
				this.trigger('play');
			}
		},
	
	
		stop: {
			enumerable: true,
	
			value: function() {
				if (!this.paused && !this.playing)
					return;
	
				this.paused = this.playing = false;
				this.stopWithRelease();
	
				this.offsetTime = 0;
				this.trigger('stop');
			}
		},
	
	
		pause: {
			enumerable: true,
	
			value: function() {
				if (this.paused || !this.playing)
					return;
	
				this.paused = true;
				this.playing = false;
	
				this.stopWithRelease();
	
				var elapsedTime = Pz.context.currentTime - this.lastTimePlayed;
	
				// If we are using a buffer node - potentially in loop mode - we need to
				// know where to re-start the sound independently of the loop it is in.
				if (this.sourceNode.buffer)
					this.offsetTime = elapsedTime % (this.sourceNode.buffer.length / Pz.context.sampleRate);
				else
					this.offsetTime = elapsedTime;
	
				this.trigger('pause');
			}
		},
	
	
		clone: {
			enumerable: true,
	
			value: function() {
				var clone = new Pizzicato.Sound({
					source: 'sound',
					options: {
						loop: this.loop,
						attack: this.attack,
						release: this.release,
						volume: this.volume,
						sound: this
					}
				});
	
				for (var i = 0; i < this.effects.length; i++)
					clone.addEffect(this.effects[i]);
	
				return clone;
			}
		},
	
	
		onEnded: {
			enumerable: true,
	
			value: function(node) {
				return function() {
					// This function may've been called from the release
					// end. If in that time the Sound has been played again,
					// no action should be taken.
					if (!!this.sourceNode && this.sourceNode !== node)
						return;
	
					if (this.playing)
						this.stop();
					if (!this.paused)
						this.trigger('end');
				};
			}
		},
	
		/**
		 * Adding effects will create a graph in which there will be a
		 * gain node (effectConnector) in between every effect added. For example:
		 * [fadeNode]--->[effect 1]->[connector 1]--->[effect 2]->[connector 2]--->[masterGain]
		 * 
		 * Connectors are used to know what nodes to disconnect and not disrupt the
		 * connections of another Pz.Sound object using the same effect.
		 */
		addEffect: {
			enumerable: true,
	
			value: function(effect) {
				if (!Pz.Util.isEffect(effect)) {
					console.error('The object provided is not a Pizzicato effect.');
					return this;
				}
	
				this.effects.push(effect);
	
				// Connects effect in the last position
				var previousNode = this.effectConnectors.length > 0 ? this.effectConnectors[this.effectConnectors.length - 1] : this.fadeNode;
				previousNode.disconnect();
				previousNode.connect(effect);
	
				// Creates connector for the newly added effect
				var gain = Pz.context.createGain();
				this.effectConnectors.push(gain);
				effect.connect(gain);
				gain.connect(this.masterVolume);
	
				return this;
			}
		},
	
		/**
		 * When removing effects, the graph in which there will be a
		 * gain node (effectConnector) in between every effect should be 
		 * conserved. For example:
		 * [fadeNode]--->[effect 1]->[connector 1]--->[effect 2]->[connector 2]--->[masterGain]
		 * 
		 * Connectors are used to know what nodes to disconnect and not disrupt the
		 * connections of another Pz.Sound object using the same effect.
		 */
		removeEffect: {
			enumerable: true,
	
			value: function(effect) {
	
				var index = this.effects.indexOf(effect);
	
				if (index === -1) {
					console.warn('Cannot remove effect that is not applied to this sound.');
					return this;
				}
	
				var shouldResumePlaying = this.playing;
	
				if (shouldResumePlaying)
					this.pause();
	
				var previousNode = (index === 0) ? this.fadeNode : this.effectConnectors[index - 1];
				previousNode.disconnect();
	
				// Disconnect connector and effect
				var effectConnector = this.effectConnectors[index];
				effectConnector.disconnect();
				effect.disconnect(effectConnector);
	
				// Remove connector and effect from our arrays
				this.effectConnectors.splice(index, 1);
				this.effects.splice(index, 1);
	
				var targetNode; 
				if (index > this.effects.length - 1 || this.effects.length === 0)
					targetNode = this.masterVolume;
				else
					targetNode = this.effects[index];
	
				previousNode.connect(targetNode);
	
				if (shouldResumePlaying)
					this.play();
	
				return this;
			}
		},
	
	
		connect: {
			enumerable: true,
	
			value: function(audioNode) {
				this.masterVolume.connect(audioNode);
				return this;
			}
		},
	
	
		disconnect: {
			enumerable: true,
	
			value: function(audioNode) {
				this.masterVolume.disconnect(audioNode);
				return this;
			}
		},
	
	
		connectEffects: {
			enumerable: true,
	
			value: function() {
	
				var connectors = [];
	
				for (var i = 0; i < this.effects.length; i++) {
	
					var isLastEffect = i === this.effects.length - 1;
					var destinationNode = isLastEffect ? this.masterVolume : this.effects[i + 1].inputNode;
	
					connectors[i] = Pz.context.createGain();
	
					this.effects[i].outputNode.disconnect(this.effectConnectors[i]);
	
					this.effects[i].outputNode.connect(destinationNode);
				}
			}
		},
	
	
		volume: {
			enumerable: true,
	
			get: function() {
				if (this.masterVolume)
					return this.masterVolume.gain.value;
			},
	
			set: function(volume) {
				if (Pz.Util.isInRange(volume, 0, 1) && this.masterVolume)
					this.masterVolume.gain.value = volume;
			}
		},
	
	
		frequency: {
			enumerable: true,
	
			get: function() {
				if (this.sourceNode && Pz.Util.isOscillator(this.sourceNode)) {
					return this.sourceNode.frequency.value;
				}
	
				return null;
			},
	
			set: function(frequency) {
				if (this.sourceNode && Pz.Util.isOscillator(this.sourceNode)) {
					this.sourceNode.frequency.value = frequency;
				}
			}
		},
	
		/**
	 	 * @deprecated - Use "release"
		 */
		sustain: {
			enumerable: true,
	
			get: function() {
				console.warn('\'sustain\' is deprecated. Use \'release\' instead.');
				return this.release;
			},
	
			set: function(sustain){
				console.warn('\'sustain\' is deprecated. Use \'release\' instead.');
	
				if (Pz.Util.isInRange(sustain, 0, 10))
					this.release = sustain;
			}
		},
	
	
		/**
		 * Returns the node that produces the sound. For example, an oscillator
		 * if the Sound object was initialized with a wave option.
		 */
		getSourceNode: {
			enumerable: true,
	
			value: function() {
				if (!!this.sourceNode) {
	
					// Directly disconnecting the previous source node causes a 
					// 'click' noise, especially noticeable if the sound is played 
					// while the release is ongoing. To address this, we fadeout the 
					// old source node before disonnecting it.
	
					var previousSourceNode = this.sourceNode;
					previousSourceNode.gainSuccessor.gain.setValueAtTime(previousSourceNode.gainSuccessor.gain.value, Pz.context.currentTime);
					previousSourceNode.gainSuccessor.gain.linearRampToValueAtTime(0.0001, Pz.context.currentTime + 0.2);
					setTimeout(function() {
						previousSourceNode.disconnect();
						previousSourceNode.gainSuccessor.disconnect();
					}, 200);
				}
	
				var sourceNode = this.getRawSourceNode();
	
				// A gain node will be placed after the source node to avoid
				// clicking noises (by fading out the sound)
				sourceNode.gainSuccessor = Pz.context.createGain();
				sourceNode.connect(sourceNode.gainSuccessor);
				sourceNode.gainSuccessor.connect(this.fadeNode);
				this.fadeNode.connect(this.getInputNode());
	
				if (Pz.Util.isAudioBufferSourceNode(sourceNode))
					sourceNode.onended = this.onEnded(sourceNode).bind(this);
	
				return sourceNode;
			}
		},
	
	
		/**
		 * Returns the first node in the graph. When there are effects,
		 * the first node is the input node of the first effect.
		 */
		getInputNode: {
			enumerable: true,
	
			value: function() {
				if (this.effects.length > 0)
					return this.effects[0].inputNode;
	
				return this.masterVolume;
			}
		},
	
		/**
		 * Will take the current source node and work up the volume
		 * gradually in as much time as specified in the attack property
		 * of the sound.
		 */
		applyAttack: {
			enumerable: false,
	
			value: function() {
				var currentValue = this.fadeNode.gain.value;
				this.fadeNode.gain.cancelScheduledValues(Pz.context.currentTime);
				this.fadeNode.gain.setValueAtTime(currentValue, Pz.context.currentTime);
	
				if (!this.attack) {
					this.fadeNode.gain.setValueAtTime(1.0, Pizzicato.context.currentTime);
					return;
				}
	
				var remainingAttackTime = (1 - this.fadeNode.gain.value) * this.attack;
				this.fadeNode.gain.setValueAtTime(this.fadeNode.gain.value, Pizzicato.context.currentTime);
				this.fadeNode.gain.linearRampToValueAtTime(1, Pizzicato.context.currentTime + remainingAttackTime);
			}
		},
	
		/**
		 * Will take the current source node and work down the volume
		 * gradually in as much time as specified in the release property
		 * of the sound before stopping the source node.
		 */
		stopWithRelease: {
			enumerable: false,
	
			value: function(callback) {
	
				var node = this.sourceNode;
				var stopSound = function() {
					return Pz.Util.isFunction(node.stop) ? node.stop(0) : node.disconnect();
				};
	
				var currentValue = this.fadeNode.gain.value;
				this.fadeNode.gain.cancelScheduledValues(Pz.context.currentTime);
				this.fadeNode.gain.setValueAtTime(currentValue, Pz.context.currentTime);
	
				if (!this.release) {
					stopSound();
					return;
				}
	
				var remainingReleaseTime = this.fadeNode.gain.value * this.release;
				this.fadeNode.gain.setValueAtTime(this.fadeNode.gain.value, Pizzicato.context.currentTime);
				this.fadeNode.gain.linearRampToValueAtTime(0.00001, Pizzicato.context.currentTime + remainingReleaseTime);
	
				window.setTimeout(function() {
					stopSound();
				}, remainingReleaseTime * 1000);
			}
		}
	});
	
	
	return Pizzicato;
})(typeof window !== "undefined" ? window : global);
