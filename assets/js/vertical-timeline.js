angular.module('vertical-timeline', [])

.directive('verticalTimeline', function () {
    return {
        templateUrl: 'vertical-timeline/templates/vertical-timeline.html',
        transclude: true,
        replace: true,
        scope: {
            alias: '@?',
            drag: '=?'
        },
        controller: function ($scope) {
            var items = [], ctrl = this;

            $scope.offset = 0;

            this.subscribe = function (scope) {
                items.push(scope);
                if (!ctrl.selected) ctrl.selected = scope;
            };

            this.select = function (scope) {
                ctrl.selected = scope;
                var index;
                for (var i = 0; i < items.length; i++) {
                    if (items[i].$id == scope.$id) {
                        index = i;
                        break;
                    }
                }
                ctrl.scroll(-index * ctrl.height);
            };

            this.scroll = function (offset) {
                if (offset <= -ctrl.height * items.length)
                    return;
                $scope.offset = offset;
                if ($scope.offset > 0) $scope.offset = 0;
                $scope.containerStyle = {
                    'top': $scope.offset + 'px'
                };
            };

            this.find = function (filter) {
                return items.filter(filter)[0];
            };

            this.getSelectedIndex = function () {
                var index;
                for (var i = 0; i < items.length; i++) {
                    if (items[i].$id == ctrl.selected.$id) {
                        index = i;
                        break;
                    }
                }
                return index;
            }

            this.scrollUp = function () {
                if ($scope.drag) {
                    var index = ctrl.getSelectedIndex() + 1;
                    if (index == items.length) return;
                    ctrl.selected = items[index];
                    ctrl.scroll(-index * ctrl.height);
                } else {
                    ctrl.scroll($scope.offset - ctrl.height);
                }
            };

            this.scrollDown = function () {
                if ($scope.drag) {
                    var index = ctrl.getSelectedIndex();
                    if (!index) return;
                    ctrl.selected = items[--index];
                    ctrl.scroll(-index * ctrl.height);
                } else {
                    ctrl.scroll($scope.offset + ctrl.height);
                }
            };
        },
        link: function (scope, element, attrs, ctrl) {
            if (scope.alias)
                scope.$parent[scope.alias] = ctrl;
            element.bind('mousewheel', function (e) {
                if (e.originalEvent.wheelDelta > 0) {
                    ctrl.scrollUp();
                } else {
                    ctrl.scrollDown();
                }
                scope.$apply();
            });
        }
    };
})

.directive('verticalTimelineItem', function () {
    return {
        templateUrl: 'vertical-timeline/templates/vertical-timeline-item.html',
        require: '^verticalTimeline',
        replace: true,
        transclude: true,
        scope: {
            title: '=titleText',
            isodate: '=date',
            format: '@?'
        },
        link: function (scope, element, attrs, ctrl) {
            scope.ctrl = ctrl;
            scope.$watch('isodate', function (date) {
                scope.date = new Date(moment(date).utc().format('YYYY-M-D'));
            });
            ctrl.subscribe(scope);

            scope.select = function () {
                ctrl.select(scope);
            };

            ctrl.height = element.find('.panel')[0].offsetHeight;
        }
    }
});
