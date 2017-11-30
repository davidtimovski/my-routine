'use strict';

var MessageViewModel = function () {
    var self = this;

    self.id = ko.observable(0);
    self.type = ko.observable();
    self.typeText = ko.pureComputed(function () {
        if (typeof self.type() !== 'undefined') {
            return pickyMessageTypeSelectOptions[self.type()].text;
        }
    });
    self.message = ko.observable();
    self.trimmedMessage = ko.pureComputed(function () {
        if (self.message()) {
            var cutoffLength = 80;
            if (self.message().length > cutoffLength) {
                var trimmedMessage = self.message().substr(0, cutoffLength);
                return trimmedMessage.substr(0, Math.min(trimmedMessage.length, trimmedMessage.lastIndexOf(" "))) + ' ...';
            }
            return self.message();
        }
        return '';
    });

    self.mapFromJs = function (message) {
        self.id(message.id);
        self.type(message.type);
        self.message(message.message);
    };

    self.mapFromKo = function (messageViewModel) {
        self.mapFromJs(ko.mapping.toJS(messageViewModel));
    };
};

var ViewModel = function () {
    var self = this;

    self.messages = ko.observableArray();
    self.selectedMessage = ko.observable(new MessageViewModel());
    self.formTitle = function () {
        return (self.selectedMessage().id() === 0) ? 'New message' : 'Edit message';
    };
    self.pickyMessageTypeSelectOptions = ko.observableArray();
    self.gridFilters = ko.observable(new GridFiltersViewModel());
    self.formIsShown = ko.observable(false);

    self.submit = function () {
        picky.loading();

        app.controller.admin.editPicky.editMessage(ko.toJSON(self.selectedMessage()), function (response) {
            if (response.isSuccessful) {
                self.gridFilters().reset();
                self.getMessages();
                self.hideForm();

                picky.say(response.pickyMessage, picky.alertTypeEnum.success, true);
            } else {
                picky.showFormErrors(response);
            }
        });
    };

    self.resetSelectedMessage = function () {
        self.selectedMessage(new MessageViewModel());
    };
    
    self.newMessage = function () {
        self.resetSelectedMessage();

        if (!self.formIsShown()) {
            self.showForm();
            app.ui.scrollTo();
        }
    };

    self.editMessage = function (message) {
        if (!self.formIsShown()) {
            self.showForm();
            app.ui.scrollTo();
        }

        if (self.selectedMessage().id() === message.id()) {
            self.hideForm();
        } else {
            var messageViewModel = new MessageViewModel();
            messageViewModel.mapFromKo(message);
            self.selectedMessage(messageViewModel);
        }
    };

    self.deleteMessage = function (message) {
        picky.confirm(picky.messageTypeEnum.deletePickyMessageConfirm, function () {
            picky.loading();

            app.controller.admin.editPicky.deleteMessage(message.id(), function (response) {
                if (response.isSuccessful) {
                    if (message.id() === self.selectedMessage().id()) {
                        self.resetSelectedMessage();
                    }

                    self.messages.remove(message);
                    picky.say(response.pickyMessage, picky.alertTypeEnum.success, true);
                } else {
                    picky.showFormErrors(response);
                }
            });
        });
    };
    
    self.getMessages = function () {
        app.controller.admin.editPicky.getAllMessages(self.gridFilters().onlyAssignedFiltersToJS(), function (response) {
            if (response.isSuccessful) {
                var observableMessages = response.result.pickyMessages.map(function (message) {
                    var messageViewModel = new MessageViewModel();
                    messageViewModel.mapFromJs(message);
                    return messageViewModel;
                });

                self.messages(observableMessages);
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
            self.resetSelectedMessage();
        });
    };
};

var model = new ViewModel();
model.pickyMessageTypeSelectOptions(pickyMessageTypeSelectOptions);
model.getMessages();

ko.applyBindings(model);