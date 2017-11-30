'use strict';

var PageViewModel = function (number, isCurrent) {
    var self = this;

    self.number = ko.observable(number);
    self.isCurrent = ko.observable(isCurrent);
};

var GridFiltersViewModel = function () {
    var self = this;

    self.search = ko.observable();
    self.searchAdditional = ko.observable();
    self.searchEnum = ko.observable();
    self.sortColumn = ko.observable();
    self.sortDirectionIsAscending = ko.observable();
    self.page = ko.observable(1);
    self.pageSize = ko.observable(10);
    self.itemCount = ko.observable(0);
    
    self.pageCount = ko.pureComputed(function () {
        return Math.ceil(self.itemCount() / self.pageSize());
    });
    self.pageItemsFrom = ko.pureComputed(function () {
        return self.pageSize() * (self.page() - 1);
    });
    self.pageItemsTo = ko.pureComputed(function () {
        if (self.page() === self.pageCount()) {
            return self.itemCount();
        } else {
            return self.pageSize() * self.page();
        }
    });
    
    self.visiblePageNumbers = ko.pureComputed(function () {
        var visiblePageNumbers = ko.observableArray();
        var start = self.page() - 2;
        if (start < 1) {
            start = 1;
        }
        var end = self.pageCount();

        for (var i = start, j = 0; i <= end; i++, j++) {
            if (j > 4)
                break;

            var page = new PageViewModel(i, i === self.page());
            visiblePageNumbers.push(page);
        }
        
        return visiblePageNumbers;
    });
    
    self.hasPreviousAndFirst = ko.pureComputed(function () {
        return self.page() !== 1;
    });
    self.hasNextAndLast = ko.pureComputed(function () {
        return self.page() !== self.pageCount();
    });
    self.setPage = function (number) {
        self.page(number);
    };
    self.previous = function () {
        self.page(self.page() - 1);
    };
    self.next = function () {
        self.page(self.page() + 1);
    };
    self.first = function () {
        self.page(1);
    };
    self.last = function () {
        self.page(self.pageCount());
    };
    
    self.setSorting = function (sortColumn) {
        if (sortColumn === self.sortColumn()) {
            if (self.sortDirectionIsAscending()) {
                self.sortDirectionIsAscending(false);
            } else {
                self.sortDirectionIsAscending(true);
            }                                   
        } else {
            self.sortDirectionIsAscending(true);
        }
        self.sortColumn(sortColumn);
    };
    
    self.reset = function () {
        self.search(undefined);
        self.searchAdditional(undefined);
        self.searchEnum(undefined);
        self.sortColumn(undefined);
        self.sortDirectionIsAscending(true);
        self.page(1);
    };
    
    self.onlyAssignedFiltersToJS = function () {
        var propertiesToCheck = ['search', 'searchAdditional', 'searchEnum', 'sortColumn', 'sortDirectionIsAscending', 'page', 'pageSize', 'itemCount'];
        var json = {};

        for (var i = 0; i < propertiesToCheck.length; i++) {
            if (self[propertiesToCheck[i]]() !== null && typeof self[propertiesToCheck[i]]() !== 'undefined') {
                json[propertiesToCheck[i]] = self[propertiesToCheck[i]]();
            }
        }
        return json;
    };
    
    self.mapFromJs = function (gridFilters) {
        self.search(gridFilters.search);
        self.searchAdditional(gridFilters.searchAdditional);
        self.searchEnum(gridFilters.searchEnum);
        self.sortColumn(gridFilters.sortColumn);
        self.sortDirectionIsAscending(gridFilters.sortDirectionIsAscending);
        self.page(gridFilters.page);
        self.pageSize(gridFilters.pageSize);
        self.itemCount(gridFilters.itemCount);
    };
};