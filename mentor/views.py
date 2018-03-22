from django.shortcuts import render, redirect


def index(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    else:
        return render(request, 'mentor/index.html')


def dashboard(request):
    if request.user.is_authenticated:
        context = {'full_name': request.user.get_full_name()}
        return render(request, 'mentor/dashboard.html', context=context)
    else:
        return redirect('index')
