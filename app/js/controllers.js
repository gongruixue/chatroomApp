var chatRoomControllers=angular.module('chatRoomControllers',[]);
//var socket=io();

chatRoomControllers.controller('userRoomController',['$scope','user','room',
    function($scope,user,room){
        //socket.on('message',function(data){
        //    $scope.message=data;
        //});
        $scope.user=user.get();
        $scope.currentRoom=room.get();
    }]);