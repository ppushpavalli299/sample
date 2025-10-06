sap.ui.define([
    "project1/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, Fragment, MessageToast, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("project1.loanapplication.CreateLoanApplication", {
        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();
            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            // Attach route matched handler on correct route name
            this.oRouter.getRoute("createLoanApplication").attachPatternMatched(this.onRouteMatched, this);

            var oData = {
                Employees: [
                    {
                        EmpName: "0286-Sammy Salonga Cabildo",
                        Loans: [
                            {
                                LoanCode: "Personal Loan",
                                LoanAmount: "30000.00",
                                AdjustmentAmount: "0.00",
                                DisbursalDate: "2025-08-20",
                                RepaymentStartDate: "2025-10-01",
                                RepaymentInstallments: "0",
                                RepaymentPayCode: "D-LOAN",
                                Remarks: "No Remarks"
                            },
                            {
                                LoanCode: "Car Loan",
                                LoanAmount: "45000.00",
                                AdjustmentAmount: "1000.00",
                                DisbursalDate: "2024-05-15",
                                RepaymentStartDate: "2024-06-01",
                                RepaymentInstallments: "12",
                                RepaymentPayCode: "C-LOAN",
                                Remarks: "New Car"
                            }
                        ]
                    },
                    {
                        EmpName: "0420-Jane Doe",
                        Loans: [
                            {
                                "LoanCode": "Home Loan",
                                "LoanAmount": "120000.00",
                                "AdjustmentAmount": "5000.00",
                                "DisbursalDate": "2023-03-10",
                                "RepaymentStartDate": "2023-04-01",
                                "RepaymentInstallments": "24",
                                "RepaymentPayCode": "H-LOAN",
                                "Remarks": "First Home"
                            }
                        ]
                    }
                ]
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "LoanModel");
        },

        onRouteMatched: function () {
            const statusData = {
                status: [
                    { key: "1", text: "Pending" },
                    { key: "2", text: "Approval" },
                    { key: "3", text: "Warning" },
                    { key: "4", text: "Cancelled" }
                ]
            };
            this.getView().setModel(new JSONModel(statusData), "masterdataMdl");
        },

        valueHelpDialogPayrollPeriod: function () {
            var oView = this.getView();
            if (!this._oPayrollDialog) {
                Fragment.load({
                    name: "project1.loanapplication.fragments.PayrollPeriodDialog",
                    controller: this
                }).then(function (oFragment) {
                    this._oPayrollDialog = oFragment;
                    oView.addDependent(this._oPayrollDialog);
                    this._oPayrollDialog.open();
                }.bind(this));
            } else {
                this._oPayrollDialog.open();
            }
        },

        onSearchPayrollPeriod: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var oList = this.byId("PayrollPeriodList");
            var oBinding = oList.getBinding("items");
            var oFilter = new Filter("description", FilterOperator.Contains, sQuery);
            oBinding.filter([oFilter]);
        },

        onPayrollPeriodSelected: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            if (!oSelectedItem) return;
            var sSelectedPeriod = oSelectedItem.getTitle();
            this.byId("inp_PayrollPeriod").setValue(sSelectedPeriod);
            this._oPayrollDialog.close();
        },

        onClosePayrollPeriodDialog: function () {
            if (this._oPayrollDialog) {
                this._oPayrollDialog.close();
            }
        },

        handleClose: function () {

            this.oRouter.navTo("loanapplication");
        }
    });
});
