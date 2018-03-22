from django.shortcuts import render, redirect


def index(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    else:
        return render(request, 'mentee/index.html')


def dashboard(request):
    if request.user.is_authenticated:
        context = {'full_name': request.user.get_full_name()}
        return render(request, 'mentee/dashboard.html', context=context)
    else:
        return redirect('index')
