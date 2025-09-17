FROM node:22-alpine

WORKDIR /server

# Copy package files and install dependencies first (cached if unchanged)
COPY package*.json ./
RUN npm install

# Copy rest of the source code
COPY . .

# Generate Prisma client and run migrations
RUN npx prisma generate
# RUN npx prisma migrate deploy

EXPOSE 3000

CMD ["node", "index.js"]
