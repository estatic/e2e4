﻿define(['ko', 'jquery', 'moment', '$datepickerLocal'], function (ko, jquery, moment)
{
    'use strict';
    ko.bindingHandlers.datepicker = {
        after: ['value', 'dateFormat', 'attr'],
        init: function (element, valueAccessor, allBindingsAccessor)
        {
            var $el = jquery(element);

            ko.utils.registerEventHandler(element, "change", function() {
                var target = valueAccessor();
                if (ko.isObservable(target)) {
                    target($el.datepicker("getDate"));
                }
                $el.blur();
            });

            var date = moment(ko.unwrap(valueAccessor()));
            var customSettings = allBindingsAccessor.get('datepickerOptions') || {};
            var initDateFormat = customSettings.dateFormat || jquery.datepicker._defaults.dateFormat;

            if (date.isValid()){
                $el.val(jquery.datepicker.formatDate(initDateFormat, date.toDate()));
            }
            $el.datepicker(customSettings);

            var validationSubscription = null;

            var valBind = valueAccessor();
            if (ko.validation && ko.validation.utils && ko.validation.utils.isValidatable && ko.validation.utils.isValidatable(valBind))
            {
                validationSubscription = ko.computed(function ()
                {
                    valBind();
                    if (ko.unwrap(valBind.isValid))
                    {
                        setTimeout(function ()
                        {
                            if ($el !== null)
                            {
                                $el.removeClass(ko.validation.configuration.errorElementClass).attr('title', '').parent().removeClass(ko.validation.configuration.errorElementClass);
                            }
                        }, 0);

                    } else
                    {
                        setTimeout(function ()
                        {
                            if ($el !== null)
                            {
                                $el.addClass(ko.validation.configuration.errorElementClass).attr('title', $el.attr('title')).parent().addClass(ko.validation.configuration.errorElementClass);
                            }
                        }, 0);
                    }
                });
            }

            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                if (validationSubscription !== null)
                {
                    validationSubscription.dispose();
                }
                $el.datepicker('option', 'disabled', false);
                $el.datepicker('destroy');
                $el.off('change', changeHandler);
                $el = null;
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor)
        {
            var $el = jquery(element);
            var valM = moment(ko.unwrap(valueAccessor()));
            if (valM.isValid())
            {
                if (false === valM.isSame($el.datepicker('getDate')))
                {
                    setTimeout(function ()
                    {
                        $el.datepicker('setDate', valM.toDate());
                    });
                }
            } else
            {
            	jquery.datepicker._clearDate(element);
            }
            var enable = allBindingsAccessor.get('enable');
            if (enable !== undefined)
            {
                jquery(element).datepicker('option', 'disabled', !ko.unwrap(enable));
            }

            var disable = allBindingsAccessor.get('disable');
            if (disable !== undefined)
            {
                jquery(element).datepicker('option', 'disabled', !!ko.unwrap(disable));
            }
        }
    };
    ko.bindingHandlers.minDate = {
        update: function (element, valueAccessor)
        {
            var $el = jquery(element);
            var oldDate = $el.datepicker('getDate');
            $el.datepicker('option', 'minDate', moment(ko.unwrap(valueAccessor())).toDate());
            var newDate = $el.datepicker('getDate');
            if (jquery.type(oldDate) !== 'date' || jquery.type(newDate) !== 'date' || newDate.getTime() !== oldDate.getTime())
            {
                $el.trigger('change');
            }
        }
    };
    ko.bindingHandlers.maxDate = {
        update: function (element, valueAccessor)
        {
            var $el = jquery(element);
            var oldDate = $el.datepicker('getDate');
            $el.datepicker('option', 'maxDate', moment(ko.unwrap(valueAccessor())).toDate());
            var newDate = $el.datepicker('getDate');
            if (jquery.type(oldDate) !== 'date' || jquery.type(newDate) !== 'date' || newDate.getTime() !== oldDate.getTime())
            {
                $el.trigger('change');
            }
        }
    };
});