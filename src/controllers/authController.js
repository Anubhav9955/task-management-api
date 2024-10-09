const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redisClient');

const register = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await redisClient.set(`user:${user._id}`, JSON.stringify(user), { EX: 3600 });

        res.json({ token });
    } catch (err) {
        next(err);
    }
};


module.exports = { register, login };
