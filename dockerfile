FROM node:18
WORKDIR /usr/src/hooli-baa

RUN npm install jest -save-dev
RUN npm install @aws-sdk/client-dynamodb
RUN npm install aws-sdk
RUN npm install jest-aws-sdk-mock --save-dev
RUN npm install --save-dev @shelf/jest-dynamodb
RUN npm install nodejs
RUN apt-get update && \
    apt-get install -y openjdk-11-jre-headless
COPY ./source/ /usr/src/hooli-baa/
# CMD node -e "console.log(require('./index').handler(require('./event_1.json')));"
# CMD npm test
