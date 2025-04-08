#!/bin/bash
echo "Starting the application..."
# Check who the user is
whoami
# Make sure we're using the correct bashrc profile
source ~/.bashrc
node --version
npm install
# restart pm2 daemon just incase new libraries are installed
pm2 restart all