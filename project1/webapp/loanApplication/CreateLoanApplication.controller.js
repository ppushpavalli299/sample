sap.ui.define([
    "project1/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "project1/utils/URLConstants",
    "sap/ui/core/Core",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    'sap/ui/export/Spreadsheet',
    'sap/m/Token',
    "project1/utils/ErrorMessage",
], function (BaseController, JSONModel, MessageToast, URLConstants, Core, MessageBox, Fragment, Spreadsheet, Token, ErrorMessage) {
    "use strict";

    return BaseController.extend("project1.loanapplication.CreateLoanApplication", {
        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();
            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            // Attach route matched handler on correct route name
            this.oRouter.getRoute("createLoanApplication").attachPatternMatched(this.onRouteMatched, this);

            let oSource = ((sId) => this.getView().byId(sId));
            [this.formId, this.pageId, this.popoverBtn] = [
                oSource('form_id'),
                oSource('id_CreateEmp'),
                oSource('errorBtn')
            ];

            var oData = {
                "Employees": [
                    {
                        "EmpID": "0286",
                        "EmpName": "Sammy Salonga Cabildo",
                        "Loans": [
                            {
                                "LoanCode": "Personal Loan",
                                "LoanAmount": "30000.00",
                                "AdjustmentAmount": "0.00",
                                "DisbursalDate": "2025-08-20",
                                "RepaymentStartDate": "2025-10-01",
                                "RepaymentInstallments": "0",
                                "RepaymentPayCode": "D-LOAN",
                                "Remarks": "No Remarks"
                            }
                        ]
                    },
                    {
                        "EmpID": "0420",
                        "EmpName": "Jane Doe",
                        "Loans": [
                            {
                                "LoanCode": "Personal Loan",
                                "LoanAmount": "25000.00",
                                "AdjustmentAmount": "0.00",
                                "DisbursalDate": "2025-07-15",
                                "RepaymentStartDate": "2025-09-01",
                                "RepaymentInstallments": "10",
                                "RepaymentPayCode": "P-LOAN",
                                "Remarks": "Pending verification"
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
            this.setInitialModel();
            this.errorPopoverParams();
        },
        errorPopoverParams: function () {
            this.eMdl = this.getOwnerComponent().getModel("errors");
            ErrorMessage.removeValueState([this.formId], this.eMdl);
            this.eMdl.setData([]);
        },

        setInitialModel: function () {
            let obj = {
                name: null,
                designation: null,
                status: "1"
            };
            this.getView().setModel(new JSONModel(obj), "loanApplicationMdl");
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
        },
        onPressSave: async function () {
            try {
                // Perform form field validation
                ErrorMessage.formValidation([this.formId], this.eMdl, this.pageId);

                let reqData = this.getView().getModel("loanApplicationMdl")?.getData();
                let validationErrors = this.eMdl?.getData() || [];

                // Proceed only if there are no validation errors
                if (validationErrors.length === 0) {
                    if (this._oMessagePopover) {
                        this._oMessagePopover.close();
                    }

                    this.showLoading(true);

                    let path = URLConstants.URL.loan_application_add;
                    let response = await this.restMethodPost(path, reqData);

                    this.getView().setModel(new JSONModel(response), "loanApplicationMdl");
                    this.showLoading(false);
                    this.setInitialModel();

                    MessageBox.information("Saved successfully!", {
                        actions: [MessageBox.Action.OK],
                        onClose: () => {
                            this.getRouter().navTo("loanapplication", { layout: "OneColumn" });
                        }
                    });
                } else {
                    this.errorHandling();
                }
            } catch (ex) {
                this.errorHandling(ex);
            }
        },
        onPayrollPeriodSelected: function (oEvent) {
            var sSelectedPeriod = oEvent.getParameter("listItem").getTitle();
            this.fetchLoansByPayrollPeriod(sSelectedPeriod);
        },
        fetchLoansByPayrollPeriod: async function (sPeriod) {
            try {
                let response = await this.restMethodGet(
                    URLConstants.URL.loan_application_get,
                    { FILTER_PARAMS: JSON.stringify({ PAYROLL_PERIOD: sPeriod }), PAGE_NUMBER: 1, PAGE_SIZE: 50 }
                );
                this.processLoanResponse(response);
            } catch (err) {
                MessageToast.show("Failed to fetch loans for selected period");
            }
        }


    });
});
