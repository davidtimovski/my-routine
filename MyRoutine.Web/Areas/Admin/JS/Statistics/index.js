'use strict';

Highcharts.setOptions({
    colors: ['#3598dc'],
    chart: {
        backgroundColor: '#fafafa',
        style: {
            color: '#444',
            fontFamily: '"Lato", sans-serif'
        }
    },
    legend: {
        enabled: false
    }
});

var ViewModel = function () {
    var self = this;

    self.userRegistrationsToday = ko.observable();
    self.tasksCreatedToday = ko.observable();
    self.tasksCompletedToday = ko.observable();
    self.userRegistrationsPerMonth = ko.observableArray();
    self.userRegistrationsMonthlyChart = ko.observable();
    self.tasksCreatedPerMonth = ko.observableArray();
    self.tasksCreatedMonthlyChart = ko.observable();
    self.tasksCompletedPerMonth = ko.observableArray();
    self.tasksCompletedMonthlyChart = ko.observable();
    
    self.getStatisticsAndDrawCharts = function () {
        app.controller.admin.statistics.getStatistics(function (response) {
            if (response.isSuccessful) {
                self.userRegistrationsToday(response.result.userRegistrationsToday);
                self.tasksCreatedToday(response.result.tasksCreatedToday);
                self.tasksCompletedToday(response.result.tasksCompletedToday);
                self.userRegistrationsPerMonth(response.result.userRegistrationsPerMonth);
                self.tasksCreatedPerMonth(response.result.tasksCreatedPerMonth);
                self.tasksCompletedPerMonth(response.result.tasksCompletedPerMonth);

                self.drawCharts();
            } else {
                picky.showFormErrors(response);
            }
        });
    };

    self.drawUserRegistrationsMonthlyChart = function () {
        if (self.userRegistrationsPerMonth().length > 0) {
            var shownMonths = [];
            var userRegistrationsPerMonth = [];
            var currentMomentMonth = moment(self.userRegistrationsPerMonth()[0].month, 'YYYY-MM');
            var monthsCount = moment(self.userRegistrationsPerMonth()[self.userRegistrationsPerMonth().length - 1].month, 'YYYY-MM').diff(moment(self.userRegistrationsPerMonth()[0].month, 'YYYY-MM'), 'months') + 1;

            for (var i = 0, j = 0; i < monthsCount; i++) {
                if (currentMomentMonth.isSame(moment(self.userRegistrationsPerMonth()[j].month, 'YYYY-MM'))) {
                    userRegistrationsPerMonth.push(self.userRegistrationsPerMonth()[j].count);
                    j++;
                } else {
                    userRegistrationsPerMonth.push(0);
                }
                shownMonths.push(currentMomentMonth.format('MMMM YYYY'));
                currentMomentMonth.add(1, 'months');
            }

            if (self.userRegistrationsMonthlyChart()) {
                self.userRegistrationsMonthlyChart().xAxis[0].setCategories(shownMonths, false);
                self.userRegistrationsMonthlyChart().series[0].setData(userRegistrationsPerMonth, false);
                self.userRegistrationsMonthlyChart().redraw();
            } else {
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'user-registrations-monthly-chart'
                    },
                    title: {
                        text: 'User Registrations Monthly'
                    },
                    xAxis: {
                        categories: shownMonths
                    },
                    yAxis: {
                        title: {
                            text: 'User registrations'
                        }
                    },
                    series: [{
                        name: 'User registrations',
                        data: userRegistrationsPerMonth
                    }]
                });

                self.userRegistrationsMonthlyChart(chart);
            }
        }
    };
    
    self.drawTasksCreatedMonthlyChart = function () {
        if (self.tasksCreatedPerMonth().length > 0) {
            var shownMonths = [];
            var tasksCreatedPerMonth = [];
            var currentMomentMonth = moment(self.tasksCreatedPerMonth()[0].month, 'YYYY-MM');
            var monthsCount = moment(self.tasksCreatedPerMonth()[self.tasksCreatedPerMonth().length - 1].month, 'YYYY-MM').diff(moment(self.tasksCreatedPerMonth()[0].month, 'YYYY-MM'), 'months') + 1;

            for (var i = 0, j = 0; i < monthsCount; i++) {
                if (currentMomentMonth.isSame(moment(self.tasksCreatedPerMonth()[j].month, 'YYYY-MM'))) {
                    tasksCreatedPerMonth.push(self.tasksCreatedPerMonth()[j].count);
                    j++;
                } else {
                    tasksCreatedPerMonth.push(0);
                }
                shownMonths.push(currentMomentMonth.format('MMMM YYYY'));
                currentMomentMonth.add(1, 'months');
            }

            if (self.tasksCreatedMonthlyChart()) {
                self.tasksCreatedMonthlyChart().xAxis[0].setCategories(shownMonths, false);
                self.tasksCreatedMonthlyChart().series[0].setData(tasksCreatedPerMonth, false);
                self.tasksCreatedMonthlyChart().redraw();
            } else {
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'tasks-created-monthly-chart'
                    },
                    title: {
                        text: 'Tasks Created Monthly'
                    },
                    xAxis: {
                        categories: shownMonths
                    },
                    yAxis: {
                        title: {
                            text: 'Tasks created'
                        }
                    },
                    series: [{
                        name: 'Tasks created',
                        data: tasksCreatedPerMonth
                    }]
                });

                self.tasksCreatedMonthlyChart(chart);
            }
        }
    };

    self.drawTasksCompletedMonthlyChart = function () {
        if (self.tasksCompletedPerMonth().length > 0) {
            var shownMonths = [];
            var tasksCompletedPerMonth = [];
            var currentMomentMonth = moment(self.tasksCompletedPerMonth()[0].month, 'YYYY-MM');
            var monthsCount = moment(self.tasksCompletedPerMonth()[self.tasksCompletedPerMonth().length - 1].month, 'YYYY-MM').diff(moment(self.tasksCompletedPerMonth()[0].month, 'YYYY-MM'), 'months') + 1;

            for (var i = 0, j = 0; i < monthsCount; i++) {
                if (currentMomentMonth.isSame(moment(self.tasksCompletedPerMonth()[j].month, 'YYYY-MM'))) {
                    tasksCompletedPerMonth.push(self.tasksCompletedPerMonth()[j].count);
                    j++;
                } else {
                    tasksCompletedPerMonth.push(0);
                }
                shownMonths.push(currentMomentMonth.format('MMMM YYYY'));
                currentMomentMonth.add(1, 'months');
            }

            if (self.tasksCompletedMonthlyChart()) {
                self.tasksCompletedMonthlyChart().xAxis[0].setCategories(shownMonths, false);
                self.tasksCompletedMonthlyChart().series[0].setData(tasksCompletedPerMonth, false);
                self.tasksCompletedMonthlyChart().redraw();
            } else {
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'tasks-completed-monthly-chart'
                    },
                    title: {
                        text: 'Tasks Completed Monthly'
                    },
                    xAxis: {
                        categories: shownMonths
                    },
                    yAxis: {
                        title: {
                            text: 'Tasks completed'
                        }
                    },
                    series: [{
                        name: 'Tasks completed',
                        data: tasksCompletedPerMonth
                    }]
                });

                self.tasksCompletedMonthlyChart(chart);
            }
        }
    };

    self.drawCharts = function () {
        self.drawUserRegistrationsMonthlyChart();
        self.drawTasksCreatedMonthlyChart();
        self.drawTasksCompletedMonthlyChart();
    };
};

var model = new ViewModel();
model.getStatisticsAndDrawCharts();

ko.applyBindings(model);