from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    get_current_user,
    UserViewSet, 
    SubjectViewSet, 
    ClassViewSet, 
    StudentViewSet, 
    ParentViewSet,
    ExamViewSet, 
    GradeViewSet, 
    AttendanceViewSet, 
    FeeViewSet, 
    AnnouncementViewSet,
    MessageViewSet, 
    TimetableViewSet, 
    HomeworkViewSet, 
    LibraryItemViewSet, 
    LibraryBorrowingViewSet,
    LeaveApplicationViewSet, 
    ReportCardViewSet,
    ParentFeedbackViewSet,
    AuditLogViewSet,
    SchoolSettingsViewSet,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'classes', ClassViewSet)
router.register(r'students', StudentViewSet)
router.register(r'parents', ParentViewSet)
router.register(r'exams', ExamViewSet)
router.register(r'grades', GradeViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'fees', FeeViewSet)
router.register(r'announcements', AnnouncementViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'timetables', TimetableViewSet)
router.register(r'homework', HomeworkViewSet)
router.register(r'library-items', LibraryItemViewSet)
router.register(r'library-borrowings', LibraryBorrowingViewSet)
router.register(r'leave-applications', LeaveApplicationViewSet)
router.register(r'report-cards', ReportCardViewSet)
router.register(r'parent-feedback', ParentFeedbackViewSet)
router.register(r'audit-logs', AuditLogViewSet)
router.register(r'school-settings', SchoolSettingsViewSet, basename='school-settings')

# Define specific paths first, then include router URLs
urlpatterns = [
    path('users/me/', get_current_user, name='current_user'),  # Specific path first
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/', include('rest_framework.urls')),
    path('', include(router.urls)),  # Router URLs last to avoid overriding
]
