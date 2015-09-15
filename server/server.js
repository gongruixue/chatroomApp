var express=require('express');
var app=express();

app.use(express.static('app'));
app.use(function(req,res){
    res.sendFile('/index.html');
});

var server=app.listen(3000,function(){
    console.log('server listening on port ',3000);
});

var io=require('socket.io')(server);
io.on('connection',function(socket){
    console.log('one user connected');
    socket.emit('message','haha');
});