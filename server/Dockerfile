# Stage 1: Build Environment
FROM node:20-alpine AS builder

# Set the root working directory
WORKDIR /app

# 1. Copy the shared folder into the container
COPY shared ./shared

# 2. Set working directory to the server folder
WORKDIR /app/server

# 3. Copy server package files and prisma
COPY server/package*.json ./
COPY server/prisma ./prisma/

# Install dependencies and generate Prisma Client
RUN npm ci
RUN npx prisma generate

# 4. Copy the rest of the server code
COPY server/ .

# Build the NestJS application
RUN npm run build


# Stage 2: Production Environment
FROM node:20-alpine AS production

WORKDIR /app/server

ENV NODE_ENV=production

# Copy package files and Prisma schema
COPY server/package*.json ./
COPY server/prisma ./prisma/

# Install ONLY production dependencies and generate Prisma client
RUN npm ci --only=production
RUN npx prisma generate

# Copy the compiled dist folder from the builder stage
COPY --from=builder /app/server/dist ./dist

# CHANGE 1: Give the built-in 'node' user ownership of the app files
RUN chown -R node:node /app

# CHANGE 2: Switch from the 'root' user to the 'node' user
USER node

EXPOSE 3000

# Start the application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server/src/main.js"]