const request = require('supertest');
const { pgp } = require('../../db/config');
const app = require('../../app');
const testHelpers = require('../../tests-helpers/tests-utils');

describe('Tasks API endpoints', () => {
    const mockUserId = 4
    const mockNotExistingUserId = 50;
    const mockCreateTaskRequest = {
        project_id: 1,
        workgroup_id: 2,
        title: 'Payment functionality',
        description: 'Integrate the external payment API with the backend system.',
        status: 'in_progress',
        assigned_to: 4,
        due_date: '2024-08-22'
    }
    const mockCreateTaskBadRequest = {
        project_id: '1',
        workgroup_id: '2',
        title: '',
        description: 'Integrate the external payment API with the backend system.',
        status: 'in_progress',
        assigned_to: 4,
        due_date: '2024-08-22'
    }
    const mockCreateTaskWithNotExistingUserId = {
        project_id: 1,
        workgroup_id: 2,
        title: 'Payment functionality',
        description: 'Integrate the external payment API with the backend system.',
        status: 'in_progress',
        assigned_to: mockNotExistingUserId,
        due_date: '2024-08-22'
    }
    const mockCreateTaskWithNotExistingProjectId = {
        project_id: 1,
        workgroup_id: 2,
        title: 'Payment functionality',
        description: 'Integrate the external payment API with the backend system.',
        status: 'in_progress',
        assigned_to: 10,
        due_date: '2024-08-22'
    }
    const mockCreateTaskWithNotExistingWorkgroupId = {
        project_id: 1,
        workgroup_id: 2,
        title: 'Payment functionality',
        description: 'Integrate the external payment API with the backend system.',
        status: 'in_progress',
        assigned_to: 50,
        due_date: '2024-08-22'
    }

    beforeEach(async () => {
        await testHelpers.resetDataBaseTables();
        await testHelpers.seedDataBaseTables();
    });

    afterAll(async () => {
        pgp.end();
    });

    describe('POST /api/v1.0/tasks/create-task', () => {
        const endpoint = '/api/v1.0/tasks/create-task';

        it('Should respond with a status 201 if a task was created and a notification was sent', 
            async () => {
                await testHelpers.registerUser(testHelpers.validUserRegisterSchema);
                await testHelpers.changeUserPermissions(mockUserId, 'admin');
                const loginUserTest = await testHelpers.loginUser(testHelpers.validUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .post(endpoint)
                    .send(mockCreateTaskRequest)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(201);
                expect(response.body).toBeDefined();
            }
        );

        it('Should respond with a status 400 if invalid data was sent', 
            async () => {
                await testHelpers.registerUser(testHelpers.validUserRegisterSchema);
                await testHelpers.changeUserPermissions(mockUserId, 'admin');
                const loginUserTest = await testHelpers.loginUser(testHelpers.validUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .post(endpoint)
                    .send(mockCreateTaskBadRequest)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(400);
            }
        )

        it('Should respond with a status 401 if no token is provided', async () => {
            const response = await request(app)
                .post(endpoint)
                .send(mockCreateTaskRequest);

            expect(response.status).toBe(401);
        });

        it('Should respond with a status 403 if token is invalid', async () => {
            const response = await request(app)
                .post(endpoint)
                .send(mockCreateTaskRequest)
                .set('Authorization', `Bearer ${testHelpers.invalidtoken}`);

            expect(response.status).toBe(403);
        });

        it('Should respond with a status 403 if user has not permissions', 
            async () => {
                await testHelpers.registerUser(testHelpers.validUserRegisterSchema);
                const loginUserTest = await testHelpers.loginUser(testHelpers.validUserCredentials);
                const token = loginUserTest.body[0].token;
                await testHelpers.changeUserPermissions(mockUserId);

                const response = await request(app)
                    .post(endpoint)
                    .send(mockCreateTaskRequest)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(403);
            }
        );

        it('Should respond with a status 500 if userId does not exists', 
            async () => {
                await testHelpers.registerUser(testHelpers.validUserRegisterSchema);
                await testHelpers.changeUserPermissions(mockUserId, 'admin');
                const loginUserTest = await testHelpers.loginUser(testHelpers.validUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .post(endpoint)
                    .send(mockCreateTaskWithNotExistingUserId)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(500);
            }
        );

        it('Should respond with a status 500 if project_id does not exists', 
            async () => {
                await testHelpers.registerUser(testHelpers.validUserRegisterSchema);
                await testHelpers.changeUserPermissions(mockUserId, 'admin');
                const loginUserTest = await testHelpers.loginUser(testHelpers.validUserCredentials);
                const token = loginUserTest.body[0].token;
                await testHelpers.changeUserPermissions(mockUserId);

                const response = await request(app)
                    .post(endpoint)
                    .send(mockCreateTaskWithNotExistingProjectId)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(500);
            }
        );

        it('Should respond with a status 500 if workgroup_id does not exists', 
            async () => {
                await testHelpers.registerUser(testHelpers.validUserRegisterSchema);
                await testHelpers.changeUserPermissions(mockUserId, 'admin');
                const loginUserTest = await testHelpers.loginUser(testHelpers.validUserCredentials);
                const token = loginUserTest.body[0].token;
                await testHelpers.changeUserPermissions(mockUserId);

                const response = await request(app)
                    .post(endpoint)
                    .send(mockCreateTaskWithNotExistingWorkgroupId)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(500);
            }
        );
    });
})