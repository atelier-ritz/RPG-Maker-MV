//=============================================================================
// Ritz_CustomizeSaveLayout.js
// ----------------------------------------------------------------------------
// Copyright (c) 2019 Ritz
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// Special thanks to Tsumio
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2019/10/11 公開。
// ----------------------------------------------------------------------------
// [GitHub] : https://github.com/atelier-ritz
// [Twitter]: https://twitter.com/atelier_ritz
//=============================================================================

/*:
 * @plugindesc セーブ画面のレイアウトを変更するプラグインです。
 * @author Ritz
 *
 * @param NumSaveFileSlot
 * @desc 各ページのセーブスロットの数です
 * @default 4
 *
 * @param NameDefaultPortrait
 * @desc 一枚絵が設定されてない場合の画像の名前です。img/bustに置いてください
 * @default default_bust
 *
 * @param NameBgImgSave
 * @desc サーブシーンの背景画像の名前です。img/picturesに置いてください。使用しない場合は空欄にしてください。
 * @default menu_bg
 *
 * @param NameBgImgLoad
 * @desc ロードシーンの背景画像の名前です。img/picturesに置いてください。使用しない場合は空欄にしてください。
 * @default menu_bg
 *
 * @param NamePageSound
 * @desc ページを切り替えるときのSEファイル名です。
 * @default Book1
 *
 * @param VolumePageSound
 * @desc ページを切り替えるときのSE音量です。
 * @default 100
 *
 * @param PitchPageSound
 * @desc ページを切り替えるときのSEピッチです。
 * @default 100
 *
 * @param PageIndicatorPicture
 * @desc 現在のセーブファイルのページの位置を表示するアイコンです。img/picturesに置いてください。使用しない場合は空欄にしてください。
 * @default save_pageIndicator
 *
 * @param PageIndicatorPosY
 * @desc 前述アイコンのY位置です(px)。
 * @default 380
 *
 * @param PageIndicatorPosX1
 * @desc 前述アイコンのXの左位置です(px)。
 * @default 80
 *
 * @param PageIndicatorPosX2
 * @desc 前述アイコンのXの右位置です(px)。
 * @default 300
 *
 *
 *　@help
 * 【機能】
 * ・セーブ画面のレイアウトを変更します。
 * ・先頭のキャラクターに合わせて一枚絵を表示できます。
 *
 * 【使用方法】
 * 1. データーベース → アクター で一枚絵を表示させたいキャラクターのメモ欄に以下のように記述します。
 *    <save_bustup_img:["filename","X","Y"]>
 *    例：<save_bustup_img:["Package2_8","0","0"]>
 *
 * 2. 画像ファイルを img/bust フォルダに放り込みます。
 *
 * 3. 先頭キャラクターのメモ欄に記述があった場合、一枚絵がセーブ画面の右のほうに表示されます。無い場合はNameDefaultPortraitで設定された画像が読み込まれます。
 *
 * 4. 他に背景画像をNameBgImgSave、NameBgImgLoadで設定した画像をフォルダに放り込んでください。
 *
 * 【プラグインコマンド】
 * プラグインコマンドはありません。
 *
 *
 */


(function() {
  'use strict';
  var pluginName = 'Ritz_CustomizeSaveLayout';

  var getParamString = function(paramNames) {
    if (!Array.isArray(paramNames)) paramNames = [paramNames];
    for (var i = 0; i < paramNames.length; i++) {
      var name = PluginManager.parameters(pluginName)[paramNames[i]];
      if (name) return name;
    }
    return '';
  };

  var getParamNumber = function(paramNames, min, max) {
    var value = getParamString(paramNames);
    if (arguments.length < 2) min = -Infinity;
    if (arguments.length < 3) max = Infinity;
    return (parseInt(value) || 0).clamp(min, max);
  };


  var paramNumSaveFileSlot = getParamNumber('NumSaveFileSlot', 0);
  var paramNameDefaultPortrait = getParamString('NameDefaultPortrait')
  var paramNameBgImgSave = getParamString('NameBgImgSave');
  var paramNameBgImgLoad = getParamString('NameBgImgLoad');
  var paramNamePageSound = getParamString('NamePageSound');
  var paramVolumePageSound = getParamNumber('VolumePageSound', 0, 100);
  var paramPitchPageSound = getParamNumber('PitchPageSound', 50, 150);
  var paramPageIndicatorPicture = getParamString('PageIndicatorPicture');
  var paramPageIndicatorPosY = getParamNumber('PageIndicatorPosY', 0);
  var paramPageIndicatorPosX1 = getParamNumber('PageIndicatorPosX1', 0);
  var paramPageIndicatorPosX2 = getParamNumber('PageIndicatorPosX2', 0);
  //=============================================================================
  // ImageManager
  //=============================================================================
  ImageManager.loadBustupImage = function(filename) {
    return this.loadBitmap('img/bust/', filename, 0, true);
  };

  //=============================================================================
  // DataManager
  //=============================================================================
  DataManager.makeSavefileInfo = function() {
    var info = {};
    info.globalId = this._globalId;
    info.title = $dataSystem.gameTitle;
    info.leaderName = $gameParty.members()[0].name()
    info.leaderJobName = $gameParty.members()[0].currentClass().name
    info.characters = $gameParty.charactersForSavefile();
    info.faces = $gameParty.facesForSavefile();
    info.playtime = $gameSystem.playtimeText();
    info.timestamp = Date.now();
    return info;
  };

  //=============================================================================
  // Scene_Save
  //=============================================================================
  Scene_Save.prototype.createBackground = function() {
    if (paramNameBgImgSave) {
      this._backSprite = new Sprite(ImageManager.loadPicture(paramNameBgImgSave));
      this.addChild(this._backSprite);
    }
  };

  Scene_Save.prototype.onSaveSuccess = function() {
    SoundManager.playSave();
    StorageManager.cleanBackup(this.savefileId());
    this._listWindow.refresh();
    this.activateListWindow();
  };

  //=============================================================================
  // Scene_Load
  //=============================================================================
  Scene_Load.prototype.createBackground = function() {
    if (paramNameBgImgLoad) {
      this._backSprite = new Sprite(ImageManager.loadPicture(paramNameBgImgLoad));
      this.addChild(this._backSprite);
    }
  };
  //=============================================================================
  // Scene_File
  //=============================================================================

  // override
  Scene_File.prototype.createListWindow = function() {
    this._helpWindow.height = 0;
    var width = 360;
    var height = 360;
    var x = (Graphics.boxWidth - this.infoWindowWidth() - width) / 3;
    var y = 150;
    this._listWindow = new Window_SavefileList(x, y, width, height);
    this._listWindow.setHandler('ok', this.onSavefileOk.bind(this));
    this._listWindow.setHandler('cancel', this.popScene.bind(this));
    var maxVisibleItems = this._listWindow.maxVisibleItems();
    this._listWindow.setTopRow(Math.floor(this.firstSavefileIndex() / maxVisibleItems) * maxVisibleItems);

    this._listWindow.select(this.firstSavefileIndex());
    this._listWindow.setMode(this.mode());
    this._listWindow.refresh();
    this.addWindow(this._listWindow);
  };


  const _Scene_File_create = Scene_File.prototype.create;
  Scene_File.prototype.create = function() {
    _Scene_File_create.call(this);
    this.createInfoWindow();
  };


  Scene_File.prototype.createInfoWindow = function() {
    var x = this._listWindow.width + 2 * (Graphics.boxWidth - this.infoWindowHeight() - this._listWindow.width) / 3;;
    var y = this._listWindow.y;
    var width = this.infoWindowWidth()
    var height = this.infoWindowHeight()
    this._infoWindow = new Window_FileInfo(x, y, width, height);
    this._infoWindow.refresh(this._listWindow.index());
    this.addWindow(this._infoWindow);
    this._listWindow.setChildWindow(this._infoWindow);
  };

  Scene_File.prototype.infoWindowWidth = function() {
    return 360;
  };

  Scene_File.prototype.infoWindowHeight = function() {
    return 360;
  };

  //=============================================================================
  // Window_SavefileList
  //=============================================================================
  var _Window_SavefileList_initialize = Window_SavefileList.prototype.initialize;
  Window_SavefileList.prototype.initialize = function(x, y, width, height) {
    _Window_SavefileList_initialize.call(this, x, y, width, height);
    if (paramPageIndicatorPicture) {
      this._pageIndicatorSprite = new Sprite(ImageManager.loadPicture(paramPageIndicatorPicture));
      this._pageIndicatorSprite.y = paramPageIndicatorPosY;
      this.setPageIndicatorPosX();
      this.addChild(this._pageIndicatorSprite);
    }
  }

  Window_SavefileList.prototype.setPageIndicatorPosX = function() {
    if (paramPageIndicatorPicture) {
      var offset = (paramPageIndicatorPosX2 - paramPageIndicatorPosX1) / Math.floor(this.maxItems() / this.maxVisibleItems() - 1)
      var pageID = Math.floor(this.index() / this.maxVisibleItems());
      this._pageIndicatorSprite.x = paramPageIndicatorPosX1 + offset * pageID;
    }
  };

  Window_SavefileList.prototype.maxVisibleItems = function() {
    return paramNumSaveFileSlot;
  };

  Window_SavefileList.prototype.windowWidth = function() {
    return 360;
  };

  Window_SavefileList.prototype.windowHeight = function() {
    return 360;
  };

  var _Window_SavefileList_select = Window_SavefileList.prototype.select;
  Window_SavefileList.prototype.select = function(index) {
    _Window_SavefileList_select.call(this, index);
    if (this.childWindow) {
      this.childWindow.refresh(index);
    }
    if (this._pageIndicatorSprite) {
      this.setPageIndicatorPosX();
    }
  };

  Window_SavefileList.prototype.cursorDown = function(wrap) {
    var index = this.index();
    var maxVisibleItems = this.maxVisibleItems();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
      if ((index + 1) % maxVisibleItems !== 0) {
        this.select((index + maxCols) % maxItems);
      }
    }
  };

  Window_SavefileList.prototype.cursorUp = function(wrap) {
    var index = this.index();
    var maxVisibleItems = this.maxVisibleItems();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (index >= maxCols || (wrap && maxCols === 1)) {
      if (index % maxVisibleItems !== 0) {
        this.select((index - maxCols + maxItems) % maxItems);
      }
    }
  };


  Window_SavefileList.prototype.cursorPagedown = function() {
    var index = this.index();
    var maxItems = this.maxItems();
    if (this.topRow() + this.maxPageRows() < this.maxRows()) {
      this.setTopRow(this.topRow() + this.maxPageRows());
      this.select(Math.min(index + this.maxPageItems(), maxItems - 1));
      this.playPageSound();
    }
  };

  Window_SavefileList.prototype.cursorPageup = function() {
    var index = this.index();
    if (this.topRow() > 0) {
      this.setTopRow(this.topRow() - this.maxPageRows());
      this.select(Math.max(index - this.maxPageItems(), 0));
      this.playPageSound();
    }
  };

  Window_SavefileList.prototype.processCursorMove = function() {
    if (this.isCursorMovable()) {
      var lastIndex = this.index();
      if (Input.isRepeated('down')) {
        this.cursorDown(Input.isTriggered('down'));
      }
      if (Input.isRepeated('up')) {
        this.cursorUp(Input.isTriggered('up'));
      }
      if (!this.isHandled('right') && Input.isTriggered('right')) {
        this.cursorPagedown();
        return
      }
      if (!this.isHandled('left') && Input.isTriggered('left')) {
        this.cursorPageup();
        return
      }
      if (!this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
        this.cursorPagedown();
        return
      }
      if (!this.isHandled('pageup') && Input.isTriggered('pageup')) {
        this.cursorPageup();
        return
      }
      if (this.index() !== lastIndex) {
        SoundManager.playCursor();
      }
    }
  };
  // override
  Window_SavefileList.prototype.drawItem = function(index) {
    var id = index + 1;
    var valid = DataManager.isThisGameFile(id);
    var info = DataManager.loadSavefileInfo(id);
    var rect = this.itemRectForText(index);
    this.resetTextColor();
    if (this._mode === 'load') {
      this.changePaintOpacity(valid);
    }
    if (info) {
      this.changePaintOpacity(valid);
      this.drawContents(info, rect, valid);
      this.changePaintOpacity(true);
    } else {
      this.drawFileId(id, rect.x, rect.y, rect.width, rect.height);
    }
  };

  Window_SavefileList.prototype.drawFileId = function(id, x, y, width, height) {
    this.drawText(TextManager.file + ' ' + id, x, y + height / 2 - this.lineHeight() / 2, width, "center");
  };

  Window_SavefileList.prototype.drawContents = function(info, rect, valid) {
    var bottom = rect.y + rect.height;
    var lineHeight = this.lineHeight();
    var y2 = bottom - lineHeight;
    this.drawCharacterName(info, rect.x, rect.y);
    this.drawPlaytime(info, rect.x, bottom - lineHeight, rect.width);
    this.drawJobName(info, rect.x, rect.y, rect.width);
  };

  Window_SavefileList.prototype.drawPlaytime = function(info, x, y, width) {
    if (info.playtime) {
      var hourMinSec = info.playtime
      var hourMin = hourMinSec.substring(0, hourMinSec.lastIndexOf(":"));
      this.drawText(hourMin, x, y, width, 'right');
    }
  };

  Window_SavefileList.prototype.drawJobName = function(info, x, y, width) {
    if (info.leaderJobName) {
      var job = info.leaderJobName
      this.drawText(job, x, y, width, 'right');
    }
  };

  Window_SavefileList.prototype.drawCharacterName = function(info, x, y) {
    var name = info.leaderName;
    this.drawText(name, x, y, this.windowWidth() / 2);
  };

  Window_SavefileList.prototype.setChildWindow = function(window) {
    this.childWindow = window;
  };

  Window_SavefileList.prototype.updateArrows = function() {
    this.downArrowVisible = false;
    this.upArrowVisible = false;
  };

  Window_SavefileList.prototype.playPageSound = function() {
    if (paramNamePageSound) {
      AudioManager.playSe({
        "name": paramNamePageSound,
        "volume": paramVolumePageSound,
        "pitch": paramPitchPageSound,
        "pan": 0
      })
    }
  };
  //=============================================================================
  // Window_FileInfo
  //=============================================================================
  class Window_FileInfo extends Window_Base {
    constructor(x, y, width, height) {
      super(x, y, width, height);
    }

    initialize(x, y, width, height) {
      super.initialize(x, y, width, height);
      this.opacity = 0

      this.spriteActor = null;
      this._metaData = null;
    }

    get parentIndex() {
      return this.parentWindow.index();
    }

    get fileName() {
      return this._metaData[0];
    }

    get actorX() {
      return Number(this._metaData[1]);
    }

    get actorY() {
      return Number(this._metaData[2]);
    }

    partyInfo(index) {
      const savefileId = index + 1;
      if (DataManager.isThisGameFile(savefileId)) {
        const json = StorageManager.load(savefileId);
        const party = this.extractSaveContents(JsonEx.parse(json));
        return party;
      } else {
        this.deleteActorPicture();
        return null;
      }
    }

    deleteActorPicture() {
      if (this.spriteActor !== null) {
        this.removeChild(this.spriteActor);
        this.spriteActor = null;
      }
    }

    extractSaveContents(contents) {
      return contents.party;
    };

    refresh(index) {
      const partyInfo = this.partyInfo(index);
      if (!partyInfo) {
        this.createActorPictureWhenEmpty();
        return;
      }
      const members = partyInfo.members();
      this.refreshMetaData(members);
      this.removeChild(this.spriteActor);
      this.drawExtraContents();
      this.createActorPicture();
    }

    drawExtraContents() {
      //e.g. this.drawTextEx('aaa',0, 0);
    }

    createActorPicture() {
      if (!this.fileName) {
        return;
      }
      //Create and addChild.
      this.spriteActor = new Sprite(ImageManager.loadBustupImage(this.fileName));
      this.spriteActor.x = this.actorX;
      this.spriteActor.y = this.actorY;
      this.addChild(this.spriteActor);
    }

    createActorPictureWhenEmpty() {
      var fileName = paramNameDefaultPortrait;
      //Create and addChild.
      this.spriteActor = new Sprite(ImageManager.loadBustupImage(fileName));
      this.spriteActor.x = 0;
      this.spriteActor.y = 0;
      this.addChild(this.spriteActor);
    }

    refreshMetaData(info) {
      if (info.length <= 0) {
        //Info do not exsist.
        this._metaData = [null, 0, 0];
        return;
      }

      //Info exsist.
      const actorId = info[0].actorId(); //Get first actor id.
      if ($dataActors[actorId].meta['save_bustup_img']) {
        this._metaData = JSON.parse($dataActors[actorId].meta['save_bustup_img']);
      } else {
        //Assign blank data.
        this._metaData = [null, 0, 0];
      }
    }
  }

})();
