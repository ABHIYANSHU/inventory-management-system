#!/usr/bin/env python
import os
import sys

# This is the main entry point for Django's command-line utility.
if __name__ == '__main__':
    # Set the default settings module for the 'django' program.
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    try:
        # Import Django's command-line utility.
        from django.core.management import execute_from_command_line  # type: ignore
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv) # Execute the command-line utility with the provided arguments.