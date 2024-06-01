# Use an official node image as the base image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Serve the built app using a lightweight web server
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
