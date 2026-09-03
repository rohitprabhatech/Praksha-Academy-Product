-- =============================================================================
-- Praksha Academy SaaS — Database Schema
-- Database: MySQL 8.0+
-- Engine: InnoDB
-- Charset: utf8mb4
-- =============================================================================

CREATE DATABASE IF NOT EXISTS praksha_academy_saas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE praksha_academy_saas;

-- =============================================================================
-- PLATFORM LEVEL TABLES
-- =============================================================================

CREATE TABLE tenants (
    id              CHAR(36)     NOT NULL,
    tenant_code     VARCHAR(32)  NOT NULL,
    name            VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) NOT NULL,
    status          ENUM('pending','trial','active','suspended','cancelled','archived') NOT NULL DEFAULT 'pending',
    contact_email   VARCHAR(255) NULL,
    contact_phone   VARCHAR(30)  NULL,
    timezone        VARCHAR(64)  NOT NULL DEFAULT 'Asia/Kolkata',
    trial_ends_at   DATETIME(6)  NULL,
    activated_at    DATETIME(6)  NULL,
    suspended_at    DATETIME(6)  NULL,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_tenants_tenant_code (tenant_code),
    UNIQUE KEY uk_tenants_slug (slug),
    KEY idx_tenants_status (status),
    KEY idx_tenants_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE subscription_plans (
    id                  CHAR(36)       NOT NULL,
    code                VARCHAR(50)    NOT NULL,
    name                VARCHAR(150)   NOT NULL,
    description         TEXT           NULL,
    monthly_price       DECIMAL(12,2)  NOT NULL DEFAULT 0.00,
    annual_price        DECIMAL(12,2)  NULL,
    currency            CHAR(3)        NOT NULL DEFAULT 'INR',
    trial_days          INT UNSIGNED   NOT NULL DEFAULT 0,
    max_students        INT UNSIGNED   NULL,
    max_teachers        INT UNSIGNED   NULL,
    max_courses         INT UNSIGNED   NULL,
    features_json       JSON           NULL,
    status              ENUM('active','inactive','archived') NOT NULL DEFAULT 'active',
    sort_order          INT            NOT NULL DEFAULT 0,
    created_at          DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at          DATETIME(6)    NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_subscription_plans_code (code),
    KEY idx_subscription_plans_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tenant_subscriptions (
    id                  CHAR(36)     NOT NULL,
    tenant_id           CHAR(36)     NOT NULL,
    plan_id             CHAR(36)     NOT NULL,
    status              ENUM('trial','active','past_due','cancelled','expired') NOT NULL DEFAULT 'trial',
    billing_cycle       ENUM('monthly','annual','custom') NOT NULL DEFAULT 'monthly',
    starts_at           DATETIME(6)  NOT NULL,
    ends_at             DATETIME(6)  NULL,
    trial_ends_at       DATETIME(6)  NULL,
    cancelled_at        DATETIME(6)  NULL,
    auto_renew          TINYINT(1)   NOT NULL DEFAULT 1,
    notes               TEXT         NULL,
    created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    KEY idx_tenant_subscriptions_tenant_id (tenant_id),
    KEY idx_tenant_subscriptions_plan_id (plan_id),
    KEY idx_tenant_subscriptions_status (status),
    KEY idx_tenant_subscriptions_ends_at (ends_at),
    CONSTRAINT fk_tenant_subscriptions_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_tenant_subscriptions_plan
        FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE platform_settings (
    id              CHAR(36)     NOT NULL,
    setting_key     VARCHAR(100) NOT NULL,
    setting_value   JSON         NULL,
    description     VARCHAR(500) NULL,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_platform_settings_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE roles (
    id              CHAR(36)     NOT NULL,
    scope           ENUM('platform','tenant') NOT NULL,
    code            VARCHAR(50)  NOT NULL,
    name            VARCHAR(100) NOT NULL,
    description     VARCHAR(500) NULL,
    is_system       TINYINT(1)   NOT NULL DEFAULT 0,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_roles_scope_code (scope, code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE permissions (
    id              CHAR(36)     NOT NULL,
    scope           ENUM('platform','tenant') NOT NULL,
    code            VARCHAR(100) NOT NULL,
    name            VARCHAR(150) NOT NULL,
    module          VARCHAR(50)  NOT NULL,
    description     VARCHAR(500) NULL,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_permissions_scope_code (scope, code),
    KEY idx_permissions_module (module)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE role_permissions (
    role_id         CHAR(36)     NOT NULL,
    permission_id   CHAR(36)     NOT NULL,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (role_id, permission_id),
    KEY idx_role_permissions_permission_id (permission_id),
    CONSTRAINT fk_role_permissions_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_permission
        FOREIGN KEY (permission_id) REFERENCES permissions(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE users (
    id                  CHAR(36)     NOT NULL,
    tenant_id           CHAR(36)     NULL,
    email               VARCHAR(255) NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NULL,
    phone               VARCHAR(30)  NULL,
    avatar_url          VARCHAR(500) NULL,
    status              ENUM('pending','active','inactive','suspended') NOT NULL DEFAULT 'pending',
    email_verified_at   DATETIME(6)  NULL,
    last_login_at       DATETIME(6)  NULL,
    created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at          DATETIME(6)  NULL,
    created_by          CHAR(36)     NULL,
    updated_by          CHAR(36)     NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_tenant_email (tenant_id, email),
    KEY idx_users_tenant_id (tenant_id),
    KEY idx_users_status (status),
    KEY idx_users_deleted_at (deleted_at),
    CONSTRAINT fk_users_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_roles (
    id              CHAR(36)     NOT NULL,
    user_id         CHAR(36)     NOT NULL,
    role_id         CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NULL,
    assigned_at     DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    assigned_by     CHAR(36)     NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_roles_user_role_tenant (user_id, role_id, tenant_id),
    KEY idx_user_roles_user_id (user_id),
    KEY idx_user_roles_role_id (role_id),
    KEY idx_user_roles_tenant_id (tenant_id),
    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_user_roles_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE password_reset_tokens (
    id              CHAR(36)     NOT NULL,
    user_id         CHAR(36)     NOT NULL,
    token_hash      VARCHAR(255) NOT NULL,
    expires_at      DATETIME(6)  NOT NULL,
    used_at         DATETIME(6)  NULL,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_password_reset_tokens_hash (token_hash),
    KEY idx_password_reset_tokens_user_id (user_id),
    KEY idx_password_reset_tokens_expires_at (expires_at),
    CONSTRAINT fk_password_reset_tokens_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE email_verifications (
    id              CHAR(36)     NOT NULL,
    user_id         CHAR(36)     NOT NULL,
    otp_hash        VARCHAR(255) NOT NULL,
    purpose         ENUM('registration','email_change','login') NOT NULL DEFAULT 'registration',
    expires_at      DATETIME(6)  NOT NULL,
    verified_at     DATETIME(6)  NULL,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    KEY idx_email_verifications_user_id (user_id),
    KEY idx_email_verifications_expires_at (expires_at),
    CONSTRAINT fk_email_verifications_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE platform_audit_logs (
    id              CHAR(36)     NOT NULL,
    actor_user_id   CHAR(36)     NULL,
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(100) NOT NULL,
    entity_id       CHAR(36)     NULL,
    tenant_id       CHAR(36)     NULL,
    metadata_json   JSON         NULL,
    ip_address      VARCHAR(45)  NULL,
    user_agent      VARCHAR(500) NULL,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    KEY idx_platform_audit_logs_actor (actor_user_id),
    KEY idx_platform_audit_logs_tenant_id (tenant_id),
    KEY idx_platform_audit_logs_entity (entity_type, entity_id),
    KEY idx_platform_audit_logs_created_at (created_at),
    CONSTRAINT fk_platform_audit_logs_actor
        FOREIGN KEY (actor_user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_platform_audit_logs_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TENANT LEVEL TABLES
-- =============================================================================

CREATE TABLE tenant_profiles (
    id                  CHAR(36)     NOT NULL,
    tenant_id           CHAR(36)     NOT NULL,
    display_name        VARCHAR(200) NOT NULL,
    tagline             VARCHAR(500) NULL,
    logo_url            VARCHAR(500) NULL,
    contact_email       VARCHAR(255) NULL,
    contact_phone       VARCHAR(30)  NULL,
    address_line1       VARCHAR(255) NULL,
    address_line2       VARCHAR(255) NULL,
    city                VARCHAR(100) NULL,
    state               VARCHAR(100) NULL,
    country             VARCHAR(100) NULL DEFAULT 'India',
    postal_code         VARCHAR(20)  NULL,
    website_url         VARCHAR(500) NULL,
    academic_year       VARCHAR(20)  NULL,
    default_language    VARCHAR(50)  NOT NULL DEFAULT 'English',
    settings_json       JSON         NULL,
    created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_tenant_profiles_tenant_id (tenant_id),
    CONSTRAINT fk_tenant_profiles_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE teacher_profiles (
    id                  CHAR(36)     NOT NULL,
    tenant_id           CHAR(36)     NOT NULL,
    user_id             CHAR(36)     NOT NULL,
    employee_code       VARCHAR(50)  NULL,
    qualification       VARCHAR(255) NULL,
    experience_years    DECIMAL(4,1) NULL,
    specialization      VARCHAR(255) NULL,
    bio                 TEXT         NULL,
    joined_at           DATE         NULL,
    created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at          DATETIME(6)  NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_teacher_profiles_user (tenant_id, user_id),
    UNIQUE KEY uk_teacher_profiles_code (tenant_id, employee_code),
    KEY idx_teacher_profiles_tenant_id (tenant_id),
    KEY idx_teacher_profiles_deleted_at (deleted_at),
    CONSTRAINT fk_teacher_profiles_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_teacher_profiles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE student_profiles (
    id                  CHAR(36)     NOT NULL,
    tenant_id           CHAR(36)     NOT NULL,
    user_id             CHAR(36)     NOT NULL,
    enrollment_number   VARCHAR(50)  NULL,
    date_of_birth       DATE         NULL,
    gender              ENUM('male','female','other','prefer_not_to_say') NULL,
    guardian_name       VARCHAR(150) NULL,
    guardian_phone      VARCHAR(30)  NULL,
    address_line1       VARCHAR(255) NULL,
    city                VARCHAR(100) NULL,
    joined_at           DATE         NULL,
    created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at          DATETIME(6)  NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_student_profiles_user (tenant_id, user_id),
    UNIQUE KEY uk_student_profiles_enrollment (tenant_id, enrollment_number),
    KEY idx_student_profiles_tenant_id (tenant_id),
    KEY idx_student_profiles_deleted_at (deleted_at),
    CONSTRAINT fk_student_profiles_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_student_profiles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE academic_classes (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    name            VARCHAR(150) NOT NULL,
    code            VARCHAR(50)  NULL,
    description     VARCHAR(500) NULL,
    sort_order      INT          NOT NULL DEFAULT 0,
    status          ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,
    created_by      CHAR(36)     NULL,
    updated_by      CHAR(36)     NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_academic_classes_name (tenant_id, name),
    UNIQUE KEY uk_academic_classes_code (tenant_id, code),
    KEY idx_academic_classes_tenant_id (tenant_id),
    KEY idx_academic_classes_status (status),
    CONSTRAINT fk_academic_classes_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE subjects (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    name            VARCHAR(150) NOT NULL,
    code            VARCHAR(50)  NULL,
    description     VARCHAR(500) NULL,
    status          ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,
    created_by      CHAR(36)     NULL,
    updated_by      CHAR(36)     NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_subjects_name (tenant_id, name),
    UNIQUE KEY uk_subjects_code (tenant_id, code),
    KEY idx_subjects_tenant_id (tenant_id),
    CONSTRAINT fk_subjects_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE batches (
    id                  CHAR(36)     NOT NULL,
    tenant_id           CHAR(36)     NOT NULL,
    academic_class_id   CHAR(36)     NOT NULL,
    course_id           CHAR(36)     NULL,
    name                VARCHAR(150) NOT NULL,
    code                VARCHAR(50)  NULL,
    start_date          DATE         NULL,
    end_date            DATE         NULL,
    status              ENUM('active','inactive','completed') NOT NULL DEFAULT 'active',
    created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at          DATETIME(6)  NULL,
    created_by          CHAR(36)     NULL,
    updated_by          CHAR(36)     NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_batches_name_class (tenant_id, academic_class_id, name),
    KEY idx_batches_tenant_id (tenant_id),
    KEY idx_batches_academic_class_id (academic_class_id),
    KEY idx_batches_course_id (course_id),
    KEY idx_batches_status (status),
    CONSTRAINT fk_batches_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_batches_academic_class
        FOREIGN KEY (academic_class_id) REFERENCES academic_classes(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE courses (
    id                  CHAR(36)       NOT NULL,
    tenant_id           CHAR(36)       NOT NULL,
    academic_class_id   CHAR(36)       NULL,
    subject_id          CHAR(36)       NULL,
    name                VARCHAR(200)   NOT NULL,
    slug                VARCHAR(220)   NOT NULL,
    category            VARCHAR(100)   NULL,
    description         TEXT           NULL,
    thumbnail_url       VARCHAR(500)   NULL,
    price               DECIMAL(12,2)  NOT NULL DEFAULT 0.00,
    discount_price      DECIMAL(12,2)  NULL,
    duration_label      VARCHAR(100)   NULL,
    language            VARCHAR(50)    NOT NULL DEFAULT 'English',
    course_type         VARCHAR(50)    NULL,
    status              ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
    is_featured         TINYINT(1)     NOT NULL DEFAULT 0,
    created_at          DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at          DATETIME(6)    NULL,
    created_by          CHAR(36)       NULL,
    updated_by          CHAR(36)       NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_courses_slug (tenant_id, slug),
    KEY idx_courses_tenant_id (tenant_id),
    KEY idx_courses_academic_class_id (academic_class_id),
    KEY idx_courses_subject_id (subject_id),
    KEY idx_courses_status (status),
    KEY idx_courses_category (tenant_id, category),
    CONSTRAINT fk_courses_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_courses_academic_class
        FOREIGN KEY (academic_class_id) REFERENCES academic_classes(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_courses_subject
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE batches
    ADD CONSTRAINT fk_batches_course
        FOREIGN KEY (course_id) REFERENCES courses(id)
        ON UPDATE CASCADE ON DELETE SET NULL;

CREATE TABLE course_teachers (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    course_id       CHAR(36)     NOT NULL,
    teacher_id      CHAR(36)     NOT NULL,
    is_primary      TINYINT(1)   NOT NULL DEFAULT 0,
    assigned_at     DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    assigned_by     CHAR(36)     NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_course_teachers (tenant_id, course_id, teacher_id),
    KEY idx_course_teachers_course_id (course_id),
    KEY idx_course_teachers_teacher_id (teacher_id),
    CONSTRAINT fk_course_teachers_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_course_teachers_course
        FOREIGN KEY (course_id) REFERENCES courses(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_course_teachers_teacher
        FOREIGN KEY (teacher_id) REFERENCES teacher_profiles(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE course_modules (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    course_id       CHAR(36)     NOT NULL,
    title           VARCHAR(200) NOT NULL,
    description     TEXT         NULL,
    sort_order      INT          NOT NULL DEFAULT 0,
    status          ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,
    PRIMARY KEY (id),
    KEY idx_course_modules_tenant_id (tenant_id),
    KEY idx_course_modules_course_id (course_id),
    CONSTRAINT fk_course_modules_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_course_modules_course
        FOREIGN KEY (course_id) REFERENCES courses(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE course_chapters (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    module_id       CHAR(36)     NOT NULL,
    title           VARCHAR(200) NOT NULL,
    description     TEXT         NULL,
    sort_order      INT          NOT NULL DEFAULT 0,
    status          ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,
    PRIMARY KEY (id),
    KEY idx_course_chapters_tenant_id (tenant_id),
    KEY idx_course_chapters_module_id (module_id),
    CONSTRAINT fk_course_chapters_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_course_chapters_module
        FOREIGN KEY (module_id) REFERENCES course_modules(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE course_lessons (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    chapter_id      CHAR(36)     NOT NULL,
    title           VARCHAR(200) NOT NULL,
    lesson_type     ENUM('video','document','text','link','mixed') NOT NULL DEFAULT 'text',
    content         TEXT         NULL,
    video_url       VARCHAR(500) NULL,
    duration_minutes INT UNSIGNED NULL,
    sort_order      INT          NOT NULL DEFAULT 0,
    status          ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,
    PRIMARY KEY (id),
    KEY idx_course_lessons_tenant_id (tenant_id),
    KEY idx_course_lessons_chapter_id (chapter_id),
    CONSTRAINT fk_course_lessons_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_course_lessons_chapter
        FOREIGN KEY (chapter_id) REFERENCES course_chapters(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE enrollments (
    id                  CHAR(36)     NOT NULL,
    tenant_id           CHAR(36)     NOT NULL,
    student_id          CHAR(36)     NOT NULL,
    course_id           CHAR(36)     NOT NULL,
    batch_id            CHAR(36)     NULL,
    status              ENUM('pending','active','completed','cancelled','transferred') NOT NULL DEFAULT 'pending',
    enrolled_at         DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    completed_at        DATETIME(6)  NULL,
    cancelled_at        DATETIME(6)  NULL,
    progress_percent    DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    created_by          CHAR(36)     NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_enrollments_student_course (tenant_id, student_id, course_id),
    KEY idx_enrollments_tenant_id (tenant_id),
    KEY idx_enrollments_student_id (student_id),
    KEY idx_enrollments_course_id (course_id),
    KEY idx_enrollments_batch_id (batch_id),
    KEY idx_enrollments_status (status),
    CONSTRAINT fk_enrollments_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_enrollments_student
        FOREIGN KEY (student_id) REFERENCES student_profiles(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_enrollments_course
        FOREIGN KEY (course_id) REFERENCES courses(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_enrollments_batch
        FOREIGN KEY (batch_id) REFERENCES batches(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE lesson_progress (
    id                  CHAR(36)     NOT NULL,
    tenant_id           CHAR(36)     NOT NULL,
    enrollment_id       CHAR(36)     NOT NULL,
    lesson_id           CHAR(36)     NOT NULL,
    status              ENUM('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
    progress_percent    DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    started_at          DATETIME(6)  NULL,
    completed_at        DATETIME(6)  NULL,
    last_accessed_at    DATETIME(6)  NULL,
    created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_lesson_progress (tenant_id, enrollment_id, lesson_id),
    KEY idx_lesson_progress_tenant_id (tenant_id),
    KEY idx_lesson_progress_enrollment_id (enrollment_id),
    CONSTRAINT fk_lesson_progress_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_lesson_progress_enrollment
        FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_lesson_progress_lesson
        FOREIGN KEY (lesson_id) REFERENCES course_lessons(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE study_materials (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    course_id       CHAR(36)     NOT NULL,
    batch_id        CHAR(36)     NULL,
    title           VARCHAR(200) NOT NULL,
    material_type   ENUM('pdf','notes','ppt','video','document','link') NOT NULL,
    file_url        VARCHAR(500) NULL,
    file_name       VARCHAR(255) NULL,
    file_size_bytes BIGINT UNSIGNED NULL,
    mime_type       VARCHAR(100) NULL,
    description     TEXT         NULL,
    status          ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
    uploaded_by     CHAR(36)     NULL,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,
    PRIMARY KEY (id),
    KEY idx_study_materials_tenant_id (tenant_id),
    KEY idx_study_materials_course_id (course_id),
    KEY idx_study_materials_batch_id (batch_id),
    KEY idx_study_materials_status (status),
    CONSTRAINT fk_study_materials_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_study_materials_course
        FOREIGN KEY (course_id) REFERENCES courses(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_study_materials_batch
        FOREIGN KEY (batch_id) REFERENCES batches(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE live_classes (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    course_id       CHAR(36)     NOT NULL,
    batch_id        CHAR(36)     NULL,
    teacher_id      CHAR(36)     NOT NULL,
    title           VARCHAR(200) NOT NULL,
    description     TEXT         NULL,
    session_date    DATE         NOT NULL,
    start_time      TIME         NOT NULL,
    end_time        TIME         NOT NULL,
    meeting_link    VARCHAR(500) NULL,
    recording_url   VARCHAR(500) NULL,
    status          ENUM('scheduled','live','completed','cancelled') NOT NULL DEFAULT 'scheduled',
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,
    created_by      CHAR(36)     NULL,
    PRIMARY KEY (id),
    KEY idx_live_classes_tenant_id (tenant_id),
    KEY idx_live_classes_course_id (course_id),
    KEY idx_live_classes_batch_id (batch_id),
    KEY idx_live_classes_teacher_id (teacher_id),
    KEY idx_live_classes_session_date (session_date),
    KEY idx_live_classes_status (status),
    CONSTRAINT fk_live_classes_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_live_classes_course
        FOREIGN KEY (course_id) REFERENCES courses(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_live_classes_batch
        FOREIGN KEY (batch_id) REFERENCES batches(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_live_classes_teacher
        FOREIGN KEY (teacher_id) REFERENCES teacher_profiles(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE assignments (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    course_id       CHAR(36)     NOT NULL,
    batch_id        CHAR(36)     NULL,
    teacher_id      CHAR(36)     NULL,
    title           VARCHAR(200) NOT NULL,
    description     TEXT         NULL,
    instructions    TEXT         NULL,
    attachment_url  VARCHAR(500) NULL,
    due_at          DATETIME(6)  NULL,
    max_score       DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    status          ENUM('draft','published','closed') NOT NULL DEFAULT 'draft',
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,
    created_by      CHAR(36)     NULL,
    PRIMARY KEY (id),
    KEY idx_assignments_tenant_id (tenant_id),
    KEY idx_assignments_course_id (course_id),
    KEY idx_assignments_batch_id (batch_id),
    KEY idx_assignments_teacher_id (teacher_id),
    KEY idx_assignments_status (status),
    KEY idx_assignments_due_at (due_at),
    CONSTRAINT fk_assignments_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_assignments_course
        FOREIGN KEY (course_id) REFERENCES courses(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_assignments_batch
        FOREIGN KEY (batch_id) REFERENCES batches(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_assignments_teacher
        FOREIGN KEY (teacher_id) REFERENCES teacher_profiles(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE assignment_submissions (
    id                  CHAR(36)     NOT NULL,
    tenant_id           CHAR(36)     NOT NULL,
    assignment_id       CHAR(36)     NOT NULL,
    student_id          CHAR(36)     NOT NULL,
    enrollment_id       CHAR(36)     NOT NULL,
    submission_text     TEXT         NULL,
    file_url            VARCHAR(500) NULL,
    file_name           VARCHAR(255) NULL,
    status              ENUM('not_started','submitted','late','reviewed','closed') NOT NULL DEFAULT 'not_started',
    score               DECIMAL(5,2) NULL,
    feedback            TEXT         NULL,
    submitted_at        DATETIME(6)  NULL,
    reviewed_at         DATETIME(6)  NULL,
    reviewed_by         CHAR(36)     NULL,
    created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_assignment_submissions (tenant_id, assignment_id, student_id),
    KEY idx_assignment_submissions_tenant_id (tenant_id),
    KEY idx_assignment_submissions_assignment_id (assignment_id),
    KEY idx_assignment_submissions_student_id (student_id),
    KEY idx_assignment_submissions_status (status),
    CONSTRAINT fk_assignment_submissions_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_assignment_submissions_assignment
        FOREIGN KEY (assignment_id) REFERENCES assignments(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_assignment_submissions_student
        FOREIGN KEY (student_id) REFERENCES student_profiles(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_assignment_submissions_enrollment
        FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE quizzes (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    course_id       CHAR(36)     NOT NULL,
    batch_id        CHAR(36)     NULL,
    teacher_id      CHAR(36)     NULL,
    title           VARCHAR(200) NOT NULL,
    description     TEXT         NULL,
    duration_minutes INT UNSIGNED NULL,
    max_attempts    INT UNSIGNED NOT NULL DEFAULT 1,
    passing_score   DECIMAL(5,2) NULL,
    available_from  DATETIME(6)  NULL,
    available_until DATETIME(6)  NULL,
    status          ENUM('draft','published','closed') NOT NULL DEFAULT 'draft',
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,
    created_by      CHAR(36)     NULL,
    PRIMARY KEY (id),
    KEY idx_quizzes_tenant_id (tenant_id),
    KEY idx_quizzes_course_id (course_id),
    KEY idx_quizzes_batch_id (batch_id),
    KEY idx_quizzes_status (status),
    CONSTRAINT fk_quizzes_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_quizzes_course
        FOREIGN KEY (course_id) REFERENCES courses(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_quizzes_batch
        FOREIGN KEY (batch_id) REFERENCES batches(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_quizzes_teacher
        FOREIGN KEY (teacher_id) REFERENCES teacher_profiles(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE quiz_questions (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    quiz_id         CHAR(36)     NOT NULL,
    question_text   TEXT         NOT NULL,
    question_type   ENUM('mcq','short_text') NOT NULL DEFAULT 'mcq',
    points          DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    sort_order      INT          NOT NULL DEFAULT 0,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,
    PRIMARY KEY (id),
    KEY idx_quiz_questions_tenant_id (tenant_id),
    KEY idx_quiz_questions_quiz_id (quiz_id),
    CONSTRAINT fk_quiz_questions_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_quiz_questions_quiz
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE quiz_question_options (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    question_id     CHAR(36)     NOT NULL,
    option_text     VARCHAR(500) NOT NULL,
    is_correct      TINYINT(1)   NOT NULL DEFAULT 0,
    sort_order      INT          NOT NULL DEFAULT 0,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    KEY idx_quiz_question_options_tenant_id (tenant_id),
    KEY idx_quiz_question_options_question_id (question_id),
    CONSTRAINT fk_quiz_question_options_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_quiz_question_options_question
        FOREIGN KEY (question_id) REFERENCES quiz_questions(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE quiz_attempts (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    quiz_id         CHAR(36)     NOT NULL,
    student_id      CHAR(36)     NOT NULL,
    enrollment_id   CHAR(36)     NOT NULL,
    attempt_number  INT UNSIGNED NOT NULL DEFAULT 1,
    status          ENUM('in_progress','submitted','graded','abandoned') NOT NULL DEFAULT 'in_progress',
    score           DECIMAL(5,2) NULL,
    max_score       DECIMAL(5,2) NULL,
    started_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    submitted_at    DATETIME(6)  NULL,
    graded_at       DATETIME(6)  NULL,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_quiz_attempts (tenant_id, quiz_id, student_id, attempt_number),
    KEY idx_quiz_attempts_tenant_id (tenant_id),
    KEY idx_quiz_attempts_quiz_id (quiz_id),
    KEY idx_quiz_attempts_student_id (student_id),
    KEY idx_quiz_attempts_status (status),
    CONSTRAINT fk_quiz_attempts_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_quiz_attempts_quiz
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_quiz_attempts_student
        FOREIGN KEY (student_id) REFERENCES student_profiles(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_quiz_attempts_enrollment
        FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE quiz_answers (
    id                  CHAR(36)     NOT NULL,
    tenant_id           CHAR(36)     NOT NULL,
    attempt_id          CHAR(36)     NOT NULL,
    question_id         CHAR(36)     NOT NULL,
    selected_option_id  CHAR(36)     NULL,
    answer_text         TEXT         NULL,
    is_correct          TINYINT(1)   NULL,
    points_awarded      DECIMAL(5,2) NULL,
    created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_quiz_answers (tenant_id, attempt_id, question_id),
    KEY idx_quiz_answers_tenant_id (tenant_id),
    KEY idx_quiz_answers_attempt_id (attempt_id),
    CONSTRAINT fk_quiz_answers_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_quiz_answers_attempt
        FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_quiz_answers_question
        FOREIGN KEY (question_id) REFERENCES quiz_questions(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_quiz_answers_option
        FOREIGN KEY (selected_option_id) REFERENCES quiz_question_options(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE exams (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    course_id       CHAR(36)     NOT NULL,
    batch_id        CHAR(36)     NULL,
    title           VARCHAR(200) NOT NULL,
    description     TEXT         NULL,
    exam_date       DATE         NOT NULL,
    start_time      TIME         NULL,
    end_time        TIME         NULL,
    duration_minutes INT UNSIGNED NULL,
    max_score       DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    is_online       TINYINT(1)   NOT NULL DEFAULT 0,
    status          ENUM('draft','scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'draft',
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,
    created_by      CHAR(36)     NULL,
    PRIMARY KEY (id),
    KEY idx_exams_tenant_id (tenant_id),
    KEY idx_exams_course_id (course_id),
    KEY idx_exams_batch_id (batch_id),
    KEY idx_exams_exam_date (exam_date),
    KEY idx_exams_status (status),
    CONSTRAINT fk_exams_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_exams_course
        FOREIGN KEY (course_id) REFERENCES courses(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_exams_batch
        FOREIGN KEY (batch_id) REFERENCES batches(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE exam_questions (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    exam_id         CHAR(36)     NOT NULL,
    question_text   TEXT         NOT NULL,
    question_type   ENUM('mcq','short_text') NOT NULL DEFAULT 'mcq',
    points          DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    sort_order      INT          NOT NULL DEFAULT 0,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,
    PRIMARY KEY (id),
    KEY idx_exam_questions_tenant_id (tenant_id),
    KEY idx_exam_questions_exam_id (exam_id),
    CONSTRAINT fk_exam_questions_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_exam_questions_exam
        FOREIGN KEY (exam_id) REFERENCES exams(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE exam_question_options (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    question_id     CHAR(36)     NOT NULL,
    option_text     VARCHAR(500) NOT NULL,
    is_correct      TINYINT(1)   NOT NULL DEFAULT 0,
    sort_order      INT          NOT NULL DEFAULT 0,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    KEY idx_exam_question_options_tenant_id (tenant_id),
    KEY idx_exam_question_options_question_id (question_id),
    CONSTRAINT fk_exam_question_options_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_exam_question_options_question
        FOREIGN KEY (question_id) REFERENCES exam_questions(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE exam_attempts (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    exam_id         CHAR(36)     NOT NULL,
    student_id      CHAR(36)     NOT NULL,
    enrollment_id   CHAR(36)     NOT NULL,
    status          ENUM('in_progress','submitted','graded','absent') NOT NULL DEFAULT 'in_progress',
    score           DECIMAL(5,2) NULL,
    max_score       DECIMAL(5,2) NULL,
    started_at      DATETIME(6)  NULL,
    submitted_at    DATETIME(6)  NULL,
    graded_at       DATETIME(6)  NULL,
    graded_by       CHAR(36)     NULL,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_exam_attempts (tenant_id, exam_id, student_id),
    KEY idx_exam_attempts_tenant_id (tenant_id),
    KEY idx_exam_attempts_exam_id (exam_id),
    KEY idx_exam_attempts_student_id (student_id),
    CONSTRAINT fk_exam_attempts_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_exam_attempts_exam
        FOREIGN KEY (exam_id) REFERENCES exams(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_exam_attempts_student
        FOREIGN KEY (student_id) REFERENCES student_profiles(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_exam_attempts_enrollment
        FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE exam_answers (
    id                  CHAR(36)     NOT NULL,
    tenant_id           CHAR(36)     NOT NULL,
    attempt_id          CHAR(36)     NOT NULL,
    question_id         CHAR(36)     NOT NULL,
    selected_option_id  CHAR(36)     NULL,
    answer_text         TEXT         NULL,
    is_correct          TINYINT(1)   NULL,
    points_awarded      DECIMAL(5,2) NULL,
    created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_exam_answers (tenant_id, attempt_id, question_id),
    KEY idx_exam_answers_tenant_id (tenant_id),
    KEY idx_exam_answers_attempt_id (attempt_id),
    CONSTRAINT fk_exam_answers_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_exam_answers_attempt
        FOREIGN KEY (attempt_id) REFERENCES exam_attempts(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_exam_answers_question
        FOREIGN KEY (question_id) REFERENCES exam_questions(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_exam_answers_option
        FOREIGN KEY (selected_option_id) REFERENCES exam_question_options(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE marks (
    id                  CHAR(36)     NOT NULL,
    tenant_id           CHAR(36)     NOT NULL,
    student_id          CHAR(36)     NOT NULL,
    course_id           CHAR(36)     NOT NULL,
    enrollment_id       CHAR(36)     NOT NULL,
    assessment_type     ENUM('assignment','quiz','exam','manual') NOT NULL,
    assessment_id       CHAR(36)     NULL,
    title               VARCHAR(200) NOT NULL,
    score               DECIMAL(5,2) NOT NULL,
    max_score           DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    remarks             TEXT         NULL,
    recorded_at         DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    recorded_by         CHAR(36)     NULL,
    created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    KEY idx_marks_tenant_id (tenant_id),
    KEY idx_marks_student_id (student_id),
    KEY idx_marks_course_id (course_id),
    KEY idx_marks_enrollment_id (enrollment_id),
    KEY idx_marks_assessment (tenant_id, assessment_type, assessment_id),
    CONSTRAINT fk_marks_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_marks_student
        FOREIGN KEY (student_id) REFERENCES student_profiles(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_marks_course
        FOREIGN KEY (course_id) REFERENCES courses(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_marks_enrollment
        FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE attendance_records (
    id                  CHAR(36)     NOT NULL,
    tenant_id           CHAR(36)     NOT NULL,
    student_id          CHAR(36)     NOT NULL,
    course_id           CHAR(36)     NOT NULL,
    batch_id            CHAR(36)     NULL,
    live_class_id       CHAR(36)     NULL,
    attendance_date     DATE         NOT NULL,
    status              ENUM('present','absent','late') NOT NULL DEFAULT 'absent',
    remarks             VARCHAR(500) NULL,
    marked_by           CHAR(36)     NULL,
    marked_at           DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_attendance_session (tenant_id, student_id, attendance_date, course_id, batch_id, live_class_id),
    KEY idx_attendance_records_tenant_id (tenant_id),
    KEY idx_attendance_records_student_id (student_id),
    KEY idx_attendance_records_course_id (course_id),
    KEY idx_attendance_records_date (attendance_date),
    CONSTRAINT fk_attendance_records_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_attendance_records_student
        FOREIGN KEY (student_id) REFERENCES student_profiles(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_attendance_records_course
        FOREIGN KEY (course_id) REFERENCES courses(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_attendance_records_batch
        FOREIGN KEY (batch_id) REFERENCES batches(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_attendance_records_live_class
        FOREIGN KEY (live_class_id) REFERENCES live_classes(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payments (
    id                  CHAR(36)       NOT NULL,
    tenant_id           CHAR(36)       NOT NULL,
    student_id          CHAR(36)       NOT NULL,
    enrollment_id       CHAR(36)       NULL,
    course_id           CHAR(36)       NULL,
    amount              DECIMAL(12,2)  NOT NULL,
    currency            CHAR(3)        NOT NULL DEFAULT 'INR',
    payment_method      VARCHAR(50)    NULL,
    transaction_ref     VARCHAR(100)   NULL,
    status              ENUM('pending','completed','failed','refunded','cancelled') NOT NULL DEFAULT 'pending',
    paid_at             DATETIME(6)    NULL,
    notes               TEXT           NULL,
    created_at          DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    created_by          CHAR(36)       NULL,
    PRIMARY KEY (id),
    KEY idx_payments_tenant_id (tenant_id),
    KEY idx_payments_student_id (student_id),
    KEY idx_payments_enrollment_id (enrollment_id),
    KEY idx_payments_status (status),
    KEY idx_payments_paid_at (paid_at),
    CONSTRAINT fk_payments_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_payments_student
        FOREIGN KEY (student_id) REFERENCES student_profiles(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_payments_enrollment
        FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_payments_course
        FOREIGN KEY (course_id) REFERENCES courses(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE coupons (
    id                  CHAR(36)       NOT NULL,
    tenant_id           CHAR(36)       NOT NULL,
    code                VARCHAR(50)    NOT NULL,
    description         VARCHAR(500)   NULL,
    discount_type       ENUM('percentage','fixed') NOT NULL DEFAULT 'percentage',
    discount_value      DECIMAL(12,2)  NOT NULL,
    max_uses            INT UNSIGNED   NULL,
    used_count          INT UNSIGNED   NOT NULL DEFAULT 0,
    min_order_amount    DECIMAL(12,2)  NULL,
    valid_from          DATETIME(6)    NULL,
    valid_until         DATETIME(6)    NULL,
    status              ENUM('active','inactive','expired') NOT NULL DEFAULT 'active',
    created_at          DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at          DATETIME(6)    NULL,
    created_by          CHAR(36)       NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_coupons_code (tenant_id, code),
    KEY idx_coupons_tenant_id (tenant_id),
    KEY idx_coupons_status (status),
    CONSTRAINT fk_coupons_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE coupon_redemptions (
    id              CHAR(36)       NOT NULL,
    tenant_id       CHAR(36)       NOT NULL,
    coupon_id       CHAR(36)       NOT NULL,
    payment_id      CHAR(36)       NOT NULL,
    student_id      CHAR(36)       NOT NULL,
    discount_amount DECIMAL(12,2)  NOT NULL,
    redeemed_at     DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    KEY idx_coupon_redemptions_tenant_id (tenant_id),
    KEY idx_coupon_redemptions_coupon_id (coupon_id),
    KEY idx_coupon_redemptions_payment_id (payment_id),
    CONSTRAINT fk_coupon_redemptions_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_coupon_redemptions_coupon
        FOREIGN KEY (coupon_id) REFERENCES coupons(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_coupon_redemptions_payment
        FOREIGN KEY (payment_id) REFERENCES payments(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_coupon_redemptions_student
        FOREIGN KEY (student_id) REFERENCES student_profiles(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE wishlist_items (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    student_id      CHAR(36)     NOT NULL,
    course_id       CHAR(36)     NOT NULL,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_wishlist_items (tenant_id, student_id, course_id),
    KEY idx_wishlist_items_tenant_id (tenant_id),
    CONSTRAINT fk_wishlist_items_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_items_student
        FOREIGN KEY (student_id) REFERENCES student_profiles(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_items_course
        FOREIGN KEY (course_id) REFERENCES courses(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE certificates (
    id                  CHAR(36)     NOT NULL,
    tenant_id           CHAR(36)     NOT NULL,
    student_id          CHAR(36)     NOT NULL,
    course_id           CHAR(36)     NOT NULL,
    enrollment_id       CHAR(36)     NOT NULL,
    certificate_number  VARCHAR(100) NOT NULL,
    issued_at           DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    file_url            VARCHAR(500) NULL,
    status              ENUM('issued','revoked') NOT NULL DEFAULT 'issued',
    issued_by           CHAR(36)     NULL,
    created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_certificates_number (tenant_id, certificate_number),
    UNIQUE KEY uk_certificates_enrollment (tenant_id, enrollment_id),
    KEY idx_certificates_tenant_id (tenant_id),
    KEY idx_certificates_student_id (student_id),
    CONSTRAINT fk_certificates_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_certificates_student
        FOREIGN KEY (student_id) REFERENCES student_profiles(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_certificates_course
        FOREIGN KEY (course_id) REFERENCES courses(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_certificates_enrollment
        FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE blog_posts (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    title           VARCHAR(250) NOT NULL,
    slug            VARCHAR(270) NOT NULL,
    excerpt         TEXT         NULL,
    content         LONGTEXT     NULL,
    category        VARCHAR(100) NULL,
    author_name     VARCHAR(150) NULL,
    author_user_id  CHAR(36)     NULL,
    thumbnail_url   VARCHAR(500) NULL,
    tags_json       JSON         NULL,
    seo_title       VARCHAR(250) NULL,
    seo_description VARCHAR(500) NULL,
    status          ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
    published_at    DATETIME(6)  NULL,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,
    created_by      CHAR(36)     NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_blog_posts_slug (tenant_id, slug),
    KEY idx_blog_posts_tenant_id (tenant_id),
    KEY idx_blog_posts_status (status),
    KEY idx_blog_posts_published_at (published_at),
    CONSTRAINT fk_blog_posts_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE gallery_items (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    title           VARCHAR(200) NULL,
    media_type      ENUM('image','video') NOT NULL DEFAULT 'image',
    media_url       VARCHAR(500) NOT NULL,
    thumbnail_url   VARCHAR(500) NULL,
    description     TEXT         NULL,
    sort_order      INT          NOT NULL DEFAULT 0,
    status          ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,
    created_by      CHAR(36)     NULL,
    PRIMARY KEY (id),
    KEY idx_gallery_items_tenant_id (tenant_id),
    KEY idx_gallery_items_status (status),
    CONSTRAINT fk_gallery_items_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE faqs (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    question        VARCHAR(500) NOT NULL,
    answer          TEXT         NOT NULL,
    category        VARCHAR(100) NULL,
    sort_order      INT          NOT NULL DEFAULT 0,
    status          ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,
    PRIMARY KEY (id),
    KEY idx_faqs_tenant_id (tenant_id),
    KEY idx_faqs_status (status),
    CONSTRAINT fk_faqs_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE testimonials (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    author_name     VARCHAR(150) NOT NULL,
    author_title    VARCHAR(150) NULL,
    content         TEXT         NOT NULL,
    rating          TINYINT UNSIGNED NULL,
    image_url       VARCHAR(500) NULL,
    sort_order      INT          NOT NULL DEFAULT 0,
    status          ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,
    PRIMARY KEY (id),
    KEY idx_testimonials_tenant_id (tenant_id),
    KEY idx_testimonials_status (status),
    CONSTRAINT fk_testimonials_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notifications (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    title           VARCHAR(200) NOT NULL,
    message         TEXT         NOT NULL,
    notification_type ENUM('info','warning','success','alert') NOT NULL DEFAULT 'info',
    audience_type   ENUM('all','students','teachers','owners','specific_user') NOT NULL DEFAULT 'all',
    target_user_id  CHAR(36)     NULL,
    status          ENUM('draft','scheduled','sent','cancelled') NOT NULL DEFAULT 'draft',
    scheduled_at    DATETIME(6)  NULL,
    sent_at         DATETIME(6)  NULL,
    created_by      CHAR(36)     NULL,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    KEY idx_notifications_tenant_id (tenant_id),
    KEY idx_notifications_status (status),
    KEY idx_notifications_scheduled_at (scheduled_at),
    CONSTRAINT fk_notifications_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notification_recipients (
    id                  CHAR(36)     NOT NULL,
    tenant_id           CHAR(36)     NOT NULL,
    notification_id     CHAR(36)     NOT NULL,
    user_id             CHAR(36)     NOT NULL,
    is_read             TINYINT(1)   NOT NULL DEFAULT 0,
    read_at             DATETIME(6)  NULL,
    delivered_at        DATETIME(6)  NULL,
    created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_notification_recipients (tenant_id, notification_id, user_id),
    KEY idx_notification_recipients_tenant_id (tenant_id),
    KEY idx_notification_recipients_user_id (user_id),
    KEY idx_notification_recipients_is_read (is_read),
    CONSTRAINT fk_notification_recipients_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_notification_recipients_notification
        FOREIGN KEY (notification_id) REFERENCES notifications(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_notification_recipients_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE contact_messages (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    name            VARCHAR(150) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    phone           VARCHAR(30)  NULL,
    subject         VARCHAR(250) NULL,
    message         TEXT         NOT NULL,
    status          ENUM('new','read','replied','archived') NOT NULL DEFAULT 'new',
    replied_at      DATETIME(6)  NULL,
    replied_by      CHAR(36)     NULL,
    reply_message   TEXT         NULL,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    KEY idx_contact_messages_tenant_id (tenant_id),
    KEY idx_contact_messages_status (status),
    KEY idx_contact_messages_created_at (created_at),
    CONSTRAINT fk_contact_messages_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tenant_audit_logs (
    id              CHAR(36)     NOT NULL,
    tenant_id       CHAR(36)     NOT NULL,
    actor_user_id   CHAR(36)     NULL,
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(100) NOT NULL,
    entity_id       CHAR(36)     NULL,
    metadata_json   JSON         NULL,
    ip_address      VARCHAR(45)  NULL,
    user_agent      VARCHAR(500) NULL,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    KEY idx_tenant_audit_logs_tenant_id (tenant_id),
    KEY idx_tenant_audit_logs_actor (actor_user_id),
    KEY idx_tenant_audit_logs_entity (entity_type, entity_id),
    KEY idx_tenant_audit_logs_created_at (created_at),
    CONSTRAINT fk_tenant_audit_logs_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_tenant_audit_logs_actor
        FOREIGN KEY (actor_user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
