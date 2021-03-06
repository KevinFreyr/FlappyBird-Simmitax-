window.Player = (function() {
	'use strict';

	var Controls = window.Controls;

	// All these constants are in em's, multiply by 10 pixels
	// for 1024x576px canvas.
	var SPEED = 30; // * 10 pixels per second
	var WIDTH = 5;
	var HEIGHT = 5;
	var INITIAL_POSITION_X = 30;
	var INITIAL_POSITION_Y = 25;
	var FALLING_ACCELERATION = 100;

	var Player = function(el, game) {
		this.el = el;
		this.game = game;
		this.pos = { x: 0, y: 0, width: WIDTH, height: HEIGHT };
		this.verticalSpeed = 0;
		this.lastKeyPressed = false;
	};

	/**
	 * Resets the state of the player for a new game.
	 */
	Player.prototype.reset = function() {
		this.pos.x = INITIAL_POSITION_X;
		this.pos.y = INITIAL_POSITION_Y;
		this.verticalSpeed = 0;
	};

	Player.prototype.onFrame = function(delta, hasStarted) {
		var self = this;

		if(hasStarted) {
			if(Controls.didJump()) {
				if(!this.lastKeyPressed) {
					self.verticalSpeed = 30;
					this.lastKeyPressed = true;

					if(!Controls.getAudioMuted()){
						var flap = document.getElementById('flap');
						$('#flap').trigger('play');
					}
				}
			}
			else {
				this.lastKeyPressed = false;
			}
		}

		this.pos.y -= this.verticalSpeed * delta;
		this.verticalSpeed -= FALLING_ACCELERATION * delta;
		
		if(this.verticalSpeed > 1) {
			$('.SimmiTax').attr('class', 'SimmiTax SimmiTax-jumping');
		}
		else if(this.verticalSpeed < -5) {
			$('.SimmiTax').attr('class', 'SimmiTax SimmiTax-falling');
		}
		else if(-5 < this.verticalSpeed < 5) {
			$('.SimmiTax').attr('class', 'SimmiTax SimmiTax-normal');
		}

		this.checkCollisionWithBounds();

		// Update UI
		this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
	};

	Player.prototype.getPlayerHeight = function() {
		return HEIGHT;
	};

	Player.prototype.getPlayerWidth = function() {
		return WIDTH;
	};

	Player.prototype.checkCollisionWithBounds = function() {
		if (this.pos.x < 0 ||
			this.pos.x + WIDTH > this.game.WORLD_WIDTH ||
			this.pos.y < 0 ||
			this.pos.y + HEIGHT + 10.8 > this.game.WORLD_HEIGHT) {
			return this.game.gameover();
		}
	};

	return Player;

})();
