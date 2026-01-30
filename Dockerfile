FROM node:25-alpine

EXPOSE 8080
ARG WORK_DIR="/apparchive"
ARG UID=1337
ARG USERNAME=ogsh
ARG NODE_AUTH_TOKEN

WORKDIR $WORK_DIR
RUN adduser --uid $UID --disabled-password --gecos "" $USERNAME && chown -R $UID $WORK_DIR
USER $USERNAME

ADD package.json package.json
ADD tsconfig.json tsconfig.json
ADD src src
ADD .npmrc .npmrc

RUN export "NODE_AUTH_TOKEN=$NODE_AUTH_TOKEN" && npm i
RUN tsc

RUN rm -rf src package.json package-lock.json tsconfig.json .npmrc

ENTRYPOINT ["node", "build/apparchive.js"]