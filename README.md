# Horoscope Technical Test Houbron

A simple Express app that returns the zodiac sign based on a provided birthdate. The app uses the `horoscope` library for determining the zodiac sign and includes Swagger for API documentation.

## Features

- Returns the zodiac sign based on birthdate.
- Includes Swagger UI for API documentation.
- Input validation for birthdate query parameter.

## Prerequisites

- Node.js (version 14.x, 16.x, or 20.x recommended)
- npm (Node Package Manager)
- Docker (optional, for containerized deployment)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/horoscope-express-app.git
   cd horoscope-express-app
2. Install dependencies:

   ```sh
   npm install
## Running the App Locally

1. Start the application:

   ```sh
   node app.js
2. Access the API:

   Open your browser or use an API client like Postman to navigate to:

   ```bash
   http://localhost:3000/horoscope?birthdate=1990-01-01
   ```



3. Access Swagger UI:

   Open your browser and navigate to:

   ```bash
   http://localhost:3000/api-docs
   ```

## Running the App with Docker
1. Build the Docker image:

   ```sh
   docker build -t horoscope-express-app .
   ```
2. Run the Docker container:

   ```sh
   docker run -p 3000:3000 horoscope-express-app
   ```
3. Access the API and Swagger UI as described in the previous section.

## Running Tests
The app includes tests for the /horoscope endpoint using Jest and Supertest.

1. Run the tests:

   ```sh
   npm test
   ```

## API Documentation
The app includes Swagger UI for API documentation. After starting the app, you can access the documentation at:

   ```bash
   http://localhost:3000/api-docs
   ```
### Endpoint
#### GET /horoscope
Returns the zodiac sign based on the provided birthdate.

- #### Parameters:

  - birthdate (required): The birthdate in YYYY-MM-DD format.

- #### Responses:

  - `200 OK`: Returns the zodiac sign.
  - `400 Bad Request`: Invalid birthdate format or birthdate not provided.
  - `500 Internal Server Error`: Error processing the birthdate.

Example request:

   ```bash
   GET /horoscope?birthdate=1990-01-01
   ```

Example response:

   ```json
   {
     "zodiacSign": "Capricorn"
   }
   ```
## Dockerfile

The repository includes a Dockerfile for building a Docker image:

  ```Dockerfile
   # Dockerfile
   FROM node:14

   # Create app directory
   WORKDIR /usr/src/app

   # Install app dependencies
   COPY package*.json ./
   RUN npm install

   # Copy app source code
   COPY . .

   # Expose port and start the application
   EXPOSE 3000
   CMD [ "node", "app.js" ]
   ```

## GitHub Actions
The repository includes a GitHub Actions workflow for building the Docker image:

```yaml
# .github/workflows/docker-build.yml
name: Build and Push Docker Image

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1

      - name: Cache Docker layers
        uses: actions/cache@v2
        with:
          path: /tmp/.buildx-cache
          key: ${{ runner.os }}-buildx-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-buildx-

      - name: Log in to Docker Hub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v2
        with:
          push: true
          tags: yourdockerhubusername/horoscope-express-app:latest
```