var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8080 });

function WebConnection(con,Name){
	this.connection=con;
	this.name=Name;
}

var wsArray= new Array();

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
	console.log("TOTALMESSAGE");
	console.log(message);
	console.log("ENDTOTALMESSAGE");
	var splitArray= message.split("\n");
	switch(parseInt(splitArray[0])){
		case 1:
		wsArray.push(new WebConnection(ws,splitArray[1]));
		break;
		default:
		break;
	}
  });
  console.log("connected");
  
});