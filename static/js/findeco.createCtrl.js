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

'use strict';
/* Controllers */

function FindecoCreateCtrl($scope, $routeParams, Backend, TMP, Message, Navigator) {
    $scope.settings = {
        type: $routeParams.type
    };
    $scope.radioModel = '';

    $scope.showIf = function (matchArray) {
        for (var m in matchArray) {
            if (matchArray[m] == $scope.settings.type) {
                return true;
            }
        }
        return false;
    };

    $scope.parse = function (text) {
        if (text != undefined && text.length > 0)
            return Parser.parse(text, null, true);
        return "";
    };

    $scope.checkWikiCompatibility = function (text) {
        if (text == undefined
            || text == '') {
            return 'Empty';
        }
        Parser.parse(text);
        if (Parser.isErrorState()) {
            return 'ParseError';
        }

        return true;
    }

    $scope.submit = function () {

        var params = {};
        switch ($scope.settings.type) {
            case 'argumentPro':
            case 'argumentNeut':
            case 'argumentCon':
                var test = $scope.checkWikiCompatibility($scope.tmp.text);
                if ( test != true ) {
                    Message.send('error','_argumentText' + test + '_');
                    break;
                }
                // Past watchdog

                params['argumentType'] = $scope.settings.type.toLowerCase().substr(8);
                params['wikiText'] = $scope.tmp.text;
            break;
            case 'topic':
                var test = $scope.checkWikiCompatibility($scope.tmp.text);
                if ( test != true ) {
                    Message.send('error','_text' + test + '_');
                    break;
                }
                // Past watchdog

                params['wikiText'] = $scope.tmp.text;
            break;
            case 'derivate':
                if ( $scope.tmp.argumentType != 'con' && $scope.tmp.argumentType != 'neut' ) {
                    Message.send('error','_derivateArgumentMissing_');
                    break;
                }
                var test = $scope.checkWikiCompatibility($scope.tmp.text);
                if ( test != true ) {
                    Message.send('error','_derivateText' + test + '_');
                    break;
                }
                test = $scope.checkWikiCompatibility($scope.tmp.textAlternative);
                if ( test != true ) {
                    Message.send('error','_derivateTextAlternative' + test + '_');
                    break;
                }
                // Past watchdog

                params['argumentType'] = $scope.tmp.argumentType;
                params['wikiText'] = $scope.tmp.text;
                params['wikiTextAlternative'] = $scope.tmp.textAlternative;
            break;
            case 'opposing':
                var test = $scope.checkWikiCompatibility($scope.tmp.textAlternative);
                if ( test != true ) {
                    Message.send('error','_opposingTextAlternative' + test + '_');
                    break;
                }
                // Past watchdog

                params['wikiTextAlternative'] = $scope.tmp.textAlternative;
            break;
        }

        if ( angular.equals(params,{}) ) {
            return;
        }

        Backend.storeText(Navigator.nodePath, params)
            .success(function (data) {
                if (data.storeTextResponse != undefined) {
                    $scope.tmp.text = '';
                    $scope.tmp.textAlternative = '';
                    $scope.tmp.argumentType = '';
                    Navigator.changePath(data.storeTextResponse.path);
                }
                if (data.errorResponse != undefined) {
                    Message.send('error', data.errorResponse.errorMessage);
                }
            });
    };

    $scope.tmp = TMP;
}

FindecoCreateCtrl.$inject = ['$scope', '$location', '$routeParams', 'Backend', 'TMP', 'Message'];