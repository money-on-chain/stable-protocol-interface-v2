FROM node:16.16.0

# Author
MAINTAINER Nicolas Flores & Martin Mulone

WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# copy environments targets
COPY .env ./
COPY .env.rocTestnet ./
COPY .env.flipagoTestnet ./

# build script target
COPY build_target.sh ./
COPY prepare_target.sh ./

CMD /bin/bash -c 'bash ./build_target.sh'
