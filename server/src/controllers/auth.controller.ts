import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { validate } from 'class-validator';
import { createToken } from '../utils/jwt';

const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        let user = await userRepository.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User();
        user.email = email;
        user.password = password;
        user.role = 'user'; // Default role

        // Validate user input
        const errors = await validate(user);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        // Save user to database
        await userRepository.save(user);

        // Generate JWT token
        const token = createToken(user);

        // Return user data (without password) and token
        const { password: _, ...userData } = user;
        res.status(201).json({ user: userData, token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = createToken(user);

        // Return user data (without password) and token
        const { password: _, ...userData } = user;
        res.json({ user: userData, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const user = await userRepository.findOne({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password, ...userData } = user;
        res.json(userData);
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
