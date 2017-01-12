//=============================================================================
// RTZ_ItemScene.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Atelier Ritz
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/01/08 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/atelier_ritz
//=============================================================================

/*:
 * @plugindesc Ver 1.0.0 Customizable Item Scene plugin
 * @author Atelier Ritz
 *
 * @param CategoryFontSize
 * @desc Set the font size of category window
 * @default 20
 *
 * @param CategoryFontFace
 * @desc Set the font of category window.
 * @default HelpFont
 *
 * @param ItemListFontSize
 * @desc Set the font size of item list window
 * @default 20
 *
 * @param ItemListSpacing
 * @desc Set the spacing between two columns
 * @default 12
 *
 * @param ItemListFontFace
 * @desc Set the font of item list window.
 * @default HelpFont
 *
 * @param ItemSceneBackgroundImage
 * @desc Set the background image of the item scene
 * @default gui_bgItem
 *
 * @param HideCategories
 * @desc カテゴリを表示した際に、隠すカテゴリです。
 * @default すべて,アイテム,武器,防具,大事なもの
 *
 * @param EffectsNames
 * @desc 使用効果の各効果の名称です。
 * @default HP回復,HPダメージ,MP回復,MPダメージ,TP増加,ステート付与,ステート解除,強化付与,弱体付与,強化解除,弱体解除,特殊効果,成長,スキル習得,コモン
 *
 * @param Param Color
 * @desc 詳細ウィンドウに表示する特徴の色設定です。
 * 順番に基本色、システム色、上昇色、下降色です。
 * @default 6,4,24,2
 *
 * @param Param Text1
 * @desc 詳細ウィンドウに表示する特徴の表示名です。
 * 1は有効度と無効化です。
 * @default  有効度,弱体有効度,無効化
 *
 * @param Param Text2
 * @desc 詳細ウィンドウに表示する特徴の表示名です。
 * 2は追加能力値です。
 * @default 命中率,回避率,会心率,会心回避,魔法回避,魔法反射率,反撃率,再生率,再生率,再生率
 *
 * @param Param Text3
 * @desc 詳細ウィンドウに表示する特徴の表示名です。
 * 3は特殊能力値です。
 * @default 狙われ率,防御効果率,回復効果率,薬の知識,消費率,チャージ率,物理ダメージ率,魔法ダメージ率,床ダメージ率,経験値獲得率
 *
 * @param Param Text4
 * @desc 詳細ウィンドウに表示する特徴の表示名です。
 * 4は攻撃タブです。
 * @default 攻撃属性付与:,攻撃時ステート付与:,攻撃速度,攻撃回数
 *
 * @param Param Text5
 * @desc 詳細ウィンドウに表示する特徴の表示名です。
 * 5はスキルタブです。
 * @default スキルタイプ追加:,スキルタイプ封印:,スキル追加:,スキル封印:
 *
 * @param Param Text6
 * @desc 詳細ウィンドウに表示する特徴の表示名です。
 * 6は装備タブです。
 * @default 武器タイプ追加:,防具タイプ追加:,装備固定:,装備封印:,二刀流
 *
 * @param Param Text7
 * @desc 詳細ウィンドウに表示する特徴の表示名です。
 * 7はその他タブです。
 * @default 行動回数追加,自動戦闘,防御,身代わり,TP持越し,消滅エフェクト,エンカウント半減,エンカウント無効,不意打ち無効,先制率アップ,取得金額倍化,アイテム取得率倍化
 * 
 * @param AllIncludesCategory
 * @desc すべてのアイテムに付与されるカテゴリの名称です。
 * カテゴリで指定を行うときに使用します。
 * @default すべて
 * @help やなさんのセカンドカテゴリを使った、カテゴリ、レアリティなどを入れたアイテムシーンです。
 * 
 * 以下、注意点です。
 *
 * 1. GUIを自作する必要があります。
 *
 * 2. やなさんのセカンドカテゴリプラグイン必須です。
 *
 * 3. レアリティに画像を使う場合、プリロードしないと一枚目がロードされません。
 *
 * 4. アニメーションを追加したいです。\
 *
 * 5. トリアコンタンさんのフォントプラグインでロードしてください。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 *
 * ------------------------------------------------------
 * 利用規約
 * ------------------------------------------------------
 * 当プラグインはMITライセンスで公開されています。
 * 使用に制限はありません。商用、アダルト、いずれにも使用できます。
 * 二次配布も制限はしませんが、サポートは行いません。
 * 著作表示は任意です。行わなくても利用できます。
 * 要するに、特に規約はありません。
 * バグ報告や使用方法等のお問合せはTwitterにお願いします。
 * 素材利用は自己責任でお願いします。
 * ------------------------------------------------------
 */
(function() {
    'use strict';
    const pluginName = 'RTZ_ItemScene';
    //=============================================================================
    // Import Parameters
    //=============================================================================
    var parameters = PluginManager.parameters(pluginName);
    var categoryFontSize = Number(parameters['CategoryFontSize']) || 20;
    var categoryFontFace = String(parameters['CategoryFontFace']) || 'GameFont'; 
    var itemListFontSize = Number(parameters['ItemListFontSize']) || 20;
    var itemListSpacing = Number(parameters['ItemListSpacing']) || 12;
    var itemListFontFace = String(parameters['ItemListFontFace']) || 'GameFont';   
    var itemSceneBackgroundImage = String(parameters['ItemSceneBackgroundImage']);
    var hideCategories = parameters['HideCategories'].split(',');
    var effectNames = String(parameters['EffectsNames']).split(',');
    var paramColor = parameters['Param Color'].split(',');
    var paramVocab = [];
    var allIncludesCategory = parameters['AllIncludesCategory'];
    for (var i=1;i<=7;i++) {
        var key = 'Param Text' + i;
        paramVocab[i-1] = parameters[key].split(',');
    }
    //=============================================================================
    // p
    //  ログ出力をより短い関数名で実現します。(RGSS互換)
    //=============================================================================
    var p = function(value) {
        console.log.apply(console, arguments);
        SceneManager.getNwJs().showDevTools();
    };
    //=============================================================================
    // Modified Second Categories.js by yana
    //  When obtaining item category, always refer to the base item.
    //=============================================================================
    DataManager.itemSecondaryCategories = function(item) {
        if (!item) return [];
        if (this.isItemEx(item)) item = item.baseItemId ? $dataItems[item.baseItemId] : item;
        if (this.isWeaponEx(item)) item = item.baseItemId ? $dataWeapons[item.baseItemId] : item;
        if (this.isArmorEx(item)) item = item.baseItemId ? $dataArmors[item.baseItemId] : item;
          if (item._secondaryCategories) return item._secondaryCategories;
        item._secondaryCategories = [allIncludesCategory];
        var texts = item.note.split('\n');
        for (var i =0,max=texts.length;i<max;i++) {
            var text = texts[i];
            if (text.match(/<(?:分類|Category):(.+)>/)) {
                var cn = RegExp.$1;
                item._secondaryCategories.push(cn);
            }
        }
        if (this.isItemEx(item) && item.itypeId === 1){
            item._secondaryCategories.push(TextManager.item);
        } else if (this.isWeaponEx(item)) {
            var wtype = $dataSystem.weaponTypes[item.wtypeId];
            if (wtype) item._secondaryCategories.push(wtype);
            var etype = $dataSystem.equipTypes[item.etypeId];
            item._secondaryCategories.push(etype);
            var weapon = TextManager.weapon;
            if (item._secondaryCategories.indexOf(weapon) < 0) item._secondaryCategories.push(weapon);
        } else if (this.isArmorEx(item)) {
            var atype = $dataSystem.armorTypes[item.atypeId];
            item._secondaryCategories.push(atype);
            var etype = $dataSystem.equipTypes[item.etypeId];
            item._secondaryCategories.push(etype);
            var armor = TextManager.armor;
            if (item._secondaryCategories.indexOf(armor) < 0) item._secondaryCategories.push(armor);
        } else if (this.isItemEx(item) && item.itypeId === 2) {
            item._secondaryCategories.push(TextManager.keyItem);
        }
        return item._secondaryCategories;
    };
    
    DataManager.isItemEx = function(item) {
        if (!item._type) this.initItemType(item);
        return item._itemType === 0;
    };
    
    DataManager.isWeaponEx = function(item) {
        if (!item._type) this.initItemType(item);
        return item._itemType === 1;
    };
    
    DataManager.isArmorEx = function(item) {
        if (!item._type) this.initItemType(item);
        return item._itemType === 2;
    };
    
    DataManager.isSkillEx = function(item) {
        if (!item._type) this.initItemType(item);
        return item._itemType === 3;
    };
    
    DataManager.initItemType = function(item) {
        item._itemType = -1;
        if (DataManager.isItem(item))   item._itemType = 0;
        if (DataManager.isWeapon(item)) item._itemType = 1;
        if (DataManager.isArmor(item))  item._itemType = 2;
        if (DataManager.isSkill(item))  item._itemType = 3;
    };

	//=============================================================================
    // Window_ItemCategory
    // カテゴリウィンドウの設定です
    //=============================================================================
	Window_ItemCategory.prototype.standardFontSize = function() {
	    return categoryFontSize;
	};

	Window_ItemCategory.prototype.windowWidth = function() {
	    return 526;
	};

	Window_ItemCategory.prototype.standardPadding = function() {
	    return 0;
	};
	
    Window_ItemCategory.prototype.standardFontFace = function() {
       	return categoryFontFace;
    };

    Window_ItemCategory.prototype.scrollUp = function() {
        if (this.isOpenAndActive() && (this._list.length < 5 || this.index() > 0)) {
            this.backSubCategory();
            this._stayCount = -5;
        }
	};

	Window_ItemCategory.prototype.scrollDown = function() {
        if (this.isOpenAndActive() && (this._list.length < 5 || this.index() > 0)) {
            this.forwardSubCategory();
            this._stayCount = -5;
        }
	};

    var __WICategory_initialize = Window_ItemCategory.prototype.initialize;
    Window_ItemCategory.prototype.initialize = function () {
        this._subIndex = [0, 0, 0, 0, 0];
        __WICategory_initialize.call(this);
    };

    Window_ItemCategory.prototype.cursorUp =function(wrap) {
        if (this.isOpenAndActive() && (this._list.length < 5 || this.index() > 0)) {
                this.backSubCategory();
                this._stayCount = -5;
        }
    };

    Window_ItemCategory.prototype.cursorDown = function(wrap) {
        if (this.isOpenAndActive() && (this._list.length < 5 || this.index() > 0)) {
            this.forwardSubCategory();
            this._stayCount = -5;
        }
    };

    Window_ItemCategory.prototype.drawItem = function (index) {
        if (this._subIndex[index] === 0) {
            Window_HorzCommand.prototype.drawItem.call(this, index);
        } else {
            var rect = this.itemRectForText(index);
            var align = this.itemTextAlign();
            this.resetTextColor();
            this.changePaintOpacity(this.isCommandEnabled(index));
            this.drawText(this.subCommandName(index), rect.x, rect.y, rect.width, align);
        }
    };

    Window_ItemCategory.prototype.subCommandName = function (index) {
        if (!this._categories) this.initCategories();
        return this._categories[index][this._subIndex[index]];
    };

    Window_ItemCategory.prototype.initCategories = function () {
        this._categories = [[], [], [], [], []];
        var n = 0;
        if (Imported['LimitPossession'] && $gameParty.reserveItems().length > 0) n = 1;
        this.allItems().forEach(function (item) {
            var sc = DataManager.itemSecondaryCategories(item);
            var id = -1;
            if (DataManager.isItemEx(item))     id = n;
            if (DataManager.isWeaponEx(item))   id = n+1;
            if (DataManager.isArmorEx(item))    id = n+2;
            if (id === n && item.itypeId === 2) id = n+3;
            for (var i = 0, max = sc.length; i < max; i++) {
                if (sc[i] === allIncludesCategory) continue;
                if (sc[i] === TextManager.item) continue;
                if (sc[i] === TextManager.keyItem) continue;
                if (sc[i] === TextManager.weapon) continue;
                if (sc[i] === TextManager.armor) continue;
                if (!this._categories[id].contains(sc[i])) {
                    this._categories[id].push(sc[i]);
                }
            }
        }.bind(this));
        this._categories[n].sort();
        this._categories[n+1].sort();
        this._categories[n+2].sort();
        this._categories[n+3].sort();
        this._categories[n].unshift('');
        this._categories[n+1].unshift('');
        this._categories[n+2].unshift('');
        this._categories[n+3].unshift('');
        this._subIndex = [0, 0, 0, 0, 0];
    };

    Window_ItemCategory.prototype.allItems = function() {
        return $gameParty.allItems();
    };

    Window_ItemCategory.prototype.categorySize = function (index) {
        if (!this._categories) this.initCategories();
        return this._categories[index].length;
    };

    Window_ItemCategory.prototype.currentSubCategory = function () {
        if (!this._categories) this.initCategories();
        var index = this.index();
        return this._categories[index][this._subIndex[index]];
    };

    Window_ItemCategory.prototype.forwardSubCategory = function () {
        var max = this.categorySize(this.index());
        if (max === 1) return;
        this._subIndex[this.index()] = (this._subIndex[this.index()] + 1) % max;
        this._itemWindow.setSubCategory(this.currentSubCategory());
        SoundManager.playCursor();
        this.refresh();
    };

    Window_ItemCategory.prototype.backSubCategory = function () {
        var max = this.categorySize(this.index());
        if (max === 1) return;
        this._subIndex[this.index()] = (this._subIndex[this.index()] + (max - 1)) % max;
        this._itemWindow.setSubCategory(this.currentSubCategory());
        SoundManager.playCursor();
        this.refresh();
    };

    Window_ItemCategory.prototype.select = function(index) {
        Window_HorzCommand.prototype.select.call(this, index);
        if (this._itemWindow) this._itemWindow.setSubCategory(this.currentSubCategory());
    };

    //=============================================================================
    // Window_ItemList
    // アイテムリストのウィンドウです。
    //=============================================================================
	Window_ItemList.prototype.standardFontSize = function() {
	    return 20;
	};

	Window_ItemList.prototype.spacing = function() {
    	return itemListSpacing;
	};

	Window_ItemList.prototype.standardFontFace = function() {
        return itemListFontFace;
    };

    Window_ItemList.prototype.setHelpWindowItem = function(item) {
        Window_Selectable.prototype.setHelpWindowItem.call(this,item);
        if (this._traitsWindow) {
            this._traitsWindow.setItem(item);
        }
    };

    var __WIList_includes = Window_ItemList.prototype.includes;
    Window_ItemList.prototype.includes = function (item) {
        var result = __WIList_includes.call(this, item);
        if (result && this._subCategory) {
            var sc = DataManager.itemSecondaryCategories(item);
            result = result && sc.contains(this._subCategory);
        }
        return result;
    };

    Window_ItemList.prototype.setSubCategory = function (category) {
        if (this._subCategory !== category) {
            this._subCategory = category;
            this.refresh();
            this.resetScroll();
        }
    };

    // //=====Show Icons instead of lists
    //  // var _Window_ItemList_maxCols = Window_ItemList.prototype.maxCols;
    // Window_ItemList.prototype.maxCols = function() {
    //     // if (SceneManager._scene instanceof Scene_Item) {
    //     //     return Math.floor((this.width - this.standardPadding()) / (this.itemWidth() + this.spacing()));
    //     // }
    //     // return _Window_ItemList_maxCols.call(this);
    //     //return 8;
    //     return 10;
    // };

    // Window_ItemList.prototype.maxPageRows = function() {
    //     // return Math.floor((this.height - this.standardPadding()) / (this.itemHeight() + this.spacing()));
    //     return 5;
    // };

    // Window_ItemList.prototype.itemHeight = function() {
    //     return 45;
    // };

    // Window_ItemList.prototype.itemWidth = function() {
    //     return 45;
    // };

    // Window_ItemList.prototype.spacing = function() { 
    //     return 6; 
    // };

    // Window_ItemList.prototype.itemRect = function(index) {
    //     var rect = new Rectangle();
    //     rect.width = this.itemWidth();
    //     rect.height = this.itemHeight();
    //     rect.x = index % this.maxCols() * (this.itemWidth() + this.spacing()) + this.spacing();
    //     rect.y = Math.floor(index / this.maxCols()) * (this.itemHeight() + this.spacing()) + this.spacing() - this._scrollY;
    //     return rect;
    // };

    // Window_ItemList.prototype.drawItem = function(index) {
    //     var item = this._data[index];
    //     if(item) {
    //         var rect = this.itemRect(index);
    //         rect.width -= 4;
    //         rect.x += 2;
    //         this.drawIcon(item.iconIndex, rect.x + 5, rect.y + 6);
    //         this.drawItemNumber(item, rect.x + 16, rect.y + 18, 24);
    //         // this.makeFontSmaller();
    //         // var number = $gameParty.numItems(item);
    //         // if(Number(number) > 1) {
    //         //     this.drawText("x" + number, rect.x + 22, rect.y + 18, 24);
    //         // }
    //         // this.makeFontBigger();
    //     }
    // };

    //=============================================================================
    // Window_ItemDescription
    // ヘルプウィンドウを継承した、アイテムの説明文ウィンドウです
    //=============================================================================
    function Window_ItemDescription() {
	    this.initialize.apply(this, arguments);
	}

	Window_ItemDescription.prototype = Object.create(Window_Help.prototype);
	Window_ItemDescription.prototype.constructor = Window_ItemDescription;

	Window_ItemDescription.prototype.initialize = function(x, y, width, height) {
	    Window_Help.prototype.initialize.call(this, x, y, width, height);
	};

   	Window_ItemDescription.prototype.standardFontSize = function() {
	    return 20;
	};

    Window_ItemDescription.prototype.refresh = function() {
        this.contents.clear();
        if (this._text) {
            var text = this._text.replace(/\\n/gi, '\n');
            // var l = text.split('\n').length; // obtain number of lines
            this.drawTextEx(text, this.textPadding(), 0);
        }
    };

    Window_ItemDescription.prototype.standardFontFace = function() {
       	return 'HelpFont';
    };

    Window_ItemDescription.prototype.lineHeight = function() {
        return 50;
    };
    //===以下自動換行=====
  	Window_ItemDescription.prototype.textAreaWidth = function() {
        return this.contentsWidth();
    };

    Window_ItemDescription.prototype.needWrap = function(textState) {
        var c = textState.text[textState.index],
            w = this.textWidth(c),
            nextSpaceIndex = 0,
            nextBreakIndex = 0,
            nextWord = "",
            nextWidth = 0,
            text = textState.text,
            breakWord = !!this._breakWord;

        if (breakWord && (textState.x + w * 2) >= this.textAreaWidth()) {
            textState.index--; // hack for missing character
            return true;
        }

        if (!breakWord && c === " ") {
            nextSpaceIndex = text.indexOf(" ", textState.index + 1);
            nextBreakIndex = text.indexOf("\n", textState.index + 1);

            if (nextSpaceIndex < 0) {
                nextSpaceIndex = text.length + 1;
            }

            if (nextBreakIndex > 0) {
                nextSpaceIndex = Math.min(nextSpaceIndex, nextBreakIndex);
            }

            nextWord = text.substring(textState.index, nextSpaceIndex);

            nextWidth = this.textWidth(nextWord);

            if (textState.x + nextWidth >= this.textAreaWidth()) {
                return true;
            }
        }

        return false;
    };

    Window_ItemDescription.prototype.convertEscapeCharacters = function(text) {
        text = Window_Base.prototype.convertEscapeCharacters.call(this, text);
        text = this.convertWordWrapEscapeCharacters(text);
        return text;
    };

    Window_ItemDescription.prototype.convertWordWrapEscapeCharacters = function(text) {
        text = this.enableWordWrap(text);
            text = text.replace(/[\n\r]+/g, '');
            text = text.replace(/<br>/gi, '\n');
        return text;
    };

    Window_ItemDescription.prototype.enableWordWrap = function(text) {
        this._yamiWordWrap = true;
        this._breakWord = true;
        text = text.replace(/<wrap>/gi, '');
        text = text.replace(/<breakword>/gi, '');

        return text;
    };

    Window_ItemDescription.prototype.processNormalCharacter = function(textState) {
        if (this.needWrap(textState)) {
            return this.processNewLine(textState);
        }
        Window_Base.prototype.processNormalCharacter.call(this, textState);
    };
  	//=============================================================================
    // Window_ItemTraits
    // アイテムの性能や特徴を描画するウィンドウです
    //=============================================================================
    function Window_ItemTraits() {
	    this.initialize.apply(this, arguments);
	}

	Window_ItemTraits.prototype = Object.create(Window_Base.prototype);
	Window_ItemTraits.prototype.constructor = Window_ItemTraits;

	Window_ItemTraits.prototype.initialize = function(x, y, width, height) {
	    Window_Base.prototype.initialize.call(this, 639, 179, 420, 180);
	    this._item = {};
        this._isDrawing = ' ';
	};

	Window_ItemTraits.prototype.standardFontSize = function(x, y, width, height) {
	    return 20;
	};

	Window_ItemTraits.prototype.standardPadding = function(x, y, width, height) {
	    return 6;
	};

	Window_ItemTraits.prototype.setItem = function(item) {
        if (item && this._item !== item) {
            this._item = item;	
        	this.makeContents();   //traits -> this._data
            this.makeCatagory();    //sub category -> this._category
            this.refresh();
        }
    };

    Window_ItemTraits.prototype.makeContents = function() {
        var item = this._item;
        var color = paramColor;
        var text = '';
        var c = '\\C['+color[0]+']';
        var s = '\\C['+color[1]+']';
        var g = '\\C['+color[2]+']';
        var r = '\\C['+color[3]+']';
        this._data = [];
        if(item.effects){
            for (var i=0,max=item.effects.length;i<max;i++) {
                var e = item.effects[i];
                text = '';
                switch(e.code) {
                    case 11:
                        if (e.value1 > 0 && effectNames[0]) text = s + effectNames[0] + ' ' + g + Math.floor(e.value1 * 100) + '%';
                        if (e.value1 < 0 && effectNames[1]) text = s + effectNames[1] + ' ' + r + Math.floor(Math.abs(e.value1 * 100)) + '%';
                        if (e.value2 > 0 && effectNames[0]) {
                            if (text) text += ' + ' + g + e.value2;
                            if (!text) text = s + effectNames[0] + ' ' + g + e.value2;
                        }
                        if (e.value2 < 0 && effectNames[1]) {
                            if (text) text += ' + ' + r + Math.abs(e.value2);
                            if (!text) text = s + effectNames[1] + ' ' + r + Math.abs(e.value2);
                        }
                        break;
                    case 12:
                        if (e.value1 > 0 && effectNames[2]) text = s + effectNames[2] + ' ' + g + Math.floor(e.value1 * 100) + '%';
                        if (e.value1 < 0 && effectNames[3]) text = s + effectNames[3] + ' ' + r + Math.floor(Math.abs(e.value1 * 100)) + '%';
                        if (e.value2 > 0 && effectNames[2]) {
                            if (text) text += ' + ' + g + e.value2;
                            if (!text) text = s + effectNames[2] + ' ' + g + e.value2; 
                        } 
                        if (e.value2 < 0 && effectNames[3]) {
                            if (text) text += ' + ' + r + Math.abs(e.value2);
                            if (!text) text = s + effectNames[3] + ' ' + r + Math.abs(e.value2); 
                        }
                        break;
                    case 13:
                        if (e.value1 > 0 && effectNames[4]) text = s + effectNames[4] + g +  ' ' + e.value1;
                        break;
                    case 21:
                        var state = $dataStates[e.dataId];
                        if (state) {
                            var name = state.name;
                            if (e.value1 > 0 && effectNames[5]) text = s + effectNames[5] + ' ' + c + name + ' ' + Math.floor(Math.abs(e.value1 * 100)) + '%';
                        }
                        break;
                    case 22:
                        var state = $dataStates[e.dataId];
                        if (state) {
                            var name = state.name;
                            if (e.value1 > 0 && effectNames[6]) text = s + effectNames[6] + ' ' + c + name + ' ' + Math.floor(Math.abs(e.value1 * 100)) + '%';
                        }
                        break;
                    case 31:
                        var name = TextManager.param(e.dataId);
                        if (e.value1 > 0 && effectNames[7]) text = s + effectNames[7] + ' ' + c + name + ' ' + e.value1 + turnText;
                        break;
                    case 32:
                        var name = TextManager.param(e.dataId);
                        if (e.value1 > 0 && effectNames[8]) text = s + effectNames[8] + ' ' + c + name + ' ' + e.value1 + turnText;
                        break;
                    case 33:
                        if (effectNames[9]) {
                            var name = TextManager.param(e.dataId);
                            text = s + effectNames[9] + ' ' + c + name;
                        }
                        break;
                    case 34:
                        if  (effectNames[10]) {
                            var name = TextManager.param(e.dataId);
                            text = s + effectNames[10] + ' ' + c + name;
                        }
                        break;
                    case 41:
                        if  (effectNames[11]) text = s + effectNames[11] + ' ' + c + escapeText;
                        break;
                    case 42:
                        if  (effectNames[12]) {
                            var name = TextManager.param(e.dataId);
                            text = s + effectNames[12] + ' ' + c + name + '+' + e.value1;
                        }
                        break;
                    case 43:
                        if  (effectNames[13]) {
                            var name = $dataSkills[e.dataId].name;
                            if (name) text = s + effectNames[13] + ' ' + c + name;
                        }
                        break;
                    case 44:
                        if  (effectNames[14]) {
                            var name = $dataCommonEvents[e.dataId].name;
                            if (name) text = s + effectNames[14] + ' ' + c + name;
                        }
                        break;
                }
                if (text) this._data.push(text);
            }
        }
        if (item.params) {
            for (var i=0;i<8;i++) {
                var value = item.params[i];
                if (value !== 0){
                    var ud = value > 0 ? g : r;
                    var sym = value > 0 ? ' +' : '';
                    this._data.push(s + TextManager.param(i) + ud + sym + value );
                }
            }
        }
        if (item.traits) {
            for (var i=0,max=item.traits.length;i<max;i++) {
                var trait = item.traits[i];
                var vocab = paramVocab;
                var dataId = trait.dataId;
                var value = trait.value;
                var ud = value > 1.0 ? g : r;
                var du = value < 1.0 ? g : r;
                var sym = value > 0 ? ' +' : '';
                text = '';
                switch (trait.code) {
                    case 11:
                        if (vocab[0][0] && value !== 1.0) {
                            var ele = $dataSystem.elements[dataId];
                            text = c + ele + s + vocab[0][0] + du + ' x' + Math.floor(value * 100) + '%';
                        }
                        break;
                    case 12:
                        if (vocab[0][1]  && value !== 1.0) {
                            var param = TextManager.param(dataId);
                            text = c + param + s + vocab[0][1] + du + ' x' + Math.floor(value * 100) + '%';
                        }
                        break;
                    case 13:
                        if (vocab[0][0]  && value !== 1.0) {
                            var state = $dataStates[dataId].name;
                            text = c + state + s + vocab[0][0] + du + ' x' + Math.floor(value * 100) + '%';
                        }
                        break;
                    case 14:
                        if (vocab[0][2]) {
                            var state = $dataStates[dataId].name;
                            text = c + state + s + vocab[0][2];
                        }
                        break;
                    case 21:
                        if (value !== 1.0) {
                            var param = TextManager.param(dataId);
                            text = s + param + ud + ' x' + Math.floor(value * 100) + '%';
                        }
                        break;
                    case 22:
                        var xparam = vocab[1][dataId];
                        if (xparam && value !== 0) {
                            //if (dataId === 0 && xparam) xparam = TextManager.param(8);
                            //if (dataId === 1 && xparam) xparam = TextManager.param(9);
                            if (dataId === 7 && xparam) xparam = TextManager.hpA + xparam;
                            if (dataId === 8 && xparam) xparam = TextManager.mpA + xparam;
                            if (dataId === 9 && xparam) xparam = TextManager.tpA + xparam;
                            text = s + xparam + du + sym + Math.floor(value * 100) + '%';
                        }
                        break;
                    case 23:
                        var sparam = vocab[2][dataId];
                        if (sparam && value !== 1.0) {
                            if (dataId === 0) ud = c;
                            if (dataId === 4) { sparam = TextManager.mpA + sparam; ud = du; }
                            if (dataId === 5) TextManager.tpA + sparam;
                            if (dataId === 6 || dataId === 7 || dataId === 8) ud = du;
                            text = s + sparam + ud + ' x' + Math.floor(value * 100) + '%';
                        }
                        break;
                    case 31:
                        if (vocab[3][0]) {
                            var ele = $dataSystem.elements[dataId];
                            text = s + vocab[3][0] + c + ele;
                        }
                        break;
                    case 32:
                        if (vocab[3][1] && value > 0) {
                            var state = $dataStates[dataId].name;
                            text = s + vocab[3][1] + c + state + ' ' + Math.floor(value*100) + '%' ;
                        }
                        break;
                    case 33:
                        if (vocab[3][2] && value !== 0) text = s + vocab[3][2] + ud + sym + value;
                        break;
                    case 34:
                        if (vocab[3][3] && value !== 0){
                            var ud = value > 0 ? g : r;
                            text = s + vocab[3][3] + ud + sym + value + '回';
                        }
                        break;
                    case 41:
                    case 42:
                        var stype = $dataSystem.skillTypes[dataId];
                        var v = trait.code === 41 ? vocab[4][0] : vocab[4][1];
                        if (v && stype) text = s + v + c + stype;
                        break;
                    case 43:
                    case 44:
                        var skill = $dataSkills[dataId];
                        var v = trait.code === 43 ? vocab[4][2] : vocab[4][3];
                        if (v && skill) text = s + v + c + skill.name;
                        break;
                    case 51:
                    case 52:
                        var type = trait.code === 51 ? $dataSystem.weaponTypes[dataId] : $dataSystem.armorTypes[dataId];
                        var v = trait.code === 51 ? vocab[5][0] : vocab[5][1];
                        if (v && type) text = s + v + c + type;
                        break;
                    case 53:
                    case 54:
                        var etype = $dataSystem.equipTypes[dataId];
                        var v = trait.code === 53 ? vocab[5][2] : vocab[5][3];
                        if (v && etype) text = s + v + c + etype;
                        break;
                    case 55:
                        if (vocab[5][4]) text = s + vocab[5][4];
                        break;
                    case 61:
                        if (vocab[6][0] && value > 0) text = s + vocab[6][0] + du + sym + (value * 100) + '%';
                        break;
                    case 62:
                        if (vocab[6][1+dataId]) {
                            text = s + vocab[6][1 + dataId];
                        }
                        break;
                    case 63:
                        if (vocab[6][5]) text = s + vocab[6][5] + defeatText[dataId];
                        break;
                    case 64:
                        if (vocab[6][6+dataId]) text = s + vocab[6][6+dataId];
                        break;
                    case 111:
                        if (vocab[0][0] && value !== 0) {
                            var ele = $dataSystem.elements[dataId];
                            du = value < 0 ? g : r;
                            text = c + ele + s + vocab[0][0] + du + sym + Math.floor(value * 100) + '%';
                        }
                        break;
                    case 112:
                        if (vocab[0][1]  && value !== 0) {
                            var param = TextManager.param(dataId);
                            du = value < 0 ? g : r;
                            text = c + param + s + vocab[0][1] + du + sym + Math.floor(value * 100) + '%';
                        }
                        break;
                    case 113:
                        if (vocab[0][0]  && value !== 0) {
                            var state = $dataStates[dataId].name;
                            du = value < 0 ? g : r;
                            text = c + state + s + vocab[0][0] + du + sym + Math.floor(value * 100) + '%';
                        }
                        break;
                    case 121:
                        if (value !== 0) {
                            var param = TextManager.param(dataId);
                            text = s + param + ud + sym + value;
                        }
                        break;
                    case 123:
                        var sparam = vocab[2][dataId];
                        if (sparam && value !== 0) {
                            ud = value > 0 ? g : r;
                            du = value < 0 ? g : r;
                            if (dataId === 0) ud = c;
                            if (dataId === 4) { sparam = TextManager.mpA + sparam; ud = du; }
                            if (dataId === 5) TextManager.tpA + sparam;
                            if (dataId === 6 || dataId === 7 || dataId === 8) ud = du;
                            text = s + sparam + ud + sym + Math.floor(value * 100) + '%';
                        }
                        break;
                }

                if(text) this._data.push(text);
            }
        }
    };

    Window_ItemTraits.prototype.makeCatagory = function() {
        var item = this._item;
        var cs = DataManager.itemSecondaryCategories(item);
        var hide = hideCategories;
        this._category = [];
        cs = cs.filter(function(c){ return hide.indexOf(c) < 0});
        if (cs.length > 0) {
            cs.sort();
            for (var i = 0, max = cs.length; i < max; i++) this._category[i] = cs[i];
        }
    };

	Window_ItemTraits.prototype.refresh = function() {
	    this.createContents();
        this.contents.clear();
        this.drawIcon();
        this.drawName();
        this.drawCategory();
        this.drawValue();
        this.drawQuality();
        this.drawTraits();
        this._isDrawing = '';
	};

    Window_ItemTraits.prototype.drawIcon = function() {
        var x = 16;
        var y = 10;
        var iconIndex = this._item.iconIndex;
        var bitmap = ImageManager.loadSystem('IconSet');
        var pw = Window_Base._iconWidth;
        var ph = Window_Base._iconHeight;
        var sx = iconIndex % 16 * pw;
        var sy = Math.floor(iconIndex / 16) * ph;
        var n = 56;
        this.contents.blt(bitmap, sx, sy, pw, ph, x, y, n, n);
    };

	Window_ItemTraits.prototype.drawName = function() {
        var x = 83;
        var y = 6;
        this._isDrawing = 'name';
        this.drawTextEx(this._item.name, x, y);
    };

    Window_ItemTraits.prototype.drawCategory = function() {
        this._isDrawing = 'category';
        var charWidth = 16;
        var spacing = 74;
        var category = this._category;
        for(var i=0,max=category.length;i<max;i++){
            var text = category[i];
            var offset = - text.length / 2 * charWidth;
            var x = 223 + i*spacing + offset;
            var y = 43;
            this.drawTextEx(category[i], x, y);
        }
    };

    Window_ItemTraits.prototype.drawTraits = function() {
        this._isDrawing = 'traits';
        for(var i=0,max=this._data.length;i<max;i++){
            var x = 33 + i % 2 * 201;
            var y = 82 + Math.floor(i / 2)* 31;
    	    this.drawTextEx(this._data[i], x, y);
        }
    };

    Window_ItemTraits.prototype.drawValue = function() {
        var item = this._item;
        var price;
        if (item.meta['価値']) price = String(item.meta['価値']);
        if (item.meta['value']) price = String(item.meta['value']);
        if (price !== '1' && price !== '2' && price !=='3') price = 0;
        var bitmap = ImageManager.loadSystem('gui_rarity' + price);
        var bitmap = ImageManager.loadSystem('gui_rarity' + price);
        var x = 240;
        var y = 7;
        var pw = 165;
        var ph = 36;
        this.contents.blt(bitmap, 0, 0, pw, ph, x, y, pw, ph);
    };

    Window_ItemTraits.prototype.drawQuality = function() {
        var x = 123;
        var y = 43;
        var quality =  this._item.meta['quality'] ? '品質 ' + String(this._item.meta['quality']) : '  N/A';
        this._isDrawing = 'quality';
        this.drawTextEx(quality, x, y);
    };

    Window_ItemTraits.prototype.standardFontSize = function() {
        if (this._isDrawing === 'name') return 24;
        if (this._isDrawing === 'traits') return 16;
        if (this._isDrawing === 'category') return 16;
        if (this._isDrawing === 'quality') return 16;
        return 20;
    };

    Window_ItemTraits.prototype.standardFontFace = function() {
        return 'HelpFont';
    };

    //=============================================================================
    // Scene_Item
    // アイテムの性能や特徴を描画するウィンドウです
    //=============================================================================

	Scene_Item.prototype.create = function() {
	    Scene_ItemBase.prototype.create.call(this);
	    this.createItemDescriptionWindow();
	    this.createCategoryWindow();
	    this.createItemWindow();
        this.createTraitsWindow();
	    this.createActorWindow();
	};

	Scene_Item.prototype.createBackground = function() {
	    var bg = itemSceneBackgroundImage;
	    this._backgroundSprite = new Sprite();
	    this._backgroundSprite.bitmap = ImageManager.loadSystem(bg);
	    this.addChild(this._backgroundSprite);
	};

	Scene_Item.prototype.createItemDescriptionWindow = function() {
	    this._helpWindow = new Window_ItemDescription(4);
	    this._helpWindow.x = 635;
	    this._helpWindow.y = 373;
	    this._helpWindow.opacity = 0;
	    this._helpWindow.width = 450;
	    this._helpWindow.height = 148;
	    this.addWindow(this._helpWindow);
	};	

	
	Scene_Item.prototype.createCategoryWindow = function() {
	    this._categoryWindow = new Window_ItemCategory();
	    this._categoryWindow.setHelpWindow(this._helpWindow);
	    this._categoryWindow.x = 70;
	    this._categoryWindow.y = 177;
	    this._categoryWindow.opacity = 0;
	    this._categoryWindow.setHandler('ok',     this.onCategoryOk.bind(this));
	    this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
	    this.addWindow(this._categoryWindow);
	};

	Scene_Item.prototype.createItemWindow = function() {
        // var x = 53; item with name
        // var y = 213;
        var x = 46;
        var y = 207;
	    var w = Graphics.boxWidth*0.5;
	    var h = 36*8+76;
	    this._itemWindow = new Window_ItemList(x, y, w, h);
	    this._itemWindow.opacity = 0;
	    this._itemWindow.setHelpWindow(this._helpWindow);
	    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
	    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
	    this.addWindow(this._itemWindow);
	    this._categoryWindow.setItemWindow(this._itemWindow);
	};

	Scene_Item.prototype.createTraitsWindow = function() {
	    this._traitsWindow = new Window_ItemTraits();
	    this._traitsWindow.opacity = 0;
	    this._itemWindow._traitsWindow = this._traitsWindow;
	    this.addWindow(this._traitsWindow);
	};	

})();
