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
            var $submit = $('button[type=submit]', $objects.signInForm);
            if (!$submit.hasClass('loading')) {
                $submit.addClass('loading');
                fn.login($objects.signInForm.serialize())
                    .always(function () {
                        $submit.removeClass('loading');
                    });
            }
        },
        signUpFormOnSubmit: function (event) {
            event.preventDefault();
            var $submit = $('button[type=submit]', $objects.signUpForm);
            if (!$submit.hasClass('loading')) {
                $submit.addClass('loading');
                $.post(API_URL + '/auth/signup/', $objects.signUpForm.serialize())
                    .done(function (data, status) {
                        if (status === 'success') {
                            fn.login($objects.signUpForm.serialize());
                        }
                    })
                    .fail(fn.requestFailureHandler)
                    .always(function () {
                        $submit.removeClass('loading');
                    });
            }
        },
        getMentorsButtonOnClick: function (event) {
            if (!$objects.getMentorsButton.hasClass('loading')) {
                $objects.getMentorsButton.addClass('loading');
                fn.getMentors()
                    .done(function (data, status) {
                        if (status === 'success') {
                            fn.renderUserList($objects.mentorsList, data);
                        }
                    })
                    .always(function () {
                        $objects.getMentorsButton.removeClass('loading');
                    });
            } else {
                event.preventDefault();
            }
        },
        getMenteesButtonOnClick: function (event) {
            if ($objects.getMenteesButton.hasClass('loading')) {
                $objects.getMenteesButton.addClass('loading');
                fn.getMentees()
                    .done(function (data, status) {
                        if (status === 'success') {
                            fn.renderUserList($objects.menteesList, data);
                        }
                    })
                    .always(function () {
                        $objects.getMenteesButton.removeClass('loading');
                    });
            } else {
                event.preventDefault();
            }
        },
        logoutButtonOnClick: function (event) {
            if (!$objects.logoutButton.hasClass('loading')) {
                $objects.logoutButton.addClass('loading');
                fn.logout()
                    .always(function () {
                        $objects.logoutButton.removeClass('loading');
                    });
            } else {
                event.preventDefault();
            }
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
