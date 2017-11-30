'use strict';

var ViewModel = function () {
    var self = this;

    self.email = ko.observable();
    self.name = ko.observable();
    self.password = ko.observable();
    self.confirmPassword = ko.observable();

    self.submit = function () {
        app.ui.loading();

        app.hideFormErrors('register-form', function () {
            app.controller.account.register(ko.toJSON(self), function (response) {
                app.ui.endLoading();

                if (response.isSuccessful) {
                    self.registrationSuccess();
                } else {
                    app.showFormErrors(response);
                }
            });
        });
    };
    
    self.registrationSuccess = function () {
        self.email(undefined);
        self.name(undefined);
        self.password(undefined);
        self.confirmPassword(undefined);
        app.ui.slideDownAndFadeIn('.form-success');
    };
};

ko.applyBindings(new ViewModel());

app.ui.fadeIn('#register-form-wrap');