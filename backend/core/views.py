from django.contrib.auth import get_user_model
from django.utils import timezone
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action  # Added 'action' here
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdmin, IsAdminOrTeacher, IsAdminOrStaff, IsParent, IsStudent
from .serializers import (
    UserSerializer, SubjectSerializer, ClassInstanceSerializer, StudentSerializer,
    ParentSerializer, ExamSerializer, GradeSerializer, AttendanceSerializer,
    FeeSerializer, AnnouncementSerializer, MessageSerializer, TimetableSerializer,
    HomeworkSerializer, LibraryItemSerializer, LibraryBorrowingSerializer,
    LeaveApplicationSerializer, ReportCardSerializer, ParentFeedbackSerializer,
    AuditLogSerializer, SchoolSettingsSerializer,
)
from .models import (
    Subject, ClassInstance, Student, Parent, Exam, Grade, Attendance, Fee, Announcement,
    Message, Timetable, Homework, LibraryItem, LibraryBorrowing, LeaveApplication,
    ReportCard, ParentFeedback, AuditLog, SchoolSettings,
)

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    print(f"Request headers for /api/users/me/: {request.headers}")  # Add this line
    user = request.user
    print(f"Received GET request for /users/me/ - User: {user.username}, Authenticated: {user.is_authenticated}")
    serializer = UserSerializer(user)
    print(f"Successfully serialized user data: {serializer.data}")
    return Response(serializer.data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

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
    permission_classes = [IsAdmin]

class ClassInstanceViewSet(viewsets.ModelViewSet):
    queryset = ClassInstance.objects.all()
    serializer_class = ClassInstanceSerializer
    permission_classes = [IsAdmin]

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAdminOrStaff]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return Student.objects.all()
        elif user.role == 'teacher':
            return Student.objects.filter(class_instance__teachers=user)
        elif user.role == 'parent':
            return Student.objects.filter(parents__user=user)
        elif user.role == 'student':
            return Student.objects.filter(user=user)
        return Student.objects.none()

class ParentViewSet(viewsets.ModelViewSet):
    queryset = Parent.objects.all()
    serializer_class = ParentSerializer
    permission_classes = [IsAdmin]

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [IsAdmin]

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [IsAdminOrTeacher]

    def get_queryset(self):
        user = self.request.user
        teacher_id = self.request.query_params.get('teacher_id')
        parent_id = self.request.query_params.get('parent_id')
        if user.is_superuser or user.role == 'admin':
            return Grade.objects.all()
        elif user.role == 'teacher' and teacher_id:
            return Grade.objects.filter(created_by_id=teacher_id)
        elif user.role == 'parent' and parent_id:
            return Grade.objects.filter(student__parents__id=parent_id)
        elif user.role == 'student':
            return Grade.objects.filter(student__user=user)
        return Grade.objects.none()

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAdminOrTeacher]

    def get_queryset(self):
        user = self.request.user
        teacher_id = self.request.query_params.get('teacher_id')
        if user.is_superuser or user.role == 'admin':
            return Attendance.objects.all()
        elif user.role == 'teacher' and teacher_id:
            return Attendance.objects.filter(created_by_id=teacher_id)
        elif user.role == 'parent':
            return Attendance.objects.filter(student__parents__user=user)
        elif user.role == 'student':
            return Attendance.objects.filter(student__user=user)
        return Attendance.objects.none()

class FeeViewSet(viewsets.ModelViewSet):
    queryset = Fee.objects.all()
    serializer_class = FeeSerializer
    permission_classes = [IsAdminOrStaff]

    def get_queryset(self):
        user = self.request.user
        parent_id = self.request.query_params.get('parent_id')
        if user.is_superuser or user.role == 'admin':
            return Fee.objects.all()
        elif user.role == 'parent' and parent_id:
            return Fee.objects.filter(student__parents__id=parent_id)
        elif user.role == 'student':
            return Fee.objects.filter(student__user=user)
        return Fee.objects.none()

    @action(detail=True, methods=['post'], permission_classes=[IsParent])
    def pay(self, request, pk=None):
        try:
            fee = Fee.objects.get(id=pk)
            if fee.balance <= 0:
                return Response({'message': 'Fee already paid'}, status=status.HTTP_400_BAD_REQUEST)
            fee.balance = 0
            fee.payment_method = request.data.get('payment_method', 'Cash')
            fee.save()
            AuditLog.objects.create(
                user=request.user,
                action='PAY_FEE',
                model_name='Fee',
                object_id=str(fee.id),
                details=f"Fee paid for student {fee.student}"
            )
            return Response({'message': 'Payment successful'}, status=status.HTTP_200_OK)
        except Fee.DoesNotExist:
            return Response({'message': 'Fee not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAdminOrTeacher]

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
        return Message.objects.filter(Q(sender=user) | Q(receiver=user))

class TimetableViewSet(viewsets.ModelViewSet):
    queryset = Timetable.objects.all()
    serializer_class = TimetableSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        user = self.request.user
        student_id = self.request.query_params.get('student_id')
        if user.is_superuser or user.role == 'admin':
            return Timetable.objects.all()
        elif user.role == 'teacher':
            return Timetable.objects.filter(class_instance__teachers=user)
        elif user.role == 'student' and student_id:
            return Timetable.objects.filter(class_instance__students__user_id=student_id)
        return Timetable.objects.none()

class HomeworkViewSet(viewsets.ModelViewSet):
    queryset = Homework.objects.all()
    serializer_class = HomeworkSerializer
    permission_classes = [IsAdminOrTeacher]

    def get_queryset(self):
        user = self.request.user
        student_id = self.request.query_params.get('student_id')
        teacher_id = self.request.query_params.get('teacher_id')
        if user.is_superuser or user.role == 'admin':
            return Homework.objects.all()
        elif user.role == 'teacher' and teacher_id:
            return Homework.objects.filter(created_by_id=teacher_id)
        elif user.role == 'student' and student_id:
            return Homework.objects.filter(class_instance__students__user_id=student_id)
        return Homework.objects.none()

class LibraryItemViewSet(viewsets.ModelViewSet):
    queryset = LibraryItem.objects.all()
    serializer_class = LibraryItemSerializer
    permission_classes = [IsAdmin]

class LibraryBorrowingViewSet(viewsets.ModelViewSet):
    queryset = LibraryBorrowing.objects.all()
    serializer_class = LibraryBorrowingSerializer
    permission_classes = [IsAdminOrStaff]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return LibraryBorrowing.objects.all()
        elif user.role == 'student':
            return LibraryBorrowing.objects.filter(student__user=user)
        return LibraryBorrowing.objects.none()

class LeaveApplicationViewSet(viewsets.ModelViewSet):
    queryset = LeaveApplication.objects.all()
    serializer_class = LeaveApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return LeaveApplication.objects.all()
        return LeaveApplication.objects.filter(user=user)

    def perform_update(self, serializer):
        if self.request.user.role == 'admin':
            serializer.save(approved_by=self.request.user)
        else:
            serializer.save()

class ReportCardViewSet(viewsets.ModelViewSet):
    queryset = ReportCard.objects.all()
    serializer_class = ReportCardSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return ReportCard.objects.all()
        elif user.role == 'parent':
            return ReportCard.objects.filter(student__parents__user=user)
        elif user.role == 'student':
            return ReportCard.objects.filter(student__user=user)
        return ReportCard.objects.none()

class ParentFeedbackViewSet(viewsets.ModelViewSet):
    queryset = ParentFeedback.objects.all()
    serializer_class = ParentFeedbackSerializer
    permission_classes = [IsParent]

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
    permission_classes = [IsAdmin]

class SchoolSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = SchoolSettingsSerializer
    permission_classes = [IsAdmin]

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
