# =========================
# Build Stage
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite build (uses .env.production automatically)
RUN npm run build

# =========================
# NGINX Stage
# =========================
FROM nginx:alpine

# Replace default nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built frontend
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
