from django import forms
from .models import Student, Assignment, Task

class StudentRegistrationForm(forms.ModelForm):
    pwd = forms.CharField(label='Password', widget=forms.PasswordInput)
    confirm_pwd = forms.CharField(label='Confirm Password', widget=forms.PasswordInput)

    class Meta:
        model = Student
        fields = ['username', 'name', 'email']

    def clean(self):
        super().clean()
        pwd = self.cleaned_data.get("pwd")
        confirm_pwd = self.cleaned_data.get("confirm_pwd")

        if pwd != confirm_pwd:
            raise forms.ValidationError("Passwords do not match.")

        return self.cleaned_data

    def save(self, commit=True):
        student = super().save(commit=False)
        student.set_password(self.cleaned_data["pwd"])
        if commit:
            student.save()
        return student


class StudentLoginForm(forms.Form):
    username = forms.CharField(max_length=150, label='Username')
    password = forms.CharField(widget=forms.PasswordInput, label='Password')


class AssignmentSubmissionForm(forms.ModelForm):
    class Meta:
        model = Assignment
        fields = ['submission_text']


class TaskCreationForm(forms.ModelForm):
    title = forms.CharField(label='Title', max_length=200)
    description = forms.CharField(widget=forms.Textarea, label='Description')
    due_date = forms.DateField(widget=forms.SelectDateWidget(), label='Due Date')

    class Meta:
        model = Task
        fields = ['title', 'description', 'due_date']
