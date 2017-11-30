'use strict';

Highcharts.theme = {
    colors: ['#444'],
    chart: {
        backgroundColor: null,
        style: {
            color: '#444',
            fontFamily: '"Lato", sans-serif'
        }
    },
    tooltip: {
        borderWidth: 0
    },
    legend: {
        enabled: (window.innerWidth > 599),
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },
    xAxis: {
        labels: {
            style: {
                color: '#6e6e70'
            }
        }
    },
    yAxis: {
        labels: {
            style: {
                color: '#6e6e70'
            }
        }
    },
    plotOptions: {
        series: {
            shadow: true
        },
        candlestick: {
            lineColor: '#404048'
        },
        map: {
            shadow: false
        }
    },

    // General
    background2: '#E0E0E8'
};

// Apply theme
Highcharts.setOptions(Highcharts.theme);



var TaskItemViewModel = function () {
    var self = this;

    self.id = ko.observable(0);
    self.taskId = ko.observable(0);
    self.taskTitle = ko.observable();
    self.taskShortTitle = ko.observable();
    self.taskDescription = ko.observable();
    self.taskTheme = ko.observable();
    self.taskThemeName = ko.observable();
    self.date = ko.observable();
    self.taskDurationMinutes = ko.observable();
    self.durationMinutes = ko.observable();
    self.taskRepetitions = ko.observable();
    self.repetitions = ko.observable();
    self.isCompleted = ko.observable(false);
    self.fieldsAreVisible = ko.observable(false);
    self.durationTooltip = ko.pureComputed(function () {
        if (self.durationMinutes() && self.isCompleted()) {
            if (self.durationMinutes() === 1) {
                return '1 minute';
            } else {
                return self.durationMinutes() + ' minutes';
            }
        }
        return '0 minutes';
    });
    self.repetitionsTooltip = ko.pureComputed(function () {
        if (self.repetitions() && self.isCompleted()) {
            if (self.repetitions() === 1) {
                return '1 repetition';
            } else {
                return self.repetitions() + ' repetitions';
            }
        }
        return '0 repetitions';
    });

    self.toggleIsCompleted = function (taskItem) {
        if (taskItem.isCompleted()) {
            taskItem.isCompleted(false);
            app.sound.blop.play();
        } else {
            taskItem.isCompleted(true);
            app.sound.bleep.play();
        }
        model.logChangedItem(taskItem);
    };
};

var TaskViewModel = function () {
    var self = this;

    self.id = ko.observable(0);
    self.title = ko.observable();
    self.shortTitle = ko.observable();
    self.description = ko.observable();
    self.durationMinutes = ko.observable();
    self.repetitions = ko.observable();
    self.theme = ko.observable();
    self.themeName = ko.observable();
    self.completedTaskItems = ko.observableArray();

    self.mapFromJs = function (task) {
        self.id(task.id);
        self.title(task.title);
        self.shortTitle(task.shortTitle);
        self.description(task.description);
        self.durationMinutes(task.durationMinutes);
        self.repetitions(task.repetitions);
        self.theme(task.theme);
        self.themeName(task.themeName);
        self.completedTaskItems(task.completedTaskItems);
    };
};

var ScheduleDayViewModel = function () {
    var self = this;

    self.date = ko.observable();
    self.dateFormatted = ko.pureComputed(function () {
        return self.date() ? moment(self.date(), 'YYYY-MM-DD').format('DD MMM') : undefined;
    });
    self.isStartOfMonth = ko.pureComputed(function () {
        return moment(self.date(), 'YYYY-MM-DD').date() === 1;
    });
    self.taskItems = ko.observableArray();
    self.allTaskItemsAreCompleted = ko.pureComputed(function () {
        var completedTaskItemsCount = 0;
        for (var i = 0; i < self.taskItems().length; i++) {
            if (self.taskItems()[i].isCompleted()) {
                completedTaskItemsCount++;
            }
        }
        if (completedTaskItemsCount === self.taskItems().length) {
            return true;
        }
        return false;
    });
    
    self.markAllTaskItemsAsCompleted = function (scheduleDay) {
        for (var i = 0; i < scheduleDay.taskItems().length; i++) {
            if (scheduleDay.taskItems()[i].isCompleted() === false) {
                scheduleDay.taskItems()[i].isCompleted(true);
                model.logChangedItem(scheduleDay.taskItems()[i]);
            }
        }
        app.sound.bleep.play();
    };
    
    self.markAllTaskItemsAsUncompleted = function (scheduleDay) {
        for (var i = 0; i < scheduleDay.taskItems().length; i++) {
            if (scheduleDay.taskItems()[i].isCompleted()) {
                scheduleDay.taskItems()[i].isCompleted(false);
                model.logChangedItem(scheduleDay.taskItems()[i]);
            }
        }
        app.sound.blop.play();
    };
};

var ScheduleFilterViewModel = function () {
    var self = this;

    self.fromDate = ko.observable();
    self.toDate = ko.observable();
};

var ViewModel = function (scheduleFilter) {
    var self = this;

    self.scheduleFilter = ko.observable(scheduleFilter);
    self.tasks = ko.observableArray();
    self.scheduleDays = ko.observableArray();
    self.changedTaskItems = ko.observableArray();
    self.scheduleIsCompact = ko.observable(false);
    self.scheduleIsCompact.subscribe(function (isCompact) {
        app.controller.overview.toggleScheduleIsCompact(isCompact);
    });
    self.scheduleLayoutToggleTitle = ko.pureComputed(function () {
        return self.scheduleIsCompact() ? 'Expand layout' : 'Compact layout';
    }, self);
    
    self.showPreviousButtonIsVisible = ko.observable(true);
    
    self.minutesChart = ko.observable();
    self.minutesChartToggleTitle = ko.pureComputed(function () {
        return self.minutesChartIsShown() ? 'Hide Minutes Chart' : 'Show Minutes Chart';
    }, self);
    self.minutesChartIsShown = ko.observable(false);
    self.minutesChartIsShown.subscribe(function (isShown) {
        if (isShown) {
            self.minutesPerTaskChartIsShown(false);
            self.repetitionsPerTaskChartIsShown(false);

            $('#minutes-chart').removeClass('hide');
            self.minutesChart().reflow();
            app.ui.slideUpAndFadeIn('#minutes-chart');
        } else {
            app.ui.slideDownAndFadeOut('#minutes-chart', function () {
                $('#minutes-chart').addClass('hide');
            });
        }
    });
    
    self.minutesPerTaskChart = ko.observable();
    self.minutesPerTaskChartToggleTitle = ko.pureComputed(function () {
        return self.minutesPerTaskChartIsShown() ? 'Hide Minutes Per Task Chart' : 'Show Minutes Per Task Chart';
    }, self);
    self.minutesPerTaskChartIsShown = ko.observable(false);
    self.minutesPerTaskChartIsShown.subscribe(function (isShown) {
        if (isShown) {
            self.minutesChartIsShown(false);
            self.repetitionsPerTaskChartIsShown(false);

            $('#minutes-per-task-chart').removeClass('hide');
            self.minutesPerTaskChart().reflow();
            app.ui.slideUpAndFadeIn('#minutes-per-task-chart');
        } else {
            app.ui.slideDownAndFadeOut('#minutes-per-task-chart', function () {
                $('#minutes-per-task-chart').addClass('hide');
            });
        }
    });
    
    self.repetitionsPerTaskChart = ko.observable();
    self.repetitionsPerTaskChartToggleTitle = ko.pureComputed(function () {
        return self.repetitionsPerTaskChartIsShown() ? 'Hide Repetitions Per Task Chart' : 'Show Repetitions Per Task Chart';
    }, self);
    self.repetitionsPerTaskChartIsShown = ko.observable(false);
    self.repetitionsPerTaskChartIsShown.subscribe(function (isShown) {
        if (isShown) {
            self.minutesChartIsShown(false);
            self.minutesPerTaskChartIsShown(false);

            $('#repetitions-per-task-chart').removeClass('hide');
            self.repetitionsPerTaskChart().reflow();
            app.ui.slideUpAndFadeIn('#repetitions-per-task-chart');
        } else {
            app.ui.slideDownAndFadeOut('#repetitions-per-task-chart', function () {
                $('#repetitions-per-task-chart').addClass('hide');
            });
        }
    });
    
    self.scheduleThemeColors = Object.freeze({
        blue: '#3598dc',
        green: '#55bf3b',
        red: '#d91e18',
        purple: '#8e44ad',
        turquoise: '#32c5d2',
        cyan: '#aaeeee',
        pink: '#ff0066',
        orange: '#f2784b',
        grey: '#bac3d0'
    });

    self.saveSchedule = function () {
        picky.loading();

        app.controller.overview.saveTaskItems(ko.toJSON(self.changedTaskItems()), function (response) {
            if (response.isSuccessful) {
                
                // Calculate minutes
                var minutes = 0;
                for (var l = 0; l < self.changedTaskItems().length; l++) {
                    self.changedTaskItems()[l].fieldsAreVisible(false);

                    if (self.changedTaskItems()[l].isCompleted()) {
                        minutes += self.changedTaskItems()[l].durationMinutes();
                    } else {
                        minutes -= self.changedTaskItems()[l].durationMinutes();
                    }
                }
                
                // Update the changed task items
                for (var i = 0; i < self.scheduleDays().length; i++) {
                    for (var j = 0; j < self.scheduleDays()[i].taskItems().length; j++) {
                        var taskItem = self.scheduleDays()[i].taskItems()[j];
                        for (var k = 0; k < response.result.length; k++) {
                            if (response.result[k].taskId === taskItem.taskId() && moment(response.result[k].date, 'YYYY-MM-DD').format('YYYY-MM-DD') === taskItem.date()) {
                                if (taskItem.isCompleted()) {
                                    taskItem.id(response.result[k].id);
                                } else {
                                    taskItem.id(0);
                                    taskItem.durationMinutes(taskItem.taskDurationMinutes());
                                    taskItem.repetitions(taskItem.taskRepetitions());
                                }
                            }
                        }
                    }
                }

                self.changedTaskItems([]);
                self.drawCharts();

                picky.showScore(minutes);
                picky.say(response.pickyMessage, picky.alertTypeEnum.success, true);
            } else {
                picky.showFormErrors(response);
            }
        });
    };

    self.cancelChangesToSchedule = function () {
        for (var i = 0; i < self.changedTaskItems().length; i++) {
            var changedTaskItem = self.changedTaskItems()[i];
            changedTaskItem.isCompleted(changedTaskItem.isCompleted() ? false : true);
            changedTaskItem.fieldsAreVisible(false);
        }
        self.changedTaskItems.splice(0, self.changedTaskItems().length);
    };
    
    self.logChangedItem = function (taskItem) {
        var task = ko.utils.arrayFirst(self.changedTaskItems(), function (item) {
            return item === taskItem;
        });

        if (task) {
            self.changedTaskItems.remove(task);
            taskItem.fieldsAreVisible(false);
        } else {
            self.changedTaskItems.push(taskItem);
            if (taskItem.isCompleted()) {
                taskItem.fieldsAreVisible(true);
            }
        }
    };

    self.getAllTasksAndDrawSchedule = function (completeCallback) {
        app.controller.overview.getTasksForSchedule(ko.toJS(self.scheduleFilter()), function (response) {
            if (response.isSuccessful) {
                var tasks = response.result.tasks.map(function (task) {
                    var taskViewModel = new TaskViewModel();
                    taskViewModel.mapFromJs(task);
                    return taskViewModel;
                });
                
                self.scheduleIsCompact(response.result.scheduleIsCompact);
                self.tasks(tasks);
                
                var scheduleStart = moment().diff(moment(self.scheduleFilter().toDate(), 'YYYY-MM-DD'), 'days');
                var scheduleEnd = moment(self.scheduleFilter().toDate(), 'YYYY-MM-DD').diff(moment(self.scheduleFilter().fromDate(), 'YYYY-MM-DD'), 'days') + scheduleStart;
                
                // Create schedule days
                for (var i = scheduleStart; i <= scheduleEnd; i++) {
                    var scheduleDayViewModel = new ScheduleDayViewModel();
                    scheduleDayViewModel.date(moment().subtract(i, 'days').format('YYYY-MM-DD'));
                    
                    // Loop through tasks creating items
                    for (var j = 0; j < self.tasks().length; j++) {
                        var taskItemViewModel = new TaskItemViewModel();
                        taskItemViewModel.taskId(self.tasks()[j].id());
                        taskItemViewModel.taskTitle(self.tasks()[j].title());
                        taskItemViewModel.taskShortTitle(self.tasks()[j].shortTitle());
                        taskItemViewModel.taskDescription(self.tasks()[j].description());
                        taskItemViewModel.taskTheme(self.tasks()[j].theme());
                        taskItemViewModel.taskThemeName(self.tasks()[j].themeName());
                        taskItemViewModel.date(scheduleDayViewModel.date());
                        taskItemViewModel.taskDurationMinutes(self.tasks()[j].durationMinutes());
                        taskItemViewModel.durationMinutes(self.tasks()[j].durationMinutes());
                        taskItemViewModel.taskRepetitions(self.tasks()[j].repetitions());
                        taskItemViewModel.repetitions(self.tasks()[j].repetitions());

                        // Loop through each task's completed task items marking the item with the isCompleted flag
                        var completedTaskItems = self.tasks()[j].completedTaskItems();
                        for (var k = 0; k < completedTaskItems.length; k++) {
                            if (moment(completedTaskItems[k].date, 'YYYY-MM-DD').format('YYYY-MM-DD') === scheduleDayViewModel.date()) {
                                taskItemViewModel.id(completedTaskItems[k].id);
                                taskItemViewModel.isCompleted(true);
                                taskItemViewModel.durationMinutes(completedTaskItems[k].durationMinutes);
                                taskItemViewModel.repetitions(completedTaskItems[k].repetitions);
                                break;
                            }
                        }
                        scheduleDayViewModel.taskItems.push(taskItemViewModel);
                    }
                    self.scheduleDays.push(scheduleDayViewModel);
                }
                
                self.drawCharts();

                // Disable user from loading more items
                if (response.result.isLastLoad) {
                    self.showPreviousButtonIsVisible(false);
                }

                self.showScheduleOrMessage();
                
                if (completeCallback) {
                    completeCallback();
                }
            } else {
                picky.showFormErrors(response);
            }
        });
    };

    self.showPreviousMonth = function () {
        picky.loading();

        self.scheduleFilter().toDate(moment(self.scheduleFilter().fromDate(), 'YYYY-MM-DD').subtract(1, 'day').format('YYYY-MM-DD'));
        self.scheduleFilter().fromDate(moment(self.scheduleFilter().fromDate(), 'YYYY-MM-DD').subtract(1, 'day').set('date', 1).format('YYYY-MM-DD'));
        
        self.getAllTasksAndDrawSchedule(function () {
            picky.endLoading();

            // Scroll to end of newly loaded month if no charts are open
            if (!self.minutesChartIsShown() && !self.minutesPerTaskChartIsShown() && !self.repetitionsPerTaskChartIsShown()) {
                $($('.start-of-month')[$('.start-of-month').length - 2]).velocity('scroll', { duration: 1500 });
            }
        });
    };
  
    self.drawMinutesChart = function () {
        var momentMonths = [];
        var shownMonths = [];
        var minutesPerMonth = [];

        for (var i = self.scheduleDays().length - 1; i >= 0; i--) {
            var startOfMonth = moment(self.scheduleDays()[i].date(), 'YYYY-MM-DD').format('YYYY-MM');
            if (momentMonths.indexOf(startOfMonth) === -1) {
                momentMonths.push(startOfMonth);
                shownMonths.push(moment(startOfMonth, 'YYYY-MM').format('MMMM YYYY'));
            }
        }

        for (var j = 0; j < momentMonths.length; j++) {
            var completedMinutes = 0;

            for (var k = self.scheduleDays().length - 1; k >= 0; k--) {
                var date = moment(self.scheduleDays()[k].date(), 'YYYY-MM-DD').format('YYYY-MM');
                if (date === momentMonths[j]) {
                    for (var l = 0; l < self.scheduleDays()[k].taskItems().length; l++) {
                        if (self.scheduleDays()[k].taskItems()[l].isCompleted() && self.scheduleDays()[k].taskItems()[l].durationMinutes()) {
                            completedMinutes += parseInt(self.scheduleDays()[k].taskItems()[l].durationMinutes());
                        }
                    }
                }
            }
            minutesPerMonth.push(completedMinutes);
        }

        if (self.minutesChart()) {
            self.minutesChart().xAxis[0].setCategories(shownMonths, false);
            self.minutesChart().series[0].setData(minutesPerMonth, false);
            self.minutesChart().redraw();
        } else {
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'minutes-chart',
                    spacing: [25, 15, 25, 15]
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: 'Completed Minutes'
                },
                xAxis: {
                    categories: shownMonths
                },
                yAxis: {
                    title: {
                        text: 'Minutes'
                    }
                },
                series: [{
                    name: 'Total minutes',
                    data: minutesPerMonth
                }]
            });

            self.minutesChart(chart);
        }
    };
    
    self.drawMinutesPerTaskChart = function () {
        var momentMonths = [];
        var shownMonths = [];
        var minutesPerTaskPerMonth = [];

        for (var i = self.scheduleDays().length - 1; i >= 0; i--) {
            var startOfMonth = moment(self.scheduleDays()[i].date(), 'YYYY-MM-DD').format('YYYY-MM');
            if (momentMonths.indexOf(startOfMonth) === -1) {
                momentMonths.push(startOfMonth);
                shownMonths.push(moment(startOfMonth, 'YYYY-MM').format('MMMM YYYY'));
            }
        }

        for (var j = 0; j < self.tasks().length; j++) {
            var taskId = self.tasks()[j].id();
            var taskName = self.tasks()[j].title();
            var taskTheme = self.tasks()[j].themeName();
            
            var completedMinutesPerMonth = [];

            for (var k = 0; k < momentMonths.length; k++) {
                var completedMinutes = 0;

                for (var l = self.scheduleDays().length - 1; l >= 0; l--) {
                    var date = moment(self.scheduleDays()[l].date(), 'YYYY-MM-DD').format('YYYY-MM');
                    if (date === momentMonths[k]) {
                        for (var m = 0; m < self.scheduleDays()[l].taskItems().length; m++) {
                            if (self.scheduleDays()[l].taskItems()[m].taskId() === taskId
                                && self.scheduleDays()[l].taskItems()[m].isCompleted()
                                && self.scheduleDays()[l].taskItems()[m].durationMinutes()) {
                                completedMinutes += parseInt(self.scheduleDays()[l].taskItems()[m].durationMinutes());
                            }
                        }
                    }
                }
                completedMinutesPerMonth.push(completedMinutes);
            }
            minutesPerTaskPerMonth.push({ name: taskName, color: self.scheduleThemeColors[taskTheme], data: completedMinutesPerMonth });
        }
        
        if (self.minutesPerTaskChart()) {
            self.minutesPerTaskChart().xAxis[0].setCategories(shownMonths, false);
            for (var n = 0; n < minutesPerTaskPerMonth.length; n++) {
                self.minutesPerTaskChart().series[n].setData(minutesPerTaskPerMonth[n].data, false);
            }
            self.minutesPerTaskChart().redraw();
        } else {
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'minutes-per-task-chart',
                    spacing: [25, 15, 25, 15]
                },
                title: {
                    text: 'Completed Minutes Per Task'
                },
                xAxis: {
                    categories: shownMonths
                },
                yAxis: {
                    title: {
                        text: 'Minutes'
                    }
                },
                tooltip: {
                    valueSuffix: ' minutes'
                },
                series: minutesPerTaskPerMonth
            });

            self.minutesPerTaskChart(chart);
        }
    };
    
    self.drawRepetitionsPerTaskChart = function () {
        var momentMonths = [];
        var shownMonths = [];
        var repetitionsPerTaskPerMonth = [];

        for (var i = self.scheduleDays().length - 1; i >= 0; i--) {
            var startOfMonth = moment(self.scheduleDays()[i].date(), 'YYYY-MM-DD').format('YYYY-MM');
            if (momentMonths.indexOf(startOfMonth) === -1) {
                momentMonths.push(startOfMonth);
                shownMonths.push(moment(startOfMonth, 'YYYY-MM').format('MMMM YYYY'));
            }
        }

        for (var j = 0; j < self.tasks().length; j++) {
            var taskId = self.tasks()[j].id();
            var taskName = self.tasks()[j].title();
            var taskTheme = self.tasks()[j].themeName();

            var repetitionsPerMonth = [];

            for (var k = 0; k < momentMonths.length; k++) {
                var completedRepetitions = 0;

                for (var l = self.scheduleDays().length - 1; l >= 0; l--) {
                    var date = moment(self.scheduleDays()[l].date(), 'YYYY-MM-DD').format('YYYY-MM');
                    if (date === momentMonths[k]) {
                        for (var m = 0; m < self.scheduleDays()[l].taskItems().length; m++) {
                            if (self.scheduleDays()[l].taskItems()[m].taskId() === taskId
                                && self.scheduleDays()[l].taskItems()[m].isCompleted()
                                && self.scheduleDays()[l].taskItems()[m].repetitions()) {
                                completedRepetitions += parseInt(self.scheduleDays()[l].taskItems()[m].repetitions());
                            }
                        }
                    }
                }
                repetitionsPerMonth.push(completedRepetitions);
            }
            repetitionsPerTaskPerMonth.push({ name: taskName, color: self.scheduleThemeColors[taskTheme], data: repetitionsPerMonth });
        }

        if (self.repetitionsPerTaskChart()) {
            self.repetitionsPerTaskChart().xAxis[0].setCategories(shownMonths, false);
            for (var n = 0; n < repetitionsPerTaskPerMonth.length; n++) {
                self.repetitionsPerTaskChart().series[n].setData(repetitionsPerTaskPerMonth[n].data, false);
            }
            self.repetitionsPerTaskChart().redraw();
        } else {
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'repetitions-per-task-chart',
                    spacing: [25, 15, 25, 15]
                },
                title: {
                    text: 'Completed Repetitions Per Task'
                },
                xAxis: {
                    categories: shownMonths
                },
                yAxis: {
                    title: {
                        text: 'Repetitions'
                    }
                },
                tooltip: {
                    valueSuffix: ' repetitions'
                },
                series: repetitionsPerTaskPerMonth
            });

            self.repetitionsPerTaskChart(chart);
        }
    };

    self.drawCharts = function () {
        if (self.tasks().length > 0) {
            self.drawMinutesChart();
            self.drawMinutesPerTaskChart();
            self.drawRepetitionsPerTaskChart();
        }
    };

    self.showScheduleOrMessage = function () {
        if (self.tasks().length > 0) {
            app.ui.fadeIn('.schedule-wrap');
        } else {
            app.ui.fadeIn('.no-tasks-message');
        }
    };
};

var scheduleFilter = new ScheduleFilterViewModel();
scheduleFilter.fromDate(moment().set('date', 1).format('YYYY-MM-DD'));
scheduleFilter.toDate(moment().format('YYYY-MM-DD'));

var model = new ViewModel(scheduleFilter);
model.getAllTasksAndDrawSchedule();

// Enter and escape keys save and cancel changes respectively
$(document).keyup(function (e) {
    if (e.keyCode === 13 && model.changedTaskItems().length > 0) {
        model.saveSchedule();
    }
    if (e.keyCode === 27 && model.changedTaskItems().length > 0) {
        model.cancelChangesToSchedule();
    }
});

ko.bindingHandlers['css2'] = ko.bindingHandlers.css;
ko.applyBindings(model);