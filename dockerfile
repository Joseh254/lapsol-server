FROM node:22-alpine

WORKDIR /server

COPY package*.json ./
COPY . .

RUN npm install
RUN npx prisma generate
RUN npx prisma migrate deploy


EXPOSE 3000

CMD [ "node","index.js" ]