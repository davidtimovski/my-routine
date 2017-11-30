'use strict';

var ChangeProfileDetailsFormViewModel = function () {
    var self = this;

    self.originalEmail = ko.observable();
    self.email = ko.observable();
    self.originalName = ko.observable();
    self.name = ko.observable();
    self.password = ko.observable();
    self.dateRegistered = ko.observable();
    self.formIsShown = ko.observable(false);

    self.showForm = function () {
        if (!self.formIsShown()) {
            self.formIsShown(true);
            app.ui.slideDownAndFadeIn('#change-profile-details-form');
            app.ui.scrollTo('#change-profile-details-form');
        } else {
            self.hideForm();
        }
    };

    self.hideForm = function () {
        self.reset();
        app.ui.slideUpAndFadeOut('#change-profile-details-form', function () {
            self.formIsShown(false);
        });
    };
    
    self.submit = function () {
        picky.loading();

        app.hideFormErrors('change-profile-details-form', function () {
            app.controller.profile.changeUserDetails(ko.toJSON(self), function(response) {
                if (response.isSuccessful) {
                    self.password(undefined);
                    self.originalEmail(self.email());
                    self.originalName(self.name());
                    self.hideForm();
                    picky.say(response.pickyMessage, picky.alertTypeEnum.success, true);
                } else {
                    picky.showFormErrors(response);
                }
            });
        });
    };

    self.reset = function() {
        self.email(self.originalEmail());
        self.name(self.originalName());
    };
};

var changeProfileDetailsFormViewModel = new ChangeProfileDetailsFormViewModel();
ko.applyBindings(changeProfileDetailsFormViewModel, document.getElementById('change-profile-details-form'));


var ChangePasswordFormViewModel = function () {
    var self = this;

    self.oldPassword = ko.observable();
    self.newPassword = ko.observable();
    self.confirmPassword = ko.observable();
    self.formIsShown = ko.observable(false);

    self.showForm = function () {
        if (!self.formIsShown()) {
            self.formIsShown(true);
            app.ui.slideDownAndFadeIn('#change-password-form');
            app.ui.scrollTo('#change-password-form');
        } else {
            self.hideForm();
        }
    };

    self.hideForm = function () {
        self.reset();
        app.ui.slideUpAndFadeOut('#change-password-form', function () {
            self.formIsShown(false);
        });
    };

    self.submit = function () {
        picky.loading();

        app.hideFormErrors('change-password-form', function () {
            app.controller.profile.changePassword(ko.toJSON(self), function(response) {
                if (response.isSuccessful) {
                    self.reset();
                    self.hideForm();
                    picky.say(response.pickyMessage, picky.alertTypeEnum.success, true);
                } else {
                    picky.showFormErrors(response);
                }
            });
        });
    };

    self.reset = function () {
        self.oldPassword(undefined);
        self.newPassword(undefined);
        self.confirmPassword(undefined);
    };
};

var changePasswordFormViewModel = new ChangePasswordFormViewModel();
ko.applyBindings(changePasswordFormViewModel, document.getElementById('change-password-form'));


var DeleteAccountFormsViewModel = function () {
    var self = this;

    self.deleteConfirmPassword = ko.observable();
    self.reason = ko.observable();
    self.elaboration = ko.observable();
    self.suggestions = ko.observable();
    self.elaborationAndSuggestionsAreVisible = ko.pureComputed(function () {
        return (self.reason() !== 'No reason');
    });
    self.verifyFormIsShown = ko.observable(false);
    self.deleteAccountFormIsShown = ko.observable(false);
    
    self.showVerifyForm = function () {
        if (!self.verifyFormIsShown()) {
            self.verifyFormIsShown(true);
            app.ui.slideDownAndFadeIn('#verify-before-deletion-form');
            app.ui.scrollTo('#verify-before-deletion-form');
        } else {
            self.hideForms();
        }
    };
   
    self.hideForms = function () {
        self.resetForms();
        app.ui.slideUpAndFadeOut('#delete-account-form', function () {
            self.deleteAccountFormIsShown(false);
        });
        app.ui.slideUpAndFadeOut('#verify-before-deletion-form', function () {
            self.verifyFormIsShown(false);
        });
    };

    self.verify = function () {
        picky.loading();

        app.hideFormErrors('verify-before-deletion-form', function () {
            app.controller.account.verifyCurrentUser(ko.toJSON(self), function(response) {
                if (response.isSuccessful) {
                    picky.endLoading();
                    self.deleteAccountFormIsShown(true);
                    app.ui.slideDownAndFadeIn('#delete-account-form');
                } else {
                    picky.showFormErrors(response);
                }
            });
        });
    };

    self.submit = function () {
        picky.loading();

        app.hideFormErrors('delete-account-form', function () {
            app.controller.account.deleteAccount(ko.toJSON(self), function(response) {
                if (response.isSuccessful) {
                    app.redirectToLocal('?accountDeleted=True');
                } else {
                    picky.showFormErrors(response);
                }
            });
        });
    };
    
    self.resetForms = function () {
        self.deleteConfirmPassword(undefined);
        self.reason(undefined);
        self.elaboration(undefined);
        self.suggestions(undefined);
    };
};

var deleteAccountFormsViewModel = new DeleteAccountFormsViewModel();
ko.applyBindings(deleteAccountFormsViewModel, document.getElementById('delete-account-forms'));


var ProfileDetailsViewModel = function () {
    var self = this;

    self.changeProfileDetailsForm = ko.observable(changeProfileDetailsFormViewModel);
    self.changePasswordForm = ko.observable(changePasswordFormViewModel);
    self.deleteAccountForm = ko.observable(deleteAccountFormsViewModel);
    self.activeTasksCount = ko.observable();
    self.archivedTasksCount = ko.observable();
    self.completedTasksCount = ko.observable();
    self.completedMinutesCount = ko.observable();

    self.getProfileDetails = function () {
        app.controller.profile.getProfileDetails(function (response) {
            if (response.isSuccessful) {
                self.changeProfileDetailsForm().originalEmail(response.result.userDetails.email);
                self.changeProfileDetailsForm().email(response.result.userDetails.email);
                self.changeProfileDetailsForm().originalName(response.result.userDetails.name);
                self.changeProfileDetailsForm().name(response.result.userDetails.name);
                self.changeProfileDetailsForm().dateRegistered(response.result.userDetails.dateRegistered);
                self.activeTasksCount(response.result.activeTasksCount);
                self.archivedTasksCount(response.result.archivedTasksCount);
                self.completedTasksCount(response.result.completedTasksCount);
                self.completedMinutesCount(response.result.completedMinutesCount);
            } else {
                picky.showFormErrors(response);
            }
        });
    };
};

var profileDetailsViewModel = new ProfileDetailsViewModel();
profileDetailsViewModel.getProfileDetails();

ko.applyBindings(profileDetailsViewModel, document.getElementById('profile-details'));