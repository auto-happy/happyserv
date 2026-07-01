-- HappyServ Database Schema
-- Initialisation complète de la base de données

-- ============================
-- EXTENSIONS
-- ============================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================
-- ENUMS
-- ============================
CREATE TYPE user_role AS ENUM ('admin', 'support', 'user');
CREATE TYPE license_type AS ENUM ('free', 'basic', 'premium', 'enterprise');
CREATE TYPE license_status AS ENUM ('active', 'expired', 'revoked', 'suspended');
CREATE TYPE device_status AS ENUM ('active', 'inactive', 'revoked');
CREATE TYPE notification_type AS ENUM ('info', 'warning', 'error', 'success');
CREATE TYPE audit_action AS ENUM (
    'user.create', 'user.update', 'user.delete',
    'license.create', 'license.update', 'license.revoke',
    'device.register', 'device.revoke',
    'auth.login', 'auth.logout', 'auth.failed',
    'settings.update', 'version.publish'
);

-- ============================
-- TABLE: roles
-- ============================
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================
-- TABLE: users
-- ============================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    role_id INTEGER REFERENCES roles(id),
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================
-- TABLE: licenses
-- ============================
CREATE TABLE IF NOT EXISTS licenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_key VARCHAR(64) UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
    type license_type NOT NULL DEFAULT 'free',
    status license_status NOT NULL DEFAULT 'active',
    max_devices INTEGER NOT NULL DEFAULT 1,
    activated_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_licenses_user_id ON licenses(user_id);
CREATE INDEX idx_licenses_license_key ON licenses(license_key);
CREATE INDEX idx_licenses_status ON licenses(status);

-- ============================
-- TABLE: devices
-- ============================
CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    license_id INTEGER NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    platform VARCHAR(50),
    os_version VARCHAR(50),
    app_version VARCHAR(20),
    last_seen_at TIMESTAMP WITH TIME ZONE,
    status device_status NOT NULL DEFAULT 'active',
    fingerprint VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(license_id, device_id)
);

CREATE INDEX idx_devices_license_id ON devices(license_id);
CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_devices_device_id ON devices(device_id);

-- ============================
-- TABLE: notifications
-- ============================
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ============================
-- TABLE: audit_logs
-- ============================
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action audit_action NOT NULL,
    resource_type VARCHAR(50),
    resource_id INTEGER,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================
-- TABLE: app_settings
-- ============================
CREATE TABLE IF NOT EXISTS app_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================
-- TABLE: app_versions
-- ============================
CREATE TABLE IF NOT EXISTS app_versions (
    id SERIAL PRIMARY KEY,
    version VARCHAR(20) NOT NULL,
    platform VARCHAR(20) NOT NULL,
    url VARCHAR(500) NOT NULL,
    checksum VARCHAR(128),
    changelog TEXT,
    is_mandatory BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    published_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(version, platform)
);

CREATE INDEX idx_app_versions_platform ON app_versions(platform);
CREATE INDEX idx_app_versions_is_active ON app_versions(is_active);

-- ============================
-- TABLE: sync_log
-- ============================
CREATE TABLE IF NOT EXISTS sync_log (
    id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    sync_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    data_size INTEGER DEFAULT 0,
    conflicts INTEGER DEFAULT 0,
    duration_ms INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sync_log_device_id ON sync_log(device_id);
CREATE INDEX idx_sync_log_created_at ON sync_log(created_at);

-- ============================
-- SEED DATA
-- ============================

-- Roles par défaut
INSERT INTO roles (name, description, permissions) VALUES
    ('admin', 'Accès complet au système', '["*"]'),
    ('support', 'Gestion des utilisateurs et licences', '["users.read", "users.write", "licenses.read", "licenses.write", "devices.read"]'),
    ('user', 'Accès à son propre espace', '["profile.read", "profile.write", "licenses.read", "devices.read", "devices.write"]')
ON CONFLICT (name) DO NOTHING;

-- Admin par défaut (password: changeme123!)
INSERT INTO users (email, password_hash, name, role) VALUES
    ('admin@happyserv.fr', crypt('changeme123!', gen_salt('bf')), 'Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Paramètres par défaut
INSERT INTO app_settings (key, value, description) VALUES
    ('app.name', '"HappyServ"', 'Nom de l''application'),
    ('app.version', '"1.0.0"', 'Version actuelle'),
    ('maintenance_mode', 'false', 'Mode maintenance'),
    ('max_devices_per_license', '5', 'Nombre max d''appareils par licence'),
    ('session_timeout_minutes', '60', 'Timeout session en minutes'),
    ('backup_enabled', 'true', 'Activer les backups automatiques'),
    ('monitoring_enabled', 'true', 'Activer le monitoring')
ON CONFLICT (key) DO NOTHING;
