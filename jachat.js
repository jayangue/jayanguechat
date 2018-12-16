var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//APP
app.get('/',function(req,res){
	res.sendFile(__dirname + '/interface/index.html');
});
app.use('/interface',express.static(__dirname + '/interface'));
server.listen(2000,function(){console.log("Listening to port")});


//SOCKET
io.sockets.on('connection',function(socket){
	
	//USER CONNECT
	console.log('A socket has connected to the server');
	chatengine.message("A user has connected to the server");
	
	//USER SEND
	socket.on('chat-message',function(data){
		data.name = "USER ~  " + data.name;
		console.log(data.name);
		chatengine.recieve(data);
	});
	
	//USER DISCONNECT
	socket.on('disconnect',function(){
		chatengine.message("A user has disconnected to the server");
	});
	
	//USER LIST OF MESSAGES
	setInterval(function(){
		var chatbank = chatengine.send();
		socket.emit('chat-bank',chatbank);
		//console.log(chatbank);
	},1000/25);
	
	
});



//CHAT ENGINE
function thechatengine(){
	var CHATBANK = [];

	f = {};
	
	f.recieve = function(data){
		CHATBANK.push(data);
		console.log(data);
	};
	
	f.send = function(){
		
		return CHATBANK;
	};
	
	f.message = function(msg){
		var sysmsg = {name: " SYSTEM ~ Jay Angue Chat", message: msg};
		chatengine.recieve(sysmsg);
	};
	
	
	return f;
	
};
chatengine = thechatengine();