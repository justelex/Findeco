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

function FindecoHelpCtrl($scope, Backend, User, Navigator) {

    // todo: Is this used at all?

    function setAuthorForAllBlogs() {
        for (var i = 0; i < $scope.microbloggingList.length; ++i ) {
            var blog = $scope.microbloggingList[i];
            blog.author = blog.authorGroup[0];
            blog.author.isFollowing = User.follows(blog.author.displayName);
            blog.author.path = blog.author.displayName;
        }
    }

    $scope.microbloggingList = [];
    $scope.user = User;
    $scope.test =function(e){
    	$("#foo").html("Highlghted Item " + (e)?e.target.id:window.event.srcElement.id)
    };
    
    $scope.followUser = function (path, type) {
        return User.markUser(path, type).success(setAuthorForAllBlogs);
    };

    $scope.updateMicrobloggingList = function () {
        Backend.loadMicroblogging($scope.microbloggingList, Navigator.path).success(setAuthorForAllBlogs);
    };

    $scope.submit = function () {
        // TODO: Cross-site-scripting protection!
        if ($scope.microblogText.length <= 0) return;
        Backend.storeMicroblogPost(Navigator.path, $scope.microblogText).success(function () {
            $scope.updateMicrobloggingList();
            $scope.microblogText = '';
        });
    };

    $scope.updateMicrobloggingList();
}

FindecoHelpCtrl.$inject = ['$scope', 'Backend', 'User', 'Navigator'];