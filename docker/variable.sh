CURRENT_PATH="$(pwd)"
GIT_REPO_LINK="https://github.com/saurabh-mishrr/htmltopdf.git"
DOMAIN="api.cactuspdfgen.com"
NETWORK_NAME="docbridge" 
NETWORK_SUBNET="192.168.31.0/26"
SERVICES_LIST=(node)
PROJECT_DIR=$CURRENT_PATH/../
# ----------------------NODE JS--------------------------------------------
NODE_IP="192.168.31.21"
NODE_PORT="5001:5001"
NODE_DOCKERFILE=${CURRENT_PATH}/setup/node/Dockerfile
NODE_CONTAINER_NAME=${DOMAIN}
# ----------------------CHROME---------------------------------------------
CHROME_DOCKERFILE=${CURRENT_PATH}/setup/chrome/Dockerfile
CHROME_CONTAINER_NAME=chrome
CHROME_IP="192.168.31.22"
CHROME_PORT="9222"
CHROME_DIR=$CURRENT_PATH/setup/chrome/
# -------------------------------------------------------------------------