var chatRoomControllers=angular.module('chatRoomControllers',['ngFileUpload']);
var socket=io();
chatRoomControllers.
    controller('userRoomController',['$scope','$routeParams','$window','User','Room',
    function($scope,$routeParams,$location,$window,User,Room){
        var id=$routeParams.id;
        var result=User.get({id:id},function(){
            //success callback
            $scope.user=result.user;
            $scope.rooms=result.rooms;
        },function(){
            //failure callback
            var rst=$scope.user;
        });
        $scope.createNewRoom=function(){
            var newRoom=new Room({
                creatorId:id,
                name:$scope.newRoomName,
                picture:'/images/portrait3.png'
            });
            newRoom.$save(function(){
                $window.location.reload();
            });
        };
        socket.on('newIncomingMessage',function(message){
            $scope.currentRoom.messages.push(message);
        });
        $scope.changeCurrentRoom= function (currentRoom) {
            socket.emit('changeRoom',currentRoom.id);
            var result=Room.get({id:currentRoom.id},function(){
                //success
                $scope.currentRoom=result.room;
                $scope.members=result.members;
            },function(){
                //error
                var x=result;
            });
        };
        $scope.addNewMessage=function(){
            var newMessage={
                ownerId:id,
                content:$scope.newMessage
            };
            socket.emit('newMessage',$scope.currentRoom.id,newMessage);
        }
    }]).
    controller('loginController',['$scope','$window','$http','Upload','User',
    function($scope,$window,$http,Upload,User){
        $scope.defaultPortrait="/images/unonwnUser1.jpg";
        $scope.showDefault=true;
        $scope.changePortrait=function($file){
            $scope.showDefault=false;
        };
        $scope.createUser=function(){
            //先处理头像上传
            handlePortrait(function(imgUrl){
                //上传头像成功后创建用户
                var newUser=new User({
                    name:$scope.newUserName,
                    password:$scope.password,
                    portrait:imgUrl
                });
                newUser.$save(function(data,resHeader){
                    //成功创建用户，重定向到用户主页
                    $window.location.href='/user/'+data.uId+'/home';
                });
            },function(){
                //上传头像失败
                $scope.errMessage="上传头像失败，请稍后重试";
            });
        };
        $scope.login=function(){
            var user={
                name:$scope.username,
                password:$scope.password
            };
            $http.post('/login',user).
                success(function(data){
                    $window.location.href='/user/'+data.uId+'/home';
                })
                .error(function(){});
        };

        function handlePortrait(success,error){
            if($scope.portrait) {
                //用户上传了自定义头像
                Upload.upload({
                    url: '/data/images/userUpload',
                    file: $scope.portrait
                }).success(success)
                    .error(error);
            }else{
                //用户未上传头像，使用默认头像
                success($scope.defaultPortrait);
            }
        }
    }]);