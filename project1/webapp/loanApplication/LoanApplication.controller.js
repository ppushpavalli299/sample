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

    return BaseController.extend("project1.loanapplication.LoanApplication", {
        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();
            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("loanapplication").attachMatched(this.onRouteMatched, this);
            // this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

            // this.masData = this.getStorage("master_data");
            // this._mViewSettingsDialogs = {};
            this.initialModel();


            // Advanced Filter Model
            this.getView().setModel(new JSONModel({ payrollperiod: null, date: null, status: null }), "advancedFilterMdl");

            // Sample loan application data (3 records)
            const sampleData = [
                {
                    payroll_period: "2025-08-05",
                    date: "2025-08-10",
                    currency: "USD",
                    disbursal_method: "Bank Transfer",
                    remarks: "Medical Loan",
                    status: 1,
                    hasDetails: true
                },
                {
                    payroll_period: "2025-07-02",
                    date: "2025-07-05",
                    currency: "EUR",
                    disbursal_method: "Cheque",
                    remarks: "Education Loan",
                    status: 2,
                    hasDetails: true
                },
                {
                    payroll_period: "2025-06-01",
                    date: "2025-06-20",
                    currency: "INR",
                    disbursal_method: "Cash",
                    remarks: "Personal Loan",
                    status: 3,
                    hasDetails: false
                },
                {
                    payroll_period: "2025-10-01",
                    date: "2025-10-05",
                    currency: "USD",
                    disbursal_method: "Cheque",
                    remarks: "Car Loan",
                    status: 4,
                    hasDetails: true
                },
                {
                    payroll_period: "2025-10-10",
                    date: "2025-10-12",
                    currency: "INR",
                    disbursal_method: "Cash",
                    remarks: "Emergency Loan",
                    status: 1,
                    hasDetails: true
                }
            ];

            this.getView().setModel(new JSONModel(sampleData), "manageLoanApplicationMdl");
        },

        // onRouteMatched: function () {
        //     const statusData = {
        //         status: [
        //             { key: "1", text: "Pending" },
        //             { key: "2", text: "Approval" },
        //             { key: "3", text: "Warning" },
        //             { key: "4", text: "Cancelled" }
        //         ]
        //     };
        //     this.getView().setModel(new sap.ui.model.json.JSONModel(statusData), "masterdataMdl");



        //     let oSettingsModel = this.oOwnerComponent.getModel("settings");
        //     oSettingsModel.getData().columns = this.createColumnConfig();
        //     oSettingsModel.refresh(true);

        //     this.registerPageIds();
        //     this._tableId = this.tableId;
        //     if (this._tableId) {
        //         this.disableItemNavigated(this._tableId);
        //         this.setColulmnsIntoModel();
        //     }
        //     this.clearAllFilters();
        // },
        onRouteMatched: function () {
            // Set status model to view
            const statusData = {
                status: [
                    { key: "1", text: "Pending" },
                    { key: "2", text: "Approval" },
                    { key: "3", text: "Warning" },
                    { key: "4", text: "Cancelled" }
                ]
            };
            this.getView().setModel(new sap.ui.model.json.JSONModel(statusData), "masterdataMdl");

            // Get settings model from owner component safely
            let oSettingsModel = this.oOwnerComponent.getModel("settings");
            if (oSettingsModel) {
                let oData = oSettingsModel.getData();
                oData.columns = this.createColumnConfig();
                oSettingsModel.refresh(true);
            } else {
                // Optional: create the settings model if it does not exist
                const settingsData = {
                    columns: this.createColumnConfig()
                };
                this.oOwnerComponent.setModel(new sap.ui.model.json.JSONModel(settingsData), "settings");
            }

            // Register UI elements
            this.registerPageIds();

            // Use _tableId safely
            this._tableId = this.tableId;
            if (this._tableId) {
                if (typeof this.disableItemNavigated === "function") {
                    this.disableItemNavigated(this._tableId);
                }
                if (typeof this.setColulmnsIntoModel === "function") {
                    this.setColulmnsIntoModel();
                }
            }

            // Clear filters
            this.clearAllFilters();
        },

        registerPageIds: function () {
            this.pageId = this.byId("page_ManageLoanApplication");
            this.tableId = this.getView().byId("tableManageLoanApplication");
            this.payroll_period = this.getView().byId("payroll_period");
            this.date = this.getView().byId("date");
            this.currency = this.getView().byId("currency");
            this.disbursal_method = this.getView().byId("disursal_method");
            this.remarks = this.getView().byId("remarks");
            this.status = this.getView().byId("status");
        },
        initialModel: function () {
            const obj = {
                payroll_period: null,
                date: null,
                status: null
            };
            this.getView().setModel(new JSONModel(obj), "advancedFilterMdl");
            this.getView().setModel(new JSONModel(), "manageLoanApplicationMdl");
        },

        onPressCreate: function () {
            this.oRouter.navTo("createLoanApplication", { layout: "TwoColumnsMidExpanded" });
        },

        createColumnConfig: function () {
            return [

                {
                    label: 'Payroll Period',
                    property: 'payroll_period',
                    width: "25"
                },
                {
                    label: 'Date',
                    property: 'date',
                    width: "25"
                },
                {
                    label: 'Currency',
                    property: 'currency',
                    width: "25"
                },
                {
                    label: 'Disbursal Method',
                    property: 'disbursal_method',
                    width: "25"
                },
                {
                    label: 'Remarks',
                    property: 'remarks',
                    width: "25"
                },
                {
                    label: 'Status',
                    property: 'status',
                    width: "25"
                },

            ];
        },
        advancedFilter: function () {
            const mdl = this.getView().getModel("advancedFilterMdl");
            const data = mdl.getData();
            const filters = [];

            // Payroll Period filter
            if (data.payroll_period) {
                filters.push(new sap.ui.model.Filter("payroll_period", sap.ui.model.FilterOperator.Contains, data.payroll_period));
            }

            // Date filter
            if (data.date) {
                const formattedDate = Formatter.formatDateToYYYYMMDD(data.date); // use Formatter, NOT this
                filters.push(new sap.ui.model.Filter("date", sap.ui.model.FilterOperator.EQ, formattedDate));
            }
            // Status filter
            if (data.status) {
                filters.push(new sap.ui.model.Filter(
                    "status",
                    sap.ui.model.FilterOperator.EQ,
                    parseInt(data.status, 10)
                ));
            }

            // Apply filters to table binding
            const binding = this.getView().byId("tableManageLoanApplication").getBinding("items");
            if (binding) {
                binding.filter(new sap.ui.model.Filter(filters, true));
            }
        },
        onPressSelectRow: function (oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const oContext = oItem.getBindingContext("manageLoanApplicationMdl");
            const oData = oContext.getObject();
            MessageToast.show("Selected: " + oData.remarks);
        },

        onPressView: function (oEvent) {
            const oItem = oEvent.getSource().getBindingContext("manageLoanApplicationMdl").getObject();
            MessageToast.show("Viewing loan: " + oItem.remarks);
        },

        handleExport: function () {
            const data = this.getView().getModel("manageLoanApplicationMdl").getData();
            const columns = [
                { label: "Payroll Period", property: "payroll_period" },
                { label: "Date", property: "date" },
                { label: "Currency", property: "currency" },
                { label: "Disbursal Method", property: "disbursal_method" },
                { label: "Remarks", property: "remarks" },
                { label: "Status", property: "status" }
            ];

            this.onExport(columns, data, "LoanApplications");
        },
        clearAllFilters: function () {
            this.getView().getModel("advancedFilterMdl").setData({ payrollperiod: null, date: null, status: null });
            const binding = this.byId("tableManageLoanApplication").getBinding("items");
            if (binding) {
                binding.filter([]);
            }
        }



    });
});

