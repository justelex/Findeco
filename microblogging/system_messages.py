#!/usr/bin/python
# coding=utf-8
# Findeco is dually licensed under GPLv3 or later and MPLv2.
#
# Copyright (c) 2012 Klaus Greff <klaus.greff@gmx.net>
# This file is part of Findeco.
#
# Findeco is free software; you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation; either version 3 of the License, or (at your option) any later
# version.
#
# Findeco is distributed in the hope that it will be useful, but WITHOUT ANY
# WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
# A PARTICULAR PURPOSE. See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along with
# Findeco. If not, see <http://www.gnu.org/licenses/>.
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
from __future__ import division, print_function, unicode_literals
from microblogging.models import create_post
from django.contrib.auth.models import User

system = User.objects.get(username="system")


def post_node_was_flagged_message(path, user):
    text = '<span style="color: gray;">Hinweis:</span> @{user} hat /{path} als Spam markiert.'.format(
        user=user.username,
        path=path.strip('/'))
    return create_post(text, user, do_escape=False)


def post_node_was_unflagged_message(path, user):
    text = '<span style="color: gray;">Hinweis:</span> @{user} hat die Spam Markierung von /{path} zurückgezogen.'.format(
        user=user.username,
        path=path.strip('/'))
    return create_post(text, user, do_escape=False)


def post_node_became_favorit_message(path):
    text = 'Der Vorschlag /{path} ist zum Favoriten geworden.'.format(path=path)
    return create_post(text, system)


def post_new_derivate_for_node_message(user, original_path, derivate_path):
    text = '<span style="color: gray;">Hinweis:</span> @{user} hat den ' \
           'Vorschlag /{original_path} zu /{derivate_path} weiterentwickelt.'.format(
           user=user.username,
           original_path=original_path,
           derivate_path=derivate_path)
    return create_post(text, user, do_escape=False)


def post_new_argument_for_node_message(user, path, arg_type, arg_path):
    argument = {'c': "Gegenargument",
                'con': "Gegenargment",
                'n': "Argument",
                'neut': "Argument",
                'p': "Proargument",
                'pro': "Proargument"}
    text = '<span style="color: gray;">Hinweis:</span> @{user} hat das {argument} /{arg_path} zum Vorschlag /{path} ' \
           'hinzugefügt.'.format(
           user=user.username,
           arg_path=arg_path,
           argument=argument[arg_type],
           path=path)
    return create_post(text, user, do_escape=False)

