FROM node:22-alpine as dev
WORKDIR /app
COPY package*.json ./
RUN npm install
# Add prom-client explicitly
RUN npm install prom-client
COPY . .
EXPOSE 5000
CMD [ "npx", "nodemon", "index.js" ]

FROM node:22-alpine as prod
WORKDIR /app
COPY package*.json ./
RUN npm install
# Add prom-client explicitly
RUN npm install prom-client
COPY . .
EXPOSE 5000
CMD [ "node", "index.js" ]