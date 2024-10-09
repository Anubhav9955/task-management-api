const express = require('express');
require('dotenv').config();
const cluster = require('cluster');
const os = require('os');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/db');
const taskRoutes = require('./src/routes/taskRoutes');
const authRoutes = require('./src/routes/authRoutes');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork(); // Restart worker
    });
} else {
    connectDB();

    const app = express();

    app.use(helmet()); // Add security headers
    app.use(express.json());

    // Rate limiter middleware
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // 100 requests per IP per window
        message: "Too many requests, please try again later"
    });
    app.use('/api', apiLimiter);

    // Logger Middleware (enhanced with request body and response time logging)
    const loggerMiddleware = (req, res, next) => {
        console.log(`Request: ${req.method} ${req.originalUrl}`);
        console.log(`Request Body: ${JSON.stringify(req.body)}`);

        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(`Response Status: ${res.statusCode}`);
            console.log(`Response Time: ${duration}ms`);
        });

        next();
    };

    app.use(loggerMiddleware); // Apply the logging middleware globally

    // Define routes
    app.use('/api', taskRoutes);
    app.use('/api', authRoutes);

    // 404 Not Found Middleware
    app.use((req, res, next) => {
        res.status(404).json({ message: 'Not Found' });
    });

    // Error Handling Middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message, details: err.errors });
        }
        if (err.name === 'UnauthorizedError') {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.status(500).json({ message: 'Internal server error' });
    });

    // Health check route
    app.get('/health', (req, res) => {
        res.status(200).json({ message: 'OK', workerId: process.pid });
    });

    // Start server and store server instance for graceful shutdown
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started and listening on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log(`Worker ${process.pid} received SIGTERM. Shutting down gracefully...`);
        server.close(() => {
            console.log(`Worker ${process.pid} closed`);
        });
    });
}