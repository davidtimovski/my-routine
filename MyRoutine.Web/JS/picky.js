'use strict';

var picky = {
    isVisible: false,
    messageIsVisible: false,
    currentMessageTimeout: undefined,
    timeoutBeforeCasualMode: undefined,
    casualModeActionInterval: undefined,
    appearAndHideSpeed: 500,
    messageAppearSpeed: 400,
    casualModeMessageAppearAndHideSpeed: 1000,
    messageHideSpeed: 300,
    alertTypeEnum: Object.freeze({
        success: 'success',
        error: 'error',
        confirm: 'confirm',
        help: 'help',
        casual: 'casual'
    }),
    openHelpTopic: function (helpTopic) {
        var helpTopicsEnum = Object.freeze({
            taskShortTitle: 'Tasks must have a short title so that they fit in the schedule when it\'s set to compact.',
            taskDuration: 'How long does it take you to finish the task? On some days you might not be able to fully complete it so this field is editable each time you mark a task as complete.',
            taskRepetitions: 'Being able to keep track of repetitions is very useful for some tasks. For example, guitar players sometimes have exercises where they attempt to do as many chord changes (repetitions) as they can in 1 minute. This field is editable each time you mark a task as complete.',
            taskTheme: 'Having tasks of different colors will help you differentiate them easier when looking at your schedule. If you\'re not sure which one to pick, leave the field on Auto and we\'ll pick one for you.'
        });
        picky.say(helpTopicsEnum[helpTopic], picky.alertTypeEnum.help, true);
    },
    appear: function (duration, doneCallback) {
        duration = duration || picky.appearAndHideSpeed;
        doneCallback = doneCallback || function () {};

        $('#picky-wrap').velocity({ right: '15px' }, {
            duration: duration,
            complete: function () {
                picky.isVisible = true;
                doneCallback();
            }
        });
    },
    hide: function (duration) {
        if (picky.isVisible) {
            var action = function () {
                duration = duration || picky.appearAndHideSpeed;
                $('#picky-wrap').velocity({ right: '-165px' }, { duration: duration });
                picky.workMode();
                picky.isVisible = false;
            };

            if (picky.messageIsVisible) {
                picky.hideMessageContainer(picky.messageHideSpeed, function () {
                    action();
                });
            } else {
                action();
            }
        }
    },
    showMessageContainer: function (duration) {
        duration = duration || picky.messageAppearSpeed;

        $('#message').show().velocity({ opacity: 1 }, {
            duration: duration,
            complete: function () {
                picky.messageIsVisible = true;
            }
        });
        app.ui.slideDownAndFadeIn('#message-mobile');
    },
    hideMessageContainer: function (duration, doneCallback) {
        duration = duration || picky.messageHideSpeed;
        doneCallback = doneCallback || function () {};

        $('#message').velocity({ opacity: 0 }, {
            duration: duration,
            complete: function () {
                $('#message .content').empty();
                $('#message .confirm, #message .dismiss').hide();
                picky.messageIsVisible = false;
                $(this).hide();
                doneCallback();
            }
        });
        app.ui.slideUpAndFadeOut('#message-mobile');
    },
    getMessageTimeout: function (message, isCasual) {
        var timeout = message.split(' ').length * (isCasual ? 1000 : 500);
        return (timeout > 3000) ? timeout : 3000;
    },
    say: function ($message, type, hasTimeout, hasConfirm, dismissButtonText) {
        var isCasual = type === picky.alertTypeEnum.casual;

        var action = function () {
            window.clearTimeout(picky.currentMessageTimeout);

            var message = ($message instanceof window.jQuery) ? $('<div>').append($message).html() : $message;

            $('#message, #message-mobile').removeClass();
            $('#message .content').html(message.replace(/\n/g, '<br>'));
            $('#message-mobile .content').html('<span class="picky-name">Picky:</span> ' + message.replace(/\n/g, '<br>'));

            if (hasConfirm) {
                $('#message .confirm, #message-mobile .confirm').show();
            } else if (dismissButtonText) {
                $('#message .dismiss button, #message-mobile .dismiss button').off('click').on('click', function () {
                    picky.hideMessageContainer();
                });

                $('#message .dismiss button, #message-mobile .dismiss button').text(dismissButtonText);
                $('#message .dismiss, #message-mobile .dismiss').show();
            }

            if (type) {
                $('#message, #message-mobile').addClass(type);
            }

            picky.appear(picky.appearAndHideSpeed, function () {
                var messageAppearSpeed = isCasual ? picky.casualModeMessageAppearAndHideSpeed : picky.messageAppearSpeed;
                var messageHideSpeed = isCasual ? picky.casualModeMessageAppearAndHideSpeed : picky.messageHideSpeed;
                
                picky.showMessageContainer(messageAppearSpeed);

                if (hasTimeout) {
                    picky.currentMessageTimeout = window.setTimeout(function() {
                         picky.hideMessageContainer(messageHideSpeed);
                    }, picky.getMessageTimeout(message, isCasual));
                }
            });

            if (!isCasual) {
                picky.workMode();
                picky.startTimeoutBeforeCasualMode();
            }
        };

        picky.endLoading();

        if (picky.messageIsVisible) {
            picky.hideMessageContainer(picky.messageHideSpeed, function () {
                action();
            });
        } else {
            action();
        }
    },
    confirm: function (messageTypeEnum, confirmedCallback, declinedCallback) {
        $('#message .confirm .yes, #message .confirm .no, #message-mobile .confirm .yes, #message-mobile .confirm .no').off('click');

        $('#message .confirm .yes, #message-mobile .confirm .yes').on('click', function () {
            confirmedCallback();
        });
        $('#message .confirm .no, #message-mobile .confirm .no').on('click', function () {
            if (declinedCallback) {
                declinedCallback();
            } else {
                picky.hideMessageContainer();
            }
        });

        picky.getAndSay(messageTypeEnum, picky.alertTypeEnum.confirm, false, true);
    },
    showFormErrors: function (response) {
        var $message = $('<span>', { text: response.pickyMessage });
        var $errorsInMessageUl = $('<ul>');

        for (var i = 0; i < response.errors.length; i++) {
            $('#' + response.errors[i].fieldId).addClass('input-validation-error');

            for (var j = 0; j < response.errors[i].errorMessages.length; j++) {
                $errorsInMessageUl.append($('<li>', { text: response.errors[i].errorMessages[j] }));
            }
        }

        picky.endLoading();
        picky.say($message.add($errorsInMessageUl), picky.alertTypeEnum.error, false, false, 'Okay');
    },
    messageTypeEnum: Object.freeze({
        introduction: 0,
        introductionMobile: 1,
        greeting: 2,
        greetingBeenAWhile: 3,
        casualTalk: 4,
        formErrors: 5,
        changeUserDetailsSuccess: 6,
        changePasswordSuccess: 7,
        createTaskSuccess: 8,
        editTaskSuccess: 9,
        archiveTaskSuccess: 10,
        restoreTaskSuccess: 11,
        deleteTaskConfirm: 12,
        deleteTaskSuccess: 13,
        createPickyMessageSuccess: 14,
        editPickyMessageSuccess: 15,
        deletePickyMessageConfirm: 16,
        deletePickyMessageSuccess: 17,
        banUserConfirm: 18,
        banUserSuccess: 19,
        unbanUserConfirm: 20,
        unbanUserSuccess: 21,
        deleteUserConfirm: 22,
        deleteUserSuccess: 23,
        scheduleSaveSuccess: 24
    }),
    getAndSay: function (messageTypeEnum, alertTypeEnum, hasTimeout, hasConfirm, dismissButtonText) {
        $.getJSON('/Picky/GetRandomMessageByType', { pickyMessageType: messageTypeEnum }, function (response) {
            response = JSON.parse(response);
            picky.say(response.result.message, alertTypeEnum, hasTimeout, hasConfirm, dismissButtonText);
        });
    },
    loading: function () {
        if (window.innerWidth > 767) {
            $('#picky-wrap .loading').css('display', 'inline-block').velocity({ rotateZ: 360 }, {
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
            $('#picky-wrap .loading').hide().velocity('finish');
        } else {
            $('#wrap').css('opacity', 1);
            $('#mobile-loading').hide();
            $('#mobile-loading .icon-refresh').velocity('finish');
        }
    },
    showScore: function (minutes) {
        if (minutes !== 0) {
            var sign = '+';
            var classes = 'score';
            if (minutes < 0) {
                sign = '';
                classes += ' negative';
            }

            var signSpan = $('<span>', { text: sign });
            var minutesSpan = $('<span>', { text: minutes, 'class': 'minutes' });
            var scoreDiv = $('<div>', { 'class': classes }).append(signSpan).append(minutesSpan);
            $('#picky-wrap').prepend(scoreDiv);
            $('#picky-wrap .score').velocity({ opacity: 1, top: '-60px', 'font-size': '1.5rem' }, {
                duration: 1000,
                easing: 'easeInSine',
                begin: function () {
                    var count = 0;
                    var interval = 1000 / Math.abs(minutes);
                    var increment = minutes > 0 ? 1 : -1;

                    var counter = function () {
                        $('#picky-wrap .score .minutes').text(count += increment);

                        if (count === minutes) {
                            window.clearInterval(intervalId);

                            $('#picky-wrap .score').velocity({ opacity: 0, top: '-120px' }, {
                                duration: 1000,
                                easing: 'easeInSine',
                                delay: 1500,
                                complete: function () {
                                    $(this).remove();
                                }
                            });
                        }
                    };

                    var intervalId = window.setInterval(function () {
                        counter();
                    }, interval);
                }
            });
        }
    },
    animation: {
        lookDown: function () {
            $('#picky .left-eye, #picky .right-eye').velocity({ top: '60px' }, {
                duration: 800,
                complete: function () {
                    $(this).velocity({ top: '45px' }, {
                        duration: 800,
                        delay: 1500
                    });
                }
            });
            $('#picky .mouth').velocity({ top: '85px' }, {
                duration: 800,
                complete: function () {
                    $(this).velocity({ top: '65px' }, {
                        duration: 800,
                        delay: 1500
                    });
                }
            });
        },
        lookUp: function () {
            $('#picky .left-eye, #picky .right-eye').velocity({ top: '30px' }, {
                duration: 800,
                complete: function () {
                    $(this).velocity({ top: '45px' }, {
                        duration: 800,
                        delay: 1500
                    });
                }
            });
            $('#picky .mouth').velocity({ top: '55px' }, {
                duration: 800,
                complete: function () {
                    $(this).velocity({ top: '65px' }, {
                        duration: 800,
                        delay: 1500
                    });
                }
            });
        },
        lookLeft: function () {
            $('#picky .left-eye').velocity({ left: '30px' }, {
                duration: 600,
                complete: function () {
                    $(this).velocity({ left: '40px' }, {
                        duration: 600,
                        delay: 1200
                    });
                }
            });
            $('#picky .right-eye').velocity({ right: '50px' }, {
                duration: 600,
                complete: function () {
                    $(this).velocity({ right: '40px' }, {
                        duration: 600,
                        delay: 1200
                    });
                }
            });
            $('#picky .mouth').velocity({ left: '45px' }, {
                duration: 600,
                complete: function () {
                    $(this).velocity({ left: '55px' }, {
                        duration: 600,
                        delay: 1200
                    });
                }
            });
        },
        lookLeftAndRight: function () {
            $('#picky .left-eye').velocity({ left: '30px' }, {
                duration: 600,
                complete: function () {
                    $(this).velocity({ left: '40px' }, {
                        duration: 600,
                        delay: 600,
                        complete: function () {
                            $(this).velocity({ left: '50px' }, {
                                duration: 600,
                                complete: function () {
                                    $(this).velocity({ left: '40px' }, {
                                        duration: 600,
                                        delay: 600
                                    });
                                }
                            });
                        }
                    });
                }
            });
            $('#picky .right-eye').velocity({ right: '50px' }, {
                duration: 600,
                complete: function () {
                    $(this).velocity({ right: '40px' }, {
                        duration: 600,
                        delay: 600,
                        complete: function () {
                            $(this).velocity({ right: '30px' }, {
                                duration: 600,
                                complete: function () {
                                    $(this).velocity({ right: '40px' }, {
                                        duration: 600,
                                        delay: 600
                                    });
                                }
                            });
                        }
                    });
                }
            });
            $('#picky .mouth').velocity({ left: '45px' }, {
                duration: 600,
                complete: function () {
                    $(this).velocity({ left: '55px' }, {
                        duration: 600,
                        delay: 600,
                        complete: function () {
                            $(this).velocity({ left: '65px' }, {
                                duration: 600,
                                complete: function () {
                                    $(this).velocity({ left: '55px' }, {
                                        duration: 600,
                                        delay: 600
                                    });
                                }
                            });
                        }
                    });
                }
            });
        },
        suspiciousLookLeft: function () {
            $('#picky .left-eye, #picky .right-eye').velocity({ height: '5px', 'background-position-y': '-5px' }, {
                duration: 800,
                complete: function () {
                    $('#picky .left-eye').velocity({ left: '30px' }, {
                        duration: 600,
                        complete: function () {
                            $('#picky .left-eye').velocity({ left: '40px' }, {
                                duration: 600,
                                delay: 2000,
                                complete: function () {
                                    $('#picky .left-eye, #picky .right-eye').velocity({ height: '15px', 'background-position-y': 0 }, { duration: 800 });
                                }
                            });
                        }
                    });
                    $('#picky .right-eye').velocity({ right: '50px' }, {
                        duration: 600,
                        complete: function () {
                            $(this).velocity({ right: '40px' }, {
                                duration: 600,
                                delay: 2000
                            });
                        }
                    });
                    $('#picky .mouth').velocity({ left: '45px' }, {
                        duration: 600,
                        complete: function () {
                            $(this).velocity({ left: '55px' }, {
                                duration: 600,
                                delay: 2000
                            });
                        }
                    });
                }
            });
        },
        eyesWider: function () {
            $('#picky .left-eye').velocity({ left: '30px' }, {
                duration: 600,
                complete: function () {
                    $(this).velocity({ left: '40px' }, {
                        duration: 600,
                        delay: 1200
                    });
                }
            });
            $('#picky .right-eye').velocity({ right: '30px' }, {
                duration: 600,
                complete: function () {
                    $(this).velocity({ right: '40px' }, {
                        duration: 600,
                        delay: 1200
                    });
                }
            });
        },
        hehe: function () {
            $('#picky').velocity({ rotateZ: '-90deg' }, {
                duration: 1000
            });
        },
        rolloverX: function () {
            $('#picky').velocity({ rotateX: '360deg' }, {
                duration: 2000
            });
        },
        rolloverY: function () {
            $('#picky').velocity({ rotateY: '360deg' }, {
                duration: 2000
            });
        },
        rolloverZ: function () {
            $('#picky').velocity({ rotateZ: '360deg' }, {
                duration: 2000
            });
        },
        fadeOut: function () {
            $('#picky').velocity({ opacity: 0 }, {
                duration: 1000,
                complete: function () {
                    $(this).velocity({ opacity: 1 }, {
                        duration: 300,
                        delay: 1000
                    });
                }
            });
        },
        happyEyes: function (duration) {
            duration = duration || 2000;

            $('#picky .left-eye, #picky .right-eye').velocity({ height: '11px' }, {
                duration: 800,
                complete: function () {
                    $(this).velocity({ height: '15px' }, {
                        duration: 800,
                        delay: duration
                    });
                }
            });
        }
    },
    animate: function () {
        var animations = [
            picky.animation.lookDown,
            picky.animation.lookUp,
            picky.animation.lookLeft,
            picky.animation.lookLeftAndRight,
            picky.animation.suspiciousLookLeft,
            picky.animation.eyesWider,
            picky.animation.fadeOut,
            picky.animation.rolloverX,
            picky.animation.rolloverY,
            picky.animation.rolloverZ
        ];
        var randomAnimationIndex = Math.floor(Math.random() * (animations.length));
        animations[randomAnimationIndex]();
    },
    startTimeoutBeforeCasualMode: function () {
        if (window.innerWidth > 767) {
            picky.timeoutBeforeCasualMode = window.setTimeout(function () { picky.casualMode(); }, 10000);
        }
    },
    casualMode: function () {
        picky.casualModeActionInterval = setInterval(function () {
            var randomChance = Math.random();

            if (randomChance <= 0.55) {
                picky.animate();
            } else if (randomChance > 0.55 && randomChance <= 0.8) {
                picky.getAndSay(picky.messageTypeEnum.casualTalk, picky.alertTypeEnum.casual, true);
            }
        }, 30000);
    },
    workMode: function () {
        window.clearInterval(picky.casualModeActionInterval);
        window.clearTimeout(picky.timeoutBeforeCasualMode);
    }
};

// Event handlers
$('#picky').on('click', function () {
    picky.hide();
});
$('.info-button').on('click', function () {
    var helpTopic = $(this).attr('data-picky-help');
    picky.openHelpTopic(helpTopic);
});

setTimeout(function () {
    picky.appear(1000, function () {
        picky.startTimeoutBeforeCasualMode();
        
        if ($('#picky-has-introduced-itself').val() === 'False') {
            picky.animation.happyEyes(5000);
            if (window.innerWidth > 767) {
                picky.getAndSay(picky.messageTypeEnum.introduction, picky.alertTypeEnum.casual, false, false, 'Okies');
            } else {
                picky.getAndSay(picky.messageTypeEnum.introductionMobile, picky.alertTypeEnum.casual, false, false, 'Okies');
            }
        } else {
            if ($('#picky-has-greeted-user').val() === 'False') {
                picky.animation.happyEyes(4000);

                if ($('#no-login-in-a-while').val() === 'True') {
                    picky.getAndSay(picky.messageTypeEnum.greetingBeenAWhile, picky.alertTypeEnum.casual, true);
                } else {
                    picky.getAndSay(picky.messageTypeEnum.greeting, picky.alertTypeEnum.casual, true);
                }
            }
        }
    });
}, 700);