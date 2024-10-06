# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Compile TypeScript into JavaScript
RUN npx tsc

# Expose port 3000 to the outside world
EXPOSE 3000

# Define the command to run your app
CMD ["node", "./dist/app.js"]
