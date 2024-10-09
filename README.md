
# Task Management API

## Description
This is a Node.js-based Task Management API that implements features such as task creation, updating, deletion, and user authentication. The project uses MongoDB for data storage, Redis for caching, and JWT for user authentication. It also includes middleware for security (Helmet), rate limiting, and request/response logging.

## Features
- User Registration and Login: JWT-based authentication with Redis caching for performance.
- Task Management:
  - Create, Update, Delete tasks
  - Get all tasks, with caching to Redis
- Logging Middleware: Logs request details, response status, and response time for better debugging.
- Security: Helmet for setting secure HTTP headers, and rate limiting to prevent brute-force attacks.
- Clustering: Multi-core clustering for better scalability.
- Error Handling: Graceful error handling, with 404 and 500 error responses.

## Technologies Used
- Node.js: Backend server
- Express: Web framework
- MongoDB: Database for storing tasks and user information
- Redis: Caching layer to optimize task fetching
- JWT: User authentication and authorization
- Helmet: HTTP headers for security
- Express-Rate-Limit: Rate limiting to prevent abuse
- Cluster: Multi-core clustering to utilize system resources

## Installation

### Prerequisites
Ensure you have the following installed on your machine:
- Node.js (v14.x or higher)
- MongoDB (installed locally or use MongoDB Atlas)
- Redis (for caching)

### Setup
1. Clone the repository:
    bash
    git clone https://github.com/anubhav9955/task-management-api.git
    cd task-management-api
    

2. Install dependencies
    npm install
    

3. Create a `.env` file in the root directory and add your environment variables:
    
    PORT=5000
    MONGO_URI=your-mongo-db-uri
    JWT_SECRET=your-secret-key
    

4. Start the Redis server (if you have it installed locally):
    bash
    redis-server
    

5. Start the MongoDB server (if running locally):
    bash
    mongod
    

6. Run the application:
    bash
    npm start
    
 

 Health Check:
    Visit `http://localhost:5000/health` to verify that the server is running correctly.

## API Endpoints

### Authentication
- POST `/api/register`: Register a new user.
- POST `/api/login`: Log in and receive a JWT.

### Task Management
- GET `/api/tasks`: Fetch all tasks (with Redis caching).
- POST `/api/tasks`: Create a new task.
- PUT `/api/tasks/:id`: Update an existing task.
- DELETE `/api/tasks/:id`: Delete a task.

## Middleware
- Logging: Logs incoming requests and response times.
- Rate Limiting: Limits requests to prevent abuse.
- Error Handling: Handles validation and unauthorized errors.

## Clustering
The app uses the `cluster` module to take advantage of multi-core systems, automatically restarting worker processes if they fail.
