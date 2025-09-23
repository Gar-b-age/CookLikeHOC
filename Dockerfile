# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the static site
RUN npm run docs:build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built static files from the builder stage
COPY --from=builder /app/.vitepress/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]