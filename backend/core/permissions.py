from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsTeacher(permissions.BasePermission):
    """
    Allows access only to teacher users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'teacher'

class IsParent(permissions.BasePermission):
    """
    Allows access only to parent users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'parent'

class IsStudent(permissions.BasePermission):
    """
    Allows access only to student users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'

class IsStaff(permissions.BasePermission):
    """
    Allows access only to staff users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'staff'

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Allows read-only access to all users, but write access only to admins.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'admin'

class IsAdminOrTeacher(permissions.BasePermission):
    """
    Allows access to admin or teacher users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'teacher']

class IsAdminOrStaff(permissions.BasePermission):
    """
    Allows access to admin or staff users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'staff']

class IsAdminOrStudent(permissions.BasePermission):
    """
    Allows access to admin or student users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'student']

class IsAdminOrStaffOrParent(permissions.BasePermission):
    """
    Allows access to admin, staff, or parent users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'staff', 'parent']

class IsAdminOrTeacherOrParent(permissions.BasePermission):
    """
    Allows access to admin, teacher, or parent users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'teacher', 'parent']

class IsAdminOrStudentForTimetable(permissions.BasePermission):
    """
    Allows access to admin or student users for timetables.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'student']

class IsAdminOrTeacherOrStudentForHomework(permissions.BasePermission):
    """
    Allows access to admin, teacher, or student users for homework.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'teacher', 'student']

class IsAdminOrParent(permissions.BasePermission):
    """
    Allows access to admin or parent users for parent feedback.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'parent']
