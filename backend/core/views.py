from django.contrib.auth import get_user_model
from django.utils import timezone
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import (
    UserSerializer, SubjectSerializer, ClassSerializer, StudentSerializer,
    ParentSerializer, ExamSerializer, GradeSerializer, AttendanceSerializer,
    FeeSerializer, AnnouncementSerializer, MessageSerializer, TimetableSerializer,
    HomeworkSerializer, LibraryItemSerializer, LibraryBorrowingSerializer,
    LeaveApplicationSerializer, ReportCardSerializer, ParentFeedbackSerializer,
    AuditLogSerializer, SchoolSettingsSerializer,
)
from .models import (
    Subject, Class, Student, Parent, Exam, Grade, Attendance, Fee, Announcement,
    Message, Timetable, Homework, LibraryItem, LibraryBorrowing, LeaveApplication,
    ReportCard, ParentFeedback, AuditLog, SchoolSettings,
)

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    user = request.user
    print(f"Received GET request for /users/me/ - User: {user.username}, Authenticated: {user.is_authenticated}")
    serializer = UserSerializer(user)
    print(f"Successfully serialized user data: {serializer.data}")
    return Response(serializer.data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        print(f"UserViewSet: User authenticated - {self.request.user.username}, Is Admin: {self.request.user.role == 'admin'}, Is Superuser: {self.request.user.is_superuser}")
        if self.request.user.is_superuser:
            return User.objects.all()
        elif self.request.user.role == 'admin':
            return User.objects.exclude(is_superuser=True)
        return User.objects.none()

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return Student.objects.all()
        elif user.role == 'teacher':
            return Student.objects.filter(class_id__teacher=user)
        elif user.role == 'parent':
            return Student.objects.filter(parent__user=user)
        elif user.role == 'student':
            return Student.objects.filter(user=user)
        return Student.objects.none()

class ParentViewSet(viewsets.ModelViewSet):
    queryset = Parent.objects.all()
    serializer_class = ParentSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return Grade.objects.all()
        elif user.role == 'teacher':
            return Grade.objects.filter(student__class_id__teacher=user)
        elif user.role == 'parent':
            return Grade.objects.filter(student__parent__user=user)
        elif user.role == 'student':
            return Grade.objects.filter(student__user=user)
        return Grade.objects.none()

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return Attendance.objects.all()
        elif user.role == 'teacher':
            return Attendance.objects.filter(student__class_id__teacher=user)
        elif user.role == 'parent':
            return Attendance.objects.filter(student__parent__user=user)
        elif user.role == 'student':
            return Attendance.objects.filter(student__user=user)
        return Attendance.objects.none()

class FeeViewSet(viewsets.ModelViewSet):
    queryset = Fee.objects.all()
    serializer_class = FeeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return Fee.objects.all()
        elif user.role == 'parent':
            return Fee.objects.filter(student__parent__user=user)
        elif user.role == 'student':
            return Fee.objects.filter(student__user=user)
        return Fee.objects.none()

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return Announcement.objects.all()
        return Announcement.objects.filter(target_roles__contains=user.role)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return Message.objects.all()
        return Message.objects.filter(recipient=user)

class TimetableViewSet(viewsets.ModelViewSet):
    queryset = Timetable.objects.all()
    serializer_class = TimetableSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return Timetable.objects.all()
        elif user.role == 'teacher':
            return Timetable.objects.filter(teacher=user)
        elif user.role == 'student':
            return Timetable.objects.filter(class_id__students__user=user)
        return Timetable.objects.none()

class HomeworkViewSet(viewsets.ModelViewSet):
    queryset = Homework.objects.all()
    serializer_class = HomeworkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return Homework.objects.all()
        elif user.role == 'teacher':
            return Homework.objects.filter(teacher=user)
        elif user.role == 'student':
            return Homework.objects.filter(class_id__students__user=user)
        return Homework.objects.none()

class LibraryItemViewSet(viewsets.ModelViewSet):
    queryset = LibraryItem.objects.all()
    serializer_class = LibraryItemSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class LibraryBorrowingViewSet(viewsets.ModelViewSet):
    queryset = LibraryBorrowing.objects.all()
    serializer_class = LibraryBorrowingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return LibraryBorrowing.objects.all()
        return LibraryBorrowing.objects.filter(user=user)

class LeaveApplicationViewSet(viewsets.ModelViewSet):
    queryset = LeaveApplication.objects.all()
    serializer_class = LeaveApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return LeaveApplication.objects.all()
        return LeaveApplication.objects.filter(user=user)

class ReportCardViewSet(viewsets.ModelViewSet):
    queryset = ReportCard.objects.all()
    serializer_class = ReportCardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return ReportCard.objects.all()
        elif user.role == 'parent':
            return ReportCard.objects.filter(student__parent__user=user)
        elif user.role == 'student':
            return ReportCard.objects.filter(student__user=user)
        return ReportCard.objects.none()

class ParentFeedbackViewSet(viewsets.ModelViewSet):
    queryset = ParentFeedback.objects.all()
    serializer_class = ParentFeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return ParentFeedback.objects.all()
        elif user.role == 'parent':
            return ParentFeedback.objects.filter(parent__user=user)
        return ParentFeedback.objects.none()

class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class SchoolSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = SchoolSettingsSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        settings = SchoolSettings.objects.first()
        if not settings:
            settings = SchoolSettings.objects.create(
                school_name='Elite Academy',
                academic_year=str(timezone.now().year),
                motto='',
                current_term='Term 1',
                logo=''
            )
            print("SchoolSettings: Created default settings due to absence")
        return SchoolSettings.objects.all()

    def list(self, request, *args, **kwargs):
        try:
            settings = SchoolSettings.objects.first()
            if not settings:
                settings = SchoolSettings.objects.create(
                    school_name='Elite Academy',
                    academic_year=str(timezone.now().year),
                    motto='',
                    current_term='Term 1',
                    logo=''
                )
                print("SchoolSettings: Created default settings due to absence")
            serializer = self.get_serializer(settings)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "O wise one, an unforeseen error has clouded the retrieval of settings. Seek guidance from the logs."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, *args, **kwargs):
        try:
            settings = SchoolSettings.objects.first()
            if not settings:
                settings = SchoolSettings.objects.create(
                    school_name='Elite Academy',
                    academic_year=str(timezone.now().year),
                    motto='',
                    current_term='Term 1',
                    logo=''
                )
                print("SchoolSettings: Created default settings due to absence")
            serializer = self.get_serializer(settings)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "O seeker of knowledge, the settings you seek are lost in the ether. Consult the logs for enlightenment."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        try:
            settings = SchoolSettings.objects.first()
            if not settings:
                settings = SchoolSettings.objects.create(
                    school_name='Elite Academy',
                    academic_year=str(timezone.now().year),
                    motto='',
                    current_term='Term 1',
                    logo=''
                )
                print("SchoolSettings: Created default settings due to absence")
            serializer = self.get_serializer(settings, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "The settings have been updated with the wisdom of the ages. May your institution thrive."}, status=status.HTTP_200_OK)
            return Response({"message": "O guardian of the realm, the data you provided lacks the harmony of truth. Verify and try again."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": "A shadow has fallen upon the update process. Seek the logs for the path to resolution."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
