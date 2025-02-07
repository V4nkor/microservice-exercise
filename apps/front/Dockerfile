# Stage 1: Build the app
FROM node:22 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm build

# Stage 2: Serve the app with Apache
FROM httpd:2.4

# Copy the built app from the previous stage
COPY --from=build /app/dist/ /usr/local/apache2/htdocs/

# Expose port 80
EXPOSE 80

# Start Apache server
CMD ["httpd-foreground"]