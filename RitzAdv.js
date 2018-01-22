//=============================================================================
// RitzAdv.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017 atelier_ritz
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.3 2018/01/21 The spaces at the beginning of each line will be displayed all at once.
// 1.1.2 2018/01/20 Behavior changed: "end" macro won't erase msgbox anymore.
// 1.1.1 2018/01/18 Added image preload when reading a scenario file.
// 1.1.0 2018/01/18 Fixed an issue that scenarios cannot be loaded on a browser.
// 1.0.2 2017/12/28 Rewrote adjustTextLayout().
// 1.0.1 2017/12/28 Fixed inconsistence use of spaces and tabs.
// 1.0.0 2017/12/24 First Version.
// 0.0.1 2017/12/12 Start development.
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/atelier_ritz
// [GitHub] : https://github.com/atelier-ritz
//=============================================================================

/*:
 * @plugindesc Creating galgame-style events from .txt format scripts.
 * @author atelier_ritz
 *
 * @param MessageFormat
 * @desc [LEAVE THIS BLANK]
 * @default
 * @param characterPerLine
 * @desc Number of characters per line. This includes indent spaces.
 * @type number
 * @default 27
 * @parent MessageFormat
 * @param nameIndent
 * @desc The indent (number of spaces) before a character's name.
 * @type number
 * @default 3
 * @parent MessageFormat
 * @param textIndent
 * @desc The indent (number of spaces) before each line.
 * @type number
 * @default 5
 * @parent MessageFormat
 * @param specialCharacters
 * @desc These characters will follow the last character even if characterPerLine is reached.
 * @type text
 * @default "%),:;]}｡｣ﾞﾟ。，、．：；゛゜ヽヾゝゞ々’”）〕］｝〉》」』】°′″℃￠％‰"
 * @parent MessageFormat
 * @param characterTextColor
 * @desc Set the color presets for main characters. Example: NameColorId, TextColorId, CharacterName.
 * @type struct<CharaColorPreset>
 * @default {"Preset0":"21,21,れいむ","Preset1":"27,27,れみりあ","Preset2":""}
 * @parent MessageFormat
 *
 * @param WindowSetting
 * @desc [LEAVE THIS BLANK]
 * @param windowType
 * @desc 0:normal, 1:black, 2:transparent. (default: 2)
 * @type Nnumber
 * @default 2
 * @parent WindowSetting
 * @param windowPosition
 * @desc 0:top, 1:mid, 2:bottom. (default: 2)
 * @type number
 * @default 2
 * @parent WindowSetting
 * @param windowPicName
 * @desc If windowType = 2, you can use an image as a message box. Call it with ＠msgbox in the script. (default: msgbox, this will read img/pictures/msgbox.png)
 * @type text
 * @default msgbox
 * @parent WindowSetting
 * @param windowPicPositionX
 * @desc Set the X position of the message box image. (Recommended: center x of the game)
 * @type number
 * @default 408
 * @parent WindowSetting
 * @param windowPicPositionY
 * @desc Set the Y position of the message box image. (Recommended: center y of the game)
 * @type number
 * @default 312
 * @parent WindowSetting
 *
 * @param GraphicSetting
 * @desc [LEAVE THIS BLANK]
 * @param charaPicIdStartFrom
 * @desc If set to 10, a new character image is assigned to 10, 11, 12, ... (default: 10)
 * @type number
 * @default 10
 * @parent GraphicSetting
 * @param bgPicIdStartFrom
 * @desc If set to 5, background image will use picture ID 5 and 6. (default: 5)
 * @type number
 * @default 5
 * @parent GraphicSetting
 * @param msgboxPicIdStartFrom
 * @desc If set to 80, message box image will use picture ID 80. (default: 80)
 * @type number
 * @default 80
 * @parent GraphicSetting
 * @param positionPresets
 * @desc Presets of character graphic positions.Example: xPosition, yPosition, presetName.
 * @type struct<PositionPreset>
 * @default {"Preset0":"430,430,center","Preset1":"80,430,left","Preset2":"630,430,right"}
 * @parent GraphicSetting
 * @param defaultCharaFadeFrame
 * @desc default number of frames at characters transitions
 * @type number
 * @default 20
 * @parent GraphicSetting
 * @param defaultBgFadeFrame
 * @desc default number of frames at background transitions
 * @type number
 * @default 30
 * @parent GraphicSetting
 * @param defaultMsgboxFadeFrame
 * @desc default number of frames at message box transitions
 * @type number
 * @default 30
 * @parent GraphicSetting
 * @param defaultSceneFadeFrame
 * @desc default number of frames of screen fadeIn / fadeOut command
 * @type number
 * @default 60
 * @parent GraphicSetting
 *
 * @param SoundSetting
 * @desc [LEAVE THIS BLANK]
 * @param voiceVolume
 * @desc default volume of voice audio files. (default: 100)
 * @type number
 * @default 100
 * @parent SoundSetting
 *
 * @help ツクールMVでギャルゲー風会話システムを作るプラグインです。
 * 専門ソフトの凝った演出よりも、ツクールMVのデフォルト機能を使用した扱いやすさ
 * をコンセプトにしています。最低限に以下の事した後、プラグインコマンドで「AdvLoad シナリオファイル名」で使えます。
 * シナリオファイルを<project>/scenario/に放り込む。
 * 画像ファイルを<project>/img/picturesに放り込む。
 * （あったら）ボイスファイルを<project>/audio/voiceに放り込む。
 *
 *　説明を読むよりも付属しているシナリオファイルを見た方が速いと思います。
 *
 *
 *
 *
 * 【シナリオ読み込み】
 *  <プロジェクトフォルダ>/scenario/の下に、fileName.txt置きます。プラグインコ
 *  マンドで「AdvLoad fileName」を記入すれば、スクリプトを実行します。
 * 【メッセージ関連】
 * 1.＠で始まるコマンドは一行に一つだけ。使用可能なコマンドは＠bgm、＠bgs、＠me、
 *   ＠se、＠chara、＠bg、＠msgbox、 *   ＠choice、＠jump、＠end、＠insert、
 *   ＠wait、＠fadein、＠fadeout。これらは覚えなくてもいいです：＠clearStack、
 *   ＠clearPicCache、＠voice、＠endg。関数macroRun()で追加することもできます。
 *   関数macroChange()でマクロコマンドを定義することが可能です。
 * 2.スクリプトの最後には必ず＠endを記入してください。これは使用したピクチャなど
 *   を削除するコマンドです。
 * 3.ナレーションと会話の2種類をサポートし、インデントを別々に調整しています（プ
 *   ラグインマネジャーで変更可）。デフォルトでは
 *   会話文に「」を含むのを想定して、少しずらしています。例はサンプル参照。
 * 【ボイス関連】
 * 1.キャラクターセリフと同時にボイスを再生できます。記入方法は[キャラクター名/ボ
 *   イスファイル名]「セリフ…」です。ボイスの再生はseを使用していますが、もしほか
 *   のボイスを再生中の場合それを止めて、新しいボイスだけを再生します。ボイスは
 *   audio/voice/フォルダ下においてください。
 * 【キャラクター表示関連】
 *  1.＠chara f=name 最低限これさえ記入すれば、img/pictures/name.pngを画面の真
 *    ん中に出現させます。f=name＠faceと記入すれば、もし名前がnameというキャラク
 *    ターが既に表示されていた場合、位置情報などを引き継いでグラフィックだけを変え
 *    ることができます。一つのキャラクターにたくさんの表情パターンがある場合使います。
 *  2.＠chara f=name＠face x=300 y=200 opacity=150 t=30　name＠face.pngを[x,y]
 *    位置に、透明度150にし、30フレームかけて移動します。
 *  3.＠chara f=name＠face pos=presetName name＠face.pngをプラグインマネジャーに
 *		設定した位置に移動させます。
 *  4.＠chara f=name＠face dx=40 name＠face.pngを右に40ピクセル移動させます。時
 *		間は指定されていないので、プラグインマネジャーのdefaultCharaFadeFrameを使います。
 *  5.＠chara f=name＠ name＠face.pngを退場させます。
 * 【背景関連】
 *  1.＠bg f=fileName t=30　背景img/pictures/fileName.pngを30フレームかけて表示
 *		します。時間を指定しなければ、プラグインマネジャーのdefaultBgFadeFrameを使います。
 *  2.背景が既に表示されている場合＠bg f=fileName2で背景をすり替えます。デフォルト
 *		では一枚しか背景を表示できない仕様になっています。
 *  3.＠bg　で背景を消去します。
 *  【サウンド関連】
 *  1.＠bgm(＠bgs ＠me ＠se) f=fileName pitch=90 vol=100　でサウンド再生します。pitch
 *		とvolは省略可能。
 *  2.＠bgm t=2000 で2秒かけてbgmをフェードアウトします。
 * 【ラベルジャンプ】
 *  1.*labelでラベルを定義できます。
 *  2.＠jump f=*label と記入することで、*labelに飛びます。ただし、上へ飛ぶことはできない。
 *  【他のスクリプトファイルを挿入】
 *  1.＠insert f=scriptName2　で、現在実行してるスクリプトの前に、scenario/scriptName2
 *		の内容を丸々挿入できます。scriptName2実行後元々のスクリプトを中断したところで再開します。
 * 【選択肢】
 *  1. ＠choice s1=選択肢表示内容A/*label1 s2=選択肢表示内容B/*label2 s3=選択肢表示内容C/*label3 ... （最大s6まで） default=0 cancel=-1
 *  2. 以上の記入で、<選択肢表示内容A>を選択した場合*label1に飛ぶ、という処理をしています。
 *			defaultタグとcancelタグは省略可能で、デフォルトカーソル位置、キャンセル可能かなどの設定。
 *  	 default : 0->None, 1-6>Choice ID 1-6, cancel  :-2->branch,-1->disallow, 0-5->Choice ID 1-6
 *  【実装されてない機能】
 *  1.最後に表示されたキャラクターを一番前に置く機能。キャラクターが重なるシチュエーション
 *		が多くないと判断したので。
 *  2.バックログやウィンドウの消去。
 *  3.画像の拡大縮小。
 *　4.変数操作、スイッチ操作、条件分岐。
 *  5.フォント変更。
 *  6.使用グラフィックのプリロード。新しい画像を表示する際、カクッとなります。
 * This plugin is released under the MIT License.
 */

 /*~struct~CharaColorPreset:
 * @param Preset0
 * @type text
 * @param Preset1
 * @type text
 * @param Preset2
 * @type text
 * @param Preset3
 * @type text
 * @param Preset4
 * @type text
 * @param Preset5
 * @type text
 * @param Preset6
 * @type text
 * @param Preset7
 * @type text
 * @param Preset8
 * @type text
 * @param Preset9
 * @type text
 * @param Preset10
 * @type text
 */
 /*~struct~PositionPreset:
 * @param Preset0
 * @type text
 * @param Preset1
 * @type text
 * @param Preset2
 * @type text
 * @param Preset3
 * @type text
 * @param Preset4
 * @type text
 * @param Preset5
 * @type text
 * @param Preset6
 * @type text
 * @param Preset7
 * @type text
 * @param Preset8
 * @type text
 * @param Preset9
 * @type text
 * @param Preset10
 * @type text
 */

(function() {
	const pluginName = 'RitzAdv';
	//=============================================================================
	// PluginManager Variables
	// Parameters obtained from the plugin manager
	//=============================================================================
	const myParameters             = PluginManager.parameters(pluginName);

	const paramNumCharPerLine      = Number(myParameters['characterPerLine']);
	const paramNameIndent          = Number(myParameters['nameIndent']);
	const paramTextIndent          = Number(myParameters['textIndent']);
	const paramSpecialCharacters   = String(myParameters['specialCharacters']);
	const paramCharaTextColor      = JSON.parse(myParameters['characterTextColor']);
	const paramWindowType          = Number(myParameters['windowType']);
	const paramWindowPosition      = Number(myParameters['windowPosition']);
	const paramWindowPicName       = String(myParameters['windowPicName']);
	const paramWindowDefPosX       = Number(myParameters['windowPicPositionX']);
	const paramWindowDefPosY       = Number(myParameters['windowPicPositionY']);
	const paramPosPreset           = JSON.parse(myParameters['positionPresets']);
	const paramCharaPicIdBase      = Number(myParameters['charaPicIdStartFrom']);
	const paramBgPicIdBase         = Number(myParameters['bgPicIdStartFrom']);
	const parammsgboxPicIdBase     = Number(myParameters['msgboxPicIdStartFrom']);
	const paramCharaFadeFrame      = Number(myParameters['defaultCharaFadeFrame']);
	const paramBgFadeFrame         = Number(myParameters['defaultBgFadeFrame']);
	const paramMsgboxFadeFrame     = Number(myParameters['defaultMsgboxFadeFrame']);
	const paramSceneFadeFrame      = Number(myParameters['defaultSceneFadeFrame']);
	const paramVoiceVolume         = Number(myParameters['voiceVolume']);

	//***************************************************************
	// ADV_System
	//***************************************************************
	function ADV_System() {
		this.initialize.apply(this, arguments);
	}

	ADV_System.NAME_INDENT = new Array(paramNameIndent + 1).join(' ');
	ADV_System.TEXT_INDENT= new Array(paramTextIndent + 1).join(' ');
	ADV_System.TEXT_COLOR_PRESET_NAME = [];
	ADV_System.TEXT_COLOR_PRESET_VALUE = [];
	ADV_System.POS_PRESET_NAME = [];
	ADV_System.POS_PRESET_VALUE = [];


	ADV_System.prototype.initialize = function(){
		this.mStack = [];
		this.mRun = false;
		this.mWaitMode = '';
		this.mWaitData = null;
		this.mWaitCount = 0;
		this.mWindowPicEnabled 	= false;
		this.mViewPictId = -1;
		//graphics
		this.mPicIdInUse = [];
		//characterGraphic
		this.mActiveActors = [];   // names of active actors on the screen
		this.mActiveActorsInfo = []; 	// imageId, name, xPos, yPos
		this.mActiveBgIndex = -1;		// active bg pic id offset. DO NOT change.

		for(var key in paramCharaTextColor){
			var temp = paramCharaTextColor[key].split(',');
			ADV_System.TEXT_COLOR_PRESET_NAME.push(temp[2]);
			ADV_System.TEXT_COLOR_PRESET_VALUE.push([Number(temp[0]),Number(temp[1])]);
		}

		for(var key in paramPosPreset){
			var temp = paramPosPreset[key].split(',');
			ADV_System.POS_PRESET_NAME.push(temp[2]);
			ADV_System.POS_PRESET_VALUE.push([Number(temp[0]),Number(temp[1])]);
		}
	};

	//***************************************************************
	// General
	//***************************************************************
	// load .txt file and store the converted commands at this.mStack
	ADV_System.prototype.loadScript = function(filename,reset) {
		if(reset === undefined) reset = true;
		if(reset) this.resetStack();
		var file_data = this.loadScenario(filename);
		var commandList = file_data.split('\n');
		var new_stack = [];
		// Preload images
		for(var i=0, len=commandList.length; i<len; i++){
			var text = commandList[i];
			text = this.chomp(text);
			text = text.trim();
			if(text.includes("@bg ",0) || text.includes("@chara ",0)){
				var macroLine = this.macroChange(this.chomp(text));
				macroLine = macroLine[0];
				var arg = this.makeArg(macroLine,{});
				if(arg["f"].substr(-1) != "@") ImageManager.requestPicture(arg["f"]);
			}else{
				continue;
			}
		}
		for(var i=0, len=commandList.length; i<len; i++){
			var text = commandList[i];
			var add_stack = [];
			text = this.chomp(text);
			text = text.trim();
			// empty
			if(text.trim() == "" || text.trim() == '\r') continue;
			// comments
			if(text.charAt(0) == ';') continue;
			//macro
			if(text.charAt(0) == '@'){
					add_stack = this.macroChange(this.chomp(text));
			//label
			}else if(text.charAt(0) == '*'){
					add_stack = this.macroChange(this.chomp(text));
			// text
			}else{
				var add_text = text;
				if(add_text.indexOf('/') != -1){
					var voiceFileName = add_text.slice(add_text.indexOf('/')+1,add_text.indexOf(']'));
					add_stack.push('@voice f=' + voiceFileName);
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
		while( stack && stack.charAt(0) == '*' ){
			this.mStack.shift();
			stack = this.mStack[0];
		}
		if(!stack){
			this.mRun = false;
			$gameMap._interpreter.setAdvRun(false);
			return;
		}
		if(stack.charAt(0) == '@'){
			var macroCommand = this.mStack.shift();
			this.macroRun(macroCommand)
		}else{
			this.showMessage();
		}
	}

	// show message
	ADV_System.prototype.showMessage = function() {
		var text = this.mStack.shift();
		$gameMessage.setBackground(paramWindowType);
		$gameMessage.setPositionType(paramWindowPosition);
		$gameMessage.add(text);
		var stack = this.mStack[0];
		// hold the text if the next stack is choice
		if(stack && (stack.indexOf('@choice') != -1)){
			this.stackRun();
		}
		this.mWaitMode = 'message';
	}

	// run lines that start with @
	ADV_System.prototype.macroRun = function(macro) {
		var argument = {};
		if(macro.indexOf('@bgm ') != -1){
			argument = this.makeArg(macro,{pan:0, pitch:100, vol:90, t:1000});
			argument['name'] 		= argument['f'];
			if(argument['name']){
				AudioManager.playBgm(argument);
			}else{
				var sec_fadeOut = Math.floor(argument['t'] / 1000);
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
			if(argument['name']){
				AudioManager.playSe(argument);
			}else{
				AudioManager.stopSe();
			}
		}else if(macro == '@se'){
			AudioManager.stopSe();
		}

		if(macro.indexOf('@voice ') != -1){
			argument = this.makeArg(macro,{pan:0, pitch:100, vol:90});
			argument['name'] = argument['f'];
			if(argument['name']){
				AudioManager.stopVoice();
				AudioManager.playVoice(argument);
			}
		}

		if(macro.indexOf('@me ') != -1){
			argument = this.makeArg(macro,{pan:0, pitch:100, vol:90});
			argument['name'] = argument['f'];
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
			if( argument['name'] ){
				AudioManager.playBgs(argument);
			}else{
				var sec_fadeOut = Math.floor(argument['t'] / 1000);
				AudioManager.fadeOutBgs(sec_fadeOut);
			}
		}else if( macro == '@bgs' ){
			var sec_fadeOut = 1;
			argument['t'] = sec_fadeOut;
			AudioManager.fadeOutBgs(argument['t']);
		}

		if(macro.indexOf('@chara ') != -1){
			argument = this.makeArg(macro,{opacity:255, t:paramCharaFadeFrame});
			if(argument['f'] == null) return;
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
			argument = this.makeArg(macro,{x:Graphics.boxWidth/2, y:Graphics.boxHeight/2, opacity:255, t:paramBgFadeFrame});
			if(argument['f'] == null) return;
			this.loadBg(argument);
		}else if(macro == '@bg'){
			this.deleteAllBg();
		}

		if(macro.indexOf('@msgbox') != -1){
			if(paramWindowType != 2) return;
			argument = this.makeArg(macro,{x:paramWindowDefPosX, y:paramWindowDefPosY, opacity:255, f:paramWindowPicName, t:paramMsgboxFadeFrame});
			if(!this.mWindowPicEnabled){
				this.loadMsgbox(argument);
			}else{
				this.deleteMsgbox(argument);
			}
		}

		if(macro.indexOf('@choice ') != -1){
			//default : 0->None, 1-6>Choice ID 1-6
			//cancel  :-2->branch,-1->disallow, 0-5->Choice ID 1-6
			argument = this.makeArg(macro,{back:0, position:2, default:0, cancel:-1});
			var selectArgs = ['s1','s2','s3','s4','s5','s6'];
			var choiceText = [];
			var targetLabels = [];
			for(var i=0, length=selectArgs.length; i<length; i++){
				var arg = selectArgs[i];
				if(argument[arg]){
					var sel_data = argument[arg].split('/');
					choiceText.push(sel_data[0]);
					targetLabels.push(sel_data[1]);
				}
			}
			if(choiceText.length == 0) return;
			$gameMessage.setChoices(choiceText, Number(argument['default']), Number(argument['cancel']) );
			$gameMessage.setChoiceBackground(Number(argument['back']));
			$gameMessage.setChoicePositionType(Number(argument['position']));
			$gameMessage.setChoiceCallback(function(n) {
				this.jumpLabel(targetLabels[n]);
			}.bind(this));
			this.mWaitMode = 'message';
		}

		if(macro.indexOf('@jump ') != -1){
			argument = this.makeArg(macro,{});
			if(argument['f'] == null) return;
			if( argument['f'] ){
				this.jumpLabel(argument['f']);
			}
		}

		if(macro.indexOf('@insert ') != -1){
			argument = this.makeArg(macro,{});
			if(argument['f'] == null) return;
			if(argument['f']){
				this.loadScript(argument['f'], false);
			}
		}

		if(macro == '@clearPicCache'){
			this.clearPicCache()
		}

		if(macro.indexOf('@wait ') != -1){
			argument = this.makeArg(macro,{});
			if(argument['t'] == null) return;
			var waitFrame = argument['t'];
			this.wait(waitFrame);
		}

		if(macro.indexOf('@fadein') != -1){
			argument = this.makeArg(macro,{t:paramSceneFadeFrame});
			var waitFrame = argument['t'];
			$gameScreen.startFadeIn(waitFrame);
			this.wait(waitFrame);
		}

		if(macro.indexOf('@fadeout') != -1){
			argument = this.makeArg(macro,{t:paramSceneFadeFrame});
			var waitFrame = argument['t'];
			$gameScreen.startFadeOut(waitFrame);
			this.wait(waitFrame);
		}

		if( macro.indexOf('@clearStack') != -1 ){
			this.resetStack();
		}
	}

	// set a MACRO that consists of many "macros"
	ADV_System.prototype.macroChange = function(macro){
		var c_macro = [];
		if(macro == '@endg'){
			argument = this.makeArg(macro,{});
			c_macro.push('@chara');
			c_macro.push('@bg');
			c_macro.push('@clearPicCache');
			c_macro.push('@clearStack');
		}else if(macro == '@end'){
			c_macro.push('@bgm');
			c_macro.push('@bgs');
			c_macro.push('@me');
			c_macro.push('@chara');
			c_macro.push('@bg');
			c_macro.push('@clearPicCache');
			c_macro.push('@clearStack');
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
			var arg = list[i].split('=');
			var key = arg.shift();
			arg = arg.join('=');
			output[key] = arg;
		}
		// if not defined in macro, use values in init
		for(key in init){
			if(output[key] == null)	output[key] = init[key];
		}
		if(output['pos'] != null){
			var presetName 	= output['pos'];
			var presetId 	 	= ADV_System.POS_PRESET_NAME.indexOf(presetName);
			output['x'] 		= ADV_System.POS_PRESET_VALUE[presetId][0];
			output['y'] 		= ADV_System.POS_PRESET_VALUE[presetId][1];
		}
		if(output['f'] != null)       output['f']         = String(output['f']);
		if(output['x'] != null)       output['x']         = Number(output['x']);
		if(output['y'] != null)       output['y']         = Number(output['y']);
		if(output['dx'] != null)      output['dx']        = Number(output['dx']);
		if(output['dy'] != null)      output['dy']        = Number(output['dy']);
		if(output['opacity'] != null) output['opacity']   = Number(output['opacity']);
		if(output['t'] != null)       output['t']         = Number(output['t']);
		if(output['pitch'] != null)   output['pitch']     = Number(output['pitch']);
		if(output['vol'] != null)     output['volume']    = Number(output['vol']);
		return output;
	}

	ADV_System.prototype.adjustTextLayout = function(text){
		// process indent and name
		var output = "";
		var cnt = ADV_System.TEXT_INDENT.length + 2;//# of characters in the current line
		var includeName = (text[0] == "[") ? true : false;
		if(includeName){
			var namePrefix = "";
			var nameSuffix = "";
			var name = text.split(']')[0].slice(1);
			var words = text.substring(text.indexOf(']')+1);
			var nameOutput = namePrefix + name + nameSuffix;
			var colorIndex = ADV_System.TEXT_COLOR_PRESET_NAME.indexOf(name);
			if(colorIndex != -1){
				var nameColor = ADV_System.TEXT_COLOR_PRESET_VALUE[colorIndex][0];
				var textColor = ADV_System.TEXT_COLOR_PRESET_VALUE[colorIndex][1];
				nameOutput = "\\c["+nameColor+"]" + nameOutput + "\\c["+textColor+"]";
			}
			output += "\\>" + ADV_System.NAME_INDENT + "\\<" + nameOutput + "\n" + "\\>" + ADV_System.TEXT_INDENT + "\\<";
			cnt = ADV_System.TEXT_INDENT.length;
		}else{
			var words = text;
			output += "\n" + "\\>" + ADV_System.TEXT_INDENT + "\\<";
			cnt -= 1;
		}
		// process main lines
		for(var i=0, length=words.length; i<length; i++){
			var c = words[i];
			if(c == "\\"){
				var rest = words.substring(i);
				var regexp1 = /^\\[a-zA-Z]+\[\d+\]/;
				var regexp2 = /^\\[|\\\}\{\>\<\^\!\.${]/;
				var match = rest.match(regexp1) || rest.match(regexp2);
				var escape = match[0];
				if(escape){
					output += escape;
					i += escape.length - 1;
				}
			}else if(cnt < paramNumCharPerLine || paramSpecialCharacters.indexOf(c) != -1){
				output += c;
				cnt++;
			}else{
				output += "\n" + "\\>" + ADV_System.TEXT_INDENT + "  " + "\\<"+ c;
				cnt = ADV_System.TEXT_INDENT.length + 2;
			}
		}
		return output;
	}

	// strip "/voice" from [name/voice]
	ADV_System.prototype.nameVoiceCut = function(text) {
		var output = text;
		if(text.indexOf('/') != -1 && text.indexOf('[') != -1 && text.indexOf(']') != -1){
			var name = text.split(']');
			var new_name = name[0];
			new_name = new_name.split('/');
			output = text.replace(name[0], new_name[0]);
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
			if(data.dx != null) newX += data.dx;
			if(data.dy != null) newY += data.dy;
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
			$gameScreen.showPicture(imgId, filename, 1, newX, newY, 100, 100, 0, 0);
			$gameScreen.movePicture(imgId, 1, newX, newY, 100, 100, newOpacity, 0, waitFrame);
			this.wait(waitFrame);
			$gameScreen.movePicture(imgId-1, 1, newX, newY, 100, 100, 0, 0, 0);
			this.mActiveBgIndex = 1;
		}else if(index == 1){
			var imgId = paramBgPicIdBase;
			$gameScreen.showPicture(imgId, filename, 1, newX, newY, 100, 100, 255, 0);
			$gameScreen.movePicture(imgId+1, 1, newX, newY, 100, 100, 0, 0, waitFrame);
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

	ADV_System.prototype.loadMsgbox = function(data){
		var filename = data.f;
		var imgId = parammsgboxPicIdBase;
		var newX = data.x;
		var newY = data.y;
		var newOpacity = data.opacity;
		var waitFrame = data.t;
		this.mPicIdInUse.push(imgId);
		this.mWindowPicEnabled = true;
		$gameScreen.showPicture(imgId, filename, 1, newX, newY, 100, 100, 0, 0);
		$gameScreen.movePicture(imgId, 1, newX, newY, 100, 100, newOpacity, 0, waitFrame);
		this.wait(waitFrame);
	}

	ADV_System.prototype.deleteMsgbox = function(data){
		var imgId = parammsgboxPicIdBase;
		var newX = data.x;
		var newY = data.y;
		var waitFrame = data.t;
		this.mWindowPicEnabled = false;
		$gameScreen.movePicture(imgId, 1, newX, newY, 100, 100, 0, 0, waitFrame);
		this.wait(waitFrame);
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

	ADV_System.prototype.loadScenario = function(filename) {
		url = this.localFileDirectoryPath() + filename + '.txt';
		// PC: access via FileSystem
		if(Utils.isNwjs()){
			var fs = require('fs');
			var file_data = fs.readFileSync(url, 'utf-8');
			return file_data;
		}else{
		// Browser: access via xhr
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
				if (xhr.readyState === 4){  // Makes sure the document is ready to parse.
					if(xhr.status === 200){  // Makes sure it's found the file.
						return xhr.responseText;
				    }
				}
			}
			xhr.open('GET', url, false);
			xhr.send(null);
			var file_data = xhr.onreadystatechange();
			return file_data;
		}
	};

	ADV_System.prototype.resetStack = function() {
		this.mStack = [];
	}

	ADV_System.prototype.jumpLabel = function(label) {
		var stack = this.mStack[0];
		while(stack && stack != label){
				this.mStack.shift();
				stack = this.mStack[0];
		}
	}

    ADV_System.prototype.update = function(){
        if(!this.mRun) return;// adv system is not running
        if(this.updateWaitCount() || this.updateWait()) return;// return while processing
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

	AudioManager.playVoice = function(voice) {
		if (voice.name) {
			this._seBuffers = this._seBuffers.filter(function(audio) {
    			if(audio._url.indexOf('/voice/') != -1){
    				return audio.isPlaying();
    			}
    			return true;
			});
			var buffer = this.createBuffer('voice', voice.name);
			this.updateVoiceParameters(buffer, voice);
			buffer.play(false);
			this._seBuffers.push(buffer);
		}
	};

	AudioManager.stopVoice = function() {
    	this._seBuffers.forEach(function(buffer) {
			if( buffer._url.indexOf('/voice/') != -1 ){
				buffer.stop();
			}
    	});
	};

	AudioManager.updateVoiceParameters = function(buffer, voice) {
		this.updateBufferParameters(buffer, paramVoiceVolume, voice);
	};

})();
