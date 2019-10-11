//=============================================================================
// Ritz_CustomizeSaveLayout.js
// ----------------------------------------------------------------------------
// Copyright (c) 2019 Ritz
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 0.0.1 2016/03/19 Initial Commit
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/atelier_ritz/
// [GitHub] : https://github.com/atelier-ritz/
//=============================================================================
/*:
 * @plugindesc Change the layout of save scene.
 * @author Ritz
 *
 * @param SaveFileNumber
 * @desc セーブファイル数
 * @default 20
 *
 * @param SaveFileSlotNumber
 * @desc Number of save file slots
 * @default 4
 *
 *
 * @help 最大存檔數量透過參數指定來變更。
 *
 * This plugin has no command.
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function() {
    'use strict';
    var pluginName = 'Ritz_CustomizeSaveLayout';

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var paramSaveFileNumber = getParamNumber('SaveFileNumber', 0);
    var paramSaveFileSlotNumber = getParamNumber('SaveFileSlotNumber',0])

    //=============================================================================
    // Window_SavefileList
    //=============================================================================
    Window_SavefileList.prototype.maxVisibleItems = function() {
        return paramSaveFileSlotNumber;
    };


})();
