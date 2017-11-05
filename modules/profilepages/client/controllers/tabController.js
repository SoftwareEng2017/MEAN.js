(function () {
    'use strict';

    angular
        .module('profilepages')
        .controller('TabController', TabController);

    TabController.$inject = ['$scope'];

    function TabController($scope) {
    var linkURL = "modules/profilepages/client/views/userInfo.html";
    $scope.tabTagsInfo= [
        {
            url: "modules/profilepages/client/views/userInfo.html",
            tagName: "Info"
        },
        {
            url: "modules/profilepages/client/views/userInfo.html",
            tagName: "Cat"
        },
        {
            url: "modules/profilepages/client/views/userInfo.html",
            tagName: "Person"
        }
    ]


    }
}());
