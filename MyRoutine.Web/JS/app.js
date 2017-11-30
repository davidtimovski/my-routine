'use strict';

var app = {
    controller: {
        account: {
            register: function (modelJson, success) {
                app.ajax({
                    url: '/Account/Register',
                    method: 'POST',
                    data: modelJson,
                    success: success,
                    successDelay: 1000
                });
            },
            login: function (modelJson, success) {
                app.ajax({
                    url: '/Account/Login',
                    method: 'POST',
                    data: modelJson,
                    success: success
                });
            },
            logOut: function () {
                app.ajax({
                    url: '/Account/LogOut',
                    method: 'POST',
                    success: function () {
                        app.redirectToLocal();
                    }
                });
            },
            sendPasswordResetEmail: function (modelJson, success) {
                app.ajax({
                    url: '/Account/SendPasswordResetEmail',
                    method: 'POST',
                    data: modelJson,
                    success: success,
                    successDelay: 1000
                });
            },
            resetPasswordConfirm: function (modelJson, success) {
                app.ajax({
                    url: '/Account/ResetPasswordConfirm',
                    method: 'POST',
                    data: modelJson,
                    success: success,
                    successDelay: 1000
                });
            },
            verifyCurrentUser: function (modelJson, success) {
                app.ajax({
                    url: '/Account/VerifyCurrentUser',
                    method: 'POST',
                    data: modelJson,
                    success: success
                });
            },
            deleteAccount: function (modelJson, success) {
                app.ajax({
                    url: '/Account/DeleteAccount',
                    method: 'POST',
                    data: modelJson,
                    success: success,
                    successDelay: 1000
                });
            }
        },
        profile: {
            getProfileDetails: function (success) {
                app.ajax({
                    url: '/Profile/GetProfileDetails',
                    method: 'POST',
                    success: success
                });
            },
            changeUserDetails: function (modelJson, success) {
                app.ajax({
                    url: '/Profile/ChangeUserDetails',
                    method: 'POST',
                    data: modelJson,
                    success: success,
                    successDelay: 1000
                });
            },
            changePassword: function (modelJson, success) {
                app.ajax({
                    url: '/Profile/ChangePassword',
                    method: 'POST',
                    data: modelJson,
                    success: success,
                    successDelay: 1000
                });
            }
        },
        tasks: {
            getAll: function (success) {
                app.ajax({
                    url: '/Tasks/GetAll',
                    success: success
                });
            },
            edit: function (modelJson, success) {
                app.ajax({
                    url: '/Tasks/Edit',
                    method: 'POST',
                    data: modelJson,
                    success: success
                });
            },
            archive: function (id, success) {
                app.ajax({
                    url: '/Tasks/Archive',
                    method: 'POST',
                    data: JSON.stringify({ id: id }),
                    success: success
                });
            },
            restore: function (id, success) {
                app.ajax({
                    url: '/Tasks/Restore',
                    method: 'POST',
                    data: JSON.stringify({ id: id }),
                    success: success
                });
            },
            delete: function (id, success) {
                app.ajax({
                    url: '/Tasks/Delete',
                    method: 'POST',
                    data: JSON.stringify({ id: id }),
                    success: success
                });
            },
            reorder: function (oldOrder, newOrder) {
                app.ajax({
                    url: '/Tasks/Reorder',
                    method: 'POST',
                    data: JSON.stringify({ oldOrder: oldOrder, newOrder: newOrder })
                });
            }
        },
        overview: {
            getTasksForSchedule: function (modelJson, success) {
                app.ajax({
                    url: '/Overview/GetTasksForSchedule',
                    data: modelJson,
                    success: success
                });
            },
            saveTaskItems: function (modelJson, success) {
                app.ajax({
                    url: '/Overview/SaveTaskItems',
                    method: 'POST',
                    data: modelJson,
                    success: success
                });
            },
            toggleScheduleIsCompact: function (scheduleIsCompact) {
                app.ajax({
                    url: '/Overview/ToggleScheduleIsCompact',
                    method: 'POST',
                    data: JSON.stringify({ scheduleIsCompact: scheduleIsCompact })
                });
            }
        },
        admin: {
            users: {
                getAll: function (modelJson, success) {
                    app.ajax({
                        url: '/Admin/Users/GetAll',
                        data: modelJson,
                        success: success
                    });
                },
                ban: function (modelJson, success) {
                    app.ajax({
                        url: '/Admin/Users/Ban',
                        method: 'POST',
                        data: modelJson,
                        success: success
                    });
                },
                unban: function (id, success) {
                    app.ajax({
                        url: '/Admin/Users/Unban',
                        method: 'POST',
                        data: JSON.stringify({ id: id }),
                        success: success
                    });
                },
                delete: function (id, success) {
                    app.ajax({
                        url: '/Admin/Users/Delete',
                        method: 'POST',
                        data: JSON.stringify({ id: id }),
                        success: success
                    });
                }
            },
            editPicky: {
                getAllMessages: function (modelJson, success) {
                    app.ajax({
                        url: '/Admin/EditPicky/GetAllMessages',
                        data: modelJson,
                        success: success
                    });
                },
                editMessage: function (modelJson, success) {
                    app.ajax({
                        url: '/Admin/EditPicky/EditMessage',
                        method: 'POST',
                        data: modelJson,
                        success: success
                    });
                },
                deleteMessage: function (id, success) {
                    app.ajax({
                        url: '/Admin/EditPicky/DeleteMessage',
                        method: 'POST',
                        data: JSON.stringify({ id: id }),
                        success: success
                    });
                }
            },
            statistics: {
                getStatistics: function (success) {
                    app.ajax({
                        url: '/Admin/Statistics/GetStatistics',
                        success: success
                    });
                }
            }
        }
    },
    ajax: function (paramObject) {
        var ajaxStart = Date.now();

        $.ajax({
            url: paramObject.url,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: paramObject.method || 'GET',
            data: paramObject.data || '{}',
            success: function (response) {
                response = JSON.parse(response);

                if (paramObject.success) {
                    if (paramObject.successDelay) {
                        var ajaxDuration = Date.now() - ajaxStart;

                        if (ajaxDuration < paramObject.successDelay) {
                            setTimeout(function() {
                                paramObject.success(response);
                            }, paramObject.successDelay - ajaxDuration);
                        } else {
                            paramObject.success(response);
                        }
                    } else {
                        paramObject.success(response);
                    }
                }
            }
        });
    },
    redirectToLocal: function (url) {
        url = url || '';
        window.location.replace('/' + url);
    },
    showFormErrors: function (response) {
        var $validationErrorsUl = $('.validation-errors');

        for (var i = 0; i < response.errors.length; i++) {
            $('#' + response.errors[i].fieldId).addClass('input-validation-error');

            for (var j = 0; j < response.errors[i].errorMessages.length; j++) {
                $validationErrorsUl.append($('<li>', { text: response.errors[i].errorMessages[j] }));
            }
        }

        app.ui.slideDownAndFadeIn('.validation-errors');
    },
    hideFormErrors: function (formId, completeCallback) {
        completeCallback = completeCallback || function () { };

        $('#' + formId + ' .input-validation-error').removeClass('input-validation-error');
        if ($('.validation-errors').length > 0) {
            app.ui.slideUpAndFadeOut('.validation-errors', function() {
                $('.validation-errors').empty();
                completeCallback();
            });
        } else {
            completeCallback();
        }
    },
    ui: {
        loading: function () {
            if (window.innerWidth > 767) {
                $('.header-loading').css('display', 'inline-block').velocity({ rotateZ: 360 }, {
                    duration: 2000,
                    easing: 'linear',
                    loop: true
                });
            } else {
                $('#wrap').css('opacity', 0.5);
                $('#mobile-loading').show();
                $('#mobile-loading .icon-refresh').velocity({ rotateZ: 360 }, {
                    duration: 2000,
                    easing: 'linear',
                    loop: true
                });
            }
        },
        endLoading: function () {
            if (window.innerWidth > 767) {
                $('.header-loading').hide().velocity('finish');
            } else {
                $('#wrap').css('opacity', 1);
                $('#mobile-loading').hide();
                $('#mobile-loading .icon-refresh').velocity('finish');
            }
        },
        scrollTo: function (selector, duration) {
            selector = selector || 'body';
            duration = duration || 1000;

            if (document.body.scrollTop > 0) {
                $(selector).velocity('scroll', { duration: duration });
            }
        },
        fadeIn: function (selector, duration, delay, completeCallback) {
            duration = duration || 700;
            delay = delay || 500;
            completeCallback = completeCallback || function () { };
            
            setTimeout(function () {
                $(selector).velocity({ opacity: 1 }, { duration: duration, complete: completeCallback() });
            }, delay);
        },
        fadeInMultiple: function(selector, duration, delay, stagger) {
            duration = duration || 700;
            delay = delay || 500;
            stagger = stagger || 100;
            
            setTimeout(function () {
                $(selector).children().velocity('transition.fadeIn', {
                    duration: duration,
                    stagger: stagger
                });
            }, delay);
        },
        slideDownAndFadeIn: function (selector, duration) {
            duration = duration || 700;
            
            $(selector).velocity('slideDown', { duration: duration });
            $(selector).velocity({ opacity: 1 }, { duration: duration, queue: false });
        },
        slideUpAndFadeOut: function (selector, completeCallback, duration) {
            completeCallback = completeCallback || function () { };
            duration = duration || 700;
            
            $(selector).velocity('slideUp', { duration: duration });
            $(selector).velocity({ opacity: 0 }, { duration: duration, queue: false, complete: completeCallback });
        },
        slideUpAndFadeIn: function (selector, duration) {
            duration = duration || 700;
            
            $(selector).velocity('slideDown', { duration: duration });
            $(selector).velocity({ opacity: 1 }, { duration: duration, queue: false });
        },
        slideDownAndFadeOut: function (selector, completeCallback, duration) {
            completeCallback = completeCallback || function () { };
            duration = duration || 700;
            
            $(selector).velocity('slideUp', { duration: duration });
            $(selector).velocity({ opacity: 0 }, { duration: duration, queue: false, complete: completeCallback });
        }
    },
    sound: {
        bleep: new window.Audio('/Content/audio/bleep.mp3'),
        blop: new window.Audio('/Content/audio/blop.mp3')
    },
    global: function () {
        $('#logout-button').click(function () {
            app.controller.account.logOut();
        });
    }
};