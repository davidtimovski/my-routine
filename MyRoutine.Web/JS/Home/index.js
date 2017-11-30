'use strict';

var DemoUserAccountViewModel = function (email, password, description) {
    var self = this;

    self.email = ko.observable(email);
    self.password = ko.observable(password);
    self.description = ko.observable(description);
};

var ViewModel = function () {
    var self = this;

    self.email = ko.observable();
    self.password = ko.observable();
    self.rememberMe = ko.observable(false);
    self.rememberMeLabelText = ko.pureComputed(function () {
        return self.rememberMe() ? "Remember Me" : "Remember Me?";
    }, self);
    self.formSuccessText = ko.observable();
    self.demoUserAccounts = ko.observableArray([
        new DemoUserAccountViewModel('newuser@demo.com', 'newuser', 'A newly registered user'),
        new DemoUserAccountViewModel('someuser@demo.com', 'someuser', 'A user with history'),
        new DemoUserAccountViewModel('admin@demo.com', 'administrator', 'Site administrator')
    ]);

    self.submit = function () {
        self.loading();
        
        app.hideFormErrors('login-form', function () {
            app.controller.account.login(ko.toJSON(self), function (response) {
                if (response.isSuccessful) {
                    $('.logo-wrap').velocity({ opacity: 0 }, {
                        duration: 500,
                        complete: function () {
                            app.redirectToLocal(window.returnUrl.substring(1));
                        }
                    });
                } else {
                    self.stopLoading();
                    app.showFormErrors(response);
                }
            });
        });
    };

    self.showSuccessMessage = function (message) {
        self.formSuccessText(message);
        app.ui.slideDownAndFadeIn('.form-success');
    };

    self.loading = function () {
        var value = 360;
        var steps = 3;
        var time = (1000 / 60) * (value / steps);
        $('.logo-circle').velocity({ rotateZ: value }, { duration: time, easing: 'linear', loop: true });
    };

    self.stopLoading = function () {
        $('.logo-circle').velocity('stop');
    };

    self.closeDemoAlert = function () {
        if (window.innerWidth > 767) {
            $('#demo-alert').velocity({ left: '-315px' }, { duration: 600, easing: 'easeInSine' });
        } else {
            $('#demo-alert').velocity({ bottom: '-315px' }, { duration: 600, easing: 'easeOutSine' });
        }
    };

    self.setDemoLoginCredentials = function (demoUserAccountViewModel) {
        self.email(demoUserAccountViewModel.email());
        self.password(demoUserAccountViewModel.password());
        self.closeDemoAlert();
    };
};

var model = new ViewModel();
ko.applyBindings(model);

app.ui.fadeIn('#login-form', null, null, function () {
    if (window.justRegistered === 'True') {
        model.showSuccessMessage('You have been successfully registered. Welcome to the club!');
    }
    if (window.accountDeleted === 'True') {
        model.showSuccessMessage('Your account has been successfully deleted :(');
    }
});

// Show demo alert
window.setTimeout(function () {
    if (window.innerWidth > 767) {
        $('#demo-alert').velocity({ left: '15px' }, { duration: 1000, easing: 'easeOutSine' });
    } else {
        $('#demo-alert').velocity({ bottom: 0 }, { duration: 1000, easing: 'easeOutSine' });
    }
}, 1000);