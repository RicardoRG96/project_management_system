const request = require('supertest');
const fs = require('node:fs');
const path = require('node:path');
const { db, pgp } = require('../../db/config');
const app = require('../../app');
const createHttpError = require('http-errors');

describe('User API endpoints', () => {
    const mockUserId = 1;
    const mockInvalidUserId = 'k';
    const mockNotExistingUserId = 50;
    const mockExistingUserIdWithoutNotifications = 2;
    const mockUserResponse = [
        {
            id: 1,
            username: 'adminUser',
            email: 'admin@example.com',
            role: 'admin'
        }
    ];
    const mockNotificationId = 1;
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
    const mockCommentId = 1;
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
    const mockAttachmentId = 1;
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
        username: 'ricardo10',
        email: 'ricardo10@gmail.com',
        password: 'ricardo.100',
        role: 'admin'
    }
    const mockUserRegisterSchemaWithErrors = {
        username: 'ricardo10',
        email: 'ricardo10',
        password: '12345',
        role: 'admin'
    }
    const mockInvalidUserRegisterSchema = {
        name: 'ricardo10',
        email: 'ricardo10',
        password: '12345',
        role: 'admin',
        age: 25
    }
    const mockAlreadyExistingUserSchema = {
        username: 'adminUser',
        email: 'admin@example.com',
        password: 'hashedpassword1',
        role: 'admin'
    }
    
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
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(200);
            expect(response.status).toBeDefined();
            expect(response.body).toStrictEqual(mockUserResponse);
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

    describe.skip('GET /api/v1.0/user/:userId/notifications', () => {
        it('Should respond with a status 200 if the user exists and has notifications', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/notifications`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(200);
            expect(response.status).toBeDefined();
            expect(response.body).toStrictEqual(mockNotificationsResponse);
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
            const endpoint = `/api/v1.0/user/${mockInvalidUserId}/notifications`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(500);
        });
    });

    describe.skip('GET /api/v1.0/user/:userId/notifications/:notificationId', () => {
        it('should respond with a status 200 if userId and notificationId exists', async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/notifications/${mockNotificationId}`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(200);
            expect(response.status).toBeDefined();
            expect(response.body).toStrictEqual(mockNotificationsResponse);
        });

        it('Should respond with a status 404 if the user does not exist even if the notification exists', 
            async () => {
            const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/notifications/${mockNotificationId}`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 404 if the notification does not exist even if the user exists', 
            async () => {
            const endpoint = `/api/v1.0/user/${mockUserId}/notifications/${mockNotExistingNotificationId}`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 404 if the user and the notification does not exist', async () => {
            const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/notifications/${mockNotExistingNotificationId}`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 500 if userId param is not a number, even if the notificationId is valid', 
            async () => {
            const endpoint = `/api/v1.0/user/${mockInvalidUserId}/notifications/${mockNotificationId}`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(500);
        });  
        
        it('Should respond with a status 500 if notificationId param is not a number, even if the userId is valid', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/notifications/${mockInvalidNotificationId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(500);
            }
        );

        it('Should respond with a status 500 if userId and notificationId params are not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/notifications/${mockInvalidNotificationId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(500);
            }
        );
    });

    describe.skip('GET /api/v1.0/user/:userId/history/comments', () => {
        it('Should respond with a status 200 if the user exists and has submitted comments', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/comments`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(200);
                expect(response.status).toBeDefined();
                expect(response.body).toStrictEqual(mockCommentsResponse);
            }
        );

        it('Should respond with a status 404 if the user does not exist', async () => {
            const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/comments`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 404 if the user has not submitted comments',
            async () => {
                const endpoint = `/api/v1.0/user/${mockExistingUserIdWithoutHistoryComments}/history/comments`;
                const response = await request(app).get(endpoint);
    
                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 500 if the userId param is not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/comments`;
                const response = await request(app).get(endpoint);
    
                expect(response.status).toBe(500);
            }
        );
    });

    describe.skip('GET /api/v1.0/user/:userId/history/comments/:commentId',() => {
        it('Should respond with a status 200 if userId and commentId exists', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/comments/${mockCommentId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(200);
                expect(response.status).toBeDefined();
                expect(response.body).toStrictEqual(mockCommentsResponse);
            }
        );

        it('Should respond with a status 404 if the user does not exist even if the notification exists', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/comments/${mockCommentId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 404 if the comment does not exist even if the userId exists',
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/comments/${mockNotExistingCommentId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 404 if the user and the comment does not exist', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/comments/${mockNotExistingCommentId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 500 if the userId param is not a number even if the commentId is valid', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/comments/${mockCommentId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(500);
            }
        );

        it('Should respond with a status 500 if the commentId param is not a number even if the userId is valid', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/comments/${mockInvalidCommentId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(500);
            }
        );

        it('Should respond with a status 500 if the userId and commentId params are not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/comments/${mockInvalidCommentId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(500);
            }
        );
    });

    describe.skip('GET /api/v1.0/user/:userId/history/attachments', () => {
        it('Should respond with a status 200 if the user exists and has uploaded files', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/attachments`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(200);
                expect(response.status).toBeDefined();
                expect(response.body).toStrictEqual(mockAttachmentResponse);
            }
        );

        it('Should respond with a status 404 if the user does not exist', async () => {
            const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/attachments`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 404 if the user has not uploaded files',
            async () => {
                const endpoint = `/api/v1.0/user/${mockExistingUserIdWithoutHistoryAttachmentFiles}/history/attachments`;
                const response = await request(app).get(endpoint);
    
                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 500 if the userId param is not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/attachments`;
                const response = await request(app).get(endpoint);
    
                expect(response.status).toBe(500);
            }
        );
    });


    describe.skip('GET /api/v1.0/user/:userId/history/attachments/:attachmentId',() => {
        it('Should respond with a status 200 if userId and attachmentId exists', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/attachments/${mockAttachmentId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(200);
                expect(response.status).toBeDefined();
                expect(response.body).toStrictEqual(mockAttachmentResponse);
            }
        );

        it('Should respond with a status 404 if the user does not exist even if the attachment file exists', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/attachments/${mockAttachmentId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 404 if the attachment file does not exist even if the userId exists',
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/attachments/${mockNotExistingAttachmentId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 404 if the user and the attachment file does not exist', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/attachments/${mockNotExistingAttachmentId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 500 if the userId param is not a number even if the attachmentId is valid', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/attachments/${mockAttachmentId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(500);
            }
        );

        it('Should respond with a status 500 if the attachmentId param is not a number even if the userId is valid', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/attachments/${mockInvalidAttachmentId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(500);
            }
        );

        it('Should respond with a status 500 if the userId and attachmentId params are not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/attachments/${mockInvalidAttachmentId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(500);
            }
        );
    });


    describe.skip('GET /api/v1.0/user/:userId/history/projects', () => {
        it('Should respond with a status 200 if the user exists and has projects participations', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/projects`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(200);
                expect(response.status).toBeDefined();
                expect(response.body).toStrictEqual(mockProjectsResponse);
            }
        );

        it('Should respond with a status 404 if the user does not exist', async () => {
            const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/projects`;
            const response = await request(app).get(endpoint);

            expect(response.status).toBe(404);
        });

        it('Should respond with a status 404 if the user has not projects participations',
            async () => {
                const endpoint = `/api/v1.0/user/${mockExistingUserIdWithoutHistoryProjects}/history/projects`;
                const response = await request(app).get(endpoint);
    
                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 500 if the userId param is not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/projects`;
                const response = await request(app).get(endpoint);
    
                expect(response.status).toBe(500);
            }
        );
    });

    describe.skip('GET /api/v1.0/user/:userId/history/projects/:projectId',() => {
        it('Should respond with a status 200 if userId and projectId exists', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/projects/${mockProjectId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(200);
                expect(response.status).toBeDefined();
                expect(response.body).toStrictEqual(mockProjectsResponse);
            }
        );

        it('Should respond with a status 404 if the user does not exist even if the project exists', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/projects/${mockProjectId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 404 if the projectId does not exist even if the userId exists',
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/projects/${mockNotExistingProjectId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 404 if the user and the project does not exist', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockNotExistingUserId}/history/projects/${mockNotExistingProjectId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(404);
            }
        );

        it('Should respond with a status 500 if the userId param is not a number even if the projectId is valid', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/projects/${mockProjectId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(500);
            }
        );

        it('Should respond with a status 500 if the projectId param is not a number even if the userId is valid', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockUserId}/history/projects/${mockInvalidProjectId}`;
                const response = await request(app).get(endpoint);

                expect(response.status).toBe(500);
            }
        );

        it('Should respond with a status 500 if the userId and projectId params are not a number', 
            async () => {
                const endpoint = `/api/v1.0/user/${mockInvalidUserId}/history/projects/${mockInvalidProjectId}`;
                const response = await request(app).get(endpoint);

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
});