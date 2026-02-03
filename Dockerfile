FROM node:25-alpine

EXPOSE 8080
ARG WORK_DIR="/appstorage"
ARG UID=1337
ARG USERNAME=ogsh

WORKDIR $WORK_DIR
ADD . .
RUN adduser --uid $UID --disabled-password --gecos "" $USERNAME && chown -R $UID $WORK_DIR
USER $USERNAME

ENTRYPOINT ["node", "build/appstorage.js"]