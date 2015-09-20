var express=require('express');
var path=require('path');
var bodyParser=require('body-parser');
var app=express();
var data=require('./mock/userChatRoom.json');

var model=require('./model.js');

//使用静态文件服务
app.use(express.static('app'));
app.use(bodyParser.json());
//sendFile需要提供文件的绝对路径，可以使用options:root参数指定directory
var viewRoot=path.join(process.cwd(),'/app');
/*路由*/
//展示页面,路由由angular处理
app.get(['/','/login','/user/:id/home'],function(req,res){
    res.sendFile('/index.html',{root:viewRoot});
});
//获取数据
//用户
app.get('/data/user/:id',function(req,res){
    var user=model.user.getDetail(req.params['id']);
    if(typeof user==='undefined'||user===null) return res.sendStatus(404);
    res.send(user);
});
app.post('/data/user',function(req,res){
    //创建用户
    var user=req.body;
    var uId=model.user.create(user);
    res.send({uId:uId});
    model.syncCache();
});
//room
app.get('/data/room/:id',function(req,res){
    //查询某个room信息
    var room=model.room.getDetail(req.params.id);
    if(typeof room==='undefined'||room===null)return res.sendStatus(404);
    res.send(room);
});
app.post('/data/room',function(req,res){
    //创建新的room
    var room=req.body;
    var roomId=model.room.create(room);
    res.send({roomId:roomId});
    model.syncCache();
});
//images
var uploadImgDir=path.join(process.cwd(),"/app/images/userUploaded/");
app.post('/data/images/userUpload',function(req,res){
    model.handleFileUpload(req,uploadImgDir,function(err,imgPath){
        //上传出错
        if(err)return res.sendStatus(500);
        //上传成功，返回图片url
        var imgUrl='/images/userUploaded/'+path.basename(imgPath);
        res.status(200).set({'Content-type':'text/plain'}).send(imgUrl);
    });
    model.syncCache();
});
app.use(function(err,req,res,next){
    console.log('error');
    res.send(500);
});
var server=app.listen(3001,function(){
    console.log('server listening on port ',3000);
});

var io=require('socket.io')(server);
io.on('connection',function(socket){
    console.log('one user connected');
    socket.on('changeRoom',function(roomId){
        socket.leaveAll();
        socket.join(roomId);
    });
    socket.on('newMessage',function(roomId,newMessage){
        io.to(roomId).emit('newIncomingMessage',newMessage);
        model.room.addMessage(roomId,newMessage);
        model.syncCache();
    })
});
