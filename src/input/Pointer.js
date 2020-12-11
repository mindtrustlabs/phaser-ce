/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * A Pointer object is used by the Mouse, Touch and MSPoint managers and represents a single finger on the touch screen.
 *
 * @class Phaser.Pointer
 * @constructor
 * @param {Phaser.Game} game - A reference to the currently running game.
 * @param {number} id - The ID of the Pointer object within the game. Each game can have up to 10 active pointers.
 * @param {Phaser.PointerMode} pointerMode=(CURSOR|CONTACT) - The operational mode of this pointer, eg. CURSOR or CONTACT.
 */
Phaser.Pointer = function (game, id, pointerMode)
{
    /**
     * @property {Phaser.Game} game - A reference to the currently running game.
     */
    this.game = game;

    /**
     * @property {number} id - The ID of the Pointer object within the game. Each game can have up to 10 active pointers.
     */
    this.id = id;

    /**
     * @property {number} type - The const type of this object.
     * @readonly
     */
    this.type = Phaser.POINTER;

    /**
     * @property {boolean} exists - A Pointer object that exists is allowed to be checked for physics collisions and overlaps.
     * @default
     */
    this.exists = true;

    /**
     * @property {number} identifier - The identifier property of the Pointer as set by the DOM event when this Pointer is started.
     * @default
     */
    this.identifier = 0;

    /**
     * @property {number} pointerId - The pointerId property of the Pointer as set by the DOM event when this Pointer is started. The browser can and will recycle this value.
     * @default
     */
    this.pointerId = null;

    /**
     * @property {Phaser.PointerMode} pointerMode - The operational mode of this pointer.
     */
    this.pointerMode = pointerMode || (Phaser.PointerMode.CURSOR | Phaser.PointerMode.CONTACT);

    /**
     * @property {any} target - The target property of the Pointer as set by the DOM event when this Pointer is started.
     * @default
     */
    this.target = null;

    /**
     * The button property of the most recent DOM event when this Pointer is started.
     * You should not rely on this value for accurate button detection, instead use the Pointer properties
     * `leftButton`, `rightButton`, `middleButton` and so on.
     * @property {any} button
     * @default
     */
    this.button = null;

    /**
     * If this Pointer is a Mouse or Pen / Stylus then you can access its left button directly through this property.
     *
     * The DeviceButton has its own properties such as `isDown`, `duration` and methods like `justReleased` for more fine-grained
     * button control.
     *
     * @property {Phaser.DeviceButton} leftButton
     * @default
     */
    this.leftButton = new Phaser.DeviceButton(this, Phaser.Pointer.LEFT_BUTTON);

    /**
     * If this Pointer is a Mouse or Pen / Stylus then you can access its middle button directly through this property.
     *
     * The DeviceButton has its own properties such as `isDown`, `duration` and methods like `justReleased` for more fine-grained
     * button control.
     *
     * Please see the DeviceButton docs for details on browser button limitations.
     *
     * @property {Phaser.DeviceButton} middleButton
     * @default
     */
    this.middleButton = new Phaser.DeviceButton(this, Phaser.Pointer.MIDDLE_BUTTON);

    /**
     * If this Pointer is a Mouse or Pen / Stylus then you can access its right button directly through this property.
     *
     * The DeviceButton has its own properties such as `isDown`, `duration` and methods like `justReleased` for more fine-grained
     * button control.
     *
     * Please see the DeviceButton docs for details on browser button limitations.
     *
     * @property {Phaser.DeviceButton} rightButton
     * @default
     */
    this.rightButton = new Phaser.DeviceButton(this, Phaser.Pointer.RIGHT_BUTTON);

    /**
     * If this Pointer is a Mouse or Pen / Stylus then you can access its X1 (back) button directly through this property.
     *
     * The DeviceButton has its own properties such as `isDown`, `duration` and methods like `justReleased` for more fine-grained
     * button control.
     *
     * Please see the DeviceButton docs for details on browser button limitations.
     *
     * @property {Phaser.DeviceButton} backButton
     * @default
     */
    this.backButton = new Phaser.DeviceButton(this, Phaser.Pointer.BACK_BUTTON);

    /**
     * If this Pointer is a Mouse or Pen / Stylus then you can access its X2 (forward) button directly through this property.
     *
     * The DeviceButton has its own properties such as `isDown`, `duration` and methods like `justReleased` for more fine-grained
     * button control.
     *
     * Please see the DeviceButton docs for details on browser button limitations.
     *
     * @property {Phaser.DeviceButton} forwardButton
     * @default
     */
    this.forwardButton = new Phaser.DeviceButton(this, Phaser.Pointer.FORWARD_BUTTON);

    /**
     * If this Pointer is a Pen / Stylus then you can access its eraser button directly through this property.
     *
     * The DeviceButton has its own properties such as `isDown`, `duration` and methods like `justReleased` for more fine-grained
     * button control.
     *
     * Please see the DeviceButton docs for details on browser button limitations.
     *
     * @property {Phaser.DeviceButton} eraserButton
     * @default
     */
    this.eraserButton = new Phaser.DeviceButton(this, Phaser.Pointer.ERASER_BUTTON);

    /**
     * @property {boolean} _holdSent - Local private variable to store the status of dispatching a hold event.
     * @private
     * @default
     */
    this._holdSent = false;

    /**
     * @property {array} _history - Local private variable storing the short-term history of pointer movements.
     * @private
     */
    this._history = [];

    /**
     * @property {number} _nextDrop - Local private variable storing the time at which the next history drop should occur.
     * @private
     */
    this._nextDrop = 0;

    /**
     * @property {boolean} _stateReset - Monitor events outside of a state reset loop.
     * @private
     */
    this._stateReset = false;

    /**
     * @property {boolean} withinGame - true if the Pointer is over the game canvas, otherwise false.
     */
    this.withinGame = false;

    /**
     * @property {number} clientX - The horizontal coordinate of the Pointer within the application's client area at which the event occurred (as opposed to the coordinates within the page).
     */
    this.clientX = -1;

    /**
     * @property {number} clientY - The vertical coordinate of the Pointer within the application's client area at which the event occurred (as opposed to the coordinates within the page).
     */
    this.clientY = -1;

    /**
     * @property {number} pageX - The horizontal coordinate of the Pointer relative to whole document.
     */
    this.pageX = -1;

    /**
     * @property {number} pageY - The vertical coordinate of the Pointer relative to whole document.
     */
    this.pageY = -1;

    /**
     * @property {number} screenX - The horizontal coordinate of the Pointer relative to the screen.
     */
    this.screenX = -1;

    /**
     * @property {number} screenY - The vertical coordinate of the Pointer relative to the screen.
     */
    this.screenY = -1;

    /**
     * @property {number} rawMovementX - The horizontal raw relative movement of the Pointer in pixels at the last event, if this is a Mouse Pointer in a locked state.
     * @default
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX
     */
    this.rawMovementX = 0;

    /**
     * @property {number} rawMovementY - The vertical raw relative movement of the Pointer in pixels at the last event, if this is a Mouse Pointer in a locked state.
     * @default
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY
     */
    this.rawMovementY = 0;

    /**
     * @property {number} movementX - The cumulative horizontal relative movement of the Pointer in pixels since resetMovement() was called, if this is a Mouse Pointer in a locked state.
     * @default
     */
    this.movementX = 0;

    /**
     * @property {number} movementY - The cumulative vertical relative movement of the Pointer in pixels since resetMovement() was called, if this is a Mouse Pointer in a locked state..
     * @default
     */
    this.movementY = 0;

    /**
     * @property {number} x - The horizontal coordinate of the Pointer. This value is automatically scaled based on the game scale.
     * @default
     */
    this.x = -1;

    /**
     * @property {number} y - The vertical coordinate of the Pointer. This value is automatically scaled based on the game scale.
     * @default
     */
    this.y = -1;

    /**
     * @property {boolean} isMouse - If the Pointer is a mouse or pen / stylus this is true, otherwise false.
     */
    this.isMouse = (id === 0);

    /**
     * If the Pointer is touching the touchscreen, or *any* mouse or pen button is held down, isDown is set to true.
     * If you need to check a specific mouse or pen button then use the button properties, i.e. Pointer.rightButton.isDown.
     * @property {boolean} isDown
     * @default
     */
    this.isDown = false;

    /**
     * If the Pointer is not touching the touchscreen, or *all* mouse or pen buttons are up, isUp is set to true.
     * If you need to check a specific mouse or pen button then use the button properties, i.e. Pointer.rightButton.isUp.
     * @property {boolean} isUp
     * @default
     */
    this.isUp = true;

    /**
     * @property {number} timeDown - A timestamp representing when the Pointer first touched the touchscreen.
     * @default
     */
    this.timeDown = 0;

    /**
     * @property {number} timeUp - A timestamp representing when the Pointer left the touchscreen.
     * @default
     */
    this.timeUp = 0;

    /**
     * @property {number} previousTapTime - A timestamp representing when the Pointer was last tapped or clicked.
     * @default
     */
    this.previousTapTime = 0;

    /**
     * @property {number} totalTouches - The total number of times this Pointer has been touched to the touchscreen.
     * @default
     */
    this.totalTouches = 0;

    /**
     * @property {number} msSinceLastClick - The number of milliseconds since the last click or touch event.
     * @default
     */
    this.msSinceLastClick = Number.MAX_VALUE;

    /**
     * @property {any} targetObject - The Game Object this Pointer is currently over / touching / dragging.
     * @default
     */
    this.targetObject = null;

    /**
     * This array is erased and re-populated every time this Pointer is updated. It contains references to all
     * of the Game Objects that were considered as being valid for processing by this Pointer, this frame. To be
     * valid they must have suitable a `priorityID`, be Input enabled, visible and actually have the Pointer over
     * them. You can check the contents of this array in events such as `onInputDown`, but beware it is reset
     * every frame.
     * @property {array} interactiveCandidates
     * @default
     */
    this.interactiveCandidates = [];

    /**
     * @property {boolean} active - An active pointer is one that is currently pressed down on the display. A Mouse is always active.
     * @default
     */
    this.active = false;

    /**
     * @property {boolean} dirty - A dirty pointer needs to re-poll any interactive objects it may have been over, regardless if it has moved or not.
     * @default
     */
    this.dirty = false;

    /**
     * @property {Phaser.Point} position - A Phaser.Point object containing the current x/y values of the pointer on the display.
     */
    this.position = new Phaser.Point();

    /**
     * @property {Phaser.Point} positionDown - A Phaser.Point object containing the x/y values of the pointer when it was last in a down state on the display.
     */
    this.positionDown = new Phaser.Point();

    /**
     * @property {Phaser.Point} positionUp - A Phaser.Point object containing the x/y values of the pointer when it was last released.
     */
    this.positionUp = new Phaser.Point();

    /**
     * A Phaser.Circle that is centered on the x/y coordinates of this pointer, useful for hit detection.
     * The Circle size is 44px (Apples recommended "finger tip" size).
     * @property {Phaser.Circle} circle
     */
    this.circle = new Phaser.Circle(0, 0, 44);

    /**
     * Click trampolines associated with this pointer. See `addClickTrampoline`.
     * @property {object[]|null} _clickTrampolines
     * @private
     */
    this._clickTrampolines = null;

    /**
     * When the Pointer has click trampolines the last target object is stored here
     * so it can be used to check for validity of the trampoline in a post-Up/'stop'.
     * @property {object} _trampolineTargetObject
     * @private
     */
    this._trampolineTargetObject = null;
};

/**
 * No buttons at all.
 * @constant
 * @type {number}
 */
Phaser.Pointer.NO_BUTTON = 0;

/**
 * The Left Mouse button, or in PointerEvent devices a Touch contact or Pen contact.
 * @constant
 * @type {number}
 */
Phaser.Pointer.LEFT_BUTTON = 1;

/**
 * The Right Mouse button, or in PointerEvent devices a Pen contact with a barrel button.
 * @constant
 * @type {number}
 */
Phaser.Pointer.RIGHT_BUTTON = 2;

/**
 * The Middle Mouse button.
 * @constant
 * @type {number}
 */
Phaser.Pointer.MIDDLE_BUTTON = 4;

/**
 * The X1 button. This is typically the mouse Back button, but is often reconfigured.
 * On Linux (GTK) this is unsupported. On Windows if advanced pointer software (such as IntelliPoint) is installed this doesn't register.
 * @constant
 * @type {number}
 */
Phaser.Pointer.BACK_BUTTON = 8;

/**
 * The X2 button. This is typically the mouse Forward button, but is often reconfigured.
 * On Linux (GTK) this is unsupported. On Windows if advanced pointer software (such as IntelliPoint) is installed this doesn't register.
 * @constant
 * @type {number}
 */
Phaser.Pointer.FORWARD_BUTTON = 16;

/**
 * The Eraser pen button on PointerEvent supported devices only.
 * @constant
 * @type {number}
 */
Phaser.Pointer.ERASER_BUTTON = 32;

Phaser.Pointer.prototype = {

    /**
     * Resets the states of all the button booleans.
     *
     * @method Phaser.Pointer#resetButtons
     * @protected
     */
    resetButtons: function ()
    {
        this.isDown = false;
        this.isUp = true;

        if (this.isMouse)
        {
            this.leftButton.reset();
            this.middleButton.reset();
            this.rightButton.reset();
            this.backButton.reset();
            this.forwardButton.reset();
            this.eraserButton.reset();
        }
    },

    /**
     * Called by processButtonsUpDown.
     *
     * @method Phaser.Pointer#processButtonsDown
     * @private
     * @param {integer} button - {@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button MouseEvent#button} value.
     * @param {MouseEvent} event - The DOM event.
     */
    processButtonsDown: function (button, event)
    {
        console.log("Process down "+button);
        switch (button)
        {
            case (Phaser.Mouse.LEFT_BUTTON):
                this.leftButton.start(event);
                break;

            case (Phaser.Mouse.RIGHT_BUTTON):
                this.rightButton.start(event);
                break;

            case (Phaser.Mouse.MIDDLE_BUTTON):
                this.middleButton.start(event);
                break;

            case (Phaser.Mouse.BACK_BUTTON):
                this.backButton.start(event);
                break;

            case (Phaser.Mouse.FORWARD_BUTTON):
                this.forwardButton.start(event);
                break;
        }
    },

    /**
     * Called by processButtonsUpDown.
     *
     * @method Phaser.Pointer#processButtonsUp
     * @private
     * @param {integer} button - {@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button MouseEvent#button} value.
     * @param {MouseEvent} event - The DOM event.
     */
    processButtonsUp: function (button, event)
    {

        console.log("Process UP "+button);
        switch (button)
        {
            case (Phaser.Mouse.LEFT_BUTTON):
                this.leftButton.stop(event);
                break;

            case (Phaser.Mouse.RIGHT_BUTTON):
                this.rightButton.stop(event);
                break;

            case (Phaser.Mouse.MIDDLE_BUTTON):
                this.middleButton.stop(event);
                break;

            case (Phaser.Mouse.BACK_BUTTON):
                this.backButton.stop(event);
                break;

            case (Phaser.Mouse.FORWARD_BUTTON):
                this.forwardButton.stop(event);
                break;
        }
    },

    /**
     * Called by updateButtons.
     *
     * @method Phaser.Pointer#processButtonsUpDown
     * @private
     * @param {integer} buttons - {@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons MouseEvent#buttons} value.
     * @param {MouseEvent} event - The DOM event.
     */
    processButtonsUpDown: function (buttons, event)
    {
        var type = event.type.toLowerCase().substr(-4);
        var down = (type === 'down');
        var move = (type === 'move');

 
        console.log("<> Change to: "+type +" for value: "+buttons);
        if (buttons !== undefined)
        {
            // On OS X (and other devices with trackpads) you have to press CTRL + the pad to initiate a right-click event.
            if (down && buttons === 1 && event.ctrlKey)
            {
                buttons = 2;
            }
            // Note: These are bitwise checks, not booleans
            this.leftButton.startStop(Phaser.Pointer.LEFT_BUTTON & buttons, event);
            this.rightButton.startStop(Phaser.Pointer.RIGHT_BUTTON & buttons, event);
            this.middleButton.startStop(Phaser.Pointer.MIDDLE_BUTTON & buttons, event);
            this.backButton.startStop(Phaser.Pointer.BACK_BUTTON & buttons, event);
            this.forwardButton.startStop(Phaser.Pointer.FORWARD_BUTTON & buttons, event);
            this.eraserButton.startStop(Phaser.Pointer.ERASER_BUTTON & buttons, event);
        }
        else
        {
            /*
             * No buttons property (like Safari on OSX when using a trackpad)
             * Attempt to use event.button property or fallback to default
             */
            if (event.button !== undefined)
            {
                // On OS X (and other devices with trackpads) you have to press CTRL + the pad to initiate a right-click event.
                if (down && event.ctrlKey && event.button === 0)
                {
                    this.rightButton.start(event);
                }
                else
                if (down)
                {
console.log("fallback Process down "+event.button);
                    this.processButtonsDown(event.button, event);
                }
                else if (!move)
                {

        console.log("fallback Process up "+event.button);
                    this.processButtonsUp(event.button, event);
                }
            }
            else
            if (down)
            {
                console.log("double fallback process down left"/right);
                // On OS X (and other devices with trackpads) you have to press CTRL + the pad to initiate a right-click event.
                if (event.ctrlKey)
                {
                    this.rightButton.start(event);
                }
                else
                {

                    this.leftButton.start(event);
                }
            }
            else
            {
                console.log("double fallback process up left/right");
                this.leftButton.stop(event);
                this.rightButton.stop(event);
            }
        }
    },

    /**
     * Called when the event.buttons property changes from zero.
     * Contains a button bitmask.
     *
     * @method Phaser.Pointer#updateButtons
     * @protected
     * @param {MouseEvent} event - The DOM event.
     */
    updateButtons: function (event)
    {
        this.button = event.button;
        this.processButtonsUpDown(event.buttons, event);

        this.isUp = true;
        this.isDown = false;

        console.log("Update buttons. "+event.buttons+" All are up. Riight?  L "+this.leftButton.isDown +" R "+this.rightButton.isDown +" m "+this.middleButton.isDown +" back "+this.backButton.isDown +" forw "+this.forwardButton.isDown +" or eras "+this.eraserButton.isDown);
        if (this.leftButton.isDown || this.rightButton.isDown || this.middleButton.isDown || this.backButton.isDown || this.forwardButton.isDown || this.eraserButton.isDown)
        {
            this.isUp = false;
            this.isDown = true;
        }
    },

    /**
     * Called when the Pointer is pressed onto the touchscreen.
     * @method Phaser.Pointer#start
     * @param {any} event - The DOM event from the browser.
     */
    start: function (event)
    {
        var input = this.game.input;

        console.log("input START "+input +" "+event.buttons);
        if (event.pointerId)
        {
            this.pointerId = event.pointerId;
        }

        this.identifier = event.identifier;
        this.target = event.target;

        if (this.isMouse)
        {
            this.updateButtons(event);
        }
        else
        {
            this.isDown = true;
            this.isUp = false;
        }

        this.active = true;
        this.withinGame = true;
        this.dirty = false;

        this._history = [];
        this._clickTrampolines = null;
        this._trampolineTargetObject = null;

        //  Work out how long it has been since the last click
        this.msSinceLastClick = this.game.time.time - this.timeDown;
        this.timeDown = this.game.time.time;
        this._holdSent = false;

        //  This sets the x/y and other local values
        this.move(event, true);

        // x and y are the old values here?
        this.positionDown.setTo(this.x, this.y);

        if (input.multiInputOverride === Phaser.Input.MOUSE_OVERRIDES_TOUCH ||
            input.multiInputOverride === Phaser.Input.MOUSE_TOUCH_COMBINE ||
            (input.multiInputOverride === Phaser.Input.TOUCH_OVERRIDES_MOUSE && input.totalActivePointers === 0))
        {
            input.x = this.x;
            input.y = this.y;
            input.position.setTo(this.x, this.y);
            input.onDown.dispatch(this, event);
            input.resetSpeed(this.x, this.y);
        }

        this._stateReset = false;

        this.totalTouches++;

        if (this.targetObject !== null)
        {
            this.targetObject._touchedHandler(this);
        } else {
            console.log("touch not over an object");
        }

        return this;
    },

    /**
     * Called by the Input Manager.
     * @method Phaser.Pointer#update
     */
    update: function ()
    {
        var input = this.game.input;

        if (this.active)
        {
            //  Force a check?
            if (this.dirty)
            {
                if (input.interactiveItems.total > 0)
                {
                    this.processInteractiveObjects(false);
                }

                this.dirty = false;
            }

            if (this._holdSent === false && this.duration >= input.holdRate)
            {
                if (input.multiInputOverride === Phaser.Input.MOUSE_OVERRIDES_TOUCH ||
                    input.multiInputOverride === Phaser.Input.MOUSE_TOUCH_COMBINE ||
                    (input.multiInputOverride === Phaser.Input.TOUCH_OVERRIDES_MOUSE && input.totalActivePointers === 0))
                {
                    input.onHold.dispatch(this);
                }

                this._holdSent = true;
            }

            //  Update the droppings history
            if (input.recordPointerHistory && this.game.time.time >= this._nextDrop)
            {
                this._nextDrop = this.game.time.time + input.recordRate;

                this._history.push({
                    x: this.position.x,
                    y: this.position.y
                });

                if (this._history.length > input.recordLimit)
                {
                    this._history.shift();
                }
            }
        }
    },

    /**
     * Called when the Pointer is moved.
     *
     * @method Phaser.Pointer#move
     * @param {MouseEvent|PointerEvent|TouchEvent} event - The event passed up from the input handler.
     * @param {boolean} [fromClick=false] - Was this called from the click event?
     */
    move: function (event, fromClick)
    {
        var input = this.game.input;

        if (input.pollLocked)
        {
            return;
        }

        if (fromClick === undefined) { fromClick = false; }

        if (event.button !== undefined)
        {
            this.button = event.button;
        }

        if (this.isMouse)
        {
            this.updateButtons(event);
        }

        this.clientX = event.clientX;
        this.clientY = event.clientY;

        this.pageX = event.pageX;
        this.pageY = event.pageY;

        this.screenX = event.screenX;
        this.screenY = event.screenY;

        if (this.isMouse && input.pointerLock.locked && !fromClick)
        {
            this.rawMovementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            this.rawMovementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            this.movementX += this.rawMovementX;
            this.movementY += this.rawMovementY;
        }

        this.x = (this.pageX - this.game.scale.offset.x) * input.scale.x;
        this.y = (this.pageY - this.game.scale.offset.y) * input.scale.y;

        this.position.setTo(this.x, this.y);
        this.circle.x = this.x;
        this.circle.y = this.y;

        if (input.multiInputOverride === Phaser.Input.MOUSE_OVERRIDES_TOUCH ||
            input.multiInputOverride === Phaser.Input.MOUSE_TOUCH_COMBINE ||
            (input.multiInputOverride === Phaser.Input.TOUCH_OVERRIDES_MOUSE && input.totalActivePointers === 0))
        {
            input.activePointer = this;
            input.x = this.x;
            input.y = this.y;
            input.position.setTo(input.x, input.y);
            input.circle.x = input.x;
            input.circle.y = input.y;
        }

        this.withinGame = this.game.scale.bounds.contains(this.pageX, this.pageY);

        var i = input.moveCallbacks.length;

        while (i--)
        {
            input.moveCallbacks[i].callback.call(input.moveCallbacks[i].context, this, this.x, this.y, fromClick, event);
        }

        //  Easy out if we're dragging something and it still exists
        if (this.targetObject !== null && (!this.game.paused || this.targetObject.noPause) && this.targetObject.isDragged === true)
        {
            if (this.targetObject.update(this) === false)
            {
                this.targetObject = null;
            }
        }
        else if (input.interactiveItems.total > 0)
        {
            this.processInteractiveObjects(fromClick);
        }

        return this;
    },

    /**
     * Process all interactive objects to find out which ones were updated in the recent Pointer move.
     *
     * @method Phaser.Pointer#processInteractiveObjects
     * @protected
     * @param {boolean} [fromClick=false] - Was this called from the click event?
     * @return {boolean} True if this method processes an object (i.e. a Sprite becomes the Pointers currentTarget), otherwise false.
     */
    processInteractiveObjects: function (fromClick)
    {
        //  Work out which object is on the top
        var highestRenderOrderID = 0;
        var highestInputPriorityID = -1;
        var candidateTarget = null;

        /*
         *  First pass gets all objects that the pointer is over that DON'T use pixelPerfect checks and get the highest ID
         *  We know they'll be valid for input detection but not which is the top just yet
         */

        var currentNode = this.game.input.interactiveItems.first;

        this.interactiveCandidates = [];

        while (currentNode)
        {
            //  Reset checked status
            currentNode.checked = false;

            if (currentNode.validForInput(highestInputPriorityID, highestRenderOrderID, false) && (!this.game.paused || currentNode.sprite.noPause))
            {
                //  Flag it as checked so we don't re-scan it on the next phase
                currentNode.checked = true;

                if ((fromClick && currentNode.checkPointerDown(this, true)) ||
                    (!fromClick && currentNode.checkPointerOver(this, true)))
                {
                    highestRenderOrderID = currentNode.sprite.renderOrderID;
                    highestInputPriorityID = currentNode.priorityID;
                    candidateTarget = currentNode;
                    this.interactiveCandidates.push(currentNode);
                }
            }

            currentNode = this.game.input.interactiveItems.next;
        }

        /*
         *  Then in the second sweep we process ONLY the pixel perfect ones that are checked and who have a higher ID
         *  because if their ID is lower anyway then we can just automatically discount them
         *  (A node that was previously checked did not request a pixel-perfect check.)
         */

        currentNode = this.game.input.interactiveItems.first;

        while (currentNode)
        {
            if (!currentNode.checked &&
                currentNode.validForInput(highestInputPriorityID, highestRenderOrderID, true))
            {
                if ((fromClick && currentNode.checkPointerDown(this, false)) ||
                    (!fromClick && currentNode.checkPointerOver(this, false)))
                {
                    highestRenderOrderID = currentNode.sprite.renderOrderID;
                    highestInputPriorityID = currentNode.priorityID;
                    candidateTarget = currentNode;
                    this.interactiveCandidates.push(currentNode);
                }
            }

            currentNode = this.game.input.interactiveItems.next;
        }

        if (this.game.input.customCandidateHandler)
        {
            candidateTarget = this.game.input.customCandidateHandler.call(this.game.input.customCandidateHandlerContext, this, this.interactiveCandidates, candidateTarget);
        }

        this.swapTarget(candidateTarget, false);

        return (this.targetObject !== null);
    },

    /**
     * This will change the `Pointer.targetObject` object to be the one provided.
     *
     * This allows you to have fine-grained control over which object the Pointer is targeting.
     *
     * Note that even if you set a new Target here, it is still able to be replaced by any other valid
     * target during the next Pointer update.
     *
     * @method Phaser.Pointer#swapTarget
     * @param {Phaser.InputHandler} newTarget - The new target for this Pointer. Note this is an `InputHandler`, so don't pass a Sprite, instead pass `sprite.input` to it.
     * @param {boolean} [silent=false] - If true the new target AND the old one will NOT dispatch their `onInputOver` or `onInputOut` events.
     */
    swapTarget: function (newTarget, silent)
    {
        if (silent === undefined) { silent = false; }

        //  Now we know the top-most item (if any) we can process it
        if (newTarget === null)
        {
            //  The pointer isn't currently over anything, check if we've got a lingering previous target
            if (this.targetObject)
            {
                this.targetObject._pointerOutHandler(this, silent);
                this.targetObject = null;
            }
        }
        else
        if (this.targetObject === null)
        {
            //  And now set the new one
            this.targetObject = newTarget;
            newTarget._pointerOverHandler(this, silent);
        }
        else
        {
            //  We've got a target from the last update
            if (this.targetObject === newTarget)
            {
                //  Same target as before, so update it
                if (newTarget.update(this) === false)
                {
                    this.targetObject = null;
                }
            }
            else
            {
                //  The target has changed, so tell the old one we've left it
                this.targetObject._pointerOutHandler(this, silent);

                //  And now set the new one
                this.targetObject = newTarget;
                this.targetObject._pointerOverHandler(this, silent);
            }
        }
    },

    /**
     * Called when the Pointer leaves the target area.
     *
     * @method Phaser.Pointer#leave
     * @param {MouseEvent|PointerEvent|TouchEvent} event - The event passed up from the input handler.
     */
    leave: function (event)
    {
        this.withinGame = false;
        this.move(event, false);
    },

    /**
     * Called when the Pointer leaves the touchscreen.
     *
     * @method Phaser.Pointer#stop
     * @param {MouseEvent|PointerEvent|TouchEvent} event - The event passed up from the input handler.
     */
    stop: function (event)
    {
        var input = this.game.input;

        console.log("input STOP "+input +" bts "+event.buttons);
        if (this._stateReset && this.withinGame)
        {
            event.preventDefault();
            return;
        }

        this.timeUp = this.game.time.time;

        if (input.multiInputOverride === Phaser.Input.MOUSE_OVERRIDES_TOUCH ||
            input.multiInputOverride === Phaser.Input.MOUSE_TOUCH_COMBINE ||
            (input.multiInputOverride === Phaser.Input.TOUCH_OVERRIDES_MOUSE && input.totalActivePointers === 0))
        {
            input.onUp.dispatch(this, event);

            //  Was it a tap?
            if (this.duration >= 0 && this.duration <= input.tapRate)
            {
                //  Was it a double-tap?
                var doubleTap = (this.timeUp - this.previousTapTime < input.doubleTapRate);

                input.onTap.dispatch(this, doubleTap, event);

                this.previousTapTime = this.timeUp;
            }
        }

        if (this.isMouse)
        {
            this.updateButtons(event);
        }
        else
        {
            this.isDown = false;
            this.isUp = true;
        }

        //  Mouse is always active
        if (this.id > 0)
        {
            this.active = false;
        }

        this.withinGame = this.game.scale.bounds.contains(event.pageX, event.pageY);
        this.pointerId = null;
        this.identifier = null;

        this.positionUp.setTo(this.x, this.y);

        if (this.isMouse === false)
        {
            input.currentPointers--;
        }

        input.callAll('_releasedHandler', this);

        if (this._clickTrampolines)
        {
            this._trampolineTargetObject = this.targetObject;
        }

        this.targetObject = null;

        return this;
    },

    /**
     * The Pointer is considered justPressed if the time it was pressed onto the touchscreen or clicked is less than justPressedRate.
     * Note that calling justPressed doesn't reset the pressed status of the Pointer, it will return `true` for as long as the duration is valid.
     * If you wish to check if the Pointer was pressed down just once then see the Sprite.events.onInputDown event.
     * @method Phaser.Pointer#justPressed
     * @param {number} [duration] - The time to check against. If none given it will use InputManager.justPressedRate.
     * @return {boolean} true if the Pointer was pressed down within the duration given.
     */
    justPressed: function (duration)
    {
        duration = duration || this.game.input.justPressedRate;

        return (this.isDown === true && (this.timeDown + duration) > this.game.time.time);
    },

    /**
     * The Pointer is considered justReleased if the time it left the touchscreen is less than justReleasedRate.
     * Note that calling justReleased doesn't reset the pressed status of the Pointer, it will return `true` for as long as the duration is valid.
     * If you wish to check if the Pointer was released just once then see the Sprite.events.onInputUp event.
     * @method Phaser.Pointer#justReleased
     * @param {number} [duration] - The time to check against. If none given it will use InputManager.justReleasedRate.
     * @return {boolean} true if the Pointer was released within the duration given.
     */
    justReleased: function (duration)
    {
        duration = duration || this.game.input.justReleasedRate;

        return (this.isUp && (this.timeUp + duration) > this.game.time.time);
    },

    /**
     * Add a click trampoline to this pointer.
     *
     * A click trampoline is a callback that is run on the DOM 'click' event; this is primarily
     * needed with certain browsers (ie. IE11) which restrict some actions like requestFullscreen
     * to the DOM 'click' event and rejects it for 'pointer*' and 'mouse*' events.
     *
     * This is used internally by the ScaleManager; click trampoline usage is uncommon.
     * Click trampolines can only be added to pointers that are currently down.
     *
     * @method Phaser.Pointer#addClickTrampoline
     * @protected
     * @param {string} name - The name of the trampoline; must be unique among active trampolines in this pointer.
     * @param {function} callback - Callback to run/trampoline.
     * @param {object} callbackContext - Context of the callback.
     * @param {object[]|null} callbackArgs - Additional callback args, if any. Supplied as an array.
     */
    addClickTrampoline: function (name, callback, callbackContext, callbackArgs)
    {
        if (!this.isDown)
        {
            return;
        }

        var trampolines = (this._clickTrampolines = this._clickTrampolines || []);

        for (var i = 0; i < trampolines.length; i++)
        {
            if (trampolines[i].name === name)
            {
                trampolines.splice(i, 1);
                break;
            }
        }

        trampolines.push({
            name: name,
            targetObject: this.targetObject,
            callback: callback,
            callbackContext: callbackContext,
            callbackArgs: callbackArgs
        });
    },

    /**
     * Fire all click trampolines for which the pointers are still referring to the registered object.
     * @method Phaser.Pointer#processClickTrampolines
     * @private
     */
    processClickTrampolines: function ()
    {
        var trampolines = this._clickTrampolines;

        if (!trampolines)
        {
            return;
        }

        for (var i = 0; i < trampolines.length; i++)
        {
            var trampoline = trampolines[i];

            if (trampoline.targetObject === this._trampolineTargetObject)
            {
                trampoline.callback.apply(trampoline.callbackContext, trampoline.callbackArgs);
            }
        }

        this._clickTrampolines = null;
        this._trampolineTargetObject = null;
    },

    /**
     * Resets the Pointer properties. Called by InputManager.reset when you perform a State change.
     * @method Phaser.Pointer#reset
     */
    reset: function ()
    {
        if (this.isMouse === false)
        {
            this.active = false;
        }

        this.pointerId = null;
        this.identifier = null;
        this.dirty = false;
        this.totalTouches = 0;
        this._holdSent = false;
        this._history.length = 0;
        this._stateReset = true;

        this.resetButtons();

        if (this.targetObject)
        {
            this.targetObject._releasedHandler(this);
        }

        this.targetObject = null;
    },

    /**
     * Resets the movementX and movementY properties. Use in your update handler after retrieving the values.
     * @method Phaser.Pointer#resetMovement
     */
    resetMovement: function ()
    {
        this.movementX = 0;
        this.movementY = 0;
    }

};

Phaser.Pointer.prototype.constructor = Phaser.Pointer;

/**
 * How long the Pointer has been depressed on the touchscreen or *any* of the mouse buttons have been held down.
 * If not currently down it returns -1.
 * If you need to test a specific mouse or pen button then access the buttons directly, i.e. `Pointer.rightButton.duration`.
 *
 * @name Phaser.Pointer#duration
 * @property {number} duration
 * @readonly
 */
Object.defineProperty(Phaser.Pointer.prototype, 'duration', {

    get: function ()
    {
        if (this.isUp)
        {
            return -1;
        }

        return this.game.time.time - this.timeDown;
    }

});

/**
 * Gets the X value of this Pointer in world coordinates based on the world camera.
 * @name Phaser.Pointer#worldX
 * @property {number} worldX - The X value of this Pointer in world coordinates based on the world camera.
 * @readonly
 */
Object.defineProperty(Phaser.Pointer.prototype, 'worldX', {

    get: function ()
    {
        return this.game.world.camera.x + this.x;
    }

});

/**
 * Gets the Y value of this Pointer in world coordinates based on the world camera.
 * @name Phaser.Pointer#worldY
 * @property {number} worldY - The Y value of this Pointer in world coordinates based on the world camera.
 * @readonly
 */
Object.defineProperty(Phaser.Pointer.prototype, 'worldY', {

    get: function ()
    {
        return this.game.world.camera.y + this.y;
    }

});

/**
 * Enumeration categorizing operational modes of pointers.
 *
 * PointerType values represent valid bitmasks.
 * For example, a value representing both Mouse and Touch devices
 * can be expressed as `PointerMode.CURSOR | PointerMode.CONTACT`.
 *
 * Values may be added for future mode categorizations.
 * @class Phaser.PointerMode
 */
Phaser.PointerMode = {

    /**
     * A 'CURSOR' is a pointer with a *passive cursor* such as a mouse, touchpad, watcom stylus, or even TV-control arrow-pad.
     *
     * It has the property that a cursor is passively moved without activating the input.
     * This currently corresponds with {@link Phaser.Pointer#isMouse} property.
     * @constant
     */
    CURSOR: 1 << 0,

    /**
     * A 'CONTACT' pointer has an *active cursor* that only tracks movement when actived; notably this is a touch-style input.
     * @constant
     */
    CONTACT: 1 << 1

};

Phaser.PointerModes = {};

Phaser.PointerModes[Phaser.PointerMode.CURSOR] = 'CURSOR';

Phaser.PointerModes[Phaser.PointerMode.CONTACT] = 'CONTACT';
