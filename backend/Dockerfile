# --- Stage 1: Build the NestJS app ---
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
# Install all deps (including dev) to compile TypeScript
RUN npm install

COPY tsconfig*.json ./
COPY src ./src

# Compile TypeScript into dist/
RUN npm run build

# --- Stage 2: Production runtime ---
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# Copy the compiled output from builder
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]
