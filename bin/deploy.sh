# Set environment variables
cd ~/snapmuse-api/
source ../secrets.sh

# Bounce the containers
docker-compose up --build -d

# Housekeeping - remove unused images to free disk space
docker image prune -f
