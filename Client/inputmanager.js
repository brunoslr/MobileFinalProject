

function InputManager(){
	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.moveJump = false;
	this.canJump = false;
	this.controlsEnabled= false;
	window.addEventListener( 'keydown', this, false );
	window.addEventListener( 'keyup', this, false );
}


InputManager.prototype.handleEvent= function(e){
	console.log(e.type);
	if(e.type=="keydown"){
		this.onKeyDown(event);
	}
	else if(e.type=="keyup"){
		this.onKeyUp(event);
	}
};


InputManager.prototype.onKeyDown= function(event){
	switch ( event.keyCode ) {
		case 38: // up
		case 87: // w
			this.moveForward = true;
			break;

		case 37: // left
		case 65: // a
			this.moveLeft = true; 
			break;

		case 40: // down
		case 83: // s
			this.moveBackward = true;
			break;

		case 39: // right
		case 68: // d
			this.moveRight = true;
			break;

		case 32: // space
			if ( this.canJump == true ) this.moveJump=true;
			this.canJump = false;
			break;
	}
};
InputManager.prototype.onKeyUp= function(event){
	switch( event.keyCode ) {

		case 38: // up
		case 87: // w
			this.moveForward = false;
			break;

		case 37: // left
		case 65: // a
			this.moveLeft = false;
			break;

		case 40: // down
		case 83: // s
			this.moveBackward = false;
			break;

		case 39: // right
		case 68: // d
			this.moveRight = false;
			break;
	}
};

