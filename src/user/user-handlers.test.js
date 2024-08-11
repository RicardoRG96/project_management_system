const request = require('supertest');
const { pgp } = require('../../db/config');
const app = require('../../app');
const testHelpers = require('../../tests-helpers/tests-utils');
const { registerUser, loginUser } = require('../../tests-helpers/tests-utils');

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

    const mockCommentId = 2;
    const mockInvalidCommentId = 'k';
    const mockNotExistingCommentId = 50;
    const mockExistingUserIdWithoutHistoryComments = 50;

    const mockAttachmentId = 2;
    const mockInvalidAttachmentId = 'k';
    const mockNotExistingAttachmentId = 50;
    const mockExistingUserIdWithoutHistoryAttachmentFiles = 50;

    const mockProjectId = 1;
    const mockInvalidProjectId = 'k';
    const mockNotExistingProjectId = 50;
    const mockExistingUserIdWithoutHistoryProjects = 50;

    const mockWorkgroupId = 1;
    const mockInvalidWorkgroupId = 'k';
    const mockNotExistingWorkgroupId = 50;
    const mockExistingUserIdWithoutWorkgroups = 50;

    const mockTaskId = 3;
    const mockInvalidTaskId = 'k';
    const mockNotExistingTaskId = 50;
    const mockExistingUserIdWithoutTask = 50;

    const mockValidUserRegisterSchema = testHelpers.validUserRegisterSchema;
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

    const mockValidUserCredentials = testHelpers.validUserCredentials;
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
    const mockInvalidtoken = testHelpers.invalidtoken;

    const mockValidUpdateEmailRequest = {
        userId: mockUserId,
        email: mockValidUserRegisterSchema.email
    }
    const mockInvalidUpdateEmailRequest = {
        userId: mockInvalidUserId,
        email: mockInvalidUserCredentials.email
    }
    const mockNotMatchingUpdateEmailRequest = {
        userId: mockNotExistingUserId,
        email: mockValidUserRegisterSchema.email
    }

    const mockValidUpdatePasswordRequest = {
        username: mockValidUserRegisterSchema.username,
        currentPassword: mockValidUserRegisterSchema.password,
        newPassword: 'node.1234'
    }
    const mockInvalidUpdatePasswordRequest = {
        username: 'johndoe10',
        currentPassword: '1234',
        newPassword: '12345'
    }
    const mockNotExistingUsernameForUpdatePasswordRequest = {
        username: 'loremimpsum',
        currentPassword: 'node.1234',
        newPassword: 'node.123456'
    }
    const mockNotMatchingUpdatePasswordRequest = {
        username: mockValidUserRegisterSchema.username,
        currentPassword: 'node.1234',
        newPassword: 'node.123456'
    }

    const mockCreateUserNotifications = testHelpers.createUserNotifications;
    const mockCreateUserComment = testHelpers.createUserComment;
    const mockChangeUserRole = testHelpers.changeUserPermissions;
    const mockCreateUserAttachment = testHelpers.createUserAttachment;
    const mockCreateProjectMember = testHelpers.createProjectMember;
    const mockCreateWorkGroupMember = testHelpers.createWorkGroupMember;
    const mockCreateTask = testHelpers.createTask;
    
    beforeEach(async () => {
        await testHelpers.resetDataBaseTables();
        await testHelpers.seedDataBaseTables();
    });

    afterAll(async () => {
        pgp.end();
    });

    describe('GET /api/v1.0/user/:userId', () => {
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

    describe('GET /api/v1.0/user/:userId/notifications', () => {
        it('Should respond with a status 200 if the user exists, has notifications and permissions', 
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

    describe('GET /api/v1.0/user/:userId/notifications/:notificationId', () => {
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

        it('Should respond with a status 404 if the user does not exist', 
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

        it('Should respond with a status 404 if the notification does not exist', 
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

        it('Should respond with a status 500 if userId param is not a number', 
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
        
        it('Should respond with a status 500 if notificationId param is not a number', 
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

    describe('GET /api/v1.0/user/:userId/history/comments', () => {
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

    describe('GET /api/v1.0/user/:userId/history/comments/:commentId',() => {
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

        it('Should respond with a status 404 if the user does not exist', 
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

        it('Should respond with a status 404 if the comment does not exist',
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

        it('Should respond with a status 500 if the userId param is not a number', 
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

        it('Should respond with a status 500 if the commentId param is not a number', 
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

    describe('GET /api/v1.0/user/:userId/history/attachments', () => {
        it('Should respond with a status 200 if the user exists, has uploaded files, and permissions', 
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


    describe('GET /api/v1.0/user/:userId/history/attachments/:attachmentId',() => {
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

        it('Should respond with a status 404 if the user does not exist', 
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

        it('Should respond with a status 404 if the attachment file does not exist',
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

        it('Should respond with a status 500 if the userId param is not a number', 
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

        it('Should respond with a status 500 if the attachmentId param is not a number', 
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


    describe('GET /api/v1.0/user/:userId/history/projects', () => {
        it('Should respond with a status 200 if the user exists, has projects participations, and permissions', 
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

    describe('GET /api/v1.0/user/:userId/history/projects/:projectId',() => {
        it('Should respond with a status 200 if userId and projectId exists and has permissions', 
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

        it('Should respond with a status 404 if the user does not exist', 
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

        it('Should respond with a status 404 if the projectId does not exist',
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

        it('Should respond with a status 500 if the userId param is not a number', 
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

        it('Should respond with a status 500 if the projectId param is not a number', 
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

    describe('GET /api/v1.0/user/:userId/history/workgroups', () => {
        it('Should respond with a status 200 if userId exists and has permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/workgroups`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateWorkGroupMember(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body).toBeDefined();
            }
        );

        it('Should respond with a status 401 if no token is provided', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/workgroups`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(401);
        });

        it('Should respond with a status 403 if token is invalid', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/workgroups`;
            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${mockInvalidtoken}`);

            expect(response.status).toBe(403);
        });

        it('Should respond with a status 403 if user has not permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/workgroups`;

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

        it('Should respond with a status 404 if the user does not exist', async () => {
            const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/workgroups`;

            await registerUser(mockValidUserRegisterSchema);
            await mockChangeUserRole(mockUserId, 'team_member');
            const loginUserTest = await loginUser(mockValidUserCredentials);
            const token = loginUserTest.body[0].token;

            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 404 if the user has no workgroup assignments.',
            async () => {
                const endpoint = `/api/v1.0/user/${mockExistingUserIdWithoutWorkgroups}/history/workgroups`;

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
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/workgroups`;

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

    describe('GET /api/v1.0/user/:userId/history/workgroups/:workgroupId', () => {
        it('Should respond with a status 200 if the user exists, has workgroups participations, and permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/workgroups/${mockWorkgroupId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member')
                const loginUserTest = await loginUser(mockValidUserCredentials);
                await mockCreateWorkGroupMember(mockUserId);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body).toBeDefined();
            }
        );

        it('Should respond with a status 401 if no token is provided', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/workgroups/${mockWorkgroupId}`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(401);
        });

        it('Should respond with a status 403 if token is invalid', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/workgroups/${mockWorkgroupId}`;
            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${mockInvalidtoken}`);

            expect(response.status).toBe(403);
        });

        it('Should respond with a status 403 if user has not permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/workgroups/${mockWorkgroupId}`;

                await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateWorkGroupMember(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(403);
            }
        );

        it('Should respond with a status 404 if the user does not exist', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/workgroups/${mockWorkgroupId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateWorkGroupMember(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 404 if the workgroupId does not exist',
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/workgroups/${mockNotExistingWorkgroupId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateWorkGroupMember(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 404 if the user and the workgroup does not exist', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/workgroups/${mockNotExistingWorkgroupId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateWorkGroupMember(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 500 if the userId param is not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/workgroups/${mockWorkgroupId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateWorkGroupMember(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(500);
            }
        );

        it('Should respond with a status 500 if the workgroupId param is not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/workgroups/${mockInvalidWorkgroupId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateWorkGroupMember(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(500);
            }
        );

        it('Should respond with a status 500 if the userId and workgroupId params are not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/workgroups/${mockInvalidWorkgroupId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateWorkGroupMember(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(500);
            }
        );
    });

    describe('GET /api/v1.0/user/:userId/history/tasks', () => {
        it('Should respond with a status 200 if user exists, has tasks and has permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/tasks`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body).toBeDefined();
            }
        );

        it('Should respond with a status 401 if no token is provided', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/tasks`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(401);
        });

        it('Should respond with a status 403 if token is invalid', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/tasks`;
            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${mockInvalidtoken}`);

            expect(response.status).toBe(403);
        });

        it('Should respond with a status 403 if user has not permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/tasks`;

                await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(403);
            }
        );

        it('Should respond with a status 404 if the user does not exist', async () => {
            const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/tasks`;

            await registerUser(mockValidUserRegisterSchema);
            await mockChangeUserRole(mockUserId, 'team_member');
            const loginUserTest = await loginUser(mockValidUserCredentials);
            const token = loginUserTest.body[0].token;

            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 404 if the user has no tasks assigned.',
            async () => {
                const endpoint = `/api/v1.0/user/${mockExistingUserIdWithoutTask}/history/tasks`;

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
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/tasks`;

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

    describe('GET /api/v1.0/user/:userId/history/tasks/:taskId', () => {
        it('Should respond with a status 200 if the user exists, has tasks, and permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/tasks/${mockTaskId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200)
                expect(response.body).toBeDefined();
            }
        );

        it('Should respond with a status 401 if no token is provided', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/tasks/${mockTaskId}`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(401);
        });

        it('Should respond with a status 403 if token is invalid', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/history/tasks/${mockTaskId}`;
            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${mockInvalidtoken}`);

            expect(response.status).toBe(403);
        });

        it('Should respond with a status 403 if user has not permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/tasks/${mockTaskId}`;

                await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(403);
            }
        );

        it('Should respond with a status 404 if the user does not exist', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/tasks/${mockTaskId}`;
    
                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);
    
                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);
    
                expect(response.status).toBe(404);
            }
        );
    
        it('Should respond with a status 404 if the taskId does not exist',
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/tasks/${mockNotExistingTaskId}`;
    
                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);
    
                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);
    
                expect(response.status).toBe(404);
            }
        );
    
        it('Should respond with a status 404 if the user and the task does not exist', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/tasks/${mockNotExistingTaskId}`;
    
                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);
    
                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);
    
                expect(response.status).toBe(404);
            }
        );
    
        it('Should respond with a status 500 if the userId param is not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/tasks/${mockTaskId}`;
    
                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);
    
                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);
    
                expect(response.status).toBe(500);
            }
        );
    
        it('Should respond with a status 500 if the taskId param is not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/tasks/${mockInvalidTaskId}`;
    
                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);
    
                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);
    
                expect(response.status).toBe(500);
            }
        );
    
        it('Should respond with a status 500 if the userId and taskId params are not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/tasks/${mockInvalidTaskId}`;
    
                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);
    
                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);
    
                expect(response.status).toBe(500);
            }
        );
    });

    describe('GET /api/v1.0/user/:userId/currently-assigned-tasks', () => {
        it('Should respond with a status 200 if the user exists, has assigned tasks, and permissions.', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/currently-assigned-tasks`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200)
                expect(response.body).toBeDefined();
            }
        );

        it('Should respond with a status 401 if no token is provided', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/currently-assigned-tasks`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(401);
        });

        it('Should respond with a status 403 if token is invalid', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/currently-assigned-tasks`;
            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${mockInvalidtoken}`);

            expect(response.status).toBe(403);
        });

        it('Should respond with a status 403 if user has not permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/currently-assigned-tasks`;

                await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(403);
            }
        );

        it('Should respond with a status 404 if the user does not exist', async () => {
            const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/currently-assigned-tasks`;

            await registerUser(mockValidUserRegisterSchema);
            await mockChangeUserRole(mockUserId, 'team_member');
            const loginUserTest = await loginUser(mockValidUserCredentials);
            const token = loginUserTest.body[0].token;

            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 404 if the user has no tasks assigned.',
            async () => {
                const endpoint = `/api/v1.0/user/${mockExistingUserIdWithoutTask}/currently-assigned-tasks`;

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
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/currently-assigned-tasks`;

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

    describe('GET /api/v1.0/user/:userId/currently-assigned-tasks/:taskId', () => {
        it('Should respond with a status 200 if user exists, taskId exists, and has permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/currently-assigned-tasks/${mockTaskId}`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body).toBeDefined();
            }
        );

        it('Should respond with a status 401 if no token is provided', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/currently-assigned-tasks/${mockTaskId}`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(401);
        });

        it('Should respond with a status 403 if token is invalid', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/currently-assigned-tasks/${mockTaskId}`;
            const response = await request(app)
                .get(endpoint)
                .set('Authorization', `Bearer ${mockInvalidtoken}`);

            expect(response.status).toBe(403);
        });

        it('Should respond with a status 403 if user has not permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/currently-assigned-tasks/${mockTaskId}`;

                await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);

                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(403);
            }
        );

        it('Should respond with a status 404 if the user does not exist', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/currently-assigned-tasks/${mockTaskId}`;
    
                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);
    
                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);
    
                expect(response.status).toBe(404);
            }
        );
    
        it('Should respond with a status 404 if the taskId does not exist',
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/currently-assigned-tasks/${mockNotExistingTaskId}`;
    
                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);
    
                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);
    
                expect(response.status).toBe(404);
            }
        );
    
        it('Should respond with a status 404 if the user and the task does not exist', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/currently-assigned-tasks/${mockNotExistingTaskId}`;
    
                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);
    
                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);
    
                expect(response.status).toBe(404);
            }
        );
    
        it('Should respond with a status 500 if the userId param is not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/currently-assigned-tasks/${mockTaskId}`;
    
                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);
    
                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);
    
                expect(response.status).toBe(500);
            }
        );
    
        it('Should respond with a status 500 if the taskId param is not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/currently-assigned-tasks/${mockInvalidTaskId}`;
    
                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);
    
                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);
    
                expect(response.status).toBe(500);
            }
        );
    
        it('Should respond with a status 500 if the userId and taskId params are not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/currently-assigned-tasks/${mockInvalidTaskId}`;
    
                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                await mockCreateTask(mockUserId);
    
                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${token}`);
    
                expect(response.status).toBe(500);
            }
        );
    });

    describe('POST /api/v1.0/user/register', () => {
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

    describe('POST /api/v1.0/user/login', () => {
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

    describe('PATCH /api/v1.0/user/update-email', () => {
        it('Should respond with a status 204 if the email update is successful', 
            async () => {
                const endpoint = `/api/v1.0/user/update-email`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .patch(endpoint)
                    .send(mockValidUpdateEmailRequest)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(204);
            }
        );

        it('Should respond with a status 304 if email was not updated', 
            async () => {
                const endpoint = `/api/v1.0/user/update-email`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .patch(endpoint)
                    .send(mockNotMatchingUpdateEmailRequest)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(304);
            }
        );

        it('Should respond with a status 400 if invalid data are sent', 
            async () => {
                const endpoint = `/api/v1.0/user/update-email`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .patch(endpoint)
                    .send(mockInvalidUpdateEmailRequest)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(400);
            }
        );

        it('Should respond with a status 401 if no token is provided', async () => {
            const endpoint = `/api/v1.0/user/update-email`;
            const response = await request(app)
                .patch(endpoint)
                .send(mockValidUpdateEmailRequest);

            expect(response.status).toBe(401);
        });

        it('Should respond with a status 403 if token is invalid', async () => {
            const endpoint = `/api/v1.0/user/update-email`;
            const response = await request(app)
                .patch(endpoint)
                .send(mockValidUpdateEmailRequest)
                .set('Authorization', `Bearer ${mockInvalidtoken}`);

            expect(response.status).toBe(403);
        });

        it('Should respond with a status 403 if user has not permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/update-email`;

                await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .patch(endpoint)
                    .send(mockValidUpdateEmailRequest)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(403);
            }
        );
    });

    describe('PATCH /api/v1.0/user/update-password', () => {
        it('Should respond with a status 204 if the password update is successful', 
            async () => {
                const endpoint = `/api/v1.0/user/update-password`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;
                
                const response = await request(app)
                    .patch(endpoint)
                    .send(mockValidUpdatePasswordRequest)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(204);
            }
        );

        it('Should respond with a status 304 if password was not updated', 
            async () => {
                const endpoint = `/api/v1.0/user/update-password`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .patch(endpoint)
                    .send(mockNotMatchingUpdatePasswordRequest)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(304);
            }
        );

        it('Should respond with a status 400 if invalid data are sent', 
            async () => {
                const endpoint = `/api/v1.0/user/update-password`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .patch(endpoint)
                    .send(mockInvalidUpdatePasswordRequest)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(400);
            }
        );

        it('Should respond with a status 401 if no token is provided', 
            async () => {
                const endpoint = `/api/v1.0/user/update-password`;
                const response = await request(app)
                    .patch(endpoint)
                    .send(mockValidUpdatePasswordRequest);

                expect(response.status).toBe(401);
        });

        it('Should respond with a status 403 if token is invalid', async () => {
            const endpoint = `/api/v1.0/user/update-password`;
            const response = await request(app)
                .patch(endpoint)
                .send(mockValidUpdatePasswordRequest)
                .set('Authorization', `Bearer ${mockInvalidtoken}`);

            expect(response.status).toBe(403);
        });

        it('Should respond with a status 403 if user has not permissions', 
            async () => {
                const endpoint = `/api/v1.0/user/update-password`;

                await registerUser(mockValidUserRegisterSchema);
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .patch(endpoint)
                    .send(mockValidUpdatePasswordRequest)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(403);
            }
        );

        it('Should respond with a status 404 if username does not exists', 
            async () => {
                const endpoint = `/api/v1.0/user/update-password`;

                await registerUser(mockValidUserRegisterSchema);
                await mockChangeUserRole(mockUserId, 'team_member');
                const loginUserTest = await loginUser(mockValidUserCredentials);
                const token = loginUserTest.body[0].token;

                const response = await request(app)
                    .patch(endpoint)
                    .send(mockNotExistingUsernameForUpdatePasswordRequest)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(404);
            }
        );
    });
});