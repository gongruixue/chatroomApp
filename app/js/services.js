var chatRoomServices=angular.module('chatRoomServices',['ngResource']);
chatRoomServices
    .factory('user',['$resource',
    function($resource){
        return $resource('/user/:id',{id:'123'});
}])
    .factory('room',['$resource',
    function($resource){
        return $resource('/room/:id',{id:'123'});
}]);
    //.factory('userRooms',['$resource',function($resource){
    //    return $resource('/user/rooms');
    //}]);