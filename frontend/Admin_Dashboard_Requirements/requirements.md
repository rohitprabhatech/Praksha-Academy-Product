Praksha Academy — Admin Dashboard Team Assignment

Team Members:

Aditya Kshirsagar
Aditya Wakchaure
Gaurav Thorat
Omkar Ghule
Renuka Bhavskar




Important Git Rule

Everyone must create their own branch from dev.

git checkout dev
git pull origin dev

git checkout -b feature/admin-<your-module>

Nobody should directly work on dev or main.






1. Aditya Kshirsagar — Admin Foundation + Dashboard
Branch
feature/admin-dashboard
Responsibility

Build the complete Admin Dashboard foundation.

Pages
Admin Login
Admin Dashboard
Admin Profile
Admin Settings
Components
AdminLayout
Sidebar
TopNavbar
Breadcrumb
DashboardCards
RecentActivities
NotificationDropdown
ProfileMenu
Dashboard

Create:

Total Students
Total Teachers
Total Courses
Total Revenue
New Enrollments
Active Students
Revenue Chart
Student Growth Chart
Course Enrollment Chart
Recent Activities
Upcoming Classes
Files
src/
├── layouts/
│   └── AdminLayout.jsx
│
├── pages/admin/
│   ├── Dashboard/
│   │   └── Dashboard.jsx
│   ├── Login/
│   │   └── AdminLogin.jsx
│   ├── Profile/
│   │   └── AdminProfile.jsx
│   └── Settings/
│       └── AdminSettings.jsx
│
└── components/admin/
    ├── Sidebar.jsx
    ├── TopNavbar.jsx
    ├── DashboardCard.jsx
    ├── RevenueChart.jsx
    ├── StudentChart.jsx
    └── RecentActivities.jsx
Requirements
MUI
Bootstrap
Recharts
Responsive sidebar
Mobile sidebar
Dark/light mode support
Global theme




2. Aditya Wakchaure — Student + Teacher Management
Branch
feature/admin-users
Responsibility

Manage all users of Praksha Academy.

Student Management

Create:

Student List
Add Student
Edit Student
Student Details

Features:

Search
Filter
Pagination
Activate/Deactivate
Delete
View Profile
View Enrolled Courses
View Progress
Teacher Management

Create:

Teacher List
Add Teacher
Edit Teacher
Teacher Details

Teacher fields:

Name
Email
Phone
Profile Image
Qualification
Experience
Specialization
Bio
Status
Files
src/pages/admin/
│
├── Students/
│   ├── StudentList.jsx
│   ├── AddStudent.jsx
│   ├── EditStudent.jsx
│   └── StudentDetails.jsx
│
└── Teachers/
    ├── TeacherList.jsx
    ├── AddTeacher.jsx
    ├── EditTeacher.jsx
    └── TeacherDetails.jsx
Reusable Components
UserTable
UserForm
UserStatus
UserFilters
UserDetails




3. Gaurav Thorat — Course & Academic Management
Branch
feature/admin-academic
Responsibility

Build the complete academic management module.

Classes
Class List
Add Class
Edit Class
Delete Class

Examples:

Class 8
Class 9
Class 10
Class 11 Science
Class 11 Commerce
Class 11 Arts
Class 12 Science
Class 12 Commerce
Class 12 Arts
Subjects
Subject List
Add Subject
Edit Subject
Delete Subject
Courses
Course List
Add Course
Edit Course
Course Details

Course fields:

Course Name
Category
Class
Subject
Teacher
Description
Thumbnail
Price
Discount Price
Duration
Language
Course Type
Status
Curriculum
Course
 └── Module
      └── Chapter
           └── Lesson
Files
src/pages/admin/

├── Classes/
│   ├── ClassList.jsx
│   ├── AddClass.jsx
│   └── EditClass.jsx
│
├── Subjects/
│   ├── SubjectList.jsx
│   ├── AddSubject.jsx
│   └── EditSubject.jsx
│
└── Courses/
    ├── CourseList.jsx
    ├── AddCourse.jsx
    ├── EditCourse.jsx
    ├── CourseDetails.jsx
    └── Curriculum.jsx







4. Omkar Ghule — Learning + Enrollment + Payment
Branch
feature/admin-learning-sales
Responsibility

Build learning operations and business modules.

Study Materials
PDF
Notes
PPT
Videos
Documents
MaterialsList
AddMaterial
EditMaterial
Live Classes
LiveClassList
ScheduleClass
EditClass

Fields:

Class Name
Teacher
Course
Date
Start Time
End Time
Meeting Link
Assignments
AssignmentList
CreateAssignment
AssignmentDetails
Submissions
Exams
ExamList
CreateExam
QuestionManagement
ExamResults
Enrollment
EnrollmentList
EnrollmentDetails
ManualEnrollment
Payments
PaymentList
PaymentDetails
TransactionDetails
Coupons
CouponList
CreateCoupon
EditCoupon
Files
src/pages/admin/

├── Materials/
├── LiveClasses/
├── Assignments/
├── Exams/
├── Enrollments/
├── Payments/
└── Coupons/




5. Renuka Bhavskar — Content + Communication + Reports
Branch
feature/admin-content-reports
Responsibility

Manage website content, communication, and reports.

Blog
BlogList
CreateBlog
EditBlog
BlogDetails

Fields:

Title
Category
Author
Thumbnail
Content
Tags
SEO Title
SEO Description
Status
Gallery
GalleryList
AddImage
AddVideo
FAQ
FAQList
AddFAQ
EditFAQ
Testimonials
TestimonialsList
AddTestimonial
EditTestimonial
Notifications
NotificationList
CreateNotification
Contact Messages
ContactMessages
MessageDetails
Reports
StudentReports
CourseReports
RevenueReports
PerformanceReports
Files
src/pages/admin/

├── Blog/
├── Gallery/
├── FAQ/
├── Testimonials/
├── Notifications/
├── ContactMessages/
└── Reports/





Overall Admin Structure

After everyone completes their work, the structure should look approximately like:

src/
│
├── components/
│   └── admin/
│       ├── common/
│       ├── tables/
│       ├── forms/
│       ├── charts/
│       └── modals/
│
├── layouts/
│   └── AdminLayout.jsx
│
├── pages/
│   └── admin/
│       │
│       ├── Dashboard/
│       │
│       ├── Students/
│       ├── Teachers/
│       │
│       ├── Classes/
│       ├── Subjects/
│       ├── Courses/
│       ├── Curriculum/
│       │
│       ├── Materials/
│       ├── LiveClasses/
│       ├── Assignments/
│       ├── Exams/
│       │
│       ├── Enrollments/
│       ├── Payments/
│       ├── Coupons/
│       │
│       ├── Blog/
│       ├── Gallery/
│       ├── FAQ/
│       ├── Testimonials/
│       │
│       ├── Notifications/
│       ├── ContactMessages/
│       ├── Reports/
│       │
│       ├── Profile/
│       └── Settings/
│
├── routes/
│   └── AdminRoutes.jsx
│
├── services/
│   └── api.js
│
├── hooks/
├── utils/
├── constants/
└── theme/



Don't create separate designs for every module. Everyone must follow the same Praksha Academy global color, typography, spacing, button, table, form, card, and sidebar design system so the final Admin Dashboard looks like one professional product.