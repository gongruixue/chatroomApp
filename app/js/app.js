var chatRoomApp=angular.module('chatRoomApp',[
    'ngRoute',
    'ngResource',
    'chatRoomControllers',
    'chatRoomServices'
]);
chatRoomApp.config(['$routeProvider','$locationProvider',
    function($routeProvider,$locationProvider){
        $locationProvider.html5Mode(true);
        $routeProvider.
            when('/',{
                templateUrl:'/views/userChatRoom.html',
                controller:'userRoomController'
            }).
            when('/login',{
                templateUrl:'/views/login.html',
                controller:'loginController'
            }).
            when('/user/:id/home',{
                templateUrl:'/views/userChatRoom.html',
                controller:'userRoomController'
            }).
            otherwise({
                redirectTo:'/'
            });

}]);