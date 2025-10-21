#!/bin/sh

python manage.py makemigrations # Create new migrations based on the changes detected to your models.
python manage.py migrate # Apply migrations to the database.
python manage.py runserver 0.0.0.0:8000 # Start the Django development server, accessible on all network interfaces at port 8000.
