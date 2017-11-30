'use strict';

var ViewModel = function () {
    var self = this;

    self.token = ko.observable(window.token);
    self.newPassword = ko.observable();
    self.confirmPassword = ko.observable();
    self.secondsToRedirectText = ko.observable('10 seconds');

    self.submit = function () {
        app.ui.loading();

        app.hideFormErrors('reset-password-confirm-form', function () {
            app.controller.account.resetPasswordConfirm(ko.toJSON(self), function (response) {
                app.ui.endLoading();

                if (response.isSuccessful) {
                    self.passwordResetSuccess();
                } else {
                    app.showFormErrors(response);
                }
            });
        });
    };

    self.passwordResetSuccess = function () {
        self.newPassword(undefined);
        self.confirmPassword(undefined);
        app.ui.slideDownAndFadeIn('.form-success');
        
        var timeLeft = 10;
        var timeDecrement = function () {
            timeLeft--;

            if (timeLeft > 1) {
                self.secondsToRedirectText(timeLeft + ' seconds');
            } else if (timeLeft === 1) {
                self.secondsToRedirectText(timeLeft + ' second');
            } else {
                app.redirectToLocal();
            }
        };
        setInterval(timeDecrement, 1000);
    };
};

ko.applyBindings(new ViewModel());