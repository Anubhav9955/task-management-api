const { createClient } = require('redis');

// Create a Redis client with connection options
const client = createClient({
    password: 'V6ejRCXMx8WExLtg4bacqiiYxjq0eIhk',
    socket: {
        host: 'redis-14157.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 14157
    }
});

// Connect to Redis
client.connect()
    .then(() => {
        console.log('Redis connected');
    })
    .catch((err) => {
        console.error('Redis connection error:', err);
    });

module.exports = client;
