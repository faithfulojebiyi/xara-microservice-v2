FROM node:latest

COPY . /app

WORKDIR /app

RUN npm install --production

EXPOSE 5003

CMD npm start