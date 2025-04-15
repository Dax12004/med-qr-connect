
import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();

// Get all users
router.get('/', UserController.getAllUsers);

// Get user by ID
router.get('/:id', UserController.getUser);

// Create new user
router.post('/', UserController.createUser);

export default router;
