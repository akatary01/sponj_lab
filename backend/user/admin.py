from django.contrib import admin
from user.models import CustomUser
from django.contrib.auth.admin import UserAdmin

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    ordering = ('email',)
    list_filter = ('email',)
    list_display = ('email',)
    search_fields = ('email',)
    fieldsets = ((
        None, {'fields': ('id', 'email', 'first_name', 'last_name', 'is_superuser', 'is_admin', 'is_staff', 'verified')}),
    )
    add_fieldsets = (
        (None, {'fields': ('id', 'email', 'first_name', 'last_name', 'is_superuser', 'is_admin', 'is_staff', 'verified')}),
    )