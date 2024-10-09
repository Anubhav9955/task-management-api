const express = require('express');
const { body, validationResult } = require('express-validator');
const {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/tasks', getAllTasks);

router.post('/tasks',
    authMiddleware,
    body('title').trim().escape().isString().notEmpty().withMessage('Title is required'),
    body('description').trim().escape().isString().notEmpty().withMessage('Description is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    createTask
);

router.put('/tasks/:id',
    authMiddleware,
    body('title').trim().escape().optional().isString(),
    body('description').trim().escape().optional().isString(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    updateTask
);

router.delete('/tasks/:id', authMiddleware, deleteTask);

module.exports = router;
