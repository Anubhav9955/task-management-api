const Task = require('../models/task');
const redisClient = require('../config/redisClient');

const getAllTasks = async (req, res, next) => {
    try {
        console.log('Fetching all tasks');
        const cachedTasks = await redisClient.get('tasks');
        if (cachedTasks) {
            console.log('Returning cached tasks');
            return res.status(200).json(JSON.parse(cachedTasks));
        }

        const tasks = await Task.find();
        await redisClient.set('tasks', JSON.stringify(tasks), { EX: 3600 });

        console.log('Tasks fetched from MongoDB and cached');
        res.status(200).json(tasks);
    } catch (err) {
        console.error('Error with Redis or MongoDB:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const createTask = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        console.log('Creating new task:', title);
        const newTask = new Task({ title, description });

        await newTask.save();
        await redisClient.del('tasks'); // Invalidate cache

        console.log('New task created:', newTask._id);
        res.status(201).json(newTask);
    } catch (err) {
        console.error('Error creating task:', err);
        next(err);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        console.log(`Updating task ${id}`);
        const updatedTask = await Task.findByIdAndUpdate(id, { title, description }, { new: true });

        if (!updatedTask) {
            console.log(`Task ${id} not found`);
            return res.status(404).json({ message: 'Task not found' });
        }

        await redisClient.del('tasks'); // Invalidate cache

        console.log('Task updated:', updatedTask._id);
        res.status(200).json(updatedTask);
    } catch (err) {
        console.error('Error updating task:', err);
        next(err);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(`Deleting task ${id}`);
        await Task.findByIdAndDelete(id);

        await redisClient.del('tasks'); // Invalidate cache

        console.log(`Task ${id} deleted`);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        console.error('Error deleting task:', err);
        next(err);
    }
};

module.exports = { getAllTasks, createTask, updateTask, deleteTask };