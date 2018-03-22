(function (w, d, $) {

    var API_URL = 'http://localhost:8000/api';

    var $objects = {
        userListItemCache: $('<li><span class="full-name"></span><span class="email"></span></li>')
    };

    var fn = {
        requestFailureHandler: function (request) {
            if (request.responseJSON) {
                alert(request.responseJSON.detail);
            } else {
                alert('Something went wrong, please try again!');
            }
        },
        login: function (data) {
            return $.post(API_URL + '/auth/login/', data)
                .done(function (data, status) {
                    if (status === 'success') {
                        window.location = '/mentee/dashboard';
                    }
                })
                .fail(fn.requestFailureHandler);
        },
        logout: function () {
            return $.post(API_URL + '/auth/logout/')
                .done(function (data, status) {
                    if (status === 'success') {
                        window.location = '/mentee/';
                    }
                })
                .fail(fn.requestFailureHandler);
        },
        getMentors: function () {
            return $.get(API_URL + '/getmentors')
                .fail(fn.requestFailureHandler);
        },
        getMentees: function () {
            return $.get(API_URL + '/getmentees')
                .fail(fn.requestFailureHandler);
        },
        renderUserList: function ($userList, mentors) {
            $userList.empty();
            for (var i = 0; i < mentors.length; i++) {
                var mentor = mentors[i];
                var $mentor = $objects.userListItemCache.clone();
                $('.full-name', $mentor)
                    .text(mentor.first_name + ' ' + mentor.last_name);
                $('.email', $mentor)
                    .text(mentor.email);
                $userList.append($mentor);
            }
        },
        signInFormOnSubmit: function (event) {
            event.preventDefault();
            fn.login($objects.signInForm.serialize());
        },
        signUpFormOnSubmit: function (event) {
            event.preventDefault();
            $.post(API_URL + '/auth/signup/', $objects.signUpForm.serialize())
                .done(function (data, status) {
                    if (status === 'success') {
                        fn.login($objects.signUpForm.serialize());
                    }
                })
                .fail(fn.requestFailureHandler);
        },
        getMentorsButtonOnClick: function (event) {
            event.preventDefault();
            fn.getMentors()
                .done(function (data, status) {
                    if (status === 'success') {
                        fn.renderUserList($objects.mentorsList, data);
                    }
                });
        },
        getMenteesButtonOnClick: function (event) {
            event.preventDefault();
            fn.getMentees()
                .done(function (data, status) {
                    if (status === 'success') {
                        fn.renderUserList($objects.menteesList, data);
                    }
                });
        },
        logoutButtonOnClick: function (event) {
            event.preventDefault();
            fn.logout();
        }
    };

    $(function () {
        $objects.signInForm = $('#sign-in-form', d)
            .on('submit', fn.signInFormOnSubmit);
        $objects.signUpForm = $('#sign-up-form', d)
            .on('submit', fn.signUpFormOnSubmit);
        $objects.getMentorsButton = $('#get-mentors-button', d)
            .on('click', fn.getMentorsButtonOnClick);
        $objects.mentorsList = $('#mentors-list', d);
        $objects.getMenteesButton = $('#get-mentees-button', d)
            .on('click', fn.getMenteesButtonOnClick);
        $objects.menteesList = $('#mentees-list', d);
        $objects.logoutButton = $('#logout-button', d)
            .on('click', fn.logoutButtonOnClick);
    });

    $(d)
        .on('click', '.popup-button', function () {
            var $popup = $('#popup-' + $(this).data('popup'), d);
            $popup.addClass('show');
        })
        .on('click', '.popup-close-button', function () {
            var $popup = $(this).parent().parent().parent().parent().parent();
            $popup.removeClass('show');
        });
})(window, document, jQuery);
