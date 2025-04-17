#!/bin/bash
echo "Starting the application..."
# Manually set the path to the node binary, should probably fix this in the future
export HOME=/root
export PATH=/root/.nvm/versions/node/v20.14.0/bin:$PATH
# Check who the user is
whoami
# Make sure we're using the correct bashrc profile
source ~/.bashrc
node --version
cd /home/ec2-user/deploy
npm install
npm run build:clean
npm run build
# restart pm2 daemon just incase new libraries are installed
pm2 restart all