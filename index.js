var express = require("express");
var app = express();
var port = 3700;
 
// New Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/realtimewebchat-first');

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});
 
app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {

	// New Code 2
	var col = db.collection('messages');
	// Emit all messages
	col.find().limit(10).sort({_id: 1}).toArray(function(err, res) {
		if(err) throw err;
		socket.emit('send', res);
	});

    socket.emit('message', { message: 'welcome to the chat' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});
console.log("Listening on port " + port);
