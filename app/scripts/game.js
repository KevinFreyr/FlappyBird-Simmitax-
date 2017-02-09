window.Game = (function() {
	'use strict';

	var Controls = window.Controls;

	/**
	 * Main game class.
	 * @param {Element} el jQuery element containing the game.
	 * @constructor
	 */
	var Game = function(el) {
		this.el = el;
		this.player = new window.Player(this.el.find('.Player'), this);
		this.cloud = new window.Cloud(this.el.find('.Cloud'), this);
		this.pipe1 = new window.Pipe(this.el.find('.Pipe1'), this);
		this.pipe2 = new window.Pipe(this.el.find('.Pipe2'), this);
		this.score = 0;
		this.isPlaying = false;
		this.hasStarted = false;

		// Cache a bound onFrame since we need it each frame.
		this.onFrame = this.onFrame.bind(this);
	};

	/**
	 * Runs every frame. Calculates a delta and allows each game
	 * entity to update itself.
	 */
	Game.prototype.onFrame = function() {
		// Check if the game loop should stop.
		if (!this.isPlaying) {
			return;
		}

		if(Controls.keys.up || Controls.keys.space || Controls.keys.click){
			this.hasStarted = true;
		}

		// Calculate how long since last frame in seconds.
		var now = +new Date() / 1000,
				delta = now - this.lastFrame;
		this.lastFrame = now;

		// Update game entities.
		this.player.onFrame(delta, this.hasStarted);
		this.cloud.onFrame(delta);
		this.pipe1.onFrame(delta, this.hasStarted);
		this.pipe2.onFrame(delta, this.hasStarted);

		// Request next frame.
		window.requestAnimationFrame(this.onFrame);
	};

	/**
	 * Starts a new game.
	 */
	Game.prototype.start = function() {
		this.reset();

		// Restart the onFrame loop
		this.lastFrame = +new Date() / 1000;
		window.requestAnimationFrame(this.onFrame);
		this.isPlaying = true;
	};

	/**
	 * Resets the state of the game so a new game can be started.
	 */
	Game.prototype.reset = function() {
		this.player.reset(this);
		this.pipe1.reset(100);
		this.pipe2.reset(150);
		this.hasStarted = false;
	};

	/**
	 * Signals that the game is over.
	 */
	Game.prototype.gameover = function() {
		this.isPlaying = false;
		$('.Score').html(this.score);
		this.score = 0;

		if(!Controls.getAudioMuted()){
			var death = document.getElementById('death');
			$('#death').trigger('play');
		}

		// Should be refactored into a Scoreboard class.
		var that = this;
		var scoreboardEl = this.el.find('.Scoreboard');
		scoreboardEl
			.addClass('is-visible')
			.find('.Restart')
				.one('touchend click', function() {
					scoreboardEl.removeClass('is-visible');
					that.start();
				});
	};

	/**
	 * Some shared constants.
	 */
	Game.prototype.WORLD_WIDTH = 102.4;
	Game.prototype.WORLD_HEIGHT = 57.6;

	return Game;

})();