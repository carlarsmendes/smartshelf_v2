# IH-smartshelf-project3

## Table of Contents
- [IH-smartshelf-project3](#ih-smartshelf-project3)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Installation and Setup](#installation-and-setup)
    - [Prerequisites](#prerequisites)
    - [Environment Variables](#environment-variables)
    - [Database Configuration](#database-configuration)
    - [Running the Application](#running-the-application)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [Team](#team)
  - [License](#license)

## Introduction

SmartShelf is a web application that allows users to create and join libraries, share books, and borrow books from other members. The project was developed as part of the Ironhack Web Development Bootcamp in Lisbon.

## Features

- Users can create and join libraries
- Users can upload available books to share with other members  
- Users can add new books, leave reviews with ratings, and borrow books
- Nearby libraries are displayed on a map, showing available books
- Users can send invitations via email to join libraries

## Technologies Used

- MERN Stack - MongoDB, Express.js, React and Node
- Reactstrap + Bootstrap  
- Mapbox
- Nodemailer
- Google Books API
- Cloudinary

## Installation and Setup

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account

### Environment Variables

Create a `.env` file in the `server` directory and add the following variables (You should add your own):

```
MONGODB_URI=<your_mongodb_atlas_uri>
SESSION_SECRET=anysessionsecret
PORT=6000
```

Note: Replace `<your_mongodb_atlas_uri>` with the connection string for your MongoDB Atlas cluster, without `<>`.

### Database Configuration

The application uses MongoDB Atlas as the database. Make sure you have a MongoDB Atlas account and create a new cluster.

### Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

   This will start both the client and server in development mode.

## Testing

The application uses Jest and Supertest for testing. To run the tests:

```bash
cd server
npm test
```

This will run the tests in the `tests` folder.

## Deployment

The application is currently not deployed. Once you have set up your deployment environment, you can build the production version of the client:

```bash
cd client
npm run build-prod
```

This will create an optimized production build in the `build` folder.

## Contributing

If you would like to contribute to the project, please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them
4. Push your changes to your forked repository
5. Create a pull request to the original repository

## Team

- Guilherme Carmona
- Natasha Silva
- Carla Mendes

## License

This project is licensed under the [MIT License](LICENSE).