var express=require('express');
var app=express();
var data=require('./mock/userChatRoom.json');

app.use(express.static('app'));
app.get('/',function(req,res){
    res.sendFile('/index.html');
});
app.use(function(req,res,next){
    console.log('http request:',req.path);
    next();
});
/*路由*/
//用户
app.get('/user/:id',function(req,res){
    res.send(data.user);
});
app.post('/user',function(req,res){
    //创建用户
});
//room
app.get('/room/:id',function(req,res){
    //查询某个room信息
    res.send(data.rooms[0]);
});
var server=app.listen(3000,function(){
    console.log('server listening on port ',3000);
});

var io=require('socket.io')(server);
io.on('connection',function(socket){
    console.log('one user connected');
    socket.emit('message','haha');
});