#!/bin/bash

cp -r /usr/src/cache/node_modules/. /home/node/app/node_modules/
chown -R node:node /home/node/app
exec nodemon /home/node/app/dist/index.js