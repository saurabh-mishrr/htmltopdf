FROM node:12-slim
RUN mkdir /usr/src/cache
WORKDIR /usr/src/cache
COPY package*.json ./
RUN apt-get update && \
    npm install typescript pm2 gulp-cli -g && \
    npm install --quite && \
    mkdir -p /home/node/app/node_modules && \
    apt-get install --no-install-recommends xvfb gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 \
    libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 \
    libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
    libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 \
    libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget \ 
    fonts-noto fonts-noto-cjk -y && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /home/node/app
COPY . .
VOLUME [ "/home/node/app", "/home/node/app/node_modules" ]
EXPOSE 5001
CMD  ["/bin/bash", "/home/node/app/entryscript.sh"]