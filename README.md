Findeco
=======

Working Repository for the new BasDeM / DisQussion joint venture.


Requirements
------------
* Python 2.7
* Django 1.4.3
* Django South 1.7.5

Set Up
---------------
Run from the Findeco directory:

    python manage.py syncdb
    python manage.py migrate findeco
    python manage.py migrate microblogging
    python manage.py migrate node_storage
    python manage.py initial_data

And after each git pull run the following commands to migrate the database:

    python manage.py migrate findeco
    python manage.py migrate microblogging
    python manage.py migrate node_storage
    
