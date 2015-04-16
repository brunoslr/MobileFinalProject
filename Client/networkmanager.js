function NetworkManager(){
	var exampleSocket = new WebSocket("ws://127.0.0.1:8080");
	exampleSocket.onopen = function (event) {
		exampleSocket.send("Connection established"); 
	};
}