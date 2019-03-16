//=============================================================================
// SetSVCharacterHomePosition.js
//=============================================================================


/*:
 * @plugindesc Set the home position of side view battlers.
 * @author Ritz
 *
 * @help
 * このプラグインにはプラグインコマンドはありません。
 * プラグイン内で直接数値を書き直してください。
 *
 */
(function() {
  'use strict';

  Sprite_Actor.prototype.setActorHome = function(index) {
      this.setHome(400 + index * 32, 280 + index * 48);
  };

})();
