var chatRoomControllers=angular.module('chatRoomControllers',[]);
var socket=io();

chatRoomControllers.controller('userRoomController',['$scope',
    function($scope){
        socket.on('message',function(data){
            $scope.message=data;
        });
    }]);