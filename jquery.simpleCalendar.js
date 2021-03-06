/**
 * @author Kako Akihito <akakopublic@gmail.com>
 * @license New BSD License
 * @version 1.0.0
 */
(function($) {
    var getItems = function(year, month) {
        var dates = [];
        var currentMonthStart = new Date(year, month - 1, 1);
        var currentMonthEnd = new Date(year, month, 0);
        var start = 1 - currentMonthStart.getDay();
        var date = new Date(year, month - 1, start);
        var end = new Date(year, month - 1, currentMonthEnd.getDate() + (6 - currentMonthEnd.getDay()));
        for (var i = start + 1; date <= end; i++) {
            dates.push({
                date: date,
                active: currentMonthStart <= date && date <= currentMonthEnd ? true : false
            });
            date = new Date(year, month - 1, i);
        }
        return dates;
    };
    $.fn.simpleCalendar = function(options) {
        var parent = $(this);
        var today = new Date();
        var defaultOptions = {
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            headers: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
            tableClass: 'simpleCalendar',
            cellClass: {},
            previousClick: undefined,
            nextClick: undefined,
            cellClick: undefined,
            previousMonthLimit: undefined,
            nextMonthLimit: undefined,
            currentMonthFormatter: function(date) {return date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2);},
            previousMonthFormatter: function(date) {return '< ' + ('0' + (date.getMonth() + 1)).slice(-2);},
            nextMonthFormatter: function(date) {return ('0' + (date.getMonth() + 1)).slice(-2) + ' >';}
        };
        if (typeof(options) != 'object') {
            options = defaultOptions;
        } else {
            for (var key in defaultOptions) {
                if (typeof(options[key]) == 'undefined') {
                    options[key] = defaultOptions[key];
                }
            }
        }
        var formatterDate = new Date(options.year, options.month - 1, 1);
        options.year = formatterDate.getFullYear();
        options.month = formatterDate.getMonth() + 1;

        parent.html('');
        var table = $('<table />').addClass(options.tableClass).appendTo($(this));
        var controllerRow = $('<tr />').appendTo(table);
        var controllerTd = $('<td />').attr('colspan', 7).appendTo(controllerRow);
        var controllerCell = $('<div />').addClass('controller').appendTo(controllerTd);
        if (typeof(options.previousMonthLimit) == 'undefined' || options.previousMonthLimit > 0) {
            var prevMonth = (options.month - 1) % 12 == 0 ? 12 : (options.month - 1) % 12;
            $('<div />').addClass('prev').append(options.previousMonthFormatter(new Date(options.year, options.month - 2, 1))).bind('click', function(){
                options.month--;
                if (typeof(options.previousMonthLimit) != 'undefined') options.previousMonthLimit--;
                if (typeof(options.nextMonthLimit) != 'undefined') options.nextMonthLimit++;
                if (typeof(options.previousClick) == 'function') 
                    options.previousClick(options);
                parent.simpleCalendar(options);
            }).appendTo(controllerCell);
        }
        if (typeof(options.nextMonthLimit) == 'undefined' || options.nextMonthLimit > 0) {
            var nextMonth = (options.month + 1) % 12 == 0 ? 12 : (options.month + 1) % 12;
            $('<div />').addClass('next').append(options.nextMonthFormatter(new Date(options.year, options.month, 1))).bind('click', function() {
                options.month++;
                if (typeof(options.previousMonthLimit) != 'undefined') options.previousMonthLimit++;
                if (typeof(options.nextMonthLimit) != 'undefined') options.nextMonthLimit--;
                if (typeof(options.nextClick) == 'function') 
                    options.nextClick(options);
                parent.simpleCalendar(options);
            }).appendTo(controllerCell);
        }
        $('<div />').addClass('current').append(options.currentMonthFormatter(new Date(options.year, options.month - 1, 1))).appendTo(controllerCell);
        var headerRow = $('<tr />').appendTo(table);
        for (var i = 0; i < options.headers.length; i++) {
            $('<th />').append(options.headers[i]).appendTo(headerRow);
        }

        var items = getItems(options.year, options.month);
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.date.getDay() == 0) {
                var row = $('<tr />').appendTo(table);
            }
            var cell = $('<td />').append(item.date.getDate()).addClass(item.active ? 'active' : 'inactive').appendTo(row);
            if (item.active) {
                if (item.date.getDay() == 0) {
                    cell.addClass('sunday');
                } else if (item.date.getDay() == 6) {
                    cell.addClass('saturday');
                }
                if (item.date.getFullYear() == today.getFullYear() && item.date.getMonth() == today.getMonth() && item.date.getDate() == today.getDate()) {
                    cell.addClass('today');
                }
                if (typeof(options.cellClick) == 'function') {
                    cell.bind('click', {
                        date: item.date
                    }, options.cellClick);
                }
                for (var className in options.cellClass) {
                    var classTargetDates = options.cellClass[className];
                    for (var j = 0; j < classTargetDates.length; j++) {
                        if (classTargetDates[j].toString() == item.date.toString()) {
                            cell.addClass(className);
                        }
                    }
                }
            }
        }
    };
})(jQuery);