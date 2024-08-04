# node docker has image node:19-alpine.3.16
# setup os - use alpine
FROM node:19-alpine3.16

# for this image, Docker runs with a user called node

# create node_modules directory
# change ownership of app directory to node
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# where docker will run the app
WORKDIR /home/node/app

# copy files from local computer to docker container
COPY --chown=node:node package*.json ./

# switch to node user
USER node

RUN npm install

# copy all files from local computer to docker container
COPY --chown=node:node . .

EXPOSE 3000

CMD ["node", "app.js"]
