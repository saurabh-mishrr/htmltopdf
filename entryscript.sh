#!/bin/bash

cp -r /usr/src/cache/node_modules/. /home/node/app/node_modules/
chown -R node:node /home/node/app
cd /home/node/app
exec gulp watch && pm2 start ecosystem.config.js