# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Define build arguments for Vite environment variables
ARG VITE_APP_NAME="PokéRegion Explorer"
ARG VITE_APP_VERSION="1.0.0"

# Set environment variables from build args
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_VERSION=$VITE_APP_VERSION

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i --only=production=false

# Copy source code
COPY . .

# Build the application (env vars are embedded during build)
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
