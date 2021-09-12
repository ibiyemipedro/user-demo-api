# FROM node:14-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm install glob rimraf

# RUN npm install 

# ADD ./ /app

# EXPOSE 3000

# RUN npm run build

FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

RUN npm run build
