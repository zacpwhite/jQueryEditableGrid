/*
*jQuery Editable Grid
*Copyright 2015 Zac White
*
*DEPEDENCIES:
*jQuery >= 1.6
*/

'use strict';
(function ($) {
    $.fn.editableGrid = function (options) {
        var _self = this;
        var $self = $(this);
        var _data = [];
        var _options = options;

        function init() {
            $self.find('tr > td[data-editable="true"]').parent().each(function (rowIdx, row) {
                var _row = $(row);
                var rowData = {
                    'id': rowIdx
                };
                _row.data('id', rowIdx);
                var pkey = _row.data('key');
                var pval = _row.data('value');
                var ptype = _row.data('type');

                if ((typeof pkey !== 'undefined' && typeof pval !== 'undefined') &&
                    (pkey.toString().trim() !== '' && pval.toString().trim() !== '')) {
                    rowData["keyName"] = pkey;
                    rowData[pkey] = (ptype === 'number' ? Number(pval) : pval);
                }

                _row.find('td').each(function (colIdx, col) {
                    var _col = $(col);
                    var editable = _col.data('editable');
                    var prop = _col.data('property');
                    var value = _col.text();
                    var colHead = $self.find('th:eq(' + colIdx + ')').text();
                    var dataType = _col.data('type');
                    var objType = _col.data('object-type');

                    switch (dataType) {
                        case 'number':
                            value = Number(value);
                            break;
                        case 'boolean':
                            value = (value.toString().toUpperCase().trim() === 'TRUE' || value.toString().trim() === '1' ? true : false);
                            break;
                        default:
                            value = value.trim();
                            break;
                    }
                    if (typeof prop !== 'undefined' && prop.toString().trim() !== '') {
                        prop = prop.toString().trim();
                        rowData[prop] = value;
                        _col.data('col', prop);
                    } else if (typeof colHead !== 'undefined' && colHead.toString().trim() !== '') {
                        colHead = colHead.toString().trim();
                        rowData[colHead] = value;
                        _col.data('col', colHead.toString().trim());
                    } else {
                        rowData[colIdx] = value;
                        _col.data('col', colIdx);
                    }
                    var colName = _col.data('col');
                    if (typeof editable !== 'undefined' && editable === true) {
                        _col.html('');
                        switch (objType) {
                            case 'checkbox':
                                _col.append("<input type='checkbox' class='check-box' disabled='disabled'" + (value === true ? "checked='checked'" : "") + " />");
                                _col.css('text-align', 'center');
                                break;
                            case 'select':
                                var opts = getSelectColumnValues(colName);
                                if (opts) {
                                    _col.append("<select class='edit-mode' disabled='disabled'></select>");
                                    var s = _col.find('select');
                                    for (var i = 0, j = opts.length; i < j; i++) {
                                        $(s).append("<option value='" + opts[i].value + "'>" + opts[i].text + "</option>");
                                    }
                                    $(s).val(value);
                                    _col.append("<span class='view-mode'>" + $(s).find('option:selected').text() + "</span>");
                                } else {
                                    _col.append("<span class='view-mode'>" + value + "</span>");
                                    _col.append("<input type='text' class='edit-mode' value='" + value + "' />");
                                }
                                break;
                            default:
                                _col.append("<span class='view-mode'>" + value + "</span>");
                                _col.append("<input type='text' class='edit-mode' value='" + value + "' />");
                                break;
                        }
                    }
                });
                _data.push(rowData);
            });

            if (!_options.hasOwnProperty('disableControls') || (typeof _options.disableControls !== 'undefined' && _options.disableControls === false)) {
                $self.after("<div id='divEditGridControls'></div>");
                $('#divEditGridControls').append("<button type='button' id='btnEditGrid' class='view-mode'>Edit</button>");
                $('#divEditGridControls').append("<button type='button' id='btnCancelGrid' class='edit-mode'>Cancel</button>");
                $('#divEditGridControls').append("<button type='button' id='btnSaveGrid' class='edit-mode'>Save</button>");

                $('#btnEditGrid').click(function () {
                    _self.edit();
                    if (_options.hasOwnProperty("edit") && typeof _options.edit !== 'undefined') {
                        _options.edit();
                    }
                });

                $('#btnCancelGrid').click(function () {
                    _self.cancel();
                    if (_options.hasOwnProperty("cancel") && typeof _options.cancel !== 'undefined') {
                        _options.cancel();
                    }
                });

                $('#btnSaveGrid').click(function () {
                    var data = _self.save();
                    if (_options.hasOwnProperty("save") && typeof _options.save !== 'undefined') {
                        _options.save(data);
                    }
                });

                $('#divEditGridControls > button').css('margin', '2px');
            }
            if (!_options.hasOwnProperty('disableBootstrapClasses') || (typeof _options.disableBootstrapClasses !== 'undefined' && _options.disableBootstrapClasses === false)) {
                $self.find('td').css('padding', '2px');
                $self.find('td[data-editable="true"]').find('input[type!="checkbox"], select').addClass('form-control').css('padding', '5px 5px 5px 5px').css('height', '100%');
                $self.find('td[data-editable="true"]').find('input[type="checkbox"]').addClass('form-control').css('height', '20px');
                $('#divEditGridControls > button').addClass('btn btn-default');
            }
            $self.find('.edit-mode').hide();
            $self.find('.view-mode').show();
            $('.edit-mode').hide();
            $('.view-mode').show();
            return false;
        }

        function getSelectColumnValues(columnName) {
            var data = null;
            if (typeof _options !== 'undefined' && _options.hasOwnProperty("columns")) {
                var columns = _options.columns;
                if (columns.length > 0) {
                    var opts = columns.filter(function (c) {
                        return c.name.toString().toUpperCase().trim() === columnName.toString().toUpperCase().trim();
                    });

                    if (typeof opts !== 'undefined' && opts.length > 0) {
                        opts = opts[0];
                        var optsType = (typeof opts.values);
                        var optValues;
                        console.log('type:', optsType);
                        switch (optsType.toString()) {
                            case 'string':
                                optValues = JSON.parse(opts.values);
                                break;
                            case 'object':
                                optValues = opts.values;
                                break;
                            default:
                                optValues = null;
                                break;
                        }
                        if (optValues) {
                            data = [];
                            if (opts.hasOwnProperty("text") && opts.hasOwnProperty("value")) {
                                for (var i = 0, j = optValues.length; i < j; i++) {
                                    data.push({ "text": optValues[i][opts.text], "value": optValues[i][opts.value] });
                                }
                            } else {
                                for (var i = 0, j = optValues.length; i < j; i++) {
                                    data.push({"text" : optValues[i], "value":optValues[i]});
                                }
                            }
                        }
                    }
                }
            }
            return data;
        }

        _self.edit = function () {
            $self.find('.edit-mode').show();
            $self.find('.view-mode').hide();
            $('.edit-mode').show();
            $('.view-mode').hide();
            $self.find("input[type='checkbox']").prop('disabled', false);
            $self.find("select").prop('disabled', false);
            return false;
        };

        _self.cancel = function () {
            $self.find('.view-mode').show();
            $self.find('.edit-mode').hide();
            $('.view-mode').show();
            $('.edit-mode').hide();
            $self.find("input[type='checkbox']").prop('disabled', true);
            $self.find('select').prop('disabled', true);
            $self.find('tr > td[data-editable="true"]').parent().each(function (rowIdx, row) {
                var _row = $(row);
                var idx = _row.data('id');
                _row.find('td[data-editable="true"]').each(function (colIdx, col) {
                    var _col = $(col);
                    var objType = _col.data('object-type');
                    var column = _col.data('col');
                    var value = _data[idx][column];
                    switch (objType) {
                        case 'checkbox':
                            _col.find("input[type='checkbox']").prop('checked', value);
                            break;
                        case 'select':
                            _col.find('select').val(value);
                            break;
                        default:
                            _col.find("input[type!='hidden']").val(value);
                            break;
                    }
                });
            });
            return false;
        };

        _self.save = function (callback) {
            $self.find('.view-mode').show();
            $self.find('.edit-mode').hide();
            $('.view-mode').show();
            $('.edit-mode').hide();
            $self.find("input[type='checkbox']").prop('disabled', true);
            $self.find('select').prop('disabled', true);
            var dirtyRows = [];
            $self.find('tr > td[data-editable="true"]').parent().each(function (rowIdx, row) {
                var _row = $(row);
                var id = _row.data('id');
                var isDirty = false;
                var updatedRow = {};
                if (_data[id].hasOwnProperty("keyName")) {
                    var keyName = _data[id]["keyName"];
                    updatedRow[keyName] = _data[id][keyName];
                }
                _row.find('td').each(function (colIdx, col) {
                    var _col = $(col);
                    var column = _col.data('col');
                    var editable = _col.data('editable');
                    var value = _data[id][column];
                    var objType = _col.data('object-type');
                    var dataType = _col.data('type');
                    if (typeof editable !== 'undefined' && editable === true) {
                        switch (objType) {
                            case 'checkbox':
                                value = _col.find("input[type='checkbox']").prop('checked');
                                break;
                            case 'select':
                                value = _col.find('select').val();
                                _col.find('span').text(_col.find('select > option:selected').text());
                                break;
                            default:
                                value = _col.find("input[type!='hidden']").val();
                                _col.find('span').text(value);
                                break;
                        };
                        (dataType === 'number' && value !== '') && (value = Number(value));
                        if (_data[id][column] !== value) {
                            _data[id][column] = value;
                            isDirty = true;
                        }
                    }
                    updatedRow[column] = value;
                });
                if (isDirty) {
                    dirtyRows.push(updatedRow);
                }
            });
            if (callback) {
                callback(dirtyRows);
                return false;
            } else {
                return dirtyRows;
            }
        };

        init();

        return _self;
    };
}(jQuery));