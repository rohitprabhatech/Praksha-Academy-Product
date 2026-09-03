"""Add 10 new tables: refresh_tokens, user_sessions, tenant_website_settings,
batch_students, programs, program_courses, question_bank, question_bank_options,
announcements, fee_structures, fee_invoices.

Uses raw SQL to ensure COLLATE utf8mb4_unicode_ci matches existing tables.
"""

from alembic import op

revision = '0002_new_tables'
down_revision = '0001_initial_schema'
branch_labels = None
depends_on = None

# All DDL uses CHAR(36) + utf8mb4_unicode_ci to match existing schema


def upgrade() -> None:
    op.execute("""
    CREATE TABLE IF NOT EXISTS refresh_tokens (
        id              CHAR(36)     NOT NULL,
        user_id         CHAR(36)     NOT NULL,
        token_hash      VARCHAR(255) NOT NULL,
        device_info     VARCHAR(500) NULL,
        ip_address      VARCHAR(45)  NULL,
        expires_at      DATETIME(6)  NOT NULL,
        revoked_at      DATETIME(6)  NULL,
        created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        UNIQUE KEY uk_refresh_tokens_hash (token_hash),
        KEY idx_refresh_tokens_user_id (user_id),
        KEY idx_refresh_tokens_expires_at (expires_at),
        CONSTRAINT fk_refresh_tokens_user
            FOREIGN KEY (user_id) REFERENCES users(id)
            ON UPDATE CASCADE ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)

    op.execute("""
    CREATE TABLE IF NOT EXISTS user_sessions (
        id                  CHAR(36)     NOT NULL,
        user_id             CHAR(36)     NOT NULL,
        refresh_token_id    CHAR(36)     NOT NULL,
        ip_address          VARCHAR(45)  NULL,
        user_agent          VARCHAR(500) NULL,
        is_active           TINYINT(1)   NOT NULL DEFAULT 1,
        last_seen_at        DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        KEY idx_user_sessions_user_id (user_id),
        KEY idx_user_sessions_refresh_token_id (refresh_token_id),
        KEY idx_user_sessions_is_active (is_active),
        CONSTRAINT fk_user_sessions_user
            FOREIGN KEY (user_id) REFERENCES users(id)
            ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_user_sessions_refresh_token
            FOREIGN KEY (refresh_token_id) REFERENCES refresh_tokens(id)
            ON UPDATE CASCADE ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)

    op.execute("""
    CREATE TABLE IF NOT EXISTS tenant_website_settings (
        id              CHAR(36)     NOT NULL,
        tenant_id       CHAR(36)     NOT NULL,
        primary_color   VARCHAR(20)  NULL DEFAULT '#1976d2',
        secondary_color VARCHAR(20)  NULL DEFAULT '#dc004e',
        font_family     VARCHAR(100) NULL DEFAULT 'Inter',
        logo_url        VARCHAR(500) NULL,
        favicon_url     VARCHAR(500) NULL,
        show_blog       TINYINT(1)   NOT NULL DEFAULT 0,
        show_gallery    TINYINT(1)   NOT NULL DEFAULT 0,
        show_faq        TINYINT(1)   NOT NULL DEFAULT 0,
        show_testimonials TINYINT(1) NOT NULL DEFAULT 1,
        show_programs   TINYINT(1)   NOT NULL DEFAULT 1,
        home_page_json      JSON     NULL,
        about_page_json     JSON     NULL,
        contact_page_json   JSON     NULL,
        courses_header_json JSON     NULL,
        programs_page_json  JSON     NULL,
        seo_title       VARCHAR(250) NULL,
        seo_description VARCHAR(500) NULL,
        seo_keywords    VARCHAR(500) NULL,
        is_published    TINYINT(1)   NOT NULL DEFAULT 0,
        published_at    DATETIME(6)  NULL,
        published_by    CHAR(36)     NULL,
        created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        UNIQUE KEY uk_tenant_website_settings_tenant (tenant_id),
        KEY idx_tenant_website_settings_is_published (is_published),
        CONSTRAINT fk_tenant_website_settings_tenant
            FOREIGN KEY (tenant_id) REFERENCES tenants(id)
            ON UPDATE CASCADE ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)

    op.execute("""
    CREATE TABLE IF NOT EXISTS batch_students (
        id              CHAR(36)     NOT NULL,
        tenant_id       CHAR(36)     NOT NULL,
        batch_id        CHAR(36)     NOT NULL,
        student_id      CHAR(36)     NOT NULL,
        joined_at       DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        status          ENUM('active','removed') NOT NULL DEFAULT 'active',
        added_by        CHAR(36)     NULL,
        PRIMARY KEY (id),
        UNIQUE KEY uk_batch_students (tenant_id, batch_id, student_id),
        KEY idx_batch_students_batch_id (batch_id),
        KEY idx_batch_students_student_id (student_id),
        CONSTRAINT fk_batch_students_tenant
            FOREIGN KEY (tenant_id) REFERENCES tenants(id)
            ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_batch_students_batch
            FOREIGN KEY (batch_id) REFERENCES batches(id)
            ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_batch_students_student
            FOREIGN KEY (student_id) REFERENCES student_profiles(id)
            ON UPDATE CASCADE ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)

    op.execute("""
    CREATE TABLE IF NOT EXISTS programs (
        id              CHAR(36)       NOT NULL,
        tenant_id       CHAR(36)       NOT NULL,
        name            VARCHAR(200)   NOT NULL,
        slug            VARCHAR(220)   NOT NULL,
        description     TEXT           NULL,
        thumbnail_url   VARCHAR(500)   NULL,
        price           DECIMAL(12,2)  NOT NULL DEFAULT 0.00,
        discount_price  DECIMAL(12,2)  NULL,
        duration_label  VARCHAR(100)   NULL,
        category        VARCHAR(100)   NULL,
        is_featured     TINYINT(1)     NOT NULL DEFAULT 0,
        status          ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
        sort_order      INT            NOT NULL DEFAULT 0,
        created_at      DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at      DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        deleted_at      DATETIME(6)    NULL,
        created_by      CHAR(36)       NULL,
        PRIMARY KEY (id),
        UNIQUE KEY uk_programs_slug (tenant_id, slug),
        KEY idx_programs_tenant_id (tenant_id),
        KEY idx_programs_status (status),
        KEY idx_programs_is_featured (is_featured),
        CONSTRAINT fk_programs_tenant
            FOREIGN KEY (tenant_id) REFERENCES tenants(id)
            ON UPDATE CASCADE ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)

    op.execute("""
    CREATE TABLE IF NOT EXISTS program_courses (
        id          CHAR(36)     NOT NULL,
        tenant_id   CHAR(36)     NOT NULL,
        program_id  CHAR(36)     NOT NULL,
        course_id   CHAR(36)     NOT NULL,
        sort_order  INT          NOT NULL DEFAULT 0,
        created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        UNIQUE KEY uk_program_courses (tenant_id, program_id, course_id),
        KEY idx_program_courses_program_id (program_id),
        KEY idx_program_courses_course_id (course_id),
        CONSTRAINT fk_program_courses_tenant
            FOREIGN KEY (tenant_id) REFERENCES tenants(id)
            ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_program_courses_program
            FOREIGN KEY (program_id) REFERENCES programs(id)
            ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_program_courses_course
            FOREIGN KEY (course_id) REFERENCES courses(id)
            ON UPDATE CASCADE ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)

    op.execute("""
    CREATE TABLE IF NOT EXISTS question_bank (
        id              CHAR(36)     NOT NULL,
        tenant_id       CHAR(36)     NOT NULL,
        subject_id      CHAR(36)     NULL,
        question_text   TEXT         NOT NULL,
        question_type   ENUM('mcq','short_text','true_false') NOT NULL DEFAULT 'mcq',
        difficulty      ENUM('easy','medium','hard') NOT NULL DEFAULT 'medium',
        tags_json       JSON         NULL,
        explanation     TEXT         NULL,
        created_by      CHAR(36)     NULL,
        created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        deleted_at      DATETIME(6)  NULL,
        PRIMARY KEY (id),
        KEY idx_question_bank_tenant_id (tenant_id),
        KEY idx_question_bank_subject_id (subject_id),
        KEY idx_question_bank_difficulty (difficulty),
        CONSTRAINT fk_question_bank_tenant
            FOREIGN KEY (tenant_id) REFERENCES tenants(id)
            ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_question_bank_subject
            FOREIGN KEY (subject_id) REFERENCES subjects(id)
            ON UPDATE CASCADE ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)

    op.execute("""
    CREATE TABLE IF NOT EXISTS question_bank_options (
        id              CHAR(36)     NOT NULL,
        tenant_id       CHAR(36)     NOT NULL,
        question_id     CHAR(36)     NOT NULL,
        option_text     VARCHAR(500) NOT NULL,
        is_correct      TINYINT(1)   NOT NULL DEFAULT 0,
        sort_order      INT          NOT NULL DEFAULT 0,
        PRIMARY KEY (id),
        KEY idx_qb_options_question_id (question_id),
        CONSTRAINT fk_qb_options_tenant
            FOREIGN KEY (tenant_id) REFERENCES tenants(id)
            ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_qb_options_question
            FOREIGN KEY (question_id) REFERENCES question_bank(id)
            ON UPDATE CASCADE ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)

    op.execute("""
    CREATE TABLE IF NOT EXISTS announcements (
        id              CHAR(36)     NOT NULL,
        tenant_id       CHAR(36)     NOT NULL,
        course_id       CHAR(36)     NOT NULL,
        batch_id        CHAR(36)     NULL,
        posted_by       CHAR(36)     NOT NULL,
        title           VARCHAR(200) NOT NULL,
        message         TEXT         NOT NULL,
        attachment_url  VARCHAR(500) NULL,
        status          ENUM('active','archived') NOT NULL DEFAULT 'active',
        created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        deleted_at      DATETIME(6)  NULL,
        PRIMARY KEY (id),
        KEY idx_announcements_tenant_id (tenant_id),
        KEY idx_announcements_course_id (course_id),
        KEY idx_announcements_batch_id (batch_id),
        KEY idx_announcements_posted_by (posted_by),
        CONSTRAINT fk_announcements_tenant
            FOREIGN KEY (tenant_id) REFERENCES tenants(id)
            ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_announcements_course
            FOREIGN KEY (course_id) REFERENCES courses(id)
            ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_announcements_batch
            FOREIGN KEY (batch_id) REFERENCES batches(id)
            ON UPDATE CASCADE ON DELETE SET NULL,
        CONSTRAINT fk_announcements_teacher
            FOREIGN KEY (posted_by) REFERENCES teacher_profiles(id)
            ON UPDATE CASCADE ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)

    op.execute("""
    CREATE TABLE IF NOT EXISTS fee_structures (
        id                  CHAR(36)       NOT NULL,
        tenant_id           CHAR(36)       NOT NULL,
        name                VARCHAR(200)   NOT NULL,
        course_id           CHAR(36)       NULL,
        batch_id            CHAR(36)       NULL,
        academic_class_id   CHAR(36)       NULL,
        fee_type            ENUM('one_time','monthly','quarterly','annual','custom') NOT NULL DEFAULT 'one_time',
        amount              DECIMAL(12,2)  NOT NULL,
        currency            CHAR(3)        NOT NULL DEFAULT 'INR',
        due_day             TINYINT UNSIGNED NULL,
        late_fee            DECIMAL(12,2)  NULL,
        is_optional         TINYINT(1)     NOT NULL DEFAULT 0,
        description         TEXT           NULL,
        status              ENUM('active','inactive') NOT NULL DEFAULT 'active',
        created_at          DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at          DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        deleted_at          DATETIME(6)    NULL,
        created_by          CHAR(36)       NULL,
        PRIMARY KEY (id),
        KEY idx_fee_structures_tenant_id (tenant_id),
        KEY idx_fee_structures_course_id (course_id),
        KEY idx_fee_structures_batch_id (batch_id),
        CONSTRAINT fk_fee_structures_tenant
            FOREIGN KEY (tenant_id) REFERENCES tenants(id)
            ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_fee_structures_course
            FOREIGN KEY (course_id) REFERENCES courses(id)
            ON UPDATE CASCADE ON DELETE SET NULL,
        CONSTRAINT fk_fee_structures_batch
            FOREIGN KEY (batch_id) REFERENCES batches(id)
            ON UPDATE CASCADE ON DELETE SET NULL,
        CONSTRAINT fk_fee_structures_class
            FOREIGN KEY (academic_class_id) REFERENCES academic_classes(id)
            ON UPDATE CASCADE ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)

    op.execute("""
    CREATE TABLE IF NOT EXISTS fee_invoices (
        id                  CHAR(36)       NOT NULL,
        tenant_id           CHAR(36)       NOT NULL,
        student_id          CHAR(36)       NOT NULL,
        fee_structure_id    CHAR(36)       NOT NULL,
        enrollment_id       CHAR(36)       NULL,
        invoice_number      VARCHAR(100)   NOT NULL,
        amount              DECIMAL(12,2)  NOT NULL,
        late_fee            DECIMAL(12,2)  NOT NULL DEFAULT 0.00,
        discount_amount     DECIMAL(12,2)  NOT NULL DEFAULT 0.00,
        total_amount        DECIMAL(12,2)  NOT NULL,
        due_date            DATE           NOT NULL,
        paid_amount         DECIMAL(12,2)  NOT NULL DEFAULT 0.00,
        status              ENUM('unpaid','partial','paid','overdue','waived','cancelled') NOT NULL DEFAULT 'unpaid',
        payment_id          CHAR(36)       NULL,
        notes               TEXT           NULL,
        created_at          DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at          DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        created_by          CHAR(36)       NULL,
        PRIMARY KEY (id),
        UNIQUE KEY uk_fee_invoices_number (tenant_id, invoice_number),
        KEY idx_fee_invoices_tenant_id (tenant_id),
        KEY idx_fee_invoices_student_id (student_id),
        KEY idx_fee_invoices_status (status),
        KEY idx_fee_invoices_due_date (due_date),
        CONSTRAINT fk_fee_invoices_tenant
            FOREIGN KEY (tenant_id) REFERENCES tenants(id)
            ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_fee_invoices_student
            FOREIGN KEY (student_id) REFERENCES student_profiles(id)
            ON UPDATE CASCADE ON DELETE RESTRICT,
        CONSTRAINT fk_fee_invoices_fee_structure
            FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(id)
            ON UPDATE CASCADE ON DELETE RESTRICT,
        CONSTRAINT fk_fee_invoices_enrollment
            FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
            ON UPDATE CASCADE ON DELETE SET NULL,
        CONSTRAINT fk_fee_invoices_payment
            FOREIGN KEY (payment_id) REFERENCES payments(id)
            ON UPDATE CASCADE ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS fee_invoices")
    op.execute("DROP TABLE IF EXISTS fee_structures")
    op.execute("DROP TABLE IF EXISTS announcements")
    op.execute("DROP TABLE IF EXISTS question_bank_options")
    op.execute("DROP TABLE IF EXISTS question_bank")
    op.execute("DROP TABLE IF EXISTS program_courses")
    op.execute("DROP TABLE IF EXISTS programs")
    op.execute("DROP TABLE IF EXISTS batch_students")
    op.execute("DROP TABLE IF EXISTS tenant_website_settings")
    op.execute("DROP TABLE IF EXISTS user_sessions")
    op.execute("DROP TABLE IF EXISTS refresh_tokens")
