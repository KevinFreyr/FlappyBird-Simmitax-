window.Pipe = (function(){
	'use strict';

	var MIN_Y = -15;
	var MAX_Y = 5;
	var PIPESPEED = 30;

	var Pipe = function(el, game) {
		this.el = el;
		this.game = game;
		this.throughPipe = false;
		this.pos = {x: 0, y: 0};
	};

	Pipe.prototype.onFrame = function(delta) {
		this.pos.x -= delta * PIPESPEED;
		if(this.pos.x < -10) {
			this.reset();
		}
		this.checkCollisionWithPlayer();
		this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
	};

	Pipe.prototype.reset = function(initx) {
		if(initx) {
			this.pos.x = initx;
		}
		else {
			this.pos.x = 110;
		}
		this.throughPipe = false;
		this.pos.y = Math.random() * (MAX_Y - MIN_Y)  + MIN_Y;
		this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
	};

	Pipe.prototype.checkCollisionWithPlayer = function() {
		var score = 0;
		var x = this.game.player.pos.x;
		var y = this.game.player.pos.y;
		var pipeGap = ((this.game.WORLD_HEIGHT/2) + this.pos.y);
		
		if(this.pos.x <= x + 5 && this.pos.x + 10 >= x && (pipeGap - 13 > y || pipeGap + 13 < y + 18)) {
			return this.game.gameover();
		}
		
		if(x + 5 <= this.pos.x + 5.5 && x + 5 >= this.pos.x + 4.5 && pipeGap - 13 < y && pipeGap + 13 > y + 5 && !this.throughPipe) {
			score = 1;
			this.game.score += score; 
			this.throughPipe = true;
		}
	};

	return Pipe;

})();