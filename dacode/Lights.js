//LIGHTING TAVU
var lights = [],
    blocks = [],
    vector = function(_x,_y){
        this.x = _x;
        this.y = _y;  
    }
    light = function(_position,_radius,_angleSpread, _color){
        this.color = LIGHT_color;
        this.radius = _radius;
        this.angleSpread = _angleSpread;
        this.position = _position;
        this.angle = Math.random()*180;
    },
    block = function(_position,_width,_height){
       this.position = _position;
       this.width = _width;
       this.height = _height;
       this.visible = false;
    },
        angle = 0;


// FIND DISTANCE ************************
function findDistance(light, block, angle, rLen, start, shortest, closestBlock){
    var y = (block.position.y + block.height/2) - light.position.y,
        x = (block.position.x + block.width/2) - light.position.x,
        dist = Math.sqrt((y * y) + (x * x));

    if(light.radius >= dist)
    {
        var rads = angle * (Math.PI / 180),
            pointPos = new vector(light.position.x, light.position.y);
        
        pointPos.x += Math.cos(rads) * dist;
        pointPos.y += Math.sin(rads) * dist;
        
        if(pointPos.x > block.position.x && pointPos.x < block.position.x + block.width && pointPos.y > block.position.y && pointPos.y < block.position.y + block.height)
        {
            if(start || dist < shortest){
                start = false;
                shortest = dist;
                rLen= dist;
                closestBlock = block;
            }
            
            return {'start' : start, 'shortest' : shortest, 'rLen' : rLen, 'block' : closestBlock};
        }
    }
    return {'start' : start, 'shortest' : shortest, 'rLen' : rLen, 'block' : closestBlock};
}
// **************************************

// SHINE LIGHT**************************
function shineLight(light){
    var curAngle = light.angle - (light.angleSpread/2),
        dynLen = light.radius,
        addTo = 1/light.radius;
    
    for(curAngle; curAngle < light.angle + (light.angleSpread/2); curAngle += 0.8){
        dynLen = light.radius;
        
        var findDistRes = {};
            findDistRes.start = true;
            findDistRes.shortest = 0;
            findDistRes.rLen = dynLen,
            findDistRes.block = {};
                    
        for(var i = 0; i < blocks.length; i++)
        {
            findDistRes = findDistance(light, blocks[i], curAngle, findDistRes.rLen, findDistRes.start, findDistRes.shortest, findDistRes.block);
        }
         
        var rads = curAngle * (Math.PI / 180),
            end = new vector(light.position.x, light.position.y);
        
        findDistRes.block.visible = true;
        end.x += Math.cos(rads) * findDistRes.rLen;
        end.y += Math.sin(rads) * findDistRes.rLen;
       
        ctxBG.beginPath();
        ctxBG.moveTo(light.position.x, light.position.y);
        ctxBG.lineTo(end.x, end.y);
        ctxBG.closePath();
       // ctxBG.clip();
        ctxBG.stroke();
    }
}
// ************************************

function draw(){
    ctxBG.save();
        ctxBG.fillStyle = "#666";
        ctxBG.fillRect(0,0, 800, 800);
    ctxBG.restore();

    ctxBG.save();
        ctxBG.fillStyle = "#737373";
        ctxBG.fillRect(42,42, 800-84, 800-84);
    ctxBG.restore();

    ctxBG.save();
        ctxBG.fillStyle = "#666";
        ctxBG.fillRect(0,0, 400, 800);
    ctxBG.restore();
    
    //ctxBG.fillStyle = "#666";
    //ctxBG.fillRect(0,0,800,800);
    angle+=0.6;
   
    for(var i = 0; i < blocks.length; i++){
        var block = blocks[i];
        if(block.visible){
            ctxBG.fillStyle = "rgb(6,6,6,1)";
            ctxBG.fillRect(block.position.x, block.position.y, block.width, block.height);
            block.visible = false;
        }else{
           ctxBG.fillStyle = "rgba(6,6,6,0)";
           ctxBG.fillRect(block.position.x, block.position.y, block.width, block.height);
        }
    }    
   
    for(var i = 0; i < lights.length; i++){
        ctxBG.strokeStyle = LIGHT_color;
        lights[i].radius += Math.sin(angle);
        shineLight(lights[i]);  
    }
}