'use strict';

var ViewModel = function () {
    var self = this;

    self.email = ko.observable();

    self.submit = function () {
        app.ui.loading();

        app.hideFormErrors('password-reset-email-form', function () {
            app.controller.account.sendPasswordResetEmail(ko.toJSON(self), function (response) {
                app.ui.endLoading();

                if (response.isSuccessful) {
                    self.passwordResetEmailSent();
                } else {
                    app.showFormErrors(response);
                }
            });
        });
    };

    self.passwordResetEmailSent = function () {
        self.email(undefined);
        app.ui.slideDownAndFadeIn('.form-success');
    };
};

ko.applyBindings(new ViewModel());