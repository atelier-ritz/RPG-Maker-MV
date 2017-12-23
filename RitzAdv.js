//=============================================================================
// RitzAdv.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017 atelier_ritz
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1
// 0.0.1 2017/12/12 Start development.
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/atelier_ritz
// [GitHub] : https://github.com/atelier-ritz
//=============================================================================

/*:
 * @plugindesc Create galgame style events by reading .txt scripts.
 * @author atelier_ritz
 *
 *
 * @param MessageFormat
 * @desc Change the indent, character per line, etc.
 * @default
 * @param characterPerLine
 * @desc Number of characters per line (including indent spaces)
 * @type number
 * @default 27
 * @parent MessageFormat
 * @param nameIndent
 * @desc The indent (# of spaces) before name
 * @type number
 * @default 4
 * @parent MessageFormat
 * @param textIndent
 * @desc The indent (# of spaces) before each line
 * @type number
 * @default 4
 * @parent MessageFormat
 * @param specialCharacters
 * @desc These characters will follow the last character even exceeding the characterPerLine.
 * @type text
 * @default "%),:;]}｡｣ﾞﾟ。，、．：；゛゜ヽヾゝゞ々’”）〕］｝〉》」』】°′″℃￠％‰"
 * @parent MessageFormat
 * @param characterTextColor
 * @desc Set the color of name and text for main characters. NameColorId, TextColorId, CharacterName.
 * @type struct<CharaColorPreset>
 * @parent MessageFormat
 *
 * @param WindowSetting
 * @desc Change the message box swtting.
 * @param windowType
 * @desc 0:normal, 1:black, 2:transparent
 * @type Nnumber
 * @default 0
 * @parent WindowSetting
 * @param windowPosition
 * @desc 0:top, 1:mid, 2:bottom
 * @type number
 * @default 2
 * @parent WindowSetting
 *
 * @param GraphicSetting
 * @desc Picture ID, positions of the graphics
 * @param charaPicIdStartFrom
 * @desc if set to 10, character id is assigned to 10, 11, 12, ...
 * @type number
 * @default 10
 * @parent GraphicSetting
 * @param bgPicIdStartFrom
 * @desc if set to 10, backgrounf id is assigned to 5 and 6
 * @type number
 * @default 5
 * @parent GraphicSetting
 * @param PositionPresets
 * @desc Presets of character graphic positions. Anchor point is at the center of the image. Example pos=0 -> 120(x),300(y),r(presetName).
 * @type struct<PositionPreset>
 * @parent GraphicSetting
 * @param defaultCharaFadeFrame
 * @desc default wait framws when characters show up / disppear
 * @type number
 * @default 20
 * @parent GraphicSetting
 * @param defaultBgFadeFrame
 * @desc default wait framws when background show up / disppear
 * @type number
 * @default 10
 * @parent GraphicSetting
 * @param defaultSceneFadeFrame
 * @desc default wait framws when scene fadein / fadeout
 * @type number
 * @default 60
 * @parent GraphicSetting
 *
 *
 * @help ツクールMVでギャルゲー風会話システムを作るプラグインです。
 * このプラグインはプロジェクトフォルダ/Scenarioの下の.txtファイルを読み込むことで、
 * 文字、bgm、bgs、ME、SE、立ち絵など様々な演出を可能にします。
 * 快適な開発支援のために以下の機能を提供します。
 *
 * 1.
 *
 * 2.
 *
 * Roadmap: play SE, change face in the middle of a text.
 * window closes when chaing characters
 * put latest character to the front
 * label jump
 * stop previous voice
 * one chara mode
 * Choices
 * picture window
 * motion (jump syutyusen)
 * variables & switch
 * condition branch
 * layout collapse when font enlarged
 * name/text font
 * make neater adjustTextLayout
 * This plugin is released under the MIT License.
 */

 /*~struct~CharaColorPreset:
 * @param Preset0
 * @type text
 * @default 2,3,ハロルド
 * @param Preset1
 * @type text
 * @default
 * @param Preset2
 * @type text
 * @default
 */
 /*~struct~PositionPreset:
 * @param Preset0
 * @type text
 * @default 580,540,m
 * @param Preset1
 * @type text
 * @default 880,540,r
 * @param Preset2
 * @type text
 * @default 380,540,l
 */

(function() {
		// 'use strict';
		const pluginName = 'RitzAdv';

    //=============================================================================
		// print
		//=============================================================================
    p = function(value) {
        console.log.apply(console, arguments);
        SceneManager.getNwJs().showDevTools();
    };

		//=============================================================================
    // PluginManager Variables
    // Parameters obtained from the plugin manager
    //=============================================================================
		const myParameters 						= PluginManager.parameters(pluginName);
		const paramNumCharPerLine 		= Number(myParameters['characterPerLine']);
		const paramNameIndent 				= Number(myParameters['nameIndent']);
		const paramTextIndent 				= Number(myParameters['textIndent']);
		const paramSpecialCharacters 	= String(myParameters['specialCharacters']);
		const paramCharaTextColor			= JSON.parse(myParameters['characterTextColor']);
		const paramWindowType 				= Number(myParameters['windowType']);
		const paramWindowPosition   	= Number(myParameters['windowPosition']);
		const paramPosPreset					= JSON.parse(myParameters['PositionPresets']);
		const paramCharaPicIdBase			= Number(myParameters['charaPicIdStartFrom']);
		const paramBgPicIdBase				= Number(myParameters['bgPicIdStartFrom']);
		const paramCharaFadeFrame 		= Number(myParameters['defaultCharaFadeFrame']);
		const paramBgFadeFrame 				= Number(myParameters['defaultBgFadeFrame']);
		const paramSceneFadeFrame 		= Number(myParameters['defaultSceneFadeFrame']);

		//***************************************************************
		// ADV_System
		//***************************************************************
		function ADV_System() {
				this.initialize.apply(this, arguments);
		}

		ADV_System.NAME_INDENT 				= new Array(paramNameIndent + 1).join(' ');
		ADV_System.TEXT_INDENT 				= new Array(paramTextIndent + 1).join(' ');
		;
		ADV_System.SCENARIO_PREFIX 		= "\n";
		ADV_System.SCENARIO_SUFFIX 		= "\n@chara\n@bg\n@clearPicCache";

		ADV_System.TEXT_COLOR_PRESET_NAME = [];
		ADV_System.TEXT_COLOR_PRESET_VALUE = []; // namecolor, textcolor
		for(var key in paramCharaTextColor){
				var temp = paramCharaTextColor[key].split(',');
				ADV_System.TEXT_COLOR_PRESET_NAME.push(temp[2]);
				ADV_System.TEXT_COLOR_PRESET_VALUE.push([temp[0],temp[1]]);
		}

		ADV_System.POS_PRESET_NAME = [];
		ADV_System.POS_PRESET_VALUE = [];
		for(var key in paramPosPreset){
				var temp = paramPosPreset[key].split(',');
				ADV_System.POS_PRESET_NAME.push(temp[2]);
				ADV_System.POS_PRESET_VALUE.push([temp[0],temp[1]]);
		}

		ADV_System.prototype.initialize = function(){
				this.mStack = [];
				this.mRun = false;
				this.mWaitMode = ''; 			// wait type
				this.mWaitData = null;		// 判定時に使うデータ
				this.mWaitCount = 0;			// 終了待ちが時間指定の場合
				this.mWindowBack = paramWindowType;			// テキスト表示枠
				this.mWindowPos = paramWindowPosition;			// テキスト表示場所
				this.mSelectList = [];		// 選択肢のリスト
				this.mViewPictId = -1;
				//graphics
				this.mPicIdInUse = []; 				// id -> boolean, true if in use
				//characterGraphic
				this.mActiveActors 		 = [];   // active actors on the screen
				this.mActiveActorsInfo = []; // imageId, name, xPos, yPos
				//bgGraphic  -1: not in use, 0:picId = paramBgPicIdBase, 1:picId = paramBgPicIdBase+1
				this.mActiveBgIndex		 = -1;

		};

		//***************************************************************
		// General
		//***************************************************************
		// load .txt file and store the converted commands at this.mStack
		ADV_System.prototype.loadScript = function(filename,reset) {
				// reset = false when label jump is used
				if(reset === undefined) reset = true;
				if(reset) this.resetStack();
				// read scenario file
				var fs = require('fs');
				var filepath = this.localFileDirectoryPath()+filename+'.txt';
				var file_data = fs.readFileSync(filepath, 'utf-8');
				//clear character and background graphics at the end
				file_data = ADV_System.SCENARIO_PREFIX + file_data + ADV_System.SCENARIO_SUFFIX;
				var s_list = file_data.split('\n');
				var new_stack = [];
				// stack by the line
				for(var i=0, len=s_list.length; i<len; i++){
						var text = s_list[i];
						// empty
						text = this.chomp(text);
						text = text.trim();
						if( text.trim() == "" || text.trim() == '\r' ) continue;
						// comments
						if( text.charAt(0) == ';' ) continue;
						var add_stack = [];
						// commands
						if( text.charAt(0) == '@' ){					//macro
								add_stack = this.macroChange(this.chomp(text));
						}else if( text.charAt(0) == '*' ){	// ラベル
								add_stack = this.macroChange(this.chomp(text));
						}else{															// テキスト
								var add_text = text;
								//[name/voiceFileName] -> play se
								if( add_text.indexOf('/') != -1 ){
										var voiceFileName = add_text.slice(add_text.indexOf('/')+1,add_text.indexOf(']'));
										add_stack.push('@se f=' + voiceFileName);
								}
								add_text = this.nameVoiceCut(add_text);
								add_text = this.adjustTextLayout(add_text);
								add_stack.push(add_text);
						}
						new_stack = new_stack.concat(add_stack);
				}
				this.mStack = new_stack.concat(this.mStack);
				if(reset){
						this.mRun = true;
						$gameMap._interpreter.setAdvRun(true);
						this.stackRun();
				}
		}

		// run the lines in this.mStack -> showMessage()/macroRun()
		ADV_System.prototype.stackRun = function() {
				if(!this.mRun) return;
				var stack = this.mStack[0];
				// skip label
				while( stack && stack.charAt(0) == '*' ){
						this.mStack.shift();
						stack = this.mStack[0];
				}
				if(!stack){
						this.resetMesOption();
						this.mRun = false;
						$gameMap._interpreter.setAdvRun(false);
						return;
				}
				if(stack.charAt(0) == '@'){
					 	//macro
						var macroCommand = this.mStack.shift();
						this.macroRun(macroCommand)
				}else{
						//text
						this.showMessage();
				}
		}

		// show message
		ADV_System.prototype.showMessage = function() {
				var text = this.mStack.shift();
				$gameMessage.setBackground(this.mWindowBack);
				$gameMessage.setPositionType(this.mWindowPos);
				$gameMessage.add(text);
				// 次のスタックが「選択肢」「数値入力」「アイテム選択」
				// の場合は一緒に表示する
				var stack = this.mStack[0];
				if( stack && ( stack.indexOf('@select') != -1 ) ){
						this.stackRun();
				}
				this.mWaitMode = 'message';
		}

		// run macro that is denoted by @
		ADV_System.prototype.macroRun = function(macro) {
				var argument = {};

				if(macro.indexOf('@bgm ') != -1){
						argument = this.makeArg(macro,{pan:0, pitch:100, vol:90, t:1000});
						argument['name'] = argument['f'];
						argument['pitch'] = Number(argument['pitch']);
						argument['volume'] = Number(argument['vol']);
						if(argument['name']){
								AudioManager.playBgm(argument);
						}else{
								var sec_fadeOut = Math.floor(Number(argument['t']) / 1000);
								AudioManager.fadeOutBgm(sec_fadeOut);
						}
				}else if(macro == '@bgm'){
						var sec_fadeOut = 1;
						argument['t'] = sec_fadeOut;
						AudioManager.fadeOutBgm(argument['t']);
				}

				if(macro.indexOf('@se ')  != -1){
						argument = this.makeArg(macro,{pan:0, pitch:100, vol:90});
						argument['name'] = argument['f'];
						argument['pitch'] = Number(argument['pitch']);
						argument['volume'] = Number(argument['vol']);
						if(argument['name']){
								AudioManager.playSe(argument);
						}else{
								AudioManager.stopSe();
						}
				}else if(macro == '@se'){
						AudioManager.stopSe();
				}

				if(macro.indexOf('@me ') != -1){
						argument = this.makeArg(macro,{pan:0, pitch:100, vol:90});
						argument['name'] = argument['f'];
						argument['pitch'] = Number(argument['pitch']);
						argument['volume'] = Number(argument['vol']);
						if( argument['name'] ){
								AudioManager.playMe(argument);
						}else{
								AudioManager.stopMe();
						}
				}else if(macro == '@me'){
						AudioManager.stopMe();
				}

				if(macro.indexOf('@bgs ') != -1){
						argument = this.makeArg(macro,{pan:0, pitch:100, vol:90, t:1000});
						argument['name'] = argument['f'];
						argument['pitch'] = Number(argument['pitch']);
						argument['volume'] = Number(argument['vol']);
						if( argument['name'] ){
								AudioManager.playBgs(argument);
						}else{
								var sec_fadeOut = Math.floor(Number(argument['t']) / 1000);
								AudioManager.fadeOutBgs(sec_fadeOut);
						}
				}else if( macro == '@bgs' ){
						var sec_fadeOut = 1;
						argument['t'] = sec_fadeOut;
						AudioManager.fadeOutBgs(argument['t']);
				}

				if(macro.indexOf('@chara ') != -1){
						argument = this.makeArg(macro,{opacity:255, face:1, t:paramCharaFadeFrame});
						if(argument['f'] == null) return;
						if(argument['pos']){
								var presetName = argument['pos'];
								var presetId = ADV_System.POS_PRESET_NAME.indexOf(presetName);
								argument['x'] = ADV_System.POS_PRESET_VALUE[presetId][0];
								argument['y'] = ADV_System.POS_PRESET_VALUE[presetId][1];
						}
						if(argument['x'] != null) argument['x'] = Number(argument['x']);
						if(argument['y'] != null) argument['y'] = Number(argument['y']);
						argument['opacity'] = Number(argument['opacity']);
						argument['t'] 			= Number(argument['t']);
						// if f=Peter@  then delete character Peter
						if(argument['f'].lastIndexOf('@') == argument['f'].length-1){
								this.deleteActor(argument);
						}else{
								this.loadActor(argument);
						}
				}else if(macro == '@chara'){
						argument = this.makeArg(macro,{t:paramCharaFadeFrame});
						for(var i in this.mActiveActorsInfo){
								argument['f'] = this.mActiveActorsInfo[i].name;
								this.deleteActor(argument);
						}
				}

				if(macro.indexOf('@bg ') != -1){
						argument = this.makeArg(macro,{opacity:255, face:1, t:paramCharaFadeFrame});
						if(argument['f'] == null) return;
						argument['x'] 			= Graphics.boxWidth/2;
						argument['y'] 			= Graphics.boxHeight/2;
						argument['opacity'] = Number(argument['opacity']);
						argument['t'] 			= Number(argument['t']);
						this.loadBg(argument);
				}else if(macro == '@bg'){
						this.deleteAllBg();
				}

				if(macro == '@clearPicCache'){
						this.clearPicCache()
				}

				if(macro.indexOf('@wait ') != -1){
						argument = this.makeArg(macro,{});
						var waitFrame = Number(argument['t']);
						this.wait(waitFrame);
				}

				if(macro.indexOf('@fadein') != -1){
						argument = this.makeArg(macro,{t:paramSceneFadeFrame});
						var waitFrame = Number(argument['t']);
						$gameScreen.startFadeIn(waitFrame);
						this.wait(waitFrame);
				}

				if(macro.indexOf('@fadeout') != -1){
						argument = this.makeArg(macro,{t:paramSceneFadeFrame});
						var waitFrame = Number(argument['t']);
						$gameScreen.startFadeOut(waitFrame);
						this.wait(waitFrame);
				}

		}

		// set a MACRO that consists of many "macros"
		ADV_System.prototype.macroChange = function(macro){
				var c_macro = [];
				if( macro.indexOf('@fin') != -1 ){
					// 変換
					argument = this.makeArg(macro,{});
					c_macro.push( '@se' );
					c_macro.push( '@bgs' );
					c_macro.push( '@bgv' );
					c_macro.push( '@flash t=300 wt=1' );
					c_macro.push( '@flash t=300 wt=1' );
					c_macro.push( '@flash t=1000' );
					if( argument['bg'] ) c_macro.push( '@ev f='+argument['bg'] );
					if( argument['se'] ) c_macro.push( '@se f='+argument['se'] );
				}else if( macro.indexOf('@bgf') != -1 ){
					// 変換
					argument = this.makeArg(macro,{t:1000});
					c_macro.push( '@flash t='+argument['t'] );
					if( argument['bg'] ) c_macro.push( '@ev f='+argument['bg'] );
				}else if( macro.indexOf('@rps_ex') != -1 ){
					// 変換
					c_macro.push( '@fadeout' );
					c_macro.push( '@se' );
					c_macro.push( '@bgs' );
					c_macro.push( '@bgv' );
					c_macro.push( '@bgm' );
					c_macro.push( '@bs' );
					c_macro.push( '@ev' );
					c_macro.push( '@wait t=1000' );
					c_macro.push( '@fadein' );
				}else if( macro.indexOf('@rps') != -1 ){
					// 変換
					c_macro.push( '@se' );
					c_macro.push( '@bgs' );
					c_macro.push( '@bgv' );
					c_macro.push( '@bgm' );
					c_macro.push( '@bs' );
					c_macro.push( '@ev' );
					c_macro.push( '@wait t=1000' );
				}else if( macro.indexOf('@qk') != -1 ){
					// 変換
					c_macro.push( '@map_scroll dir=l dis=1 spd=6 wt=1' );
					c_macro.push( '@map_scroll dir=r dis=2 spd=6 wt=1' );
					c_macro.push( '@map_scroll dir=l dis=1 spd=6 wt=1' );
				}else{
						c_macro.push(macro);
				}
				return c_macro;
		}

		// combine arguments passed by the .txt file and variable "init"
		ADV_System.prototype.makeArg = function(macro,init) {
				var output = {};
				var list = macro.split(' ');
				list.shift();
				for(var i=0, len=list.length; i<len; i++){
						// 「=」で分割
						var arg = list[i].split('=');
						var key = arg.shift();
						arg = arg.join('=');
						output[key] = arg;
				}
				// 初期値入力
				for(key in init){
						if( output[key] == null )	output[key] = init[key];
				}
				return output;
		}

		// process indent
		ADV_System.prototype.adjustTextLayout = function(text){
				var output = "";
				var cnt = 0; //# of characters in the current line
				var includeName = true;
				// pre-process [name]
				text = text.replace(/\]/,']\n' + ADV_System.TEXT_INDENT);
				if(text.indexOf(']\n') != -1 ){
						var name = text.split(']\n')[0].slice(1);
						var nameLength = name.length;
						var index = ADV_System.TEXT_COLOR_PRESET_NAME.indexOf(name);
						if(index != -1){
								output += "\\c[" + ADV_System.TEXT_COLOR_PRESET_VALUE[index][0] + "]";
						}
						text = text.replace(']','');
						text = text.replace('[','');
				}else{
						includeName = false;
						output += "\n" + ADV_System.TEXT_INDENT + "  ";	// add a space to compensate for the Japanese [ symbol
						cnt = ADV_System.TEXT_INDENT.length + 2;
				}
				// process line break
				for(var t_cnt=0, length=text.length; t_cnt<length; t_cnt++){
						var c = text[t_cnt];
						if(includeName){
								if(cnt > nameLength){
										includeName = false;
										cnt = 0;
										if(index != -1){
												output += "\\c[" + ADV_System.TEXT_COLOR_PRESET_VALUE[index][1] + "]";
										}
								}
						}
						if(c == "\\"){
								var rest = text.substring(t_cnt);
								var regexp1 = /^\\[a-zA-Z]\[\d+\]/;
								var regexp2 = /^\\[|\\\}\{\>\<\^\!\.${]/;
								var match = rest.match(regexp1) || rest.match(regexp2);
								var escape = match[0];
								if(escape){
										output += escape;
										t_cnt += escape.length - 1;
								}
						}else if(!includeName && cnt >= paramNumCharPerLine){
								if(paramSpecialCharacters.indexOf(c) != -1){
										output += c;
										cnt++;
								}else{
										output += "\n" + ADV_System.TEXT_INDENT + "  " + c;
										cnt = ADV_System.TEXT_INDENT.length + 2;
								}
						}else if(c == "\\" && text[t_cnt+1] && text[t_cnt+1] =='n'){	// break line symbol
								output += "\n" + ADV_System.TEXT_INDENT + "  ";
								cnt = ADV_System.TEXT_INDENT.length + 2 - 1;
								t_cnt++;
						}else{
								output += c;
								cnt++;
						}
				};
				output = ADV_System.NAME_INDENT + output;
				return output;
		}

		// strip "/voice" from [name/voice]
		ADV_System.prototype.nameVoiceCut = function(text) {
				var output = text;
				if( text.indexOf('/') != -1 && text.indexOf('[') != -1 && text.indexOf(']') != -1 ){
						var name = text.split(']');
						var new_name = name[0];
						new_name = new_name.split('/');
						output = text.replace( name[0], new_name[0] );
				}
				return output;
		}

		//***************************************************************
		// Graphics
		//***************************************************************
		ADV_System.prototype.loadActor = function(data){
				var filename = data.f;
				var name = filename.split('@')[0];
				if(this.mActiveActors.indexOf(name) != -1){
						// this actor is already defined
						var index = this.mActiveActors.indexOf(name);
						var imgId = this.mActiveActorsInfo[index].pictureID;
						var oldX = this.mActiveActorsInfo[index].x;
						var oldY = this.mActiveActorsInfo[index].y;
						var newX = (data.x == null) ? oldX : data.x;
						var newY = (data.y == null) ? oldY : data.y;
						var oldOpacity = this.mActiveActorsInfo[index].opacity;
						var newOpacity = (data.opacity == null) ? oldOpacity : data.opacity;
						var waitFrame = data['t'];
						$gameScreen.showPicture(imgId, filename, 1, oldX, oldY, 100, 100, oldOpacity, 0);
						$gameScreen.movePicture(imgId, 1, newX, newY, 100, 100, newOpacity, 0, waitFrame);
						this.wait(waitFrame);
						this.mActiveActorsInfo[index] = {name:name, pictureID:imgId, x:newX, y:newY, opacity:newOpacity};
				}else{
						// this actor is not defined
						var index = this.mActiveActors.length;
						var imgId = paramCharaPicIdBase + index;
						var newX = (data.x == null) ? Graphics.boxWidth/2 : data.x;
						var newY = (data.y == null) ? Graphics.boxHeight/2: data.y;
						var newOpacity = data.opacity;
						var waitFrame = data.t;
						this.mActiveActors[index] = name;
						this.mActiveActorsInfo.push({name:name, pictureID:imgId, x:newX, y:newY, opacity:newOpacity});
						this.mPicIdInUse.push(imgId);
						$gameScreen.showPicture(imgId, filename, 1, newX, newY, 100, 100, 0, 0);
						$gameScreen.movePicture(imgId, 1, newX, newY, 100, 100, newOpacity, 0, waitFrame);
						this.wait(waitFrame);
				}
				// this.mViewPictId = this.swapPicture(pict_id_base);// 今表示したキャラを最前列に持ってくる
		}

		// This only makes the character transparent. It doen't delete the picture.
		ADV_System.prototype.deleteActor = function(data){
				var filename = data.f;
				var name = filename.split('@')[0];
				if(this.mActiveActors.indexOf(name) != -1){
						var index = this.mActiveActors.indexOf(name);
						var imgId = this.mActiveActorsInfo[index].pictureID;
						var oldX = this.mActiveActorsInfo[index].x;
						var oldY = this.mActiveActorsInfo[index].y;
						var waitFrame = data.t;
						$gameScreen.movePicture(imgId, 1, oldX, oldY, 100, 100, 0, 0, waitFrame);
						this.wait(waitFrame);
						this.mActiveActorsInfo[index] = {name:name, pictureID:imgId, x:oldX, y:oldY, opacity:0};
				}
		}

		ADV_System.prototype.clearPicCache = function(){
					for(var id in this.mPicIdInUse){
							$gameScreen.erasePicture(this.mPicIdInUse[id]);
					}
					this.mActiveActors = [];
					this.mActiveActorsInfo = [];
					this.mPicIdInUse = [];
					this.mActiveBgIndex = -1;
		}

		ADV_System.prototype.moveFadePicture = function(data){
				if(data.new){
					var afterOpacity = data['opacity'];
					data['x'] = data['ox'];
					data['y'] = data['oy'];
					data['opacity'] = data.type == 'in' ? 0 : 255;
					this.loadPicture(data);
					data['opacity'] = afterOpacity;
				}
				// 検索用の名前
				var check_name = data.f.split('@');
				check_name = check_name[0] + '@';
				// 画像を取得
				var pict_data = this.findPicture(check_name);
				// 画像が読み込め無かった
				if( pict_data == null ) return;
				// 画像ID
				var pict_id_base = pict_data.base_id;
				// セットする値
				var set_op = data.type == 'in' ? data.opacity : 0;
				var set_time = data.t;
				for(var key in pict_data.list){
						var val = pict_data.list[key];
						// セットする値
						var set_x = val._x + data['mx'];
						var set_y = val._y + data['my'];
						var pict_id = pict_id_base*this.ADD_LAYER_NUM.BASE+this.ADD_LAYER_NUM[key];
						$gameScreen.movePicture(pict_id, 1, set_x, set_y, 100, 100, set_op, 0, set_time);
				}
		}

		ADV_System.prototype.loadBg = function(data){
				var filename = data.f;
				var newX = data.x;
				var newY = data.y;
				var newOpacity = data.opacity;
				var waitFrame = data.t;
				var index = this.mActiveBgIndex;
				if(index == 0){
						var imgId = paramBgPicIdBase + 1;
						this.mPicIdInUse.push(imgId);
						$gameScreen.movePicture(imgId-1, 1, newX, newY, 100, 100, 0, 0, waitFrame);
						$gameScreen.showPicture(imgId, filename, 1, newX, newY, 100, 100, 0, 0);
						$gameScreen.movePicture(imgId, 1, newX, newY, 100, 100, newOpacity, 0, waitFrame);
						this.wait(waitFrame);
						this.mActiveBgIndex = 1;
				}else if(index == 1){
						var imgId = paramBgPicIdBase;
						$gameScreen.movePicture(imgId+1, 1, newX, newY, 100, 100, 0, 0, waitFrame);
						$gameScreen.showPicture(imgId, filename, 1, newX, newY, 100, 100, 0, 0);
						$gameScreen.movePicture(imgId, 1, newX, newY, 100, 100, newOpacity, 0, waitFrame);
						this.wait(waitFrame);
						this.mActiveBgIndex = 0;
				}else if(index == -1){
						var imgId = paramBgPicIdBase;
						this.mPicIdInUse.push(imgId);
						$gameScreen.showPicture(imgId, filename, 1, newX, newY, 100, 100, 0, 0);
						$gameScreen.movePicture(imgId, 1, newX, newY, 100, 100, newOpacity, 0, waitFrame);
						this.wait(waitFrame);
						this.mActiveBgIndex = 0;
				}

				ADV_System.prototype.deleteAllBg = function(){
					var imgId = paramBgPicIdBase;
					var waitFrame = 60;
					var oldX = Graphics.boxWidth/2;
					var oldY = Graphics.boxHeight/2;
					$gameScreen.movePicture(imgId, 1, oldX, oldY, 100, 100, 0, 0, waitFrame);
					$gameScreen.movePicture(imgId+1, 1, oldX, oldY, 100, 100, 0, 0, waitFrame);
					this.wait(waitFrame);
					this.mActiveBgIndex = -1;

				}
		}
		//***************************************************************
		// Internal Process
		//***************************************************************
		ADV_System.prototype.chomp = function(str) {
				return str.replace(/[\n\r]/g,"");
		}

		ADV_System.prototype.localFileDirectoryPath = function() {
				var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/scenario/');
				if (path.match(/^\/([A-Z]\:)/)) {
						path = path.slice(1);
				}
				return decodeURIComponent(path);
		}

		ADV_System.prototype.resetStack = function() {
				this.mStack = [];
		}

		ADV_System.prototype.resetMesOption = function(){
				this.mWindowBack = paramWindowType;
				this.mWindowPos  = paramWindowPosition;
		}

    ADV_System.prototype.update = function(){
        if(!this.mRun) return;// システム実行中じゃない
        if(this.updateWaitCount() || this.updateWait()) return;// 何かの処理待ち中
        this.stackRun();
    }

		ADV_System.prototype.updateWait = function() {
				var waiting = false;
				switch (this.mWaitMode) {
						case 'message':
								waiting = $gameMessage.isBusy();
								break;
						case 'transfer':
								waiting = $gamePlayer.isTransferring();
								break;
						case 'scroll':
								waiting = $gameMap.isScrolling();
								break;
						case 'route':
								waiting = this.mWaitData.isMoveRouteForcing();
								break;
						case 'animation':
								waiting = this.mWaitData.isAnimationPlaying();
								break;
						case 'balloon':
								waiting = this.mWaitData.isBalloonPlaying();
								break;
						case 'gather':
								waiting = $gamePlayer.areFollowersGathering();
								break;
						case 'action':
								waiting = BattleManager.isActionForced();
								break;
						case 'video':
								waiting = Graphics.isVideoPlaying();
								break;
						case 'image':
								waiting = !ImageManager.isReady();
								break;
				}
				if (!waiting) {
						this.mWaitMode = '';
						this.mWaitData = null;
				}
				return waiting;
		}

		ADV_System.prototype.updateWaitCount = function() {
				if (this.mWaitCount > 0) {
						this.mWaitCount--;
						return true;
				}
				return false;
		}

		ADV_System.prototype.wait = function(duration) {
			this.mWaitCount = duration;
		}

		//***************************************************************
		// non adv class
		//***************************************************************
    	var _ritzadv_DataManager_createGameObjects = DataManager.createGameObjects;
    	DataManager.createGameObjects = function() {
    		_ritzadv_DataManager_createGameObjects.call(this);
    		$advSystem = new ADV_System();
    	};

			var _ritzadv_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
			Game_Interpreter.prototype.pluginCommand = function (command, args) {
					_ritzadv_Game_Interpreter_pluginCommand.call(this, command, args);
					if (command === 'AdvLoad') {
							$advSystem.loadScript(args[0]);
					}
			};

    	var _ritzadv_Game_Map_update = Game_Map.prototype.update;
    	Game_Map.prototype.update = function(sceneActive) {
	    		_ritzadv_Game_Map_update.call(this,sceneActive);
	    		$advSystem.update();
    	};

    	var _ritzadv_Game_Interpreter_initialize = Game_Interpreter.prototype.initialize;
    	Game_Interpreter.prototype.initialize = function(depth) {
    		_ritzadv_Game_Interpreter_initialize.call(this,depth);
    		this._mAdvRun = false;
    	};

    	// overwrite
    	Game_Interpreter.prototype.updateWait = function() {
	    		//return this.updateWaitCount() || this.updateWaitMode();
	    		return this.updateWaitCount() || this.updateWaitMode() || this._mAdvRun;
    	};

    	// New
    	Game_Interpreter.prototype.setAdvRun = function(flag) {
	    		this._mAdvRun = flag;
	    		if (this._childInterpreter) this._childInterpreter.setAdvRun(flag);
    	};


})();
