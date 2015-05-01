var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8080 });
var IDIterator= 0;
var wsArray = new Array();

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
		newConnection.connection.send("handshake\n" + newConnection.ID);
		break;
		case "position update":
			for(var i= 0; i<wsArray.length; i++){
				if(wsArray[i].ID==splitArray[1]){
					wsArray.x= parseInt(splitArray[2]);
					wsArray.y= parseInt(splitArray[3]);
					wsArray.z= parseInt(splitArray[4]);
				}
			}
		break;
		
		default:
		break;
	}
  });
  
});

var timer= setInterval(function() { 
	var positionUpdate = "position update\n";
	for(var i=0; i<wsArray.length; i++){
		positionUpdate.concat(wsArray[i].ID + "\n");
		positionUpdate.concat(wsArray[i].position.x + "\n");
		positionUpdate.concat(wsArray[i].position.y + "\n");
		positionUpdate.concat(wsArray[i].position.z + "\n");
	}
	for(var i=0; i<wsArray.length; i++){
		wsArray[i].connection.send(positionUpdate);
	}
},1000/30);


