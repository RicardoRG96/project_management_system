const request = require('supertest');
const fs = require('node:fs');
const path = require('node:path');
const { db, pgp } = require('../../db/config');
const app = require('../../app');
const userRepository = require('./user-repository');

describe('User API endpoints', () => {
    const mockUserId = 4;
    const mockInvalidUserId = 'k';
    const mockNotExistingUserId = 50;
    const mockExistingUserIdWithoutNotifications = 2;
    const mockUserResponse = [
        {
            id: 4,
            username: 'johndoe10',
            email: 'johndoe@gmail.com',
            role: 'guest_user'
        }
    ];
    const mockNotificationId = 2;
    const mockInvalidNotificationId = 'k';
    const mockNotExistingNotificationId = 50;
    const mockNotificationsResponse = [
        {
            id: 1,
            user_id: mockUserId,
            message: 'You have been assigned a new task: \"Design Homepage\"',
            read: false,
            created_at: '2024-07-27T21:04:10.938Z'
        }
    ];
    const mockCommentId = 2;
    const mockInvalidCommentId = 'k';
    const mockNotExistingCommentId = 50;
    const mockExistingUserIdWithoutHistoryComments = 50;
    const mockCommentsResponse = [
        {
            id: 1,
            task_id: 1,
            user_id: 1,
            content: 'I have completed the initial design. Please review and provide feedback.',
            created_at: '2024-07-27T21:04:10.938Z'
        }
    ];
    const mockAttachmentId = 2;
    const mockInvalidAttachmentId = 'k';
    const mockNotExistingAttachmentId = 50;
    const mockExistingUserIdWithoutHistoryAttachmentFiles = 50;
    const mockAttachmentResponse = [
        {
            id: 1,
            task_id: 1,
            filename: 'homepage_design_mockup.png',
            file_path: '/uploads/homepage_design_mockup.png',
            uploaded_by: 1,
            uploaded_at: '2024-07-27T21:04:10.938Z'
        }
    ];
    const mockProjectId = 1;
    const mockInvalidProjectId = 'k';
    const mockNotExistingProjectId = 50;
    const mockExistingUserIdWithoutHistoryProjects = 50;
    const mockProjectsResponse = [
        {
            project_id: 1,
            project_name: 'Website Redesign',
            project_description: 'Complete redesign of the company website.',
            project_manager_id: 1,
            project_manager_name: 'adminUser',
            project_creation_date: '2024-07-27T21:04:10.938Z',
            user_id: 1,
            user_role: 'team_member',
            user_incorporation_date: '2024-07-27T21:04:10.938Z'
        }
    ];
    const mockValidUserRegisterSchema = {
        username: 'johndoe10',
        email: 'johndoe@gmail.com',
        password: 'node1234'
    }
    const mockUserRegisterSchemaWithErrors = {
        username: 'johndoe10',
        email: 'johndoe',
        password: 'node'
    }
    const mockAlreadyExistingUserSchema = {
        username: 'adminUser',
        email: 'admin@example.com',
        password: 'hashedpassword1'
    }

    const mockValidUserCredentials = {
        email: "johndoe@gmail.com",
        password: "node1234"
    }
    const mockInvalidUserCredentials = {
        email: "johndoe",
        password: "node1"
    }
    const mockNotExistingUserCredentials = {
        email: "johndoe1500@gmail.com",
        password: "node4321"
    }

    const mockNotMatchingUserCredentials = {
        email: "johndoe@gmail.com",
        password: "node123456"
    }
    const mockInvalidtoken = 'sadadjsdnllasndnaowqrfjcnl';

    const registerUser = async (userFixture) => {
        return request(app)
            .post('/api/v1.0/user/register')
            .send(userFixture)
    }

    const loginUser = async (userFixture) => {
        return request(app)
            .post('/api/v1.0/user/login')
            .send(userFixture)
    }
    const mockCreateUserNotifications = userRepository.createUserNotifications;
    const mockCreateUserComment = userRepository.createUserComment;
    const mockChangeUserRole = userRepository.changeUserPermissions;
    const mockCreateUserAttachment = userRepository.createUserAttachment;
    const mockCreateProjectMember = userRepository.createProjectMember;
    
    beforeEach(async () => {
        const resetUsersTable = fs.readFileSync(
            path.join(__dirname, '../../scripts/reset/reset_users.sql')
        ).toString();

        const seedUsersTable = fs.readFileSync(
            path.join(__dirname, '../../scripts/seed/seed_users.sql')
        ).toString();

        const resetNotificationsTable = fs.readFileSync(
            path.join(__dirname, '../../scripts/reset/reset_notifications.sql')
        ).toString();

        const seedNotificationsTable = fs.readFileSync(
            path.join(__dirname, '../../scripts/seed/seed_notifications.sql')
        ).toString();

        const resetProjectsTable = fs.readFileSync(
            path.join(__dirname, '../../scripts/reset/reset_projects.sql')
        ).toString();

        const seedProjectsTable = fs.readFileSync(
            path.join(__dirname, '../../scripts/seed/seed_projects.sql')
        ).toString();

        const resetWorkgroupsTable = fs.readFileSync(
            path.join(__dirname, '../../scripts/reset/reset_workgroups.sql')
        ).toString();

        const seedWorkgroupsTable = fs.readFileSync(
            path.join(__dirname, '../../scripts/seed/seed_workgroups.sql')
        ).toString();

        const resetTasksTable = fs.readFileSync(
            path.join(__dirname, '../../scripts/reset/reset_tasks.sql')
        ).toString();

        const seedTasksTable = fs.readFileSync(
            path.join(__dirname, '../../scripts/seed/seed_tasks.sql')
        ).toString();

        const resetCommentsTable = fs.readFileSync(
            path.join(__dirname, '../../scripts/reset/reset_comments.sql')
        ).toString();

        const seedCommentsTable = fs.readFileSync(
            path.join(__dirname, '../../scripts/seed/seed_comments.sql')
        ).toString();

        const resetAttachmentsTable = fs.readFileSync(
            path.join(__dirname, '../../scripts/reset/reset_attachments.sql')
        ).toString();

        const seedAttachmentsTable = fs.readFileSync(
            path.join(__dirname, '../../scripts/seed/seed_attachments.sql')
        ).toString();

        const resetProjectMembersTable = fs.readFileSync(
            path.join(__dirname, '../../scripts/reset/reset_projectMembers.sql')
        ).toString();

        const seedProjectMembersTable = fs.readFileSync(
            path.join(__dirname, '../../scripts/seed/seed_projectMembers.sql')
        ).toString();


        await db.none(resetUsersTable);
        await db.none(resetNotificationsTable);
        await db.none(resetProjectsTable);
        await db.none(resetWorkgroupsTable);
        await db.none(resetTasksTable);
        await db.none(resetCommentsTable);
        await db.none(resetAttachmentsTable);
        await db.none(resetProjectMembersTable);

        await db.none(seedUsersTable);
        await db.none(seedNotificationsTable);
        await db.none(seedProjectsTable);
        await db.none(seedWorkgroupsTable);
        await db.none(seedTasksTable);
        await db.none(seedCommentsTable);
        await db.none(seedAttachmentsTable);
        await db.none(seedProjectMembersTable);
    });

    afterAll(async () => {
        pgp.end();
    });

    describe.skip('GET /api/v1.0/user/:userId', () => {
        it('Should respond with a status 200 if user exists', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}`;

            await registerUser(mockValidUserRegisterSchema);
            const loginUserTest = await loginUser(mockValidUserCredentials);
            const token = loginUserTest.body[0].token;

            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.status).toBeDefined();
            expect(response.body).toStrictEqual(mockUserResponse);
        });

        it('Should respond with a status 401 if no token is provided', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(401);
        });

        it('Should respond with a status 403 if token is invalid', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}`;
            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${mockInvalidtoken}`);

            expect(response.status).toBe(403);
        });

        it('Should respond with a status 404 if user does not exist', async () => {
            const endpoint = `/api/v1.0/user/${mockNotExistingUserId}`;

            await registerUser(mockValidUserRegisterSchema);
            const loginUserTest = await loginUser(mockValidUserCredentials);
            const token = loginUserTest.body[0].token;

            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 500 if userId param is not a number', async () => {
            const endpoint = `/api/v1.0/user/${mockInvalidUserId}`;

            await registerUser(mockValidUserRegisterSchema);
            const loginUserTest = await loginUser(mockValidUserCredentials);
            const token = loginUserTest.body[0].token;

            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
        });
    });

    describe.skip('GET /api/v1.0/user/:userId/notifications', () => {
        it('Should respond with a status 200 if the user exists and has notifications', 
            async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/notifications`;

            await registerUser(mockValidUserRegisterSchema);
            const loginUserTest = await loginUser(mockValidUserCredentials);
            const token = loginUserTest.body[0].token;
            await mockCreateUserNotifications(mockUserId);

            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
        });

        it('Should respond with a status 401 if no token is provided', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/notifications`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(401);
        });

        it('Should respond with a status 403 if token is invalid', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/notifications`;
            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${mockInvalidtoken}`);

            expect(response.status).toBe(403);
        });

        it('Should respond with a status 404 if the user does not exist', async () => {
            const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/notifications`;

            await registerUser(mockValidUserRegisterSchema);
            const loginUserTest = await loginUser(mockValidUserCredentials);
            const token = loginUserTest.body[0].token;

            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 404 if the user has no notifications', async () => {
            const endpoint = `/api/v1.0/user/${mockExistingUserIdWithoutNotifications}/notifications`;
            await registerUser(mockValidUserRegisterSchema);
            const loginUserTest = await loginUser(mockValidUserCredentials);
            const token = loginUserTest.body[0].token;

            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 500 if userId param is not a number', async () => {
            const endpoint = `/api/v1.0/user/${mockInvalidUserId}/notifications`;

            await registerUser(mockValidUserRegisterSchema);
            const loginUserTest = await loginUser(mockValidUserCredentials);
            const token = loginUserTest.body[0].token;

            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
        });
    });

    describe.skip('GET /api/v1.0/user/:userId/notifications/:notificationId', () => {
        it('should respond with a status 200 if userId and notificationId exists', 
            async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/notifications/${mockNotificationId}`;

            await registerUser(mockValidUserRegisterSchema);
            const loginUserTest = await loginUser(mockValidUserCredentials);
            const token = loginUserTest.body[0].token;
            await mockCreateUserNotifications(mockUserId);

            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
        });

        it('Should respond with a status 401 if no token is provided', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/notifications/${mockNotificationId}`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(401);
        });

        it('Should respond with a status 403 if token is invalid', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/notifications/${mockNotificationId}`;
            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${mockInvalidtoken}`);

            expect(response.status).toBe(403);
        });

        it('Should respond with a status 404 if the user does not exist even if the notification exists', 
            async () => {
            const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/notifications/${mockNotificationId}`;

            await registerUser(mockValidUserRegisterSchema);
            const loginUserTest = await loginUser(mockValidUserCredentials);
            const token = loginUserTest.body[0].token;
            await mockCreateUserNotifications(mockUserId);

            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 404 if the notification does not exist even if the user exists', 
            async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/notifications/${mockNotExistingNotificationId}`;

            await registerUser(mockValidUserRegisterSchema);
            const loginUserTest = await loginUser(mockValidUserCredentials);
            const token = loginUserTest.body[0].token;
            await mockCreateUserNotifications(mockUserId);

            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 404 if the user and the notification does not exist', async () => {
            const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/notifications/${mockNotExistingNotificationId}`;

            await registerUser(mockValidUserRegisterSchema);
            const loginUserTest = await loginUser(mockValidUserCredentials);
            const token = loginUserTest.body[0].token;
            await mockCreateUserNotifications(mockUserId);

            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 500 if userId param is not a number, even if the notificationId is valid', 
            async () => {
            const endpoint = `/api/v1.0/user/${mockInvalidUserId}/notifications/${mockNotificationId}`;

            await registerUser(mockValidUserRegisterSchema);
            const loginUserTest = await loginUser(mockValidUserCredentials);
            const token = loginUserTest.body[0].token;
            await mockCreateUserNotifications(mockUserId);

            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
        });  
        
        it('Should respond with a status 500 if notificationId param is not a number, even if the userId is valid', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/notifications/${mockInvalidNotificationId}`;

                await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserNotifications(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(500);
            }
        );

        it('Should respond with a status 500 if userId and notificationId params are not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/notifications/${mockInvalidNotificationId}`;

                await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserNotifications(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(500);
            }
        );
    });

    describe.skip('GET /api/v1.0/user/:userId/history/comments', () => {
        it('Should respond with a status 200 if the user exists, has submitted comments and has permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/comments`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserComment(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body).toBeDefined();
            }
        );

        it('Should respond with a status 401 if no token is provided', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/comments`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(401);
        });

        it('Should respond with a status 403 if token is invalid', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/comments`;
            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${mockInvalidtoken}`);

            expect(response.status).toBe(403);
        });

        it('Should respond with a status 403 if user has not permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/comments`;

                await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserComment(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(403);
            }
        );

        it('Should respond with a status 404 if the user does not exist', async () => {
            const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/comments`;

            await registerUser(mockValidUserRegisterSchema);
            await mockChangeUserRole(mockUserId, 'team_member');
            const loginUserTest = await loginUser(mockValidUserCredentials);
            const token = loginUserTest.body[0].token;
            await mockCreateUserComment(mockUserId);

            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 404 if the user has not submitted comments',
            async () => {
                const endpoint = `/api/v1.0/user/${mockExistingUserIdWithoutHistoryComments}/history/comments`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);
    
                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 500 if the userId param is not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/comments`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);
    
                expect(response.status).toBe(500);
            }
        );
    });

    describe.skip('GET /api/v1.0/user/:userId/history/comments/:commentId',() => {
        it('Should respond with a status 200 if userId, commentId exists and has permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/comments/${mockCommentId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserComment(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body).toBeDefined();
            }
        );

        it('Should respond with a status 401 if no token is provided', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/comments/${mockCommentId}`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(401);
        });

        it('Should respond with a status 403 if token is invalid', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/comments/${mockCommentId}`;
            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${mockInvalidtoken}`);

            expect(response.status).toBe(403);
        });

        it('Should respond with a status 403 if user has not permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/comments`;

                await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserComment(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(403);
            }
        );

        it('Should respond with a status 404 if the user does not exist even if the comment exists', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/comments/${mockCommentId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserComment(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 404 if the comment does not exist even if the userId exists',
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/comments/${mockNotExistingCommentId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 404 if the user and the comment does not exist', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/comments/${mockNotExistingCommentId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 500 if the userId param is not a number even if the commentId is valid', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/comments/${mockCommentId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(500);
            }
        );

        it('Should respond with a status 500 if the commentId param is not a number even if the userId is valid', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/comments/${mockInvalidCommentId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(500);
            }
        );

        it('Should respond with a status 500 if the userId and commentId params are not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/comments/${mockInvalidCommentId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(500);
            }
        );
    });

    describe.skip('GET /api/v1.0/user/:userId/history/attachments', () => {
        it('Should respond with a status 200 if the user exists, has uploaded files and has permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/attachments`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserAttachment(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body).toBeDefined();
            }
        );

        it('Should respond with a status 401 if no token is provided', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/attachments/`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(401);
        });

        it('Should respond with a status 403 if token is invalid', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/attachments/`;
            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${mockInvalidtoken}`);

            expect(response.status).toBe(403);
        });

        it('Should respond with a status 403 if user has not permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/attachments`;

                await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserAttachment(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(403);
            }
        );

        it('Should respond with a status 404 if the user does not exist', async () => {
            const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/attachments`;

            await registerUser(mockValidUserRegisterSchema);
            await mockChangeUserRole(mockUserId, 'team_member');
            const loginUserTest = await loginUser(mockValidUserCredentials);
            const token = loginUserTest.body[0].token;
            await mockCreateUserAttachment(mockUserId);

            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 404 if the user has not uploaded files',
            async () => {
                const endpoint = `/api/v1.0/user/${mockExistingUserIdWithoutHistoryAttachmentFiles}/history/attachments`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserAttachment(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);
    
                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 500 if the userId param is not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/attachments`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserAttachment(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);
    
                expect(response.status).toBe(500);
            }
        );
    });


    describe.skip('GET /api/v1.0/user/:userId/history/attachments/:attachmentId',() => {
        it('Should respond with a status 200 if userId, attachmentId exists and has permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/attachments/${mockAttachmentId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserAttachment(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body).toBeDefined();
            }
        );

        it('Should respond with a status 401 if no token is provided', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/attachments/${mockAttachmentId}`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(401);
        });

        it('Should respond with a status 403 if token is invalid', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/attachments/${mockAttachmentId}`;
            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${mockInvalidtoken}`);

            expect(response.status).toBe(403);
        });

        it('Should respond with a status 403 if user has not permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/attachments/${mockAttachmentId}`;

                await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserAttachment(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(403);
            }
        );

        it('Should respond with a status 404 if the user does not exist even if the attachment file exists', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/attachments/${mockAttachmentId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserAttachment(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 404 if the attachment file does not exist even if the userId exists',
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/attachments/${mockNotExistingAttachmentId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserAttachment(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 404 if the user and the attachment file does not exist', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/attachments/${mockNotExistingAttachmentId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserAttachment(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 500 if the userId param is not a number even if the attachmentId is valid', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/attachments/${mockAttachmentId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserAttachment(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(500);
            }
        );

        it('Should respond with a status 500 if the attachmentId param is not a number even if the userId is valid', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/attachments/${mockInvalidAttachmentId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserAttachment(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(500);
            }
        );

        it('Should respond with a status 500 if the userId and attachmentId params are not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/attachments/${mockInvalidAttachmentId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateUserAttachment(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(500);
            }
        );
    });


    describe.skip('GET /api/v1.0/user/:userId/history/projects', () => {
        it('Should respond with a status 200 if the user exists, has projects participations and has permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/projects`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateProjectMember(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body).toBeDefined();
            }
        );

        it('Should respond with a status 401 if no token is provided', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/projects/`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(401);
        });

        it('Should respond with a status 403 if token is invalid', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/projects/`;
            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${mockInvalidtoken}`);

            expect(response.status).toBe(403);
        });

        it('Should respond with a status 403 if user has not permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/projects/`;

                await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(403);
            }
        );

        it('Should respond with a status 404 if the user does not exist', async () => {
            const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/projects`;

            await registerUser(mockValidUserRegisterSchema);
            await mockChangeUserRole(mockUserId, 'team_member');
            const loginUserTest = await loginUser(mockValidUserCredentials);
            const token = loginUserTest.body[0].token;

            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 404 if the user has not projects participations',
            async () => {
                const endpoint = `/api/v1.0/user/${mockExistingUserIdWithoutHistoryProjects}/history/projects`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);
    
                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 500 if the userId param is not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/projects`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateProjectMember(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);
    
                expect(response.status).toBe(500);
            }
        );
    });

    describe.skip('GET /api/v1.0/user/:userId/history/projects/:projectId',() => {
        it('Should respond with a status 200 if userId and projectId exists', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/projects/${mockProjectId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateProjectMember(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body).toBeDefined();
            }
        );

        it('Should respond with a status 401 if no token is provided', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/projects/${mockProjectId}`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(401);
        });

        it('Should respond with a status 403 if token is invalid', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/projects/${mockProjectId}`;
            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${mockInvalidtoken}`);

            expect(response.status).toBe(403);
        });

        it('Should respond with a status 403 if user has not permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/projects/${mockProjectId}`;

                await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateProjectMember(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(403);
            }
        );

        it('Should respond with a status 404 if the user does not exist even if the project exists', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/projects/${mockProjectId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateProjectMember(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 404 if the projectId does not exist even if the userId exists',
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/projects/${mockNotExistingProjectId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateProjectMember(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 404 if the user and the project does not exist', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/projects/${mockNotExistingProjectId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateProjectMember(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 500 if the userId param is not a number even if the projectId is valid', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/projects/${mockProjectId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateProjectMember(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(500);
            }
        );

        it('Should respond with a status 500 if the projectId param is not a number even if the userId is valid', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/projects/${mockInvalidProjectId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateProjectMember(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(500);
            }
        );

        it('Should respond with a status 500 if the userId and projectId params are not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/projects/${mockInvalidProjectId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateProjectMember(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(500);
            }
        );
    });

    describe.skip('POST /api/v1.0/user/register', () => {
        const endpoint = '/api/v1.0/user/register';

        it('Should respond with a status 201 if the user was created',
            async () => {
                const response = await request(app)
                    .post(endpoint)
                    .send(mockValidUserRegisterSchema)
                    .expect(201);
                
                expect(response.status).toBe(201)
            }
        );

        it('Should respond with a status 400 if the data sent has errors', 
            async () => {
                const response = await request(app)
                    .post(endpoint)
                    .send(mockUserRegisterSchemaWithErrors)
                    .expect(400)

                expect(response.status).toBe(400);
            }
        );

        it('Should respond with status 409 if the user already exists', 
            async () => {
                const response = await request(app)
                    .post(endpoint)
                    .send(mockAlreadyExistingUserSchema)
                    .expect(409)

                expect(response.status).toBe(409);
            }
        );
    });

    describe.skip('POST /api/v1.0/user/login', () => {
        it('Should respond with a status 200 if the correct user credentials are submitted', 
            async () => {
                const registerUserTest = await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockValidUserCredentials);

                expect(registerUserTest.status).toBe(201);
                expect(loginUserTest.status).toBe(200);
            }
        );

        it('Should respond with a status 400 if invalid user credentials are sent', 
            async () => {
                const registerUserTest = await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockInvalidUserCredentials);

                expect(registerUserTest.status).toBe(201);
                expect(loginUserTest.status).toBe(400);
            }
        );

        it('Should respond with a status 401 if the user is not registered',
            async () => {
                const registerUserTest = await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockNotExistingUserCredentials);

                expect(registerUserTest.status).toBe(201);
                expect(loginUserTest.status).toBe(401);
            }
        );

        it('Should respond with a 401 status if the user\'s credentials do not match',
            async () => {
                const registerUserTest = await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockNotMatchingUserCredentials);

                expect(registerUserTest.status).toBe(201);
                expect(loginUserTest.status).toBe(401);
            }
        );
    });
});