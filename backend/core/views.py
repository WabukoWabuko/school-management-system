from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User, Subject, Class, Student, Parent, Exam, Grade, Attendance, Fee, Announcement, Message, Timetable, Homework, LibraryItem, LibraryBorrowing, Borrowers, LeaveApplication, ReportCard, ParentFeedback, AuditLog, SchoolSettings
from .serializers import UserSerializer, SubjectSerializer, ClassSerializer, StudentSerializer, ParentSerializer, ExamSerializer, GradeSerializer, AttendanceSerializer, FeeSerializer, AnnouncementSerializer, MessageSerializer, TimetableSerializer, HomeworkSerializer, LibraryItemSerializer, LibraryBorrowingSerializer, LeaveApplicationSerializer, ReportCardSerializer, ParentFeedbackSerializer, AuditLogSerializer, SchoolSettingsSerializer
from .permissions import IsAdmin, IsTeacher, IsParent, IsStudent, IsStaff, IsAdminOrReadOnly

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

class SubjectViewSet(viewModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAdminOrReadOnly]

class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsAdminOrReadOnly]

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAdmin | IsStaff]

class ParentViewSet(viewsets.ModelViewSet):
    queryset = Parent.objects.all()
    serializer_class = ParentSerializer
    permission_classes = [IsAdmin]

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [IsAdminOrReadOnly]

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [IsAdmin | IsTeacher]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return Grade.objects.filter(created_by=user)
        elif user.role == 'parent':
            parent = Parent.objects.get(user=user)
            return Grade.objects.filter(student__parents__parent=user)
        elif user.role == 'student':
            student = Student.objects.get(user=user)
            return Grade.objects.filter(student=user)
        return self.queryset

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAdmin | IsTeacher]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return Attendance.objects.filter(created_by=user)
        elif user.role == 'parent':
            parent = Parent.objects.get(user=user))
            return Attendance.objects.filter(student__parents__parent=user)
        return self.queryset

class FeeViewSet(viewsets.ModelViewSet):
    queryset = Fee.objects.all()
    serializer_class = FeeSerializer
    permission_classes = [IsAdmin | IsStaff]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'parent':
            parent = Parent.objects.get(user=user)
            return Fee.objects.filter(student__parents__user=user)
        return self.queryset

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['parent', 'student']:
            return Announcement.objects.filter(target_roles__contains=user.role)
        return self.queryset

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(sender=user) | Message.objects.filter(receiver=user)

class TimetableViewSet(viewsets.ModelViewSet):
    queryset = Timetable.objects.all()
    serializer_class = TimetableSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            student = Student.objects.get(user=user)
            return Timetable.objects.filter(class_instance__students=student)
        elif user.role == 'teacher':
            return Timetable.objects.filter(class_instance__teachers=user)
        return self.queryset

class HomeworkViewSet(viewsets.ModelViewSet):
    queryset = Homework.objects.all()
    serializer_class = HomeworkSerializer
    permission_classes = [IsAdmin | IsTeacher]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            student = Student.objects.get(user=user)
            return Homework.objects.filter(class_instance__students=student)
        elif user.role == 'parent':
            parent = Parent.objects.get(user=user)
            return Homework.objects.filter(class_instance__students__parents=user)
        return self.queryset

class LibraryItemViewSet(viewsets.ModelViewSet):
    queryset = LibraryItem.objects.all()
    serializer_class = LibraryItemSerializer
    permission_classes = [IsAdminOrReadOnly]

class LibraryBorrowingViewSet(viewsets.ModelViewSet):
    queryset = LibraryBorrowing.objects.all()
    serializer_class = LibraryBorrowingSerializer
    permission_classes = [IsAdmin | IsStaff]

class LeaveApplicationViewSet(viewsets.ModelViewSet):
    queryset = LeaveApplication.objects.all()
    serializer_class = LeaveApplicationSerializer
    permission_classes = [IsAdmin | IsStudent | IsStaff]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['student', 'staff']:
            return LeaveApplication.objects.filter(user=user)
        return self.queryset

class ReportCardViewSet(viewsets.ModelViewSet):
    queryset = ReportCard.objects.all()
    serializer_class = ReportCardSerializer
    permission_classes = [IsAdmin']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'parent':
            parent = Parent.objects.get(user=user)
            return ReportCard.objects.filter(student__parents__parent=user))
        elif user.role == 'student':
            student = Student.objects.get(user=user)
            return ReportCard.objects.filter(student=user)
        return self.queryset

class ParentFeedbackViewSet(viewsets.ModelViewSet):
    queryset = ParentFeedback.objects.all()
    serializer_class = ParentFeedbackSerializer
    permission_classes = [IsAdmin | IsParent]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'parent':
            parent = Parent.objects.get(user=user)
            return ParentFeedback.objects.filter(parent=parent)
        return self.queryset

class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdmin]

class SchoolSettingsViewSet(viewsets.ModelViewSet):
    queryset = SchoolSettings.objects.all()
    serializer_class = SchoolSettingsSerializer
    permission_classes = [IsAdmin]
