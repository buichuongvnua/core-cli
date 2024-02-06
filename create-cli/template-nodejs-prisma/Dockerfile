FROM node:alpine
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npx prisma generate
CMD node server.js

