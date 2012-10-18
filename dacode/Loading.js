var ASSET_MANAGER = new window.AssetManager();
var imgSpriteCocoLoading = new Image();
var spriteCocoLoading;
var ctxL;
var frame = 0;

var ctxA;
var bufferAudio = null;


function load(){
	canvasL = document.getElementById('loadingCanvas');
	ctxL = canvasL.getContext("2d");
	ctxL.globalAlpha = 0.8;
	ctxL.fillStyle = '#000000';
	ctxL.fillRect(0, 0, 975, 950);
	
	imgSpriteCocoLoading.src = 'picz/loadingSprite.png';

	imgSpriteCocoLoading.onload = startLoadWebSite;
}

function incrementLoading(){
	spriteCocoLoading.render( ctxL, 475, 450, frame );
	frame++;
}

function startLoadWebSite(){
	spriteCocoLoading = new Sprite( imgSpriteCocoLoading, 30, 5, 6 );

	ctxL.save();
		ctxL.fillStyle = '#c9e726';
		ctxL.fillText('Loading...', 455,600);
	ctxL.restore();

	incrementLoading();
	loadImages();
}

function loadImages(){
	ASSET_MANAGER.queueDownload('picz/0.png');
	ASSET_MANAGER.queueDownload('picz/1.png');
	ASSET_MANAGER.queueDownload('picz/2.png');
	ASSET_MANAGER.queueDownload('picz/banner.svg');
	ASSET_MANAGER.queueDownload('picz/chrome.svg');
	ASSET_MANAGER.queueDownload('picz/coconut.png');
	ASSET_MANAGER.queueDownload('picz/html5logo.svg');
	ASSET_MANAGER.queueDownload('picz/lime.png');
	ASSET_MANAGER.queueDownload('picz/reset.svg');
	ASSET_MANAGER.queueDownload('picz/reset_clic.svg');
	ASSET_MANAGER.queueDownload('picz/reset_hover.svg');
	ASSET_MANAGER.queueDownload('picz/speaker.svg');
		
	ASSET_MANAGER.downloadAll(function() {
		incrementLoading();
		buildUI();
	});
}

function buildUI(){
	$('#container').append('<div id="header"></div>');
		$('#header').append('<div id="html5Logo"></div>');
		$('#header').append('<div id="soundLogo"></div>');
		$('#header').append('<div id="bannerImage"></div>');
		$('#header').append('<div id="chromeLogo"></div>');
		$('#header').append('<div id="resetButton"></div>');
	$('#container').append('<div id="content"></div>');
		$('#content').append('<div id="gameContainer"></div>');
			$('#gameContainer').append('<canvas id="lightsCanvas" oncontextmenu="return false;" width="800" height="800"></canvas>');
			$('#gameContainer').append('<canvas id="gameCanvas" oncontextmenu="return false;" width="800" height="800"></canvas>');

	$("#resetButton").click(function() {
	  //Reset !
		for (var i = 0; i < 16; i++) {
			for (var j = 0; j < 16; j++){
				coconutMatrix[i][j] = 0;
			}
		}
		commander = false;
		LIGHT_color = 'rgba(255,127,0,0.07)' //ORANGE
	});

	$('#html5Logo').click(function(){
		if (!commander) $('#loadingCanvas').fadeIn('slow');
		
		if (!localExecution){
			var source = ctxA.createBufferSource(); 	// creates a sound source
			source.buffer = bufferAudio.bufferList[32];  // tell the source which sound to play
			source.connect(ctxA.destination);       	// connect the source to the context's destination (the speakers)
			source.gain.value = 0.2;
			source.noteOn(0);                       	// play the source now	
		}
		//Reset !
		for (var i = 0; i < 16; i++) {
			for (var j = 0; j < 16; j++){
				coconutMatrix[i][j] = 0;
			}
		}
		LIGHT_color = 'rgba(255,0,127,0.07)' //PINKY
		if (!commander) setTimeout(bonusModeCommander, 5000);
	});

	function bonusModeCommander(){
		$('#loadingCanvas').fadeOut('slow');
		commander = true;
	}

	preloadGame();
}

function preloadGame(){
	init();
	if (localExecution){ 
		finishedLoading();
	} else {
		loadSounds();
	}
}

function loadSounds(){
  ctxA = new webkitAudioContext();

  bufferAudio = new BufferLoader(
    ctxA,
    [
    	'soundsystem/0.wav',
      	'soundsystem/1.wav',
      	'soundsystem/2.wav',
      	'soundsystem/3.wav',
      	'soundsystem/4.wav',
      	'soundsystem/5.wav',
    	'soundsystem/6.wav',
      	'soundsystem/7.wav',
      	'soundsystem/8.wav',
      	'soundsystem/9.wav',
      	'soundsystem/10.wav',
      	'soundsystem/11.wav',
    	'soundsystem/12.wav',
      	'soundsystem/13.wav',
      	'soundsystem/14.wav',
      	'soundsystem/15.wav',
      	'soundsystem/Commander/0.wav',
      	'soundsystem/Commander/1.wav',
      	'soundsystem/Commander/2.wav',
      	'soundsystem/Commander/3.wav',
      	'soundsystem/Commander/4.wav',
      	'soundsystem/Commander/5.wav',
      	'soundsystem/Commander/6.wav',
      	'soundsystem/Commander/7.wav',
      	'soundsystem/Commander/8.wav',
      	'soundsystem/Commander/9.wav',
      	'soundsystem/Commander/10.wav',
      	'soundsystem/Commander/11.wav',
      	'soundsystem/Commander/12.wav',
      	'soundsystem/Commander/13.wav',
      	'soundsystem/Commander/14.wav',
      	'soundsystem/Commander/15.wav',    
      	'soundsystem/Commander/bonjour.wav'      	
    ],
    	finishedLoading
    );

  	bufferAudio.load();
}

function finishedLoading() {
	startGame();
}

function startGame(){
	$('#loadingCanvas').fadeOut('slow');
	start();
}