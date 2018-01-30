
(function() {
    'use strict'

    var _Ritz_Scene_Map_createSubWindows = Window_Message.prototype.createSubWindows;
    Window_Message.prototype.createSubWindows = function() {
        _Ritz_Scene_Map_createSubWindows.call(this);
        this._svWindow = new Window_SVBattler(0, 0, window);
        this._svWindow.openness = 0;
		this._svWindow.x = 660;
		this._svWindow.y = 186;
        this._svWindow.opacity = 0;
    };

    var _Ritz_Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        if ($gameMessage.svImage() != '') this._svWindow.open();
        _Ritz_Window_Message_startMessage.call(this);
    };

    var _Ritz_Window_Message_termianteMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        this._svWindow.close()
        _Ritz_Window_Message_termianteMessage.call(this);
    };

    var _Ritz_Game_Message_clear = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function() {
        _Ritz_Game_Message_clear.call(this);
        this._svName = '';
        this._svIndex = 0;
    };

    Game_Message.prototype.svImage = function() {
        return this._svName;
    };

    Game_Message.prototype.svIndex = function() {
        return this._svIndex;
    };

    Game_Message.prototype.setSvImage = function(svName,svIndex) {
        this._svName = svName;
        this._svIndex = svIndex;
    };

    // overwrite
    Window_Message.prototype.subWindows = function() {
        return [this._goldWindow, this._choiceWindow,
                this._numberWindow, this._itemWindow, this._svWindow];
    };

    //===============================================================
    // Window_SVBattler
    //===============================================================
    function Window_SVBattler() {
        this.initialize.apply(this, arguments);
    }

    Window_SVBattler.prototype = Object.create(Window_Base.prototype);
    Window_SVBattler.prototype.constructor = Window_SVBattler;

    Window_SVBattler.prototype.initialize = function(x, y) {
        var width = this.windowWidth();
        var height = this.windowHeight();
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._index = 0;
        this._frame = 0;
        this._timer = 0;
        this.refresh();
    };

    Window_SVBattler.prototype.windowWidth = function() {
        return this.fittingHeight(2)*1.2;
    };

    Window_SVBattler.prototype.windowHeight = function() {
        return this.fittingHeight(2)*1.5;
    };

    Window_SVBattler.prototype.refresh = function() {
        var svName = $gameMessage.svImage();
        var svIndex = $gameMessage.svIndex();
        if(!svName) return;
        if (this.contents) {
            var batX = 6;
            var batY = 6;
            this.contents.clear();
            var pic = ImageManager.loadSvActor(svName);
            var pic_shadow = ImageManager.loadSvActor(svName+'_shadow');
            var row = Math.floor(svIndex/3);
            var column = svIndex % 3;
            var x = this._frame * (pic.width / 9) + (pic.width/3)*column;
            var y = (pic.width / 9) * row;
            this.contents.blt(pic_shadow, x, y, pic.width / 9, pic.height / 6, eval(batX)-12, eval(batY)-3,pic.width / 9*1.5, pic.height / 6*1.5);
            this.contents.blt(pic, x, y, pic.width / 9, pic.height / 6, eval(batX), eval(batY),pic.width / 9*1.5, pic.height / 6*1.5);
        }
    };

    Window_SVBattler.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this._timer += 1;
        if(this._timer === 10) this._frame = 1;
        if(this._timer === 20) this._frame = 2;
        if(this._timer === 30) this._frame = 1;
        if(this._timer === 40) {
            this._frame = 0;
            this._timer = 0;
        }
        this._index = 0;
        if(this._timer === 10 || 20 || 30 || 40) this.refresh();
    }

    Window_SVBattler.prototype.open = function() {
        this.refresh();
        Window_Base.prototype.open.call(this);
    };
})();
