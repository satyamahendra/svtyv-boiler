how to start:

1. clone repo

2. set env

3. seed data

-- Permissions
INSERT INTO permission (name) VALUES
('read home'),
('manage home'),
('read permissions'),
('manage permissions'),
('read roles'),
('manage roles'),
('read users'),
('manage users'),
('read orders'),
('manage orders'),
('read products'),
('manage products')
('read reports'),
('manage reports')
ON CONFLICT (name) DO NOTHING;

-- Roles
INSERT INTO role (name) VALUES
('admin'),
('member')
ON CONFLICT (name) DO NOTHING;

-- RolePermissions
INSERT INTO role_permission (role_name, permission_name) VALUES
('admin', 'read home'),
('admin', 'manage home'),
('admin', 'read permissions'),
('admin', 'manage permissions'),
('admin', 'read roles'),
('admin', 'manage roles'),
('admin', 'read users'),
('admin', 'manage users'),
('admin', 'read orders'),
('admin', 'manage orders'),
('admin', 'read products'),
('admin', 'manage products'),
('admin', 'read reports'),
('admin', 'manage reports'),
('member', 'read home'),
('member', 'manage home')
ON CONFLICT (role_name, permission_name) DO NOTHING;

procedure pushing db edits

1. npx prisma generate
2. npx prisma migrate dev --name "<your-migration-name>"
3. npx prisma migrate deploy
