# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install --legacy-peer-deps

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

ENV DATABASE_PREFIX=mongodb
ENV DATABASE_USER=admin
ENV DATABASE_PASSWORD=admin
ENV DATABASE_HOST=127.0.0.1
ENV DATABASE_NAME=quotes-db


# Start the server using the production build
CMD [ "node", "dist/main.js" ]

