const request = require('supertest');
const fs = require('node:fs');
const path = require('node:path');
const { db, pgp } = require('../../db/config');
const app = require('../../app');

describe('User API endpoints', () => {
    const mockUser = [
        {
            id: 1,
            username: 'adminUser',
            email: 'admin@example.com',
            role: 'admin'
        }
    ]

    beforeEach(async () => {
        const resetUsersTable = fs.readFileSync(path.join(__dirname, './scripts/reset/reset_users.sql')).toString();
        const seedUsersTable = fs.readFileSync(path.join(__dirname, './scripts/seed/seed_users.sql')).toString();

        await db.none(resetUsersTable);
        await db.none(seedUsersTable);
    });

    afterAll(async () => {
        pgp.end();
    });

    describe('GET /api/v1.0/user/:userId', () => {
        const endpoint = '/api/v1.0/user/1';
        const wrongEndpoint = '/api/v1.0/user/g';
        const notFoundEndpoint = '/api/v1.0/user/40';

        it('Should get one user if user exists', async () => {
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(mockUser);
        })
    })
})