//=============================================================================
// LayoutChanges.js
// ----------------------------------------------------------------------------
// (C)2019 Atelier_Ritz
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2019/03/20 メニューステータスのレイアウトを変更する機能を加えました。
//                  メッセージウィンドウのレイアウトを変更する機能を加えました。
// 1.0.0 2019/03/14 初版 サイドビューバトラーの位置を変更します
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/atelier_ritz/
// [GitHub] : https://github.com/atelier-ritz
//=============================================================================


/*:
 * @plugindesc v1.1.0/ゲームの各要素のレイアウトを変更するプラグインです。
 * @author Ritz
 *
 * @param　サイドビュー時バトラーの位置関連
 *
 * @param SVBattlerPosX
 * @desc 戦闘中先頭バトラーのx座標です。(Default:400)
 * @default 400
 * @type number
 * @parent サイドビュー時バトラーの位置関連
 *
 * @param SVBattlerPosY
 * @desc 戦闘中先頭バトラーのy座標です。(Default:280)
 * @default 280
 * @type number
 * @parent サイドビュー時バトラーの位置関連
 *
 * @param　メッセージウィンドウ関連
 *
 * @param MessageWindowWidthRatio
 * @desc メッセージウィンドウの幅です。0.5で全画面の半分になります。(Default:1)
 * @default 1
 * @type float
 * @decimal 2
 * @min 0
 * @max 1
 * @parent メッセージウィンドウ関連
 *
 * @param　パーティステータス関連
 *
 * @param NumVisibleMembers
 * @desc 一画面に表示するパーティメンバーの数です。(Default:4)
 * @default 4
 * @type number
 * @min 1
 * @max 5
 * @parent パーティステータス関連
 *
 * @param XOffsetFaces
 * @desc 顔グラフィックを横にずらすピクセル数です。(Default:0)
 * @default 0
 * @type number
 * @min 0
 * @parent パーティステータス関連
 *
 * @param YOffsetFaces
 * @desc 顔グラフィックを縦にずらすピクセル数です。(Default:0)
 * @default 0
 * @type number
 * @min 0
 * @parent パーティステータス関連
 *
 * @param XOffsetActorInfo
 * @desc アクターの名前やHPを横にずらすピクセル数です。(Default:0)
 * @default 0
 * @type number
 * @min 0
 * @parent パーティステータス関連
 *
 * @help
 * このプラグインにはプラグインコマンドはありません。
 * プラグイン内で直接数値を書き直してください。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */


(function() {
  'use strict';
  var pluginName = 'LayoutChanges';

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
  var paramSVBattlerPosX            = getParamNumber(['SVBattlerPosX']);
  var paramSVBattlerPosY            = getParamNumber(['SVBattlerPosY']);
  var paramMessageWindowWidthRatio  = getParamFloat(['MessageWindowWidthRatio']);
  var paramNumVisibleMembers        = getParamNumber(['NumVisibleMembers']);
  var paramXOffsetFaces             = getParamNumber(['XOffsetFaces']);
  var paramYOffsetFaces             = getParamNumber(['YOffsetFaces']);
  var paramXOffsetActorInfo         = getParamNumber(['XOffsetActorInfo']);

  //=============================================================================
  // Sprite_Actor [Override]
  //=============================================================================
  Sprite_Actor.prototype.setActorHome = function(index) {
      this.setHome(paramSVBattlerPosX + index * 32, paramSVBattlerPosY + index * 48);
  };

  //=============================================================================
  // Window_Message Window_ChoiceList [Override]
  //=============================================================================
  Window_Message.prototype.windowWidth = function() {
      return Graphics.boxWidth * paramMessageWindowWidthRatio;
  };

  Window_ChoiceList.prototype.updatePlacement = function() {
      var positionType = $gameMessage.choicePositionType();
      var messageY = this._messageWindow.y;
      this.width = this.windowWidth();
      this.height = this.windowHeight();
      switch (positionType) {
      case 0:
          this.x = this._messageWindow.x;
          break;
      case 1:
          this.x = (Graphics.boxWidth - this.width) / 2;
          break;
      case 2:
          this.x = Graphics.boxWidth - this.width - this._messageWindow.x;
          break;
      }
      if (messageY >= Graphics.boxHeight / 2) {
          this.y = messageY - this.height;
      } else {
          this.y = messageY + this._messageWindow.height;
      }
  };

  //=============================================================================
  // Window_MenuStatus [Override]
  //=============================================================================
  Window_MenuStatus.prototype.numVisibleRows = function() {
      return paramNumVisibleMembers;
  };

  Window_MenuStatus.prototype.drawItemImage = function(index) {
      var actor = $gameParty.members()[index];
      var rect = this.itemRect(index);
      this.changePaintOpacity(actor.isBattleMember());
      this.drawActorFace(actor, rect.x + 1 + paramXOffsetFaces, rect.y + 1 + paramYOffsetFaces, Window_Base._faceWidth, Window_Base._faceHeight);
      this.changePaintOpacity(true);
  };

  Window_MenuStatus.prototype.drawItemStatus = function(index) {
      var actor = $gameParty.members()[index];
      var rect = this.itemRect(index);
      var x = rect.x + paramXOffsetFaces + 162 + paramXOffsetActorInfo;
      var y = rect.y + rect.height / 2 - this.lineHeight() * 1.5;
      var width = rect.width - x - this.textPadding();
      this.drawActorSimpleStatus(actor, x, y, width);
  };

})();
