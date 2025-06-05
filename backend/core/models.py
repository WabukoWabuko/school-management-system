from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, username, email, role, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, role, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(username, email, role, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
        ('parent', 'Parent'),
        ('student', 'Student'),
        ('staff', 'Staff'),
    )
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'role']

    def __str__(self):
        return self.username

class SchoolSettings(models.Model):
    school_name = models.CharField(max_length=200)
    motto = models.CharField(max_length=200)
    logo = models.CharField(max_length=200, blank=True)  # URL or path
    academic_year = models.IntegerField(null=True, default=timezone.now().year)
    current_term = models.CharField(max_length=20)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'admin'}, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.school_name

class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'admin'}, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Class(models.Model):
    name = models.CharField(max_length=50)
    subjects = models.ManyToManyField(Subject)
    teachers = models.ManyToManyField(User, related_name='teaching_classes', limit_choices_to={'role': 'teacher'})
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_classes', limit_choices_to={'role': 'admin'}, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    admission_number = models.CharField(max_length=20, unique=True)
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='students')
    parents = models.ManyToManyField(User, related_name='children', limit_choices_to={'role': 'parent'})
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username

class Parent(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'role': 'parent'})
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username

class Exam(models.Model):
    name = models.CharField(max_length=100)
    term = models.CharField(max_length=20)
    year = models.IntegerField()
    max_marks = models.FloatField(default=100)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'admin'}, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.term} {self.year}"

class Grade(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    marks = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    remarks = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'teacher'})
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student} - {self.subject} - {self.marks}"

class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE)
    date = models.DateField()
    present = models.BooleanField()
    remarks = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'teacher'})
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student} - {self.date} - {'Present' if self.present else 'Absent'}"

class Fee(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    balance = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    payment_method = models.CharField(max_length=50, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role__in': ('admin', 'staff')}, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student} - {self.amount}"

class Announcement(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    target_roles = models.CharField(max_length=50)  # e.g., 'parent,student'
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role__in': ('admin', 'teacher')}, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.sender} to {self.receiver}: {self.content[:50]}"

class Timetable(models.Model):
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    day = models.CharField(max_length=10)
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=50, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'admin'}, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.class_instance} - {self.subject} - {self.day}"

class Homework(models.Model):
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    description = models.TextField()
    due_date = models.DateField()
    completed = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'teacher'})
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.subject} - {self.class_instance} - Due: {self.due_date}"

class LibraryItem(models.Model):
    title = models.CharField(max_length=200)
    item_type = models.CharField(max_length=50)  # e.g., Book, Magazine
    isbn = models.CharField(max_length=20, blank=True, unique=True)
    status = models.CharField(max_length=20, default='available')  # available, borrowed
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'admin'}, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class LibraryBorrowing(models.Model):
    library_item = models.ForeignKey(LibraryItem, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    borrow_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    returned = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role__in': ('admin', 'staff')}, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student} - {self.library_item}"

class LeaveApplication(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role__in': ('student', 'staff')})
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, default='pending')  # pending, approved, rejected
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_leaves', limit_choices_to={'role': 'admin'})
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} - {self.start_date} to {self.end_date}"

class ReportCard(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    term = models.CharField(max_length=20)
    year = models.IntegerField()
    grades = models.ManyToManyField(Grade)
    overall_grade = models.CharField(max_length=10, blank=True)
    remarks = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'admin'}, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student} - {self.term} {self.year}"

class ParentFeedback(models.Model):
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.parent} - {self.content[:50]}"

class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=200)
    model_name = models.CharField(max_length=100)
    object_id = models.CharField(max_length=50, blank=True)
    details = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.action} - {self.created_at}"
