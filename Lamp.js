(function() {

    /**
    * A general interface for all lamps.
    * @constructor
    */
    this.LampInterface = function() {};
    this.LampInterface.prototype = {
        _state : 'off',
        get STATE_OFF () { return 'off'; },
        get STATE_ON () { return 'on'; },
        /** Translates the internal 'state' variable to the words 'on' or 'off' */
        get state() {
            return this._state;
        },

        /** sets the lamp's state. */
        set state(val) {
            if ([this.STATE_OFF, this.STATE_ON].indexOf(val) == -1) {
                throw new TypeError();
            }
            this._state = val;
        },

        /** Tells the user if the lamp is on or off. */
        examine : function() {
            return 'It is ' + this.state + ".";
        },

        toString : function() { return this.examine(); }
        
    };

    /**
    * The simplest interface that turns the lamp on and off.
    * @augments LampInterface
    * @constructor
    */
    this.OnOffInterface = function() {
        this.turnOn = function() {
            this.state = this.STATE_ON;
            return this;
        };

        this.turnOff = function() {
            this.state = this.STATE_OFF;
            return this;
        };

        this.toggle = function() {
            if (this.state == this.STATE_OFF) {
                this.state = this.STATE_ON;
            } else {
                this.state = this.STATE_OFF;
            }
            return this;
        };
    };
    this.OnOffInterface.prototype = this.LampInterface.prototype;

    /**
    * A interface for a fading touch lamp.
    * @augments LampInterface
    * @constructor
    */
    this.TouchFadeInterface = function() {
        var BRIGHTNESS_STEP = .1;
        var MAX_BRIGHTNESS = 1;

        this.brightness = 0;

        /**
        * Turn on and increase brightness of lamp
        */
        this.touchUp = function() {
            this.brightness = Math.min(MAX_BRIGHTNESS, this.brightness + BRIGHTNESS_STEP);
            this.state = this.STATE_ON;
            return this;
        };

        /**
        * Decrease the brightness of lamp
        */
        this.touchDown = function() {
            this.brightness = Math.max(0, this.brightness - BRIGHTNESS_STEP);
            if (this.brightness <= 0) this.state = this.STATE_OFF;
            return this;
        };

        this.examine = function() {
            return 'The lamp is ' + this.state + ' and brightness is ' + this.brightness + ".";
        };

    };
    this.TouchFadeInterface.prototype = this.LampInterface.prototype;

    /**
    * Creates a new lamp.
    * @constructor
    * @param {LampInterface} lampInterface - A type of lamp interface
    */
    this.Lamp = function(lampInterface) {
        this.lampInterface = lampInterface || new OnOffInterface();
        for(var i in this.lampInterface) {
            this[i] = this.lampInterface[i];
        }
    };

    this.Lamp.prototype = {
        /**
        * Returns a list of interface functions that allow
        * you to interact with the lamp.
        */
        getInterface : function() {
            var controls = [];

            for(var i in this.lampInterface) {
                if (typeof this.lampInterface[i] == "function") {
                    controls.push(i);
                }
            }
            return controls;
        }
    };
}).apply(this);

var tfInterface = new TouchFadeInterface();
var onOffInterface = new OnOffInterface();

var lamp1 = new Lamp();
lamp1.getInterface();
lamp1.examine();