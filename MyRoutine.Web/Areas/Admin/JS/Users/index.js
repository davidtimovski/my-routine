'use strict';

var UserViewModel = function () {
    var self = this;

    self.id = ko.observable(0);
    self.email = ko.observable();
    self.name = ko.observable();
    self.dateRegistered = ko.observable();
    self.dateRegisteredFormatted = ko.pureComputed(function () {
        if (self.dateRegistered()) {
            return moment(self.dateRegistered(), 'YYYY-MM-DD[T]HH:mm').format('DD MMM YYYY, HH:mm');
        }
    });
    self.lastLoginAt = ko.observable();
    self.lastLoginAtFormatted = ko.pureComputed(function () {
        if (self.lastLoginAt()) {
            return moment(self.lastLoginAt(), 'YYYY-MM-DD[T]HH:mm').format('DD MMM YYYY, HH:mm');
        }
    });
    self.isBanned = ko.observable();
    self.banDate = ko.observable();
    self.banDateFormatted = ko.pureComputed(function () {
        if (self.banDate()) {
            return moment(self.banDate(), 'YYYY-MM-DD[T]HH:mm').format('DD MMM YYYY, HH:mm');
        }
    });
    self.banReason = ko.observable();
    self.membershipIsConfirmed = ko.observable();

    self.mapFromJs = function (user) {
        self.id(user.id);
        self.email(user.email);
        self.name(user.name);
        self.dateRegistered(user.dateRegistered);
        self.lastLoginAt(user.lastLoginAt);
        self.isBanned(user.isBanned);
        self.banDate(user.banDate);
        self.banReason(user.banReason);
        self.membershipIsConfirmed(user.membershipIsConfirmed);
    };

    self.mapFromKo = function (userViewModel) {
        self.mapFromJs(ko.mapping.toJS(userViewModel));
    };
};

var ViewModel = function () {
    var self = this;

    self.users = ko.observableArray();
    self.selectedUser = ko.observable(new UserViewModel());
    self.gridFilters = ko.observable(new GridFiltersViewModel());
    self.formIsShown = ko.observable(false);

    self.submit = function () {
        picky.confirm(picky.messageTypeEnum.banUserConfirm, function() {
            picky.loading();

            app.controller.admin.users.ban(ko.toJSON(self.selectedUser()), function (response) {
                if (response.isSuccessful) {
                    self.gridFilters().reset();
                    self.getUsers();
                    self.hideForm();

                    picky.say(response.pickyMessage, picky.alertTypeEnum.success, true);
                } else {
                    picky.showFormErrors(response);
                }
            });
        });
    };
    
    self.resetSelectedUser = function () {
        self.selectedUser(new UserViewModel());
    };
    
    self.banUser = function (user) {
        if (!self.formIsShown()) {
            self.showForm();
            app.ui.scrollTo();
        }
        
        if (self.selectedUser().id() === user.id()) {
            self.hideForm();
        } else {
            var userViewModel = new UserViewModel();
            userViewModel.mapFromKo(user);
            self.selectedUser(userViewModel);
        }
    };
    
    self.unbanUser = function (user) {
        picky.confirm(picky.messageTypeEnum.unbanUserConfirm, function () {
            picky.loading();

            app.controller.admin.users.unban(user.id(), function (response) {
                if (response.isSuccessful) {
                    var selectedUser = ko.utils.arrayFirst(self.users(), function (userInUsers) {
                        return userInUsers.id() === user.id();
                    });

                    selectedUser.isBanned(false);
                    selectedUser.banDate(undefined);
                    selectedUser.banReason(undefined);

                    picky.say(response.pickyMessage, picky.alertTypeEnum.success, true);
                } else {
                    picky.showFormErrors(response);
                }
            });
        });
    };

    self.deleteUser = function (user) {
        picky.confirm(picky.messageTypeEnum.deleteUserConfirm, function () {
            picky.loading();

            app.controller.admin.users.delete(user.id(), function (response) {
                if (response.isSuccessful) {
                    self.getUsers();
                    picky.say(response.pickyMessage, picky.alertTypeEnum.success, true);
                } else {
                    picky.showFormErrors(response);
                }
            });
        });
    };

    self.getUsers = function () {
        app.controller.admin.users.getAll(self.gridFilters().onlyAssignedFiltersToJS(), function (response) {
            if (response.isSuccessful) {
                var observableUsers = response.result.users.map(function (user) {
                    var userViewModel = new UserViewModel();
                    userViewModel.mapFromJs(user);
                    return userViewModel;
                });

                self.users(observableUsers);
                self.gridFilters().mapFromJs(response.result.gridFilters);
            } else {
                picky.showFormErrors(response);
            }
        });
    };
    
    self.showForm = function () {
        self.formIsShown(true);
        app.ui.slideDownAndFadeIn('#form-wrap');
    };

    self.hideForm = function () {
        app.ui.slideUpAndFadeOut('#form-wrap', function () {
            self.formIsShown(false);
            self.resetSelectedUser();
        });
    };
};

var model = new ViewModel();
model.getUsers();

ko.applyBindings(model);