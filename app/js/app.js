var chatRoomApp=angular.module('chatRoomApp',[
    'ngRoute',
    'chatRoomControllers',
    'chatRoomServices'
]);
chatRoomApp.config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/',{
                templateUrl:'/js/contents/userChatRoom.html',
                controller:'userRoomController'
            }).
            otherwise({
                redirectTo:'/'
            });

}]);