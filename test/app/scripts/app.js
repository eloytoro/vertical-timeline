angular.module('verticalTimelineDemo', ['vertical-timeline'])

.controller('MainCtrl', function ($scope) {
    $scope.date1 = new Date('2015-1-1');
    $scope.date2 = '1993-02-14T00:00:00.000Z';

    $scope.filter = function () {
        $scope.timeline.select($scope.timeline.find(function (scope) {
            return scope.title === 'NONO';
        }));
    }
});
