INSERT INTO Users (username, email, password, role, created_at) VALUES 
('adminUser', 'admin@example.com', 'hashedpassword1', 'admin', CURRENT_TIMESTAMP),
('projectManager', 'pm@example.com', 'hashedpassword2', 'project_manager', CURRENT_TIMESTAMP),
('teamMember', 'teammember@example.com', 'hashedpassword3', 'team_member', CURRENT_TIMESTAMP);