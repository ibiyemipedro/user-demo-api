FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install 

ADD ./ /app

EXPOSE 3001

# CMD ["npm", "run", "start:dev"];
