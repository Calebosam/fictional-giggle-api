FROM node:alpine3.19

WORKDIR /app

COPY package.* ./

RUN npm install

COPY . .

CMD [ "npm", "run", "start" ]