
function NetworkedPlayer(playerObj, playerID){
	this.obj= playerObj;
	this.ID= playerID;
};

function NetworkManager(){
	this.exampleSocket = "";
	this.state = 0;
	this.controls = "";
	this.playerID = -1;
	this.addedBoxes = false;
	this.otherPlayerData = new Array();
	this.ballsArray = [];
	this.fVectors = []
	this.shootVelo = 5;
	this.bulletsShot = 0;
	this.hit = false;
	
	this.update = function(controls){
		this.controls = controls;
		this.moveProjectiles();
		this.playerBulletCollisionDetection();

		
		switch(this.state){
			case 0://socket has not yet been created
				this.exampleSocket =new WebSocket("ws://191.236.195.180:8080");
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
					//console.log(this.playerID);
					this.addBoxes(event.data);
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
						//console.log("playerAdded: " + curPlayerID);
					}
					else{
						this.otherPlayerData[curPlayerID].obj.position.x= parseInt(splitString[i+1]);
						this.otherPlayerData[curPlayerID].obj.position.y= parseInt(splitString[i+2]);
						this.otherPlayerData[curPlayerID].obj.position.z= parseInt(splitString[i+3]);
					}
				}
			break;
			case "bullet spawn":
				this.spawnBullet(new THREE.Vector3(parseFloat(splitString[3]),parseFloat(splitString[4]),parseFloat(splitString[5])),
							new THREE.Vector3(parseFloat(splitString[6]),parseFloat(splitString[7]),parseFloat(splitString[8])), parseInt(splitString[1]), parseInt(splitString[2]));
			case "bullet hit player confirmed":
				this.resolveBulletCollision(parseInt(splitString[1]),parseInt(splitString[2]));
			break;
		}
	};
	
	this.updateServer = function(event){
		var updateString = "position update\n";
		updateString= updateString + (this.playerID + "\n");
		updateString= updateString + (this.controls.getObject().position.x + "\n")+ (this.controls.getObject().position.y + "\n")+ (this.controls.getObject().position.z + "\n");
		this.send(updateString);
	};
	
	
	this.addPlayer = function(curPlayerID, newX, newY, newZ){
		var geometry = new THREE.BoxGeometry( 10, 20, 10 );
		for ( var l = 0, l = geometry.faces.length; l < l; l ++ ) {

			var face = geometry.faces[ l ];
			face.vertexColors[ 0 ] = new THREE.Color( 1,0,0 );
			face.vertexColors[ 1 ] = new THREE.Color( 1,0,0);
			face.vertexColors[ 2 ] = new THREE.Color( 1,0,0 );

		}
		var material = new THREE.MeshBasicMaterial( { specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.x = newX;
		mesh.position.y = newY;
		mesh.position.z = newZ;
		mesh.health = 100;
		scene.add( mesh );
		var newPlayer= new NetworkedPlayer(mesh,curPlayerID);
		this.otherPlayerData[curPlayerID]=newPlayer;
		material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		//objects.push( mesh );
	};
	
	this.spawnBullet = function(position, direction, bulletID, bulletPlayerID){
		var sphere = new THREE.Mesh( geometry, ballMaterial );
        sphere.position.set(position.x, position.y, position.z);
		sphere.bulletPlayerID=bulletPlayerID;
		sphere.bulletID= bulletID;
        this.ballsArray.push(sphere);
        this.fVectors.push(direction);
        scene.add( sphere );
		//ballOwners.push( this.playerID );
		this.bulletsShot++;
		//console.log(this.bulletsShot);
		//console.log(this.curPlayerID);
	};
	
	this.sendBullet = function(positionVector, velocityVector){
		if(this.state==3){
			var updateString= "bullet spawn\n";
			updateString= updateString + "" + this.playerID + "\n";
			updateString= updateString + positionVector.x + "\n"+ positionVector.y + "\n"+ positionVector.z + "\n";
			updateString= updateString + velocityVector.x + "\n"+ velocityVector.y + "\n"+ velocityVector.z + "\n";
			this.send(updateString);
		}
	};

	this.send = function(obj){
		if(this.exampleSocket){
			this.exampleSocket.send(obj);
		}
	};
	
	
    this.moveProjectiles = function()
    {
        for(var i=0; i<this.ballsArray.length; i++)
		{
			this.ballsArray[i].position.set(this.ballsArray[i].position.x + this.fVectors[i].x * this.shootVelo,
			this.ballsArray[i].position.y + this.fVectors[i].y * this.shootVelo,
			this.ballsArray[i].position.z + this.fVectors[i].z * this.shootVelo);
			
			if (this.ballsArray[i].position.distanceTo(this.controls.getObject().position) > 500 || this.ballsArray[i].position.y <= 1.5) //balls[i].radius)
            {
                scene.remove(this.ballsArray[i]);
                this.ballsArray.splice(i, 1);
                this.fVectors.splice(i,1);
            }
        }        
    }
	
	this.sendHit= function(hitPlayerID, bulletID){
		var sendHitString= "bullet hit player\n";
		sendHitString+=hitPlayerID + "\n";
		sendHitString+=bulletID;
		this.send(sendHitString);
	};
	
	this.resolveBulletCollision= function (hitPlayerID, bulletID){
		if(this.playerID == hitPlayerID){
			for(var i = 0; i < this.ballsArray.length; i++)
			{
				if(this.ballsArray[i].bulletID==bulletID){
					scene.removeObject(this.ballsArray[i].obj);
					this.ballsArray.splice(i,1);
				}
			}
		}
	};
	
	this.addBoxes= function(worldData){
		var geometry = new THREE.BoxGeometry(20, 20, 20);
        for (var i = 0, l = geometry.faces.length; i < l; i++) {

            var face = geometry.faces[i];
            face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

        }
		//var halfExtents = new CANNON.Vec3(1, 1, 1);
		//var boxShape = new CANNON.Box(halfExtents);
		var splitString= worldData.split("\n");
		//console.log("s: " + splitString);
		if(!this.addedBoxes){
			this.addedBoxes=true;
			if(splitString.length>1){
				for (var j = 3; j < splitString.length-1; j+=3) {
					// TODO: Change material, for performance
					var material = new THREE.MeshPhongMaterial({ specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });
					var mesh = new THREE.Mesh(geometry, material);
							
					mesh.position.x = parseFloat(splitString[j]);
					mesh.position.y = parseFloat(splitString[j+1]);
					mesh.position.z = parseFloat(splitString[j+2]);
					scene.add(mesh);
					material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
					objects.push(mesh);
					//var boxBody = new CANNON.Body({ mass: 5 });
					//boxBody.addShape(boxShape);
					//world.add(boxBody);
					//physicsObjects.push(boxBody);
				}
			}
			else{
				for (var i = 0; i < 50; i++) {
					// TODO: Change material, for performance
					var material = new THREE.MeshPhongMaterial({ specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });
					var mesh = new THREE.Mesh(geometry, material);
					mesh.position.x = Math.floor(Math.random() * 20 - 10) * 20;
					mesh.position.y = Math.floor(Math.random() * 20) * 20 + 10;
					mesh.position.z = Math.floor(Math.random() * 20 - 10) * 20;
					scene.add(mesh);
					material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
					objects.push(mesh);
					var boxBody = new CANNON.Body({ mass: 5 });
					boxBody.addShape(boxShape);
					world.add(boxBody);
					physicsObjects.push(boxBody);
				}
			}
		}
	}
	
	this.playerBulletCollisionDetection = function()
	{
		this.hit = false;
        for(var i = 0; i < this.ballsArray.length; i++)
		{
			var currentBall=this.ballsArray[i];
			for(var j = 0; j < this.otherPlayerData.length; j++)
			{
				if(this.otherPlayerData[j] != null)
				{
					var currentPlayer= this.otherPlayerData[j];
					if (currentBall.position.distanceTo(currentPlayer.obj.position) < 10) {
						if(currentPlayer.ID==currentBall.bulletPlayerID)
						{
							this.sendHit(this.otherPlayerData[j].ID, currentBall.bulletPlayerID);
							reduceHealth(1);
						}
					}
				}
				
			}
		}
	}
	
	function reduceHealth( damage)
	{
		var healthbar = document.getElementById('progress-bar');
		healthbar.value = healthbar.value - damage;
	}
	
};
