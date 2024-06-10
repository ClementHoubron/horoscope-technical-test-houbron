FROM node:14

# Create and change to the app directory.
WORKDIR /usr/src/app

# Install production dependencies.
COPY package*.json ./
RUN npm install

# Copy local code to the container image.
COPY . .

# Run the web service on container startup.
CMD [ "node", "app.js" ]

# Inform Docker that the container listens on port 3000.
EXPOSE 3000