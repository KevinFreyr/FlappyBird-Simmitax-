
/**
 * Bootstrap and start the game.
 */
$(function() {
    'use strict';

    var music = document.getElementById('themesong');
    music.volume = 0.1;

	$('.fa').click(function(){
		if($(this).hasClass('fa fa-volume-off')){
			$(this).removeClass('fa fa-volume-off').addClass('fa fa-volume-up');
		}
		else {
			$(this).removeClass('fa fa-volume-up').addClass('fa fa-volume-off');
		}
	});

    var game = new window.Game($('.GameCanvas'));
    game.start();
});
