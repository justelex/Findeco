/****************************************************************************************
 * Copyright (c) 2012 Justus Wingert, Klaus Greff, Maik Nauheim, Johannes Merkert       *
 *                                                                                      *
 * This file is part of Findeco.                                                        *
 *                                                                                      *
 * Findeco is free software; you can redistribute it and/or modify it under             *
 * the terms of the GNU General Public License as published by the Free Software        *
 * Foundation; either version 3 of the License, or (at your option) any later           *
 * version.                                                                             *
 *                                                                                      *
 * Findeco is distributed in the hope that it will be useful, but WITHOUT ANY           *
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A      *
 * PARTICULAR PURPOSE. See the GNU General Public License for more details.             *
 *                                                                                      *
 * You should have received a copy of the GNU General Public License along with         *
 * BasDeM. If not, see <http://www.gnu.org/licenses/>.                                  *
 ****************************************************************************************/

/****************************************************************************************
 * This Source Code Form is subject to the terms of the Mozilla Public                  *
 * License, v. 2.0. If a copy of the MPL was not distributed with this                  *
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.                             *
 ****************************************************************************************/

//////////////////// findeco-graph Directive ///////////////////////////////////
/*
 <div follow-star entity="data" markFunc="markNode"/>
 */


findecoApp
    .directive('followStar', function( ) {
        return {
            restrict : 'A',
            scope: {
                entity: '=',
                markFunc: '=',
                showIf: '=',
                width: '@',
                height: '@'
            },
            replace: true,
            template: '<a class="follow-star">' +
                        '<img ng-src="static/images/star{{entity.isFollowing}}.png" ' +
                'alt="Follow" title="Folgen" width="{{width}}" height="{{height}}" ' +
                'onmouseover="this.src=\'static/images/star{{entity.isFollowing}}_hover.png\';" ' +
                'onmouseout="this.src=\'static/images/star{{entity.isFollowing}}.png\';" ' +
                '/>' +
                      '</a>',
            link : function (scope, element, attrs) {
                if (scope.entity.isFollowing != 0 &&
                    scope.entity.isFollowing != 1 &&
                    scope.entity.isFollowing != 2) {
                    scope.entity.isFollowing = 0;
                }
                var link = angular.element(element[0]);
                scope.$watch('showIf', function(value){
                    link.css('display', scope.showIf ? '' : 'none');
                });
                link.bind('click', toggle);
                function toggle() {
                    var markType = "follow";
                    if (scope.entity.isFollowing == 2) {markType = "unfollow";}
                    scope.markFunc(scope.entity.path, markType).success(function () {
                        if (markType == 'unfollow') {
                            scope.entity.isFollowing = 0;
                        } else {
                            scope.entity.isFollowing = 2;
                        }
                    });
                }

            }
        }
    })
    .directive('spamMark', function( ) {
        return {
            restrict : 'A',
            scope: {
                entity: '=',
                markFunc: '=',
                showIf: '=',
                width: '@',
                height: '@'
            },
            replace: true,
            template: '<a class="spam-mark">' +
                        '<img ng-src="static/images/spam{{entity.isFlagging}}.png" alt="SpamFlag" title="Als Spam markieren" width="{{width}}" height="{{height}}"/>' +
                      '</a>',
            link : function (scope, element, attrs) {
                if (scope.entity.isFlagging != 0 &&
                    scope.entity.isFlagging != 1 &&
                    scope.entity.isFlagging != 2) {
                    scope.entity.isFlagging = 0;
                }

                var link = angular.element(element[0]);
                scope.$watch('showIf', function(value){
                    link.css('display', scope.showIf ? '' : 'none');
                });
                link.bind('click', toggle);
                function toggle() {
                    var markType = "spam";
                    if (scope.entity.isFlagging == 1) {markType = "notspam";}
                    scope.markFunc(scope.entity.path, markType).success(function () {
                        if (markType == 'notspam') {
                            scope.entity.isFlagging = 0;
                        } else {
                            scope.entity.isFlagging = 1;
                        }
                    });
                }
            }
        }
    })
    .directive('creole', function() {
        return {
            restrict : 'A',
            scope: {
                wikiText : '=',
                updateInterval : '@'
            },
            link : function (scope, element, attrs) {
                function parse() {
                    if (scope.wikiText != undefined) {
                        var html = Parser.parse(scope.wikiText, "unusedShortTitle", true);
                        element.html(html);
                    }
                }

                function check_for_parse_timing() {
                    var now = new Date().getTime();
                    var interval = parseInt(scope.updateInterval);
                    if (now >= scope.nextParseTime &&
                        scope.lastChangeTime >= now - interval) {
                        parse();
                        scope.nextParseTime = now + interval;
                        setTimeout(check_for_parse_timing, interval + 10);
                    }
                }

                if (scope.updateInterval == undefined) {
                    scope.$watch('wikiText', function () {
                        parse();
                    });
                } else {
                    scope.nextParseTime = 0;
                    scope.lastChangeTime = 0;
                    scope.$watch('wikiText', function () {
                        var now = new Date().getTime();
                        scope.nextParseTime = Math.max(scope.nextParseTime, now + 1000);
                        scope.lastChangeTime = now;
                        setTimeout(check_for_parse_timing, 1000);
                    });
                }

                parse();
            }
        }
    });
