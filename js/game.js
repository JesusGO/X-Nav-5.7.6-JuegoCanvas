// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos
localStorage.setItem("lvl", 0);
// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

//Stone image
var stoneReady=false;
var stoneImage=new Image();
stoneImage.onload=function(){
	stoneReady=true;
};
stoneImage.src="images/stone.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var princessesCaught = 0;
var stone={};
// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	var elements=[];
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly
	princess.x = 32 + (Math.random() * (canvas.width - 64));
	princess.y = 32 + (Math.random() * (canvas.height - 64));
	elements.push([hero.x,hero.y,32]);
	stones=[];
	var numstones;

	if (localStorage.getItem("lvl") > 5){
		numstones=4;
	}else if(localStorage.getItem("lvl") > 3){
		numstones=3;
	}else{
		numstones=2;
	}



	for (var i = 0; i < numstones; i++) {
		stone.x = putElementX(elements,35);
		stone.y = putElementY(elements,35);
		elements.push([stone.x,stone.y,35]);
		stones.push( [stone.x,stone.y] );
	}
};

function putElementX(elements,size){
	var posX=Math.round((Math.random() * (canvas.width  - 64)));
	return posX;
}
function putElementY(elements,size){
	var posY=Math.round((Math.random() * (canvas.height - 64)));
	return posY;
}


function checkRight() {
	for (var i = 0; i < stones.length; i++) {
	  if((canvas.width<=(Math.round(hero.x)+60))){
	    right=false;
			break;
	  }else if ((((Math.round(hero.x)+35)>stones[i][0])&&(Math.round(hero.x)<(stones[i][0]+25)))
		&&
		(((Math.round(hero.y)+32)>=stones[i][1] ) && ( Math.round(hero.y)<=(stones[i][1]+30) ))) {
	    right=false;
			break;
	  }else{
	    right=true;
	  }
	}
  return right;
}
function checkLeft(){
	for (var i = 0; i < stones.length; i++) {
	  if ( 30>=Math.round(hero.x) ){
	    left=false;
			break;
	  }else if ( ((Math.round(hero.x)<(stones[i][0]+35))&&((Math.round(hero.x)+25)>stones[i][0]))
		&&
		(((Math.round(hero.y)+32)>stones[i][1])&&(Math.round(hero.y)<(stones[i][1]+30)))    ) {
	    left=false;
			break;
	  }else{
	    left=true;
	  }
	}
  return left;
}
function checkUp(){
	var up;
	for (var i = 0; i < stones.length; i++) {
		if(30>=Math.round(hero.y)){
			up=false;
			break;
		}else if( ((Math.round(hero.y)<(stones[i][1]+35))&&((Math.round(hero.y)+25)>stones[i][1]))
		&&
		((Math.round(hero.x)+32)>stones[i][0])&&( Math.round(hero.x)<(stones[i][0]+30)   )        ) {
			up=false;
			break;
		}else {
			up=true;
		}
	}
	return up;
}
function checkDown(){
	for (var i = 0; i < stones.length; i++) {
		if((canvas.height<=(Math.round(hero.y)+65) )){
			down=false;
			break;
		}else if((((Math.round(hero.y)+35)>stones[i][1])&&(Math.round(hero.y)<(stones[i][1]+25)))&&((Math.round(hero.x)+32)>stones[i][0])&&( Math.round(hero.x)<(stones[i][0]+30))){
			down=false;
			break;
		}else {
			down=true;
		}

	}
	return down;
}

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		if(checkUp()){
			hero.y -= hero.speed * modifier;
		} // Player holding up
	}
	if (40 in keysDown) { // Player holding down
		if(checkDown()){
			hero.y += hero.speed * modifier;
		} // Player holding down
	}
	if (37 in keysDown) { // Player holding left
		if (checkLeft()) {
			hero.x -= hero.speed * modifier;
		} // Player holding left
	}
	if (39 in keysDown) { // Player holding right
		if (checkRight()) {
			hero.x += hero.speed * modifier;
		} // Player holding right
	}

	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}
	if (stoneReady) {
    //ctx.drawImage(stoneImage, stone.x, stone.y);
		for (var i = 0; i < stones.length; i++) {
			ctx.drawImage(stoneImage,stones[i][0], stones[i][1]);
		}
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
