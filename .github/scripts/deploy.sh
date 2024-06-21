#!/bin/bash


APP_NAME="kdore-eventos-web"

DEPLOY_PATH="/data/deploy"
ENVS_PATH="/data/envs"
SERVERS_PATH="/data/servers"

TARGET_PATH="${DEPLOY_PATH}/${APP_NAME}"
NODE_OPTIONS="--max_old_space_size=4096"


if [ -f ~/.bashrc ]; then
  . ~/.bashrc
fi

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

export NODE_OPTIONS=$NODE_OPTIONS

cd $DEPLOY_PATH

echo "versions..."
node -v

echo 'unzip app'

rm -Rf $APP_NAME
unzip $APP_NAME.zip

echo 'configure env...'
cp -f ${ENVS_PATH}/${APP_NAME}.env /data/deploy/${APP_NAME}/.env

echo "deploy now..."

cd $TARGET_PATH

npm install

pm2 stop "${APP_NAME}"
pm2 delete "${APP_NAME}"
pm2 start --name "${APP_NAME}" start.sh

echo "reload proxy..."
cd ${SERVERS_PATH}
docker compose restart proxy