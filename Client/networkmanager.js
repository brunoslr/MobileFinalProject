function NetworkManager(){
	this.exampleSocket = "";
	this.state = 0;
	this.controls = "";
	this.playerID= -1;
	this.update = function(controls){
		//console.log(controls.getObject().x + " " + controls.getObject().y + " " + controls.getObject.z);
		this.controls= controls;
		switch(this.state){
			case 0://socket has not yet been created
				this.exampleSocket =new WebSocket("ws://127.0.0.1:8080");
				this.state= 1;
				this.exampleSocket.onopen = function (event) {
					this.state= 2;
				};
				
				this.exampleSocket.onmessage = function(event){
					this.messageReceived(event);
				};
			break;
			case 2://socket has opened, and sent a welcome message, but the handshake message has not been received
			
			break;
			case 3://socket has been opened, and handshake message had been received. 
				this.updateServer();
			break;
		}
	};
	
	this.messageReceived = function(event){
		var splitString =event.data.split("\n");
		switch(splitString[0]){
			case "handshake":
				if(this.state ==2 ){
					this.state= 3;
					this.playerID= parseInt(splitString[1]);
				}
			break;
			
			case "position update":
			break;
		}
	};
	
	this.updateServer = function(event){
		var updateString = "position update\n";
		updateString.concat(controls.getObject().position.x + "\n");
		updateString.concat(controls.getObject().position.y + "\n");
		updateString.concat(controls.getObject().position.z + "\n");
	};
	
	this.sendBulletData = function (bullet){
		
	}
	
}