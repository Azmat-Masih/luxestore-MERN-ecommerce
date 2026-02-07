import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import User from '../src/models/userModel';

let mongoServer: any;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe('Auth API', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
    };

    describe('POST /api/users', () => {
        it('should register a new user and return a token', async () => {
            const res = await request(app)
                .post('/api/users')
                .send(userData)
                .expect(201);

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', userData.name);
            expect(res.body).toHaveProperty('email', userData.email);
            expect(res.body).not.toHaveProperty('password');

            // Check for HTTP-Only cookie
            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(cookies[0]).toMatch(/jwt/);
        });

        it('should not register a user with duplicate email', async () => {
            await User.create(userData);

            const res = await request(app)
                .post('/api/users')
                .send(userData)
                .expect(400);

            expect(res.body).toHaveProperty('message', 'User already exists');
        });
    });

    describe('POST /api/users/auth', () => {
        beforeEach(async () => {
            // Create user using the app (hashes password) or Model if helper available
            // Using endpoint to ensure password hashing matching logic
            await request(app).post('/api/users').send(userData);
        });

        it('should login with correct credentials', async () => {
            const res = await request(app)
                .post('/api/users/auth')
                .send({ email: userData.email, password: userData.password });

            if (res.status !== 200) {
                console.log('Login failed body:', res.body);
            }

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('email', userData.email);
            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
        });

        it('should not login with incorrect password', async () => {
            await request(app)
                .post('/api/users/auth')
                .send({ email: userData.email, password: 'wrongpassword' })
                .expect(401);
        });
    });

    describe('POST /api/users/logout', () => {
        it('should logout user and clear cookie', async () => {
            const res = await request(app)
                .post('/api/users/logout')
                .expect(200);

            expect(res.body).toHaveProperty('message', 'Logged out successfully');
            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
            // Match jwt= followed optionally by a space or nothing, then semicolon
            expect(cookies[0]).toMatch(/jwt=\s*;/);
        });
    });
});
