const request = require('supertest');
const fs = require('node:fs');
const path = require('node:path');
const { db, pgp } = require('../../db/config');
const app = require('../../app');

describe('User API endpoints', () => {
    const mockUserId = 1;
    const mockInvalidUserId = 'k';
    const mockNotExistingUserId = 50;
    const mockExistingUserIdWithoutNotifications = 2;
    const mockUser = [
        {
            id: 1,
            username: 'adminUser',
            email: 'admin@example.com',
            role: 'admin'
        }
    ];

    const mockNotifications = [
        {
            id: 1,
            user_id: mockUserId,
            message: 'You have been assigned a new task: \"Design Homepage\"',
            read: false,
            created_at: '2024-07-27T21:04:10.938Z'
        },
        {
            id: 2,
            user_id: mockUserId,
            message: 'John commented on your task: \"Great work on the initial design!\"',
            read: false,
            created_at: '2024-07-27T21:04:10.938Z'
        }
    ];

    beforeEach(async () => {
        const resetUsersTable = fs.readFileSync(path.join(__dirname, './scripts/reset/reset_users.sql')).toString();
        const seedUsersTable = fs.readFileSync(path.join(__dirname, './scripts/seed/seed_users.sql')).toString();
        const resetNotificationsTable = fs.readFileSync(path.join(__dirname, './scripts/reset/reset_notifications.sql')).toString();
        const seedNotificationsTable = fs.readFileSync(path.join(__dirname, './scripts/seed/seed_notifications.sql')).toString();

        await db.none(resetUsersTable);
        await db.none(resetNotificationsTable);
        await db.none(seedUsersTable);
        await db.none(seedNotificationsTable);
    });

    afterAll(async () => {
        pgp.end();
    });

    describe.skip('GET /api/v1.0/user/:userId', () => {
        it('Should respond with a status 200 if user exists', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(200);
            expect(response.status).toBeDefined();
            expect(response.body).toStrictEqual(mockUser);
        });

        it('Should respond with a status 404 if user does not exist', async () => {
            const endpoint = `/api/v1.0/user/${mockNotExistingUserId}`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 500 if userId param is not a number', async () => {
            const endpoint = `/api/v1.0/user/${mockInvalidUserId}`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(500);
        });
    });

    describe('GET /api/v1.0/user/:userId/notifications', () => {
        it('Should respond with a status 200 if the user exists and has notifications', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/notifications`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(200);
            expect(response.status).toBeDefined();
            expect(response.body).toStrictEqual(mockNotifications);
        });

        it('Should respond with a status 404 if the user does not exist', async () => {
            const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/notifications`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 404 if the user has no notifications', async () => {
            const endpoint = `/api/v1.0/user/${mockExistingUserIdWithoutNotifications}/notifications`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 500 if userId param is not a number', async () => {
            const endpoint = `/api/v1.0/user/${mockInvalidUserId}`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(500);
        });
    });
});