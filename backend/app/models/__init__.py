"""SQLAlchemy models package.

Sprint 02: all schema tables registered on Base.metadata for Alembic.
"""

from app.core.database import Base
from app.models.academic import AcademicClass, Batch, Subject
from app.models.assessment import Assignment, AssignmentSubmission
from app.models.attendance import AttendanceRecord
from app.models.audit import PlatformAuditLog, TenantAuditLog
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
from app.models.learning import LiveClass, StudyMaterial
from app.models.marks import Mark
from app.models.notification import Notification, NotificationRecipient
from app.models.platform import PlatformSetting, SubscriptionPlan, Tenant, TenantSubscription
from app.models.profiles import StudentProfile, TeacherProfile
from app.models.quiz import Quiz, QuizAnswer, QuizAttempt, QuizQuestion, QuizQuestionOption
from app.models.rbac import Permission, Role, RolePermission
from app.models.tenant import TenantProfile
from app.models.user import EmailVerification, PasswordResetToken, User, UserRole

__all__ = [
    "Base",
    "Tenant",
    "SubscriptionPlan",
    "TenantSubscription",
    "PlatformSetting",
    "Role",
    "Permission",
    "RolePermission",
    "User",
    "UserRole",
    "PasswordResetToken",
    "EmailVerification",
    "TenantProfile",
    "TeacherProfile",
    "StudentProfile",
    "AcademicClass",
    "Subject",
    "Batch",
    "Course",
    "CourseTeacher",
    "CourseModule",
    "CourseChapter",
    "CourseLesson",
    "Enrollment",
    "LessonProgress",
    "StudyMaterial",
    "LiveClass",
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
    "AttendanceRecord",
    "Payment",
    "Coupon",
    "CouponRedemption",
    "WishlistItem",
    "Certificate",
    "BlogPost",
    "GalleryItem",
    "Faq",
    "Testimonial",
    "ContactMessage",
    "Notification",
    "NotificationRecipient",
    "PlatformAuditLog",
    "TenantAuditLog",
]
