//=============================================================================
// Ritz_Menu.js
// ----------------------------------------------------------------------------
// (C)2019 Atelier_Ritz
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2019/03/23 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/atelier_ritz/
// [GitHub] : https://github.com/atelier-ritz
//=============================================================================


/*:
 * @plugindesc Ver1.0/メニューを変更します。
 * @author Ritz
 *
 * @help
 * 注意：このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

 (function() {
     'use strict';
    //=============================================================================
    // Scene_Menu
    //=============================================================================
    Scene_Menu.prototype.createHelpWindow = function() {
        this._helpWindow = new Window_MenuHelp();
        this.addWindow(this._helpWindow);
        this._helpWindow.hide();
    };

    Scene_Menu.prototype.createEquipWindow = function() {
        this._equipWindow = new Window_EquipStatus(0, 0);
        this.addWindow(this._equipWindow);
        this._equipWindow.hide();
    };

    Scene_Menu.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
        // this.createGoldWindow();
        this.createStatusWindow();
        this.refreshSVActor();
        this.createHelpWindow();
        this.createEquipWindow();
    };

    Scene_Menu.prototype.createStatusWindow = function() {
        this._statusWindow = new Window_MenuStatus(460, 0);
        this.addWindow(this._statusWindow);
        this._statusWindow.hide();
    };

    Scene_Menu.prototype.createCommandWindow = function() {
        this._commandWindow = new Window_MenuCommand(Graphics.boxWidth, 0);
        this._commandWindow.setHandler('item',      this.commandItem.bind(this));
        this._commandWindow.setHandler('skill',     this.commandPersonal.bind(this));
        this._commandWindow.setHandler('equip',     this.commandPersonal.bind(this));
        this._commandWindow.setHandler('status',    this.commandPersonal.bind(this));
        this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
        this._commandWindow.setHandler('options',   this.commandOptions.bind(this));
        this._commandWindow.setHandler('save',      this.commandSave.bind(this));
        this._commandWindow.setHandler('gameEnd',   this.commandGameEnd.bind(this));
        this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
        this.addWindow(this._commandWindow);
        this._commandWindow.slideInToXFromLeft(Graphics.boxWidth - this._commandWindow.windowWidth(), 20);
    };

    Scene_Menu.prototype.commandPersonal = function() {
        this._statusWindow.show();
        this._statusWindow.slideInToXFromLeft(420, 10)
        this._statusWindow.setFormationMode(false);
        this._statusWindow.selectLast();
        this._statusWindow.activate();
        this._statusWindow.setHandler('ok',     this.onPersonalOk.bind(this));
        this._statusWindow.setHandler('cancel', this.onPersonalCancel.bind(this));
    };

    Scene_Menu.prototype.onPersonalOk = function() {
        this.refreshActor();
        switch (this._commandWindow.currentSymbol()) {
        case 'skill':
            SceneManager.push(Scene_Skill);
            break;
        case 'equip':
            this.showEquipWindow();
            // SceneManager.push(Scene_Equip);
            break;
        case 'status':
            SceneManager.push(Scene_Status);
            break;
        }
    };

    Scene_Menu.prototype.showEquipWindow = function() {
        this._helpWindow.show();
        this._equipWindow.show();
        this._statusWindow.activate();
    };

    Scene_Menu.prototype.refreshActor = function() {
        var currentIndex = this._statusWindow.index()
        $gameParty.setMenuActor($gameParty.members()[currentIndex]);
        var actor = this.actor();
        this._equipWindow.setActor($gameParty.menuActor());
        // this._slotWindow.setActor(actor);
        // this._itemWindow.setActor(actor);
    };

    Scene_Menu.prototype.onPersonalCancel = function() {
        this._statusWindow.hide();
        this._statusWindow.x = 460;
        this._helpWindow.hide();
        this._equipWindow.hide();
        this._statusWindow.deselect();
        this._commandWindow.activate();
    };

    Scene_Menu.prototype.refreshSVActor = function() {
        this._statusWindow.modifySVActorsVisible();
    };

    //=============================================================================
    // Window_Base
    //=============================================================================
    Window_Base.prototype.slideInToXFromLeft = function(goalX, duration) {
        Torigoya.Tween.create(this)
        .to({x: goalX - 5}, duration, Torigoya.Tween.Easing.easeOutSine)
        .to({x: goalX}, 5, Torigoya.Tween.Easing.easeInSine)
        .start();
    };

    //=============================================================================
    // Window_Equip
    //=============================================================================
    Window_EquipStatus.prototype.windowWidth = function() {
        return 400;
    };
    //=============================================================================
    // Window_MenuHelp
    //=============================================================================
    function Window_MenuHelp() {
        this.initialize.apply(this, arguments);
    }

    Window_MenuHelp.prototype = Object.create(Window_Base.prototype);
    Window_MenuHelp.prototype.constructor = Window_MenuHelp;

    Window_MenuHelp.prototype.initialize = function(numLines) {
        var width = 400;
        var height = this.fittingHeight(numLines || 2);
        Window_Base.prototype.initialize.call(this, 0, Graphics.boxHeight - height, width, height);
        this._text = '';
    };

    Window_MenuHelp.prototype.setText = function(text) {
        if (this._text !== text) {
            this._text = text;
            this.refresh();
        }
    };

    Window_MenuHelp.prototype.clear = function() {
        this.setText('');
    };

    Window_MenuHelp.prototype.setItem = function(item) {
        this.setText(item ? item.description : '');
    };

    Window_MenuHelp.prototype.refresh = function() {
        this.contents.clear();
        this.drawTextEx(this._text, this.textPadding(), 0);
    };

    //=============================================================================
    // Window_MenuStatus
    //=============================================================================
    Window_MenuStatus.prototype.standardPadding = function() {
        return 8;
    };

    Window_MenuStatus.prototype.windowWidth = function() {
        return 180;
    };

    Window_MenuStatus.prototype.windowHeight = function() {
        return Graphics.boxHeight;
    };

    Window_MenuStatus.prototype.standardFontSize = function() {
        return 18;
    };

    Window_MenuStatus.prototype.lineHeight = function() {
        return 34;
    };

    var _Window_MenuCommand_createContents = Window_MenuCommand.prototype.createContents;
    Window_MenuStatus.prototype.createContents = function() {
        _Window_MenuCommand_createContents.call(this);
        this.sVActors = new SVActors(this);
    };

    var _Window_MenuStatus_update = Window_MenuStatus.prototype.update;
    Window_MenuStatus.prototype.update = function() {
        _Window_MenuStatus_update.call(this);
        this.sVActors.update();
    };

    Window_MenuStatus.prototype.swapSVActors = function() {
        this.sVActors.swap();
    };


    Window_MenuStatus.prototype.modifySVActorsVisible = function() {
        this.sVActors.modifyVisible();
    };

    Window_MenuStatus.prototype.itemHeight = function() {
        var clientHeight = this.height - this.padding * 2 - this.lineHeight()*1;
        return Math.floor(clientHeight / this.numVisibleRows());
    };

    Window_MenuStatus.prototype.itemRect = function(index) {
        var rect = new Rectangle();
        var maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
        rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY + this.lineHeight()*1;
        return rect;
    };

    Window_MenuStatus.prototype.processOk = function() {
        Window_Selectable.prototype.processOk.call(this);
        $gameParty.setMenuActor($gameParty.members()[this.index()]);
    };

    Window_MenuStatus.prototype.drawItem = function(index) {
        this.drawItemBackground(index);
        this.drawCaption();
        this.drawItemStatus(index);
    };

    Window_MenuStatus.prototype.drawCaption = function() {
        var rect = this.itemRectForText(0);
        rect.y -= this.lineHeight();
        this.changeTextColor(this.normalColor());
        this.drawText('- Party Members -', rect.x, rect.y, rect.width, 'center');
    };

    Window_MenuStatus.prototype.drawItemStatus = function(index) {
        var actor = $gameParty.members()[index];
        var rect = this.itemRect(index);
        var x = rect.x + this.textPadding();
        var y = rect.y;
        var width = rect.width - x;
        this.drawActorSimpleStatus(actor, x, y, width);
    };

    Window_MenuStatus.prototype.drawActorLevel = function(actor, x, y) {
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.levelA, x, y, 48);
        this.resetTextColor();
        this.drawText(actor.level, x + 2, y, 36, 'right');
    };

    Window_MenuStatus.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
        var lineHeight = this.lineHeight();
        var xGauge = x + 60;
        this.drawActorName(actor, x, y);
        this.drawActorLevel(actor, x + 104, y);
        // this.drawActorIcons(actor, x, y + lineHeight * 2);
        // this.drawActorClass(actor, x2, y);
        this.drawActorHp(actor, xGauge, y + lineHeight * 0.8, width - xGauge);
        this.drawActorMp(actor, xGauge, y + lineHeight * 1.6, width - xGauge);
    };

    //=============================================================================
    // Window_MenuCommand
    //=============================================================================
    Window_MenuCommand.prototype.lineHeight = function() {
        return 48;
    };

    Window_MenuCommand.prototype.updateCursor = function() {
        if (this._cursorAll) {
            var allRowsHeight = this.maxRows() * this.itemHeight();
            this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
            this.setTopRow(0);
        } else if (this.isCursorVisible()) {
            var rect = this.itemRect(this.index());
            this.setCursorRect(rect.x + rect.width*0.05, rect.y + rect.height - this.lineHeight()*0.15, rect.width*0.9, 3);
        } else {
            this.setCursorRect(0, 0, 0, 0);
        }
    };

    Window_MenuCommand.prototype.windowWidth = function() {
        return 160;
    };

    Window_MenuCommand.prototype.itemTextAlign = function() {
    　　return 'center';
    };

    Window_MenuCommand.prototype.initialize = function(x, y) {
        Window_Command.prototype.initialize.call(this, x, y);
        // this.opacity = 0;
        this.selectLast();
    };

    Window_MenuCommand.prototype.makeCommandList = function() {
        this.addMainCommands();
        // this.addFormationCommand();
        this.addOriginalCommands();
        this.addOptionsCommand();
        this.addSaveCommand();
        // this.addGameEndCommand();
    };

    Window_MenuCommand.prototype.addMainCommands = function() {
        var enabled = this.areMainCommandsEnabled();
        if (this.needsCommand('item')) {
            this.addCommand(TextManager.item, 'item', enabled);
        }
        if (this.needsCommand('skill')) {
            this.addCommand(TextManager.skill, 'skill', enabled);
        }
        if (this.needsCommand('equip')) {
            this.addCommand(TextManager.equip, 'equip', enabled);
        }
        // if (this.needsCommand('status')) {
        //     this.addCommand(TextManager.status, 'status', enabled);
        // }
    };

    Window_MenuCommand.prototype.addOriginalCommands = function() {
        this.addCommand('システム', 'system', true);
    };


    ////=============================================================================
    //// SVActors
    ////  This is a wrapper class of the side view actor.
    ////=============================================================================
    class SVActors {
        /**
         * @param {Window_Base} parent
         */
        constructor(parent) {
            this._parent      = parent;
            this._sprites     = [];
            this.create();
        }

        get parent() {
            return this._parent;
        }

        get sprites() {
            return this._sprites;
        }

        create() {
            $gameParty.members().forEach(function(actor, i) {
                this.sprites[i] = new Sprite_Actor(actor);
                this.sprites[i].setBattler(actor);
                if (actor.isDead()) {
                    this.sprites[i].startMotion('dead');
                }else if (actor.isDying()) {
                    this.sprites[i].startMotion('dying');
                }else{
                    this.sprites[i].startMotion('walk');
                }
                this.parent.addChild(this.sprites[i]);
            }, this);
        }

        modifyVisible() {
            var topIndex = this.parent.topIndex();
            this.sprites.forEach(function(element, index) {
                if((index >= topIndex) && (index <= topIndex+this.parent.numVisibleRows()-1)){
                    element.show(); //When window contains the Actor.
                }else{
                    element.hide(); //Not contains the Actor.Actor is next(or else) page.
                }
            }, this);
        }

        update() {
            $gameParty.members().forEach(function(actor, i) {
                var rect = this.parent.itemRect(i);
                if (actor.isDead()) {
                    this.sprites[i].startMotion('dead');
                }else if (actor.isDying()) {
                    this.sprites[i].startMotion('dying');
                }else{
                    this.sprites[i].startMotion('walk');
                }
                this.sprites[i].x = rect.x + 40;
                this.sprites[i].y = rect.y + 100;
                this.sprites[i].scaleX = 0.5;
                this.sprites[i].scaleY = 0.5;
            }, this);
        }

        swap() {
            this.sprites.forEach(function(element, index) {
                this.parent.removeChild(element);
            }, this);

            this.create();
            this.modifyVisible();
        }
    };


})();
