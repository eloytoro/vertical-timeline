angular.module('verticalTimelineDemo', ['vertical-timeline'])

.controller('MainCtrl', function ($scope) {
    $scope.date1 = new Date('2015-1-1');
    $scope.date2 = new Date('2015-2-2');

    $scope.filter = function () {
        $scope.timeline.select($scope.timeline.find(function (scope) {
            return scope.title === 'NONO';
        }));
    }
});
