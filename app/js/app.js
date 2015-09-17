var chatRoomApp=angular.module('chatRoomApp',[
    'ngRoute',
    'ngResource',
    'chatRoomControllers',
    'chatRoomServices'
]);
chatRoomApp.config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/',{
                templateUrl:'/views/userChatRoom.html',
                controller:'userRoomController'
            }).
            otherwise({
                redirectTo:'/'
            });

}]);