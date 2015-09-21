var formidable=require('formidable');
var fs=require('fs');
var redis=require('redis'),
    redisClient=redis.createClient(6379,'127.0.0.1');
redisClient.on('error',function(error){
    console.log('redis error:',error);
});
var cache={};
var model={};
redisClient.get('cache',function(err,result){
    if(err){console.log('redis cache error,no cache provided.');return;}
    if(result!==null) cache=JSON.parse(result);
    cache.users||(cache.users={});
    cache.rooms||(cache.rooms={});
    //setInterval(syncCache,3000);
});
function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
}
model.syncCache=function(){
    redisClient.set('cache',JSON.stringify(cache),function(err){
        redisClient.get('cache',function(err,data){
            console.log(data);
        });
    });
};
model.handleFileUpload=function(req,uploadDir,cb){
    var form=new formidable.IncomingForm();
    //设置上传路径
    form.uploadDir=uploadDir;
    form.parse(req, function (error,fields,result) {
        if(error)return cb(error);
        //上传成功,返回存储路径
        cb(null,result.file.path);
    });
};
model.user={
    create:function(user){
        var uId=generateId();
        user.id=uId;
        user.roomList=[];
        cache.users[uId]=user;
        return uId;
    },
    update:function(id,key,value){
        cache.users[id][key]=value;
    },
    get:function(id){
        return cache.users[id];
    },
    getDetail:function(id){
        var user=cache.users[id];
        if(typeof user==='undefined'||user===null)return null;
        //结果存到result中，不污染cache中的原user对象
        var result={
            user:user,
            rooms:{}
        };
        //填充room信息
        user.roomList.map(function(roomId){
            result.rooms[roomId]=model.room.get(roomId);
        });
        return result;
    },
    auth:function(postUser,cb){
        for(var id in cache.users){
            var user=cache.users[id];
            if(user.name===postUser.name&&user.password===postUser.password){
                return cb(true,user.id);
            }
        }
        return cb(false);
    },
    joinRoom:function(id,roomId){
        cache.users[id].roomList.push(roomId);
    }
};
model.room= {
    create: function (room) {
        var roomId = generateId();
        room.id = roomId;
        //room.messageList = [];
        room.messages=[];
        room.memberList = [room.creatorId];
        cache.rooms[roomId] = room;
        //在creator的roomList中增加此room
        model.user.joinRoom(room.creatorId,roomId);
        //创建完成,返回id
        return roomId;
    },
    get:function(id){
        return cache.rooms[id];
    },
    addMessage:function(id,message){
        cache.rooms[id].messages.push(message);
    },
    getDetail:function(id){
        var room=cache.rooms[id];
        //result存储结果，避免污染cache中的room对象
        var result={
            room:room,
            members:{}
            //messages:{}
        };
        //填充所有的members object
        room.memberList.map(function(memberId){
            result.members[memberId]=model.user.get(memberId);
        });
        //填充所有的messages object
        //room.messages={};
        //room.messageList.map(function(messageId){
        //    result.messages[messageId]=model.message.get(messageId);
        //});
        return result;
    }
};
model.message={
    create:function(message){},
    get:function(id){}
};

module.exports=model;

