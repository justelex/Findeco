'use strict';
/* Controllers */

function FindecoUserCtrl($scope, $location, FindecoService, FindecoUserService) {
    $scope.login = function () {
        FindecoService.post({action: '.json_login/', 'username': $scope.username, 'password': $scope.password}, function(data) {
            FindecoUserService.isLoggedIn = true;
            FindecoUserService.content = data;
            $location.path('/');
        });
    };
}