var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8080 });
var IDIterator= 0;
var wsArray = new Array();
var worldData= "world data\n";

var posX, posY, posZ;
for(var i=0; i<50; i++){
	posX = Math.floor(Math.random() * 20 - 10) * 20;
	posY = Math.floor(Math.random() * 20) * 20 + 10;
	posZ = Math.floor(Math.random() * 20 - 10) * 20;
	worldData = worldData + posX + "\n" + posY + "\n" + posZ + "\n";
}

function WebConnection(con){
	this.connection=con;
	this.position = {x:0, y:0, z:0};
	this.ID= IDIterator;
	IDIterator++;
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {

	var splitArray= message.split("\n");
	switch(splitArray[0]){
		case "id request"://handshake message
		var newConnection = new WebConnection(ws);
		wsArray.push(newConnection);
		newConnection.connection.send("handshake\n" + newConnection.ID + "\n" + worldData);
		break;
		case "position update":
			for(var i= 0; i<wsArray.length; i++){
				if(wsArray[i].ID==splitArray[1]){
					wsArray[i].position.x= parseInt(splitArray[2]);
					wsArray[i].position.y= parseInt(splitArray[3]);
					wsArray[i].position.z= parseInt(splitArray[4]);
				}
			}
		break;
		case "bullet spawn":
			sendToAllBut(message,splitArray[1]);
		break;
		
		default:
		break;
	}
  });
  
});

function sendTo(index, msg){
	if(wsArray[index].connection!=null){//send an update if the connection is still valid
		try{
			wsArray[index].connection.send(msg);
		}
		catch(err){
			console.log(err);
			wsArray.splice(index,1);
		}
	}else{//remove the element if not valid
	wsArray.splice(index,1);
	}
}

function sendToAll(msg){
	for(var i= 0; i<wsArray.length; i++){
		sendTo(i,msg);
	}
}

function sendToAllBut(msg, exceptionID){
	for(var i= 0; i<wsArray.length; i++){
		if(wsArray[i].ID!=exceptionID){
			sendTo(i,msg);
		}
	}
}


var timer= setInterval(function() { 
	var positionUpdate = "position update\n";
	for(var i=0; i<wsArray.length; i++){
		positionUpdate= positionUpdate + (wsArray[i].ID + "\n");
		positionUpdate= positionUpdate + (wsArray[i].position.x + "\n");
		positionUpdate= positionUpdate + (wsArray[i].position.y + "\n");
		positionUpdate= positionUpdate + (wsArray[i].position.z + "\n");
	}
	sendToAll(positionUpdate);
},1000/30);


