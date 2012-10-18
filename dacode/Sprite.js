function Sprite( image, framesNb, colsNb, rowsNb ) {
	this.image = image;
	this.framesNb = framesNb;
	this.colsNb = colsNb;
	this.rowsNb = rowsNb;
	this.width = this.image.width;
	this.height = this.image.height;
	this.spriteFrameWidth = this.width / this.colsNb;
	this.spriteFrameHeight = this.height / this.rowsNb;
}

Sprite.prototype.clear = function( ctx, x, y ) {
	ctx.save();
		ctx.translate( x-(this.spriteFrameWidth/2), y-(this.spriteFrameHeight/2) );
		ctx.clearRect(0,0,this.spriteFrameWidth, this.spriteFrameHeight);
		ctx.globalAlpha = 0.8;
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, this.spriteFrameWidth, this.spriteFrameHeight);	
	ctx.restore();
}

Sprite.prototype.render = function( ctx, x, y, spriteFrameIndex ) {
	this.clear(ctx, x, y);
	ctx.save();
		ctx.translate( x, y );	
		this.drawSpriteFrameFromImage( ctx, spriteFrameIndex );
	ctx.restore();
}

Sprite.prototype.drawSpriteFrameFromImage = function( ctx, spriteFrameIndex ) {
	var frameOrigin = this.computeSpriteFrameOrigin( spriteFrameIndex );
	
	ctx.drawImage( this.image, 
			frameOrigin.x, frameOrigin.y,
			this.spriteFrameWidth, this.spriteFrameHeight,
			-this.spriteFrameWidth / 2, -this.spriteFrameHeight / 2,
			this.spriteFrameWidth, this.spriteFrameHeight );		
}

Sprite.prototype.computeSpriteFrameOrigin = function( spriteFrameIndex ) {
	var colIndex = spriteFrameIndex % this.colsNb;
	var rowIndex = ( spriteFrameIndex - colIndex ) / this.colsNb;
	var sx = colIndex * this.spriteFrameWidth;
	var sy = rowIndex * this.spriteFrameHeight;
	
	return { x:sx, y:sy };
}







