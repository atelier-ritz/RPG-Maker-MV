//=============================================================================
// StateListIcon.js
// ----------------------------------------------------------------------------
// (C)2019 Atelier_Ritz
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2019/03/16 バフデバフのアイコンをウィンドウ下に並べる機能を追加。
// 1.0.2 2019/03/15 味方アイコンをステート数に応じて右にずらす仕様に変更。
// 1.0.1 2019/03/14 Zレイヤーを追加
// 1.0.0 2019/03/14 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/atelier_ritz/
// [GitHub] : https://github.com/atelier-ritz
//=============================================================================

/*:
 * @plugindesc Ver1.1.0/ステートアイコンの一部をサイドビューキャラの横に表示します。
 * @author Ritz
 *
 * @param StateIconPosX
 * @desc 味方ステートアイコンのx相対位置です。アクターグラフィックの幅の倍率で指定。(Default:0.7)
 * @default 0.7
 * @type number
 * @decimals 2
 * @max 2
 * @min -1
 *
 * @param StateIconPosY
 * @desc 味方ステートアイコンのy相対位置です。アクターグラフィックの高さの倍率で指定。(Default:0.5)
 * @default 0.5
 * @type number
 * @decimals 2
 * @max 2
 * @min -1
 *
 * @param StateIconZ
 * @desc ステートアイコンのZレイヤーです。0:影より下 1:影より上 2:武器より上 3:キャラより上 4:状態異常アニメより上　(Default:0)
 * @default 0
 * @type number
 * @max 4
 * @min 0
 *
 * @param ShowBuffInStatusWindow
 * @desc 戦闘中下のウィンドウに、バフ（攻撃力アップなど）のアイコンを表示します。
 * @default true
 * @type boolean
 *
 * @param ShowDebuffInStatusWindow
 * @desc 戦闘中下のウィンドウに、デバフ（攻撃力ダウンなど）のアイコンを表示します。
 * @default true
 * @type boolean
 *
 * @help
 * 注意：このプラグインはサイドビューのみに対応しております。
 * ツクールMVデフォルトの仕様では、戦闘中すべてのステートアイコンが下のウィンドウに表示されます。
 * このプラグインは、一部のステートアイコン、バフアイコン、デバフアイコンをキャラクターの横へ移動させます。
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

 //-----------------------------------------------------------------------------
 // Sprite_StateIconChild
 //
 // The sprite for displaying state icons.

function Sprite_StateIconChild() {
    this.initialize.apply(this, arguments);
}

(function() {
    'use strict';
    var pluginName = 'StateListIcon';

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamFloat = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseFloat(value) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON' || (value || '').toUpperCase() === 'TRUE';
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamArrayString = function (paramNames) {
        var values = getParamString(paramNames).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getParamArrayNumber = function (paramNames, min, max) {
        var values = getParamArrayString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) {
            if (!isNaN(parseInt(values[i], 10))) {
                values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
            } else {
                values.splice(i--, 1);
            }
        }
        return values;
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramStateIconPosX        = getParamFloat(['StateIconPosX']);
    var paramStateIconPosY        = getParamFloat(['StateIconPosY']);
    var paramStateIconZ           = getParamNumber(['StateIconZ'],0,4);
    var paramIconIDForWin         = getParamArrayNumber(['IconIDForStatusWindow']);
    var paramShowBuff             = getParamBoolean(['ShowBuffInStatusWindow']);
    var paramShowDebuff           = getParamBoolean(['ShowDebuffInStatusWindow']);

    // var paramWinIDs = [];
    //
    // var isIconShownInWindow = function(iconID) {
    //     if (paramShowBuff && 32 <= iconID && iconID < 48) return true;
    //     if (paramShowDebuff && 48 <= iconID && iconID < 60) return true;
    //     // paramIconIDForWin.some(function(id){
    //     //   return id === iconID;
    //     // })
    //     // // if ()
    //     // return false;
    // };

    //=============================================================================
    // Sprite_Actor
    //  味方SVの右にステートアイコンを表示します。
    //=============================================================================
      var _Sprite_Actor_initMembers      = Sprite_Actor.prototype.initMembers;
      Sprite_Actor.prototype.initMembers = function() {
          _Sprite_Actor_initMembers.apply(this, arguments);
          this.createStateIconSprite();
      };

      Sprite_Actor.prototype.createStateIconSprite = function() {
          this._stateIconSprite = new Sprite_StateIcon();
          this.addChildAt(this._stateIconSprite,paramStateIconZ);
      };

      var _Sprite_Actor_setBattler      = Sprite_Actor.prototype.setBattler;
      Sprite_Actor.prototype.setBattler = function(battler) {
        _Sprite_Actor_setBattler.apply(this, arguments);
        this._stateIconSprite.setup(battler);
      };

      Sprite_Actor.prototype.update = function() {
          Sprite_Battler.prototype.update.call(this);
          this.updateShadow();
          if (this._actor) {
              this.updateMotion();
              this.updateStateSprite();
          }
      };

      Sprite_Actor.prototype.updateStateSprite = function() {
          var cw = this._mainSprite.bitmap.width/9;
          var ch = this._mainSprite.bitmap.height/6;
          var numStates = this._stateIconSprite._icons.length;
          this._stateIconSprite.x = Math.round(cw * paramStateIconPosX + 16 * numStates);
          this._stateIconSprite.y = -Math.round(ch * paramStateIconPosY);
      };

    //=============================================================================
    // Window_BattleStatus
    //  The window for displaying the status of party members on the battle screen.
    //=============================================================================
    Window_BattleStatus.prototype.drawActorIcons = function(actor, x, y, width) {
        width = width || 144;
        var icons = actor.allIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
        icons = icons.filter(function(element){
          if(paramShowBuff){
            if(paramShowDebuff){
              return 32 <= element && element < 64
            }else{
              return 32 <= element && element < 48
            }
          }else{
            if(paramShowDebuff){
              return 48 <= element && element < 64
            }else{
              return false
            }
          }
        });
        for (var i = 0; i < icons.length; i++) {
            this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
        }
    };

    //=============================================================================
    // Sprite_StateIcon
    //  ステートアイコンを一列にして表示します。
    //=============================================================================
    var _Sprite_StateIcon_initMembers      = Sprite_StateIcon.prototype.initMembers;
    Sprite_StateIcon.prototype.initMembers = function() {
        _Sprite_StateIcon_initMembers.apply(this, arguments);
        this._icons        = [];
        this._iconsSprites = [];
    };

    var _Sprite_StateIcon_update      = Sprite_StateIcon.prototype.update;
    Sprite_StateIcon.prototype.update = function() {
        // if (this._battler && !this._battler.isEnemy()) {
        //     _Sprite_StateIcon_update.apply(this, arguments);
        //     return;
        // }
        Sprite.prototype.update.call(this);
        this.updateRingIcon();
    };

    Sprite_StateIcon.prototype.updateRingIcon = function() {
        var icons = [];
        if (this._battler && this._battler.isAlive()) {
            icons = this._battler.allIcons();
        }
        if (this._battler && !this._battler.isEnemy()) {
            icons = icons.filter(function(element){
              if(paramShowBuff){
                if(paramShowDebuff){
                  return element < 32 || 64 <= element
                }else{
                  return element < 32 || 48 <= element
                }
              }else{
                if(paramShowDebuff){
                  return element < 48 || 64 <= element
                }else{
                  return true
                }
              }
            });
        }
        if (!this._icons.equals(icons)) {
            this._icons = icons;
            this.setupRingIcon();
        }
        this.updateNormalPosition();
        this._sortChildren();
    };

    Sprite_StateIcon.prototype.updateNormalPosition = function() {
        this._iconsSprites.forEach(function(sprite, index) {
            sprite.setNormalPosition(index, this._iconsSprites.length);
        }, this);
    };

    Sprite_StateIcon.prototype.setupRingIcon = function() {
        this._icons.forEach(function(icon, index) {
            if (!this._iconsSprites[index]) this.makeNewIcon(index);
            this._iconsSprites[index].setIconIndex(icon);
        }, this);
        var spriteLength = this._iconsSprites.length;
        for (var i = this._icons.length; i < spriteLength; i++) {
            this.popIcon();
        }
    };

    Sprite_StateIcon.prototype.makeNewIcon = function(index) {
        var iconSprite            = new Sprite_StateIconChild();
        this._iconsSprites[index] = iconSprite;
        this.addChild(iconSprite);
    };

    Sprite_StateIcon.prototype.popIcon = function() {
        var removedSprite = this._iconsSprites.pop();
        this.removeChild(removedSprite);
    };

    Sprite_StateIcon.prototype._sortChildren = function() {
        this.children.sort(this._compareChildOrder.bind(this));
    };

    Sprite_StateIcon.prototype._compareChildOrder = function(a, b) {
        if (a.z !== b.z) {
            return a.z - b.z;
        } else if (a.y !== b.y) {
            return a.y - b.y;
        } else {
            return a.spriteId - b.spriteId;
        }
    };

    //=============================================================================
    // Sprite_StateIconChild
    //=============================================================================
    Sprite_StateIconChild.prototype             = Object.create(Sprite_StateIcon.prototype);
    Sprite_StateIconChild.prototype.constructor = Sprite_StateIconChild;

    Sprite_StateIconChild.prototype.initialize = function() {
        Sprite_StateIcon.prototype.initialize.call(this);
        this.visible     = false;
    };

    Sprite_StateIconChild.prototype.update = function() {};

    Sprite_StateIconChild.prototype.setIconIndex = function(index) {
        this._iconIndex = index;
        this.updateFrame();
    };

    Sprite_StateIconChild.prototype.setNormalPosition = function(index, max) {
        this.x       = ((-max + 1) / 2 + index) * Sprite_StateIcon._iconWidth;
        this.y       = 0;
        this.visible = true;
    };

})();
