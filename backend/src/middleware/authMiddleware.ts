import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { users as mockUsers } from '../mockData';

interface JwtPayload {
    userId: string;
}

import asyncHandler from 'express-async-handler';

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123') as JwtPayload;

            // Try DB first
            let user = null;
            if (mongoose.Types.ObjectId.isValid(decoded.userId)) {
                user = await User.findById(decoded.userId).select('-password');
            }

            // Fallback to Mock Users
            if (!user) {
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
