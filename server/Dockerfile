FROM node:18-alpine

WORKDIR /app

# 1️⃣ Install ALL dependencies (including dev)
COPY package*.json ./
RUN npm install

# 2️⃣ Copy source code
COPY . .

# 3️⃣ Build TypeScript
RUN npm run build

# 4️⃣ Remove dev dependencies (optional but best practice)
RUN npm prune --production

EXPOSE 5000

CMD ["node", "dist/server.js"]