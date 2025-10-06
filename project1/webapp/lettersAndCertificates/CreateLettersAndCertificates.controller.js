sap.ui.define([
    "project1/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "project1/utils/Formatter"
], function (BaseController, JSONModel, MessageToast, MessageBox, Fragment, Filter, FilterOperator, Formatter) {
    "use strict";

    return BaseController.extend("project1.lettersAndcertificates.CreateLettersAndCertificates", {
        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();
            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("createLoanApplication").attachPatternMatched(this.onRouteMatched, this);

            var oMainModel = new JSONModel({
                employee: "",
                request_date: null,
                request_type: "",
                request_name: "",
                required_date: null,
                status: ""
            });

            var oLetterModel = new JSONModel({
                purpose: "",
                remarks: ""
            });

            var oFormModel = new JSONModel({
                form_type: "",
                passportHandedOver: "",
                medicalCardReceived: "",
                dateReleasedFrom: null,
                dateReceivedTo: null,
                receivedBy: "",
                purpose: ""
            });

            var oCertificateModel = new JSONModel({
                purpose: "",
                remarks: "",
                description: "",
                requestReason: "",
                approver: ""
            });

            this.getView().setModel(oMainModel, "mainModel");
            this.getView().setModel(oLetterModel, "letterModel");
            this.getView().setModel(oFormModel, "formModel");
            this.getView().setModel(oCertificateModel, "certificateModel");
        },

        onRouteMatched: function () {
            var statusData = [
                { key: "1", text: "Pending" },
                { key: "2", text: "Approval" },
                { key: "3", text: "Warning" },
                { key: "4", text: "Cancelled" }
            ];
            var oStatusModel = new JSONModel(statusData);
            this.getView().setModel(oStatusModel, "masterdataMdl");
        },

        onRequestTypeChange: function (oEvent) {
            var sSelectedKey = oEvent.getSource().getSelectedKey();
            var oView = this.getView();

            oView.byId("lettersPanel").setVisible(sSelectedKey === "letter");
            oView.byId("formPanel").setVisible(sSelectedKey === "form");
            oView.byId("certificatePanel").setVisible(sSelectedKey === "certificate");
        },

        onReasonChange: function (oEvent) {
            var sSelectedKey = oEvent.getSource().getSelectedKey();
            MessageToast.show("Form reason selected: " + sSelectedKey);
        },

        onFileUpload: function () {
            MessageToast.show("File upload triggered.");
        },

        onSave: function () {
            var oMainData = this.getView().getModel("mainModel").getData();
            MessageToast.show("Saved locally. Data: " + JSON.stringify(oMainData));
        },

        onSubmit: function () {
            var oMainData = this.getView().getModel("mainModel").getData();
            MessageToast.show("Submitted. Data: " + JSON.stringify(oMainData));
        },

        onCancel: function () {
            this.oRouter.navTo("lettersandcertificates");
        },

        valueHelpDialogEmployee: function () {
            var oView = this.getView();
            if (!this._pEmployeeDialog) {
                Fragment.load({
                    name: "project1.lettersAndcertificates.fragments.Employee",
                    controller: this
                }).then(function (oFragment) {
                    this._pEmployeeDialog = oFragment;
                    oView.addDependent(this._pEmployeeDialog);
                    this._pEmployeeDialog.open();
                }.bind(this));
            } else {
                this._pEmployeeDialog.open();
            }
        },

        valueHelpEmployeeClose: function () {
            if (this._pEmployeeDialog) {
                this._pEmployeeDialog.close();
            }
        },

        selectedEmpData: function () {
            var oTable = this.getView().byId("table_SelectEmp");
            var oSelectedItem = oTable.getSelectedItem();
            if (!oSelectedItem) {
                MessageToast.show("Please select an employee.");
                return;
            }

            var oContext = oSelectedItem.getBindingContext("employeeListMdl");
            if (!oContext) {
                MessageToast.show("No context found for selected employee.");
                return;
            }

            var oSelectedEmp = oContext.getObject();
            this.getView().getModel("mainModel").setProperty("/employee", oSelectedEmp.employee_name);
            this.valueHelpEmployeeClose();
        },
       


    });
});
