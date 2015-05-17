
function InputManager() {
	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.moveJump = false;
	this.canJump = false;
	this.isSprinting = false;
	this.controlsEnabled = false;
	this.acceleration = new THREE.Vector3();
	window.addEventListener( 'keydown', this, false );
	window.addEventListener('keyup', this, false);
<<<<<<< HEAD
=======
	window.addEventListener('ondevicemotion', this, false); //Usually words with safari and opera
	window.addEventListener('ondeviceorientation', this, false); //For chrome
	window.addEventListener('onmozorientation', this, false); //For Moz
	this.accLeft = false;
	this.accRight = false;
	this.lockInput= false;
>>>>>>> fb8a6f12a305f416453b74c2428fa0075c8adece
}

InputManager.prototype.handleEvent = function(e){
	if( e.type=="keydown" ) {
		this.onKeyDown(event);
	}
	else if( e.type=="keyup" ) {
		this.onKeyUp(event);
	}
	else if ( e.type == "ondevicemotion" || e.type == "onmozorientation" || e.type == "ondeviceorientation" ) {
	   
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

	    case 16: // shift
	        this.isSprinting = true;
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

	    case 16: // shift
	        this.isSprinting = false;
	        break;
	}
};
