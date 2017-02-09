window.Controls = (function() {
    'use strict';

    var audioMuted = false;

    /**
     * Key codes we're interested in.
     */
    var KEYS = {
        32: 'space',
        37: 'left',
        39: 'right'
    };

    /**
     * A singleton class which abstracts all player input,
     * should hide complexity of dealing with keyboard, mouse
     * and touch devices.
     * @constructor
     */
    var Controls = function() {
        this._didJump = false;
        this.keys = {};
        $(window)
            .on('keydown', this._onKeyDown.bind(this))
            .on('keyup', this._onKeyUp.bind(this))
            .on('touchstart mousedown', this._onMouseDown.bind(this))
            .on('touchend mouseup', this._onMouseUp.bind(this));
    };

    Controls.prototype._onKeyDown = function(e) {
        // Only jump if space wasn't pressed.
        if (e.keyCode === 32 && !this.keys.space) {
            this._didJump = true;
        }

        // Remember that this button is down.
        if (e.keyCode in KEYS) {
            var keyName = KEYS[e.keyCode];
            this.keys[keyName] = true;
            return false;
        }
    };

    Controls.prototype._onKeyUp = function(e) {
        if (e.keyCode in KEYS) {
            var keyName = KEYS[e.keyCode];
            this.keys[keyName] = false;
            return false;
        }
    };

    Controls.prototype._onMouseDown = function() {
        this._didJump = true;
        this.keys.click = true;
        return false;
    };

    Controls.prototype._onMouseUp = function() {
        this._didJump = false;
        this.keys.click = false;
        return false;
    };

    /**
     * Only answers true once until a key is pressed again.
     */
    Controls.prototype.didJump = function() {
        var answer = this._didJump;
        this._didJump = false;
        return answer;
    };

    Controls.prototype.getAudioMuted = function() {
        return audioMuted;
    };

    $('#audioIcon').on('touchstart click', function() {
        if(audioMuted) {
            audioMuted = false;
            $('#themesong').trigger('play');
        }
        else {
            audioMuted = true;
            $('#themesong').trigger('pause');
        }
    });
    
    // Export singleton.
    return new Controls();
})();
