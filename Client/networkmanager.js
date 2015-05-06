
function NetworkedPlayer(playerObj, playerID){
	this.obj= playerObj;
	this.ID= playerID;
};

function NetworkManager(){
	this.exampleSocket = "";
	this.state = 0;
	this.controls = "";
	this.playerID= -1;
	this.otherPlayerData= new Array();
	this.update = function(controls){
		//console.log(controls.getObject().x + " " + controls.getObject().y + " " + controls.getObject.z);
		this.controls= controls;
		switch(this.state){
			case 0://socket has not yet been created
				this.exampleSocket =new WebSocket("ws://127.0.0.1:8080");
				this.state= 1;
				this.exampleSocket.onopen =this.socketOnOpen.bind(this);
				this.exampleSocket.onmessage = this.messageReceived.bind(this);
			break;
			case 2://socket has opened, and sent a welcome message, but the handshake message has not been received
			
			break;
			case 3://socket has been opened, and handshake message had been received. 
				this.updateServer();
			break;
		}
	};
	
	this.socketOnOpen=function(event){
		this.state= 2;
		this.exampleSocket.send('id request');
	};
	
	this.messageReceived = function(event){
		var splitString =event.data.split("\n");
		switch(splitString[0]){
			case "handshake":
				if(this.state ==2 ){
					this.state= 3;
					this.playerID= parseInt(splitString[1]);
					console.log("id request: " + this.playerID);
				}
			break;
			
			case "position update":
				for(var i=1; i<splitString.length-1; i+=4){
					var curPlayerID= parseInt(splitString[i]);
					if(curPlayerID == this.playerID){
						continue;
					}
					
					//if the player is a new player, add the player
					if(this.otherPlayerData[curPlayerID]==null){
						this.addPlayer(curPlayerID,parseInt(splitString[i+1]),parseInt(splitString[i+2]),parseInt(splitString[i+3]));
						console.log("playerAdded: " + curPlayerID);
					}
					else{
						this.otherPlayerData[curPlayerID].obj.position.x= parseInt(splitString[i+1]);
						this.otherPlayerData[curPlayerID].obj.position.y= parseInt(splitString[i+2]);
						this.otherPlayerData[curPlayerID].obj.position.z= parseInt(splitString[i+3]);
					}
				}
			break;
		}
	};
	
	this.updateServer = function(event){
		var updateString = "position update\n";
		updateString= updateString + (this.playerID + "\n");
		updateString= updateString + (this.controls.getObject().position.x + "\n");
		updateString= updateString + (this.controls.getObject().position.y + "\n");
		updateString= updateString + (this.controls.getObject().position.z + "\n");
		this.exampleSocket.send(updateString);
	};
	
	this.sendBulletData = function (bullet){
		
	};
	
	this.addPlayer = function(curPlayerID, newX, newY, newZ){
		var geometry = new THREE.BoxGeometry( 10, 20, 10 );
		for ( var l = 0, l = geometry.faces.length; l < l; l ++ ) {

			var face = geometry.faces[ l ];
			face.vertexColors[ 0 ] = new THREE.Color( 1,0,0 );
			face.vertexColors[ 1 ] = new THREE.Color( 1,0,0);
			face.vertexColors[ 2 ] = new THREE.Color( 1,0,0 );

		}
		var material = new THREE.MeshPhongMaterial( { specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.x = newX;
		mesh.position.y = newY;
		mesh.position.z = newZ;
		scene.add( mesh );
		var newPlayer= new NetworkedPlayer(mesh,curPlayerID);
		this.otherPlayerData[curPlayerID]=newPlayer;
		material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		//objects.push( mesh );
	};
	
};
