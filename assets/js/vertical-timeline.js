angular.module('vertical-timeline', [])

.directive('verticalTimeline', function () {
    return {
        template: '<div class="container-fluid vertical-timeline" ng-style="containerClass" ng-transclude></div>',
        transclude: true,
        scope: {
            alias: '@?'
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
                $scope.offset = offset;
                if ($scope.offset > 0) $scope.offset = 0;
                $scope.containerClass = {
                    'margin-top': $scope.offset + 'px'
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
                if (ctrl.selected.$id === items[items.length - 1].$id)
                    return;
                var index = ctrl.getSelectedIndex();
                ctrl.selected = items[++index];
                ctrl.scroll(-index * ctrl.height);
            };

            this.scrollDown = function () {
                if (ctrl.selected.$id === items[0].$id)
                    return;
                var index = ctrl.getSelectedIndex();
                ctrl.selected = items[--index];
                ctrl.scroll(-index * ctrl.height);
            };
        },
        link: function (scope, element, attrs, ctrl) {
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
            title: '=',
            date: '='
        },
        link: function (scope, element, attrs, ctrl) {
            scope.ctrl = ctrl;
            ctrl.subscribe(scope);

            scope.select = function () {
                ctrl.select(scope);
            };

            ctrl.height = element.find('.panel')[0].offsetHeight;
        }
    }
});
