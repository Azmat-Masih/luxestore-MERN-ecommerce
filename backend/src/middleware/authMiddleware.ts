import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

interface JwtPayload {
    userId: string;
}

import asyncHandler from 'express-async-handler';

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            // Try DB first
            let user = await User.findById(decoded.userId).select('-password');

            // Fallback to Mock Users
            if (!user) {
                const { users: mockUsers } = require('../mockData');
                user = mockUsers.find((u: any) => u._id === decoded.userId.toString());
            }

            if (user) {
                // @ts-ignore
                req.user = user;
                next();
            } else {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

export const admin = (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as admin');
    }
};
