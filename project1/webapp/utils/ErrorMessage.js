sap.ui.define([
    'sap/ui/core/library'
], function (coreLibrary) {
    "use strict";

    return {
        formValidation: function (formIds, model, pageId) {
            model.setData([]);
            var oErrorData = [];
            formIds.forEach(function (formId) {
                if (!formId?.type) {
                    var formContent = formId.getContent();
                    var constraintValidation = (function (value, constraintType, inputType, exception, ele) {
                        try {
                            constraintType.validateValue(value);
                        } catch (oException) {
                            exception = oException.message;
                            var msg = {
                                type: 'Error',
                                active: true,
                                title: exception,
                                subtitle: 'Enter valid' + " " + inputType.toLowerCase(),
                                control: ele,
                                page: pageId
                            }
                            ele.setValueState("Error");
                            ele.setValueStateText(exception);
                            oErrorData.push(msg);
                        } finally {
                            if (exception == null) {
                                hideError(ele);
                            } else {
                                ele.setValueState("Error");
                                ele.setValueStateText(exception.message);
                            }
                        }
                    });
                    var hideError = (function (ele) {
                        ele.setValueState();
                        ele.setValueStateText();
                    })
                    var showError = (function (ele) {
                        ele.setValueState("Error");
                        ele.setValueStateText("Enter valid value");
                    })
                    formContent.forEach(function (ele) {
                        if (ele.getCustomData().length > 0 && ele.getEnabled()) {
                            let value,
                                selKey,
                                constraintType,
                                inputType,
                                exception,
                                selKeys,
                                selTokens,
                                isSelected;
                            let eleType = ele.getCustomData().find(e => e.getKey() == 'type')?.getValue(); //ele.getCustomData()[0].getValue();//ele.getAccessibilityInfo().type;
                            switch (eleType) {
                                //Input Type Components only starting
                                case 'Input':
                                    value = ele.getValue();
                                    constraintType = ele.getBindingInfo('value')?.type;
                                    inputType = ele.getLabels()[0].getText();
                                    exception = null;
                                    if (value != undefined && value != "" && constraintType != undefined) {
                                        //For Constraint input field
                                        constraintValidation(value, constraintType, inputType, exception, ele);
                                    } else if (value == undefined || value == "") {
                                        //For Without Constraint inputs
                                        var msg = {
                                            type: 'Error',
                                            active: true,
                                            title: "Enter valid value",
                                            subtitle: 'Please fill the' + " " + inputType.toLowerCase() + " " + "field!",
                                            control: ele,
                                            page: pageId
                                        }
                                        showError(ele);
                                        oErrorData.push(msg);
                                    } else {
                                        hideError(ele);
                                    }
                                    break;
                                case 'TextArea':
                                    value = ele.getValue();
                                    constraintType = ele.getBindingInfo('value').type;
                                    inputType = ele.getLabels()[0].getText();
                                    exception = null;
                                    if (value != undefined && value != "" && constraintType != undefined) {
                                        //For Constraint input field
                                        constraintValidation(value, constraintType, inputType, exception, ele);
                                    } else if (value == undefined || value == "") {
                                        //For Without Constraint inputs
                                        var msg = {
                                            type: 'Error',
                                            active: true,
                                            title: "Enter valid value",
                                            subtitle: 'Please fill the' + " " + inputType.toLowerCase() + " " + "field!",
                                            control: ele,
                                            page: pageId
                                        }
                                        showError(ele);
                                        oErrorData.push(msg);
                                    } else {
                                        hideError(ele);
                                    }
                                    break;
                                case 'MultiInput':
                                    selTokens = ele.getTokens();
                                    inputType = ele.getLabels()[0].getText();
                                    if (selTokens == 0) {
                                        //For Without Constraint inputs
                                        var msg = {
                                            type: 'Error',
                                            active: true,
                                            title: "Enter valid value",
                                            subtitle: 'Please fill the' + " " + inputType.toLowerCase() + " " + "field!",
                                            control: ele,
                                            page: pageId
                                        }
                                        showError(ele);
                                        oErrorData.push(msg);
                                    } else {
                                        hideError(ele);
                                    }
                                    break;
                                case 'MaskInput':
                                    value = ele.getValue();
                                    constraintType = ele.getBindingInfo('value').type;
                                    inputType = ele.getLabels()[0].getText();
                                    exception = null;
                                    if (value != undefined && value != "" && constraintType != undefined) {
                                        //For Constraint input field
                                        constraintValidation(value, constraintType, inputType, exception, ele);
                                    } else if (value == undefined || value == "") {
                                        //For Without Constraint inputs
                                        var msg = {
                                            type: 'Error',
                                            active: true,
                                            title: "Enter valid value",
                                            subtitle: 'Please fill the' + " " + inputType.toLowerCase() + " " + "field!",
                                            control: ele,
                                            page: pageId
                                        }
                                        showError(ele);
                                        oErrorData.push(msg);
                                    } else {
                                        hideError(ele);
                                    }
                                    break;
                                case 'StepInput':
                                    value = ele.getValue();
                                    inputType = ele.getLabels()[0].getText();
                                    if (value == undefined || value == "" || value == "0") {
                                        //For Without Constraint inputs
                                        var msg = {
                                            type: 'Error',
                                            active: true,
                                            title: "Enter valid value",
                                            subtitle: 'Please fill the' + " " + inputType.toLowerCase() + " " + "field!",
                                            control: ele,
                                            page: pageId
                                        }
                                        showError(ele);
                                        oErrorData.push(msg);
                                    } else {
                                        hideError(ele);
                                    }
                                    break;
                                //Input Type Ending
                                //Drop Down Fields
                                case 'ComboBox':
                                    value = ele.getValue();
                                    inputType = ele.getLabels()[0].getText();
                                    if (value == undefined || value == "") {
                                        //For Without Constraint inputs
                                        var msg = {
                                            type: 'Error',
                                            active: true,
                                            title: "Enter valid value",
                                            subtitle: 'Please select the' + " " + inputType.toLowerCase() + " " + "field!",
                                            control: ele,
                                            page: pageId
                                        }
                                        showError(ele);
                                        oErrorData.push(msg);
                                    } else {
                                        hideError(ele);
                                    }
                                    break;
                                case 'Select':
                                    selKey = ele.getSelectedKey();
                                    inputType = ele.getLabels()[0].getText();
                                    if (selKey == undefined || selKey == "" || selKey == "-1") {
                                        //For Without Constraint inputs
                                        var msg = {
                                            type: 'Error',
                                            active: true,
                                            title: "Enter valid value",
                                            subtitle: 'Please select the' + " " + inputType.toLowerCase() + " " + "field!",
                                            control: ele,
                                            page: pageId
                                        }
                                        showError(ele);
                                        oErrorData.push(msg);
                                    } else {
                                        hideError(ele);
                                    }
                                    break;
                                case 'MultiComboBox':
                                    selKeys = ele.getSelectedKeys();
                                    inputType = ele.getLabels()[0].getText();
                                    if (selKeys == 0) {
                                        //For Without Constraint inputs
                                        var msg = {
                                            type: 'Error',
                                            active: true,
                                            title: "Enter valid value",
                                            subtitle: 'Please select the' + " " + inputType.toLowerCase() + " " + "field!",
                                            control: ele,
                                            page: pageId
                                        }
                                        showError(ele);
                                        oErrorData.push(msg);
                                    } else {
                                        hideError(ele);
                                    }
                                    break;
                                //Check Box Only
                                case 'CheckBox':
                                    isSelected = ele.getSelected();
                                    inputType = ele.getText();
                                    if (!isSelected) {
                                        //For Without Constraint inputs
                                        var msg = {
                                            type: 'Error',
                                            active: true,
                                            title: "Select the checkbox",
                                            subtitle: "Please indicate that you accept the Terms and Conditions",
                                            control: ele,
                                            page: pageId
                                        }
                                        ele.setValueState("Error");
                                        oErrorData.push(msg);
                                    } else {
                                        ele.setValueState();
                                    }
                                    break;
                                //Date Fields Validation Starting
                                case 'DatePicker':
                                    value = ele.getValue();
                                    inputType = ele.getLabels()[0].getText();
                                    exception = null;
                                    if (value == undefined || value == "") {
                                        //For Without Constraint inputs
                                        var msg = {
                                            type: 'Error',
                                            active: true,
                                            title: "Enter valid value",
                                            subtitle: 'Please fill the' + " " + inputType.toLowerCase() + " " + "field!",
                                            control: ele,
                                            page: pageId
                                        }
                                        showError(ele);
                                        oErrorData.push(msg);
                                    } else {
                                        hideError(ele);
                                    }
                                    break;
                                case 'DateTimePicker':
                                    value = ele.getValue();
                                    inputType = ele.getLabels()[0].getText();
                                    exception = null;
                                    if (value == undefined || value == "") {
                                        //For Without Constraint inputs
                                        var msg = {
                                            type: 'Error',
                                            active: true,
                                            title: "Enter valid value",
                                            subtitle: 'Please fill the' + " " + inputType.toLowerCase() + " " + "field!",
                                            control: ele,
                                            page: pageId
                                        }
                                        showError(ele);
                                        oErrorData.push(msg);
                                    } else {
                                        hideError(ele);
                                    }
                                    break;
                                case 'DateRangeSelection':
                                    value = ele.getValue();
                                    inputType = ele.getLabels()[0].getText();
                                    exception = null;
                                    if (value == undefined || value == "") {
                                        //For Without Constraint inputs
                                        var msg = {
                                            type: 'Error',
                                            active: true,
                                            title: "Enter valid value",
                                            subtitle: 'Please fill the' + " " + inputType.toLowerCase() + " " + "field!",
                                            control: ele,
                                            page: pageId
                                        }
                                        showError(ele);
                                        oErrorData.push(msg);
                                    } else {
                                        hideError(ele);
                                    }
                                    break;
                                case 'FileUploader':
                                    value = ele.getValue();
                                    inputType = "File";//ele.getLabels()[0].getText();
                                    exception = null;
                                    if (value == undefined || value == "") {
                                        //For Without Constraint inputs
                                        var msg = {
                                            type: 'Error',
                                            active: true,
                                            title: "Choose valid file",
                                            subtitle: 'Please upload the file!',
                                            control: ele,
                                            page: pageId
                                        }
                                        showError(ele);
                                        oErrorData.push(msg);
                                    } else {
                                        hideError(ele);
                                    }
                                    break;
                            }
                        }
                    });
                } else {
                    oErrorData.push(formId);
                }
            });
            model.setData(oErrorData);

        },
        removeValueState: function (formIds, model) {
            model.setData([]);
            if (formIds) {
                formIds.forEach(function (formId) {
                    var formContent = formId.getContent();
                    formContent.forEach(function (ele) {
                        if (ele.getCustomData().length > 0) {
                            ele.setValueState();
                        }
                    });
                });
            }
        },
        _showMessagePopover: function (oSource) {
            if (!this._oMessagePopover) {
                Fragment.load({
                    name: "project1.view.ErrorMessage", // Adjust path if different
                    controller: this
                }).then(function (oMessagePopover) {
                    this._oMessagePopover = oMessagePopover;
                    this.getView().addDependent(this._oMessagePopover);
                    this._oMessagePopover.openBy(oSource);
                }.bind(this));
            } else {
                this._oMessagePopover.openBy(oSource);
            }
        }

    };
});

