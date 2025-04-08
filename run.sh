echo "Starting the application..."
# Check who the user is
whoami
# Make sure we're using the correct bashrc profile
source ~/.bashrc
# Use sudo to hopefully get node and npm to run properly
sudo node --version
sudo npm install
# pm2 daemon is running already, that way the app should run fine