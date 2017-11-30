'use strict';

var TaskViewModel = function () {
    var self = this;

    self.id = ko.observable(0);
    self.title = ko.observable();
    self.shortTitle = ko.observable();
    self.description = ko.observable();
    self.trimmedDescription = ko.pureComputed(function () {
        if (self.description()) {
            var cutoffLength = 60;
            if (self.description().length > cutoffLength) {
                var trimmedDescription = self.description().substr(0, cutoffLength);
                return trimmedDescription.substr(0, Math.min(trimmedDescription.length, trimmedDescription.lastIndexOf(' '))) + ' ...';
            }
            return self.description();
        }
        return '';
    });
    self.durationMinutes = ko.observable();
    self.repetitions = ko.observable();
    self.theme = ko.observable(0);
    self.theme.subscribe(function (theme) {
        model.selectedTask().themeName(model.taskThemeSelectOptions()[theme].text.toLowerCase());
    });
    self.themeName = ko.observable();
    self.hasNoCompletedItems = ko.observable(true);

    self.mapFromJs = function (task) {
        self.id(task.id);
        self.title(task.title);
        self.shortTitle(task.shortTitle);
        self.description(task.description);
        self.durationMinutes(task.durationMinutes);
        self.repetitions(task.repetitions);
        self.theme(task.theme);
        self.themeName(task.themeName);
        self.hasNoCompletedItems(task.hasNoCompletedItems);
    };

    self.mapFromKo = function (taskViewModel) {
        self.mapFromJs(ko.mapping.toJS(taskViewModel));
    };
};

var ViewModel = function () {
    var self = this;

    self.activeTasks = ko.observableArray();
    self.archivedTasks = ko.observableArray();
    self.selectedTask = ko.observable(new TaskViewModel());
    self.taskThemeSelectOptions = ko.observableArray();
    self.activeTasksAreVisible = ko.observable(true);
    self.formIsShown = ko.observable(false);
    
    self.formTitle = ko.pureComputed(function () {
        return (self.selectedTask().id() === 0) ? 'New task' : 'Edit task';
    });
    self.tableTitle = ko.pureComputed(function () {
        return self.activeTasksAreVisible() ? 'Active tasks' : 'Archived tasks';
    });
    self.toggleActiveArchivedButtonText = ko.pureComputed(function () {
        return self.activeTasksAreVisible() ? 'Show archived' : 'Show active';
    });

    self.generateShortTitle = function () {
        if (self.selectedTask().id() === 0 && !self.selectedTask().shortTitle()) {
            if (self.selectedTask().title()) {
                var shortTitle = '';
                var titleWordsArray = self.selectedTask().title().split(' ');

                for (var i = 0; i < titleWordsArray.length; i++) {
                    shortTitle += titleWordsArray[i].charAt(0).toUpperCase();
                }

                self.selectedTask().shortTitle(shortTitle);
            }
        }
    };

    self.toggleActiveArchived = function () {
        self.activeTasksAreVisible(self.activeTasksAreVisible() ? false : true);
    };

    self.submit = function () {
        picky.loading();
        
        app.hideFormErrors('edit-task-form', function () {
            app.controller.tasks.edit(ko.toJSON(self.selectedTask()), function (response) {
                if (response.isSuccessful) {
                    var task = ko.utils.arrayFirst(self.activeTasks(), function (activeTask) {
                        return activeTask.id() === self.selectedTask().id();
                    });

                    if (task) {
                        task.mapFromKo(self.selectedTask());
                    } else {
                        var taskViewModel = new TaskViewModel();
                        taskViewModel.mapFromKo(self.selectedTask());
                        taskViewModel.id(response.result.id);
                        taskViewModel.theme(response.result.theme);
                        taskViewModel.themeName(response.result.themeName);
                        self.activeTasks.push(taskViewModel);
                    }
                    self.hideForm();

                    picky.say(response.pickyMessage, picky.alertTypeEnum.success, true);
                } else {
                    picky.showFormErrors(response);
                }
            });
        });
    };
    
    self.resetSelectedTask = function () {
        self.selectedTask(new TaskViewModel());
    };
    
    self.newTask = function () {
        app.ui.scrollTo();
        self.resetSelectedTask();

        if (!self.formIsShown()) {
            self.showForm();
        }
    };

    self.editTask = function (task) {
        app.ui.scrollTo();

        if (!self.formIsShown()) {
            self.showForm();
        }

        if (self.selectedTask().id() === task.id()) {
            self.hideForm();
        } else {
            var taskViewModel = new TaskViewModel();
            taskViewModel.mapFromKo(task);
            self.selectedTask(taskViewModel);
        }
    };

    self.archiveTask = function (task) {
        picky.loading();

        app.controller.tasks.archive(task.id(), function (response) {
            if (response.isSuccessful) {
                if (task.id() === self.selectedTask().id()) {
                    self.resetSelectedTask();
                }
                self.archivedTasks.push(task);
                self.activeTasks.remove(task);
                picky.say(response.pickyMessage, picky.alertTypeEnum.success, true);
            } else {
                picky.showFormErrors(response);
            }
        });
    };
    
    self.restoreTask = function (task) {
        picky.loading();

        app.controller.tasks.restore(task.id(), function (response) {
            if (response.isSuccessful) {
                self.activeTasks.push(task);
                self.archivedTasks.remove(task);
                if (self.archivedTasks().length === 0) {
                    self.activeTasksAreVisible(true);
                }
                picky.say(response.pickyMessage, picky.alertTypeEnum.success, true);
            } else {
                picky.showFormErrors(response);
            }
        });
    };

    self.deleteTask = function (task) {
        var deleteAction = function () {
            picky.loading();

            app.controller.tasks.delete(task.id(), function (response) {
                if (response.isSuccessful) {
                    self.archivedTasks.remove(task);
                    if (self.archivedTasks().length === 0) {
                        self.activeTasksAreVisible(true);
                    }
                    picky.say(response.pickyMessage, picky.alertTypeEnum.success, true);
                } else {
                    picky.showFormErrors(response);
                }
            });
        };

        if (task.hasNoCompletedItems()) {
            deleteAction();
        } else {
            picky.confirm(picky.messageTypeEnum.deleteTaskConfirm, function () {
                deleteAction();
            });
        }
    };
    
    self.reorderTasks = function (oldOrder, newOrder) {
        app.controller.tasks.reorder(oldOrder, newOrder);
    };

    self.getAllTasks = function (completeCallback) {
        app.controller.tasks.getAll(function (response) {
            if (response.isSuccessful) {
                var activeObservableTasks = response.result.activeTasks.map(function (task) {
                    var taskViewModel = new TaskViewModel();
                    taskViewModel.mapFromJs(task);
                    return taskViewModel;
                });

                var archivedObservableTasks = response.result.archivedTasks.map(function (task) {
                    var taskViewModel = new TaskViewModel();
                    taskViewModel.mapFromJs(task);
                    return taskViewModel;
                });

                self.activeTasks(activeObservableTasks);
                self.archivedTasks(archivedObservableTasks);
                
                if (completeCallback) {
                    completeCallback();
                }
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
            self.resetSelectedTask();
        });
    };
};

var model = new ViewModel();
model.taskThemeSelectOptions(taskThemeSelectOptions);
model.getAllTasks(function () {
    // Enlarge "New" button if the user doesn't have any tasks
    if (model.activeTasks().length === 0 && model.archivedTasks().length === 0) {
        window.setTimeout(function () {
            $('#new-task').velocity({
                scale: 1.5,
                translateY: 5
            }, { duration: 1000, easing: 'ease' }).velocity('reverse');
        }, 2000);
    }
});



ko.applyBindings(model);

// Sorting
var activeTasks = document.getElementById('active-tasks');
Sortable.create(activeTasks, {
    animation: 150,
    handle: '.sort-handle',
    onEnd: function (e) {
        model.reorderTasks(e.oldIndex + 1, e.newIndex + 1);
    },
});