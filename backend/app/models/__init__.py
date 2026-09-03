"""SQLAlchemy models package.

Sprint 02: original 54 tables.
DB Design: updated to 64 tables — added refresh_tokens, user_sessions,
           tenant_website_settings, batch_students, programs, program_courses,
           question_bank, question_bank_options, announcements,
           fee_structures, fee_invoices.
"""

from app.core.database import Base
from app.models.academic import AcademicClass, Batch, Subject
from app.models.announcements import Announcement
from app.models.assessment import Assignment, AssignmentSubmission
from app.models.attendance import AttendanceRecord
from app.models.audit import PlatformAuditLog, TenantAuditLog
from app.models.auth_tokens import RefreshToken, UserSession
from app.models.batch_students import BatchStudent
from app.models.cms import BlogPost, ContactMessage, Faq, GalleryItem, Testimonial
from app.models.commerce import Certificate, Coupon, CouponRedemption, Payment, WishlistItem
from app.models.course import (
    Course,
    CourseChapter,
    CourseLesson,
    CourseModule,
    CourseTeacher,
)
from app.models.enrollment import Enrollment, LessonProgress
from app.models.exam import Exam, ExamAnswer, ExamAttempt, ExamQuestion, ExamQuestionOption
from app.models.finance import FeeInvoice, FeeStructure
from app.models.learning import LiveClass, StudyMaterial
from app.models.marks import Mark
from app.models.notification import Notification, NotificationRecipient
from app.models.platform import PlatformSetting, SubscriptionPlan, Tenant, TenantSubscription
from app.models.profiles import StudentProfile, TeacherProfile
from app.models.programs import Program, ProgramCourse
from app.models.question_bank import QuestionBank, QuestionBankOption
from app.models.quiz import Quiz, QuizAnswer, QuizAttempt, QuizQuestion, QuizQuestionOption
from app.models.rbac import Permission, Role, RolePermission
from app.models.tenant import TenantProfile
from app.models.user import EmailVerification, PasswordResetToken, User, UserRole
from app.models.website import TenantWebsiteSettings

__all__ = [
    "Base",
    # Platform
    "Tenant",
    "SubscriptionPlan",
    "TenantSubscription",
    "PlatformSetting",
    # RBAC
    "Role",
    "Permission",
    "RolePermission",
    # Users & Auth
    "User",
    "UserRole",
    "RefreshToken",
    "UserSession",
    "PasswordResetToken",
    "EmailVerification",
    # Tenant
    "TenantProfile",
    "TenantWebsiteSettings",
    # People
    "TeacherProfile",
    "StudentProfile",
    # Academic
    "AcademicClass",
    "Subject",
    "Batch",
    "BatchStudent",
    # Programs
    "Program",
    "ProgramCourse",
    # Courses
    "Course",
    "CourseTeacher",
    "CourseModule",
    "CourseChapter",
    "CourseLesson",
    # Enrollment
    "Enrollment",
    "LessonProgress",
    # LMS
    "StudyMaterial",
    "LiveClass",
    "Announcement",
    # Assessments
    "QuestionBank",
    "QuestionBankOption",
    "Assignment",
    "AssignmentSubmission",
    "Quiz",
    "QuizQuestion",
    "QuizQuestionOption",
    "QuizAttempt",
    "QuizAnswer",
    "Exam",
    "ExamQuestion",
    "ExamQuestionOption",
    "ExamAttempt",
    "ExamAnswer",
    "Mark",
    # Attendance
    "AttendanceRecord",
    # Finance
    "Payment",
    "Coupon",
    "CouponRedemption",
    "FeeStructure",
    "FeeInvoice",
    # Certificates
    "WishlistItem",
    "Certificate",
    # CMS
    "BlogPost",
    "GalleryItem",
    "Faq",
    "Testimonial",
    "ContactMessage",
    # Notifications
    "Notification",
    "NotificationRecipient",
    # Audit
    "PlatformAuditLog",
    "TenantAuditLog",
]
