var localExecution = false;

var commander = false;
var tickProgress = 0;

//Graphical
var canvas;
var canvasBG;
var canvasL;

var ctx;
var ctxBG;
var ctxL;

var lastTick = 0;
LIGHT_color = 'rgba(255,127,0,0.07)' //ORANGE

// shim layer with setTimeout fallback
window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     || 
		  function( callback ){
			window.setTimeout(callback, 1000 / 10);
		  };
})();


var longClic = false;
var lastCoconutFilled = {i:null,j:null};
var stateFirstCoconutFilled = 0;

var coconutMatrix = new Array();
for (var i = 0; i < 16; i++) {
	coconutMatrix[i] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
}

/****************************************GAMEPLAY***************************************************/

/*Determine l'emplacement sur la matrice de l'endroit clické*/
function detCoconut(coords){
	var x = coords.x - GRID_OFFSET;
	var y = coords.y - GRID_OFFSET;
	
	var i = Math.floor(x / SIZE_CELL);
	var j = Math.floor(y / SIZE_CELL);

	var coconut = {i:null, j:null};
	coconut.i = i;
	coconut.j = j;
	
	if ((coconut.i>=0)&&(coconut.i<=15)&&(coconut.j>=0)&&(coconut.j<=15)) return (coconut);
	else return (null);
};

//Met à jour la matrice en fonction d'une coconut.
function updateCoconutMatrix(coconut, rightclick){	
	if ((coconut.i>=0)&&(coconut.i<=15)&&(coconut.j>=0)&&(coconut.j<=15)) {
		if (!rightclick){
			if (coconutMatrix[coconut.i][coconut.j] > 1) {
				coconutMatrix[coconut.i][coconut.j] = 0;
			}
			else {
				coconutMatrix[coconut.i][coconut.j] ++;
			}
			//tickGraphical();
		}
		else{
			if (coconutMatrix[coconut.i][coconut.j] < 1) {
				coconutMatrix[coconut.i][coconut.j] = 2;
			}
			else {
				coconutMatrix[coconut.i][coconut.j] --;
			}
			//tickGraphical();
		}
	}
}

var press = function (e) {
	longClic = true;
	
	var totalOffsetX = 0;
	var totalOffsetY = 0;
	var canvasX = 0;
	var canvasY = 0;
	var currentElement = this;

	do{
		totalOffsetX += currentElement.offsetLeft;
		totalOffsetY += currentElement.offsetTop;
	}
	while(currentElement = currentElement.offsetParent)

	canvasX = e.pageX - totalOffsetX ;
	canvasY = e.pageY - totalOffsetY ;
	
	var rightclick;
    if (e.which)
		rightclick = (e.which == 3);
    else if (e.button) 
		rightclick = (e.button == 2);	
	
	if (lastCoconutFilled = detCoconut({x:canvasX, y:canvasY})){
		stateFirstCoconutFilled = coconutMatrix[lastCoconutFilled.i][lastCoconutFilled.j];
		updateCoconutMatrix(lastCoconutFilled, rightclick);
	}
}

drag = function (e) {
	var totalOffsetX = 0;
	var totalOffsetY = 0;
	var canvasX = 0;
	var canvasY = 0;
	var currentElement = this;

	do{
		totalOffsetX += currentElement.offsetLeft;
		totalOffsetY += currentElement.offsetTop;
	}
	while(currentElement = currentElement.offsetParent)

	canvasX = e.pageX - totalOffsetX ;
	canvasY = e.pageY - totalOffsetY ;

	var rightclick;
    if (e.which)
		rightclick = (e.which == 3);
    else if (e.button) 
		rightclick = (e.button == 2);	
		
	if (longClic){
		var currentCoconut = null;
		if (currentCoconut = detCoconut({x:canvasX, y:canvasY})){		
			if ((currentCoconut.i != lastCoconutFilled.i)||(currentCoconut.j != lastCoconutFilled.j)){
				if (stateFirstCoconutFilled ==  coconutMatrix[currentCoconut.i][currentCoconut.j]) {
					lastCoconutFilled = currentCoconut;
					updateCoconutMatrix(lastCoconutFilled, rightclick);
				}
			}
		}
	}
	
	// Prevent the whole page from dragging if on mobile
	e.preventDefault();
}

release = function (e){
	longClic = false;
}

cancel = function (e){
	longClic = false;
}

function init(){
	// On récupère l'objet canvas
	canvas = document.getElementById('gameCanvas');
	if (!canvas || !canvas.getContext) {
		return;
	}
	
	canvasBG = document.getElementById('lightsCanvas');
	if (!canvasBG || !canvasBG.getContext) {
		return;
	}
	ctxBG = canvasBG.getContext("2d");
	//ctxBG.globalAlpha = 0.8;
	
	// Add mouse event listeners to canvas element
	canvas.addEventListener("mousedown", press, false);
	canvas.addEventListener("mousemove", drag, false);
	canvas.addEventListener("mouseup", release);
	canvas.addEventListener("mouseout", cancel, false);

	// Add touch event listeners to canvas element
	canvas.addEventListener("touchstart", press, false);
	canvas.addEventListener("touchmove", drag, false);
	canvas.addEventListener("touchend", release, false);
	canvas.addEventListener("touchcancel", cancel, false);

	// On récupère le contexte 2D
	ctx = canvas.getContext('2d');
	if (!ctx) {
		return;
	}
	ctx.globalAlpha = 1;
	
	try {
		ctxA = new webkitAudioContext();
	}
	catch(e) {
		ctxL.save();
			ctxL.fillStyle = '#c9e726';
			ctxL.fillText('Your browser is not compatible, sorry', 400,700);
			ctxL.fillText('You can use Chrome', 435,720);
		ctxL.restore();
	}
	
	var xPos = 0;
	var yPos = 0;
	
	//Clear du canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	var spriteEmptyCoconut = ASSET_MANAGER.getAsset('picz/0.png');
		   
	//Boucles pour dessiner la matrice de base (16*16) cf. tonematrix.audiotool.com/
	for (i=0 ; i< CELL_NUMBER ; i++){
		for (j=0 ; j< CELL_NUMBER ; j++){  
			//On commence par calculer la position à laquelle on doit placer le carré
			xPos = i * SIZE_CELL + GRID_OFFSET;
			yPos = j * SIZE_CELL + GRID_OFFSET;
					
			//carré coconut
			ctx.strokeRect(xPos, yPos, SIZE_CELL_PIX, SIZE_CELL_PIX);
			//carré lights
			blocks.push(new block(new vector(xPos,yPos),SIZE_CELL_PIX,SIZE_CELL_PIX));
			
			//coconut
			//ctx.drawImage(spriteEmptyCoconut, xPos - spriteEmptyCoconut.width/2 +48, yPos - spriteEmptyCoconut.height/2+40, 50, 35);
			ctx.drawImage(spriteEmptyCoconut, xPos, yPos, SIZE_CELL_PIX, SIZE_CELL_PIX);
		}
	}
	//lights.push(new light(new vector(42+3+21,21), 500, 360, 'rgba(255,255,255,0.07)'));	
	lights.push(new light(new vector(42+3+21,21), 800, 360, LIGHT_color));
}

function start(){
	var musicalLoop = setInterval(render, 1000/5); //200ms/tick = 3200ms pour 16 ticks
	var graphicalLoop = setInterval(tickGraphical, 1000/10);
	//renderAnimation();
}

function render(){
	lastTick = Date.now;
	tickMusical();
	
	lights[0].position.x += 45;
}

function renderAnimation() {
	var delta = new Date() - lastTick;
	lights[0].position.x += (delta*45)/200;
	renderLight();
	requestAnimationFrame(renderAnimation);
}

function renderLight(){
	draw();
	if (lights[0].position.x>=759-21) lights[0].position.x = 21;
}

function tickMusical() {	
	//j is the setting 4 the volume
	//coconutMatrix[tickProgress][j] c'est la note t'entends !
	//voir pour stocker le résultat, genre on ne lit max que les 3 notes à la fois !
	renderLight();
	
	if (!localExecution) {
		for (var j = 0; j < coconutMatrix.length; j++) {
			var source = ctxA.createBufferSource(1, 1048,44100);
			switch(coconutMatrix[tickProgress][j]){
				case 0:
					//RIEN
				break;
				case 1:
					//Volume 01		
					//var source = ctxA.createBufferSource(); 	// creates a sound source
					if (commander) source.buffer = bufferAudio.bufferList[j+16];
					else source.buffer = bufferAudio.bufferList[j];  // tell the source which sound to play
					source.connect(ctxA.destination);       	// connect the source to the context's destination (the speakers)
					source.gain.value = 0.1;
					source.noteOn(0);                       	// play the source now	
				break;
				case 2:
					//Volume 02
					//var source = ctxA.createBufferSource(); 	// creates a sound source
					if (commander) source.buffer = bufferAudio.bufferList[j+16];
					else source.buffer = bufferAudio.bufferList[j];  // tell the source which sound to play
					source.connect(ctxA.destination);       	// connect the source to the context's destination (the speakers)
					source.gain.value = 0.2;
					source.noteOn(0);                       	// play the source now	
				break;
				default:
					//RIEN
				break;
			}
		}
	}
	
	tickProgress++;
	if (tickProgress >= 16){
		tickProgress=0;
	}
	return true;
}


function tickGraphical() {
	var spriteEmptyCoconut 	= ASSET_MANAGER.getAsset('picz/0.png');
	var sprite1Coconut 		= ASSET_MANAGER.getAsset('picz/1.png');
	var sprite2Coconut 		= ASSET_MANAGER.getAsset('picz/2.png');


	for (var i = 0; i < coconutMatrix.length; i++) {
		for (var j = 0; j < coconutMatrix.length; j++) {
			ctx.clearRect(i*SIZE_CELL+GRID_OFFSET, j*SIZE_CELL+GRID_OFFSET, SIZE_CELL_PIX, SIZE_CELL_PIX);
			switch(coconutMatrix[i][j]){
				case 0:
					ctx.drawImage(spriteEmptyCoconut, i*SIZE_CELL+GRID_OFFSET, j*SIZE_CELL+GRID_OFFSET, SIZE_CELL_PIX, SIZE_CELL_PIX);
				break;
				case 1:
					if(tickProgress == i){
						ctx.drawImage(sprite1Coconut, (i*SIZE_CELL+GRID_OFFSET)+3, (j*SIZE_CELL+GRID_OFFSET)+3, SIZE_CELL_PIX-6, SIZE_CELL_PIX-6);
					}
					else {
						ctx.drawImage(sprite1Coconut, i*SIZE_CELL+GRID_OFFSET, j*SIZE_CELL+GRID_OFFSET, SIZE_CELL_PIX, SIZE_CELL_PIX);
					}
				break;
				case 2:
					if(tickProgress == i){
						ctx.drawImage(sprite2Coconut, (i*SIZE_CELL+GRID_OFFSET)+3, (j*SIZE_CELL+GRID_OFFSET)+3, SIZE_CELL_PIX-6, SIZE_CELL_PIX-6);
					}
					else {
						ctx.drawImage(sprite2Coconut, i*SIZE_CELL+GRID_OFFSET, j*SIZE_CELL+GRID_OFFSET, SIZE_CELL_PIX, SIZE_CELL_PIX);
					}
				break;
			}
		}
	}
};