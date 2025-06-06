from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'password']
        read_only_fields = ['id']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)  # Hash the password
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)  # Hash the password
        instance.save()
        return instance

class SchoolSettingsSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = SchoolSettings
        fields = ['id', 'school_name', 'motto', 'logo', 'academic_year', 'current_term', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class SubjectSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Subject
        fields = ['id', 'name', 'code', 'description', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class ClassInstanceSerializer(serializers.ModelSerializer):
    subjects = SubjectSerializer(many=True, read_only=True)
    subjects_ids = serializers.PrimaryKeyRelatedField(many=True, queryset=Subject.objects.all(), source='subjects', required=False, write_only=True)
    teachers = UserSerializer(many=True, read_only=True)
    teachers_ids = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.filter(role='teacher'), source='teachers', required=False, write_only=True)
    created_by = UserSerializer(read_only=True)
    students = serializers.SerializerMethodField()

    def get_students(self, obj):
        students = obj.students.all()
        return UserSerializer(students, many=True).data

    class Meta:
        model = ClassInstance
        fields = ['id', 'name', 'subjects', 'subjects_ids', 'teachers', 'teachers_ids', 'students', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class_instance = ClassInstanceSerializer(read_only=True)
    parents = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'user', 'admission_number', 'class_instance', 'parents', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ParentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    children = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Parent
        fields = ['id', 'user', 'children', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ExamSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Exam
        fields = ['id', 'name', 'term', 'year', 'max_marks', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class GradeSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    exam = ExamSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Grade
        fields = ['id', 'student', 'subject', 'exam', 'marks', 'remarks', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class AttendanceSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    class_instance = ClassInstanceSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'student', 'class_instance', 'date', 'present', 'remarks', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class FeeSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Fee
        fields = ['id', 'student', 'amount', 'balance', 'date', 'payment_method', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class AnnouncementSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'target_roles', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'read', 'created_at', 'updated_at']
        read_only_fields = ['id', 'sender', 'created_at', 'updated_at']

class TimetableSerializer(serializers.ModelSerializer):
    class_instance = ClassInstanceSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Timetable
        fields = ['id', 'class_instance', 'subject', 'day', 'start_time', 'end_time', 'room', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class HomeworkSerializer(serializers.ModelSerializer):
    class_instance = ClassInstanceSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Homework
        fields = ['id', 'class_instance', 'subject', 'description', 'due_date', 'completed', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class LibraryItemSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = LibraryItem
        fields = ['id', 'title', 'item_type', 'isbn', 'status', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class LibraryBorrowingSerializer(serializers.ModelSerializer):
    library_item = LibraryItemSerializer(read_only=True)
    student = StudentSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = LibraryBorrowing
        fields = ['id', 'library_item', 'student', 'borrow_date', 'return_date', 'returned', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class LeaveApplicationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    approved_by = UserSerializer(read_only=True)

    class Meta:
        model = LeaveApplication
        fields = ['id', 'user', 'start_date', 'end_date', 'reason', 'status', 'approved_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'approved_by', 'created_at', 'updated_at']

class ReportCardSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    grades = GradeSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = ReportCard
        fields = ['id', 'student', 'term', 'year', 'grades', 'overall_grade', 'remarks', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class ParentFeedbackSerializer(serializers.ModelSerializer):
    parent = ParentSerializer(read_only=True)

    class Meta:
        model = ParentFeedback
        fields = ['id', 'parent', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class AuditLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = AuditLog
        fields = ['id', 'user', 'action', 'model_name', 'object_id', 'details', 'created_at']
        read_only_fields = ['id', 'created_at']

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']
