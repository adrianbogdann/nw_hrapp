# --- Stage 1: Build the React app ---
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 2: Serve the compiled app ---
FROM node:20-alpine

WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist

EXPOSE 5001
CMD ["serve", "-s", "dist", "-l", "5001"]
