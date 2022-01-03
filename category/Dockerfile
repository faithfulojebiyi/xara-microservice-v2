FROM node:latest

COPY . /app

WORKDIR /app

RUN npm install --production

EXPOSE 5002

CMD npm start