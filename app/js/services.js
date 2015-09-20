var chatRoomServices=angular.module('chatRoomServices',['ngResource']);
chatRoomServices
    .factory('User',['$resource',
    function($resource){
        return $resource('/data/user/:id');
}])
    .factory('Room',['$resource',
    function($resource){
        return $resource('/data/room/:id');
}]);
    //.factory('userRooms',['$resource',function($resource){
    //    return $resource('/user/rooms');
    //}]);