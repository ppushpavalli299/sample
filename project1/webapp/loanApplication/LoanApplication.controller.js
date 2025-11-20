sap.ui.define([
    "project1/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "project1/utils/Formatter",
    "project1/utils/URLConstants"
], function (BaseController, JSONModel, MessageToast, MessageBox, Fragment, Filter, FilterOperator, Formatter, URLConstants) {
    "use strict";

    return BaseController.extend("project1.loanapplication.LoanApplication", {
        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();
            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            // Attach route matched
            this.oRouter.getRoute("loanapplication").attachMatched(this.onRouteMatched, this);

            // Initialize models
            this.initialModel();

            // Advanced Filter Model (ensure view binding uses same model name)
            this.getView().setModel(new JSONModel({ payrollPeriod: null, applicationDate: null, status: null }), "advancedFilterMdl");
        },

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
            this.getView().setModel(new JSONModel(statusData), "masterdataMdl");

            // Fetch loan applications
            // this.fetchLoanApplication();

            // Get or create settings model
            let oSettingsModel = this.oOwnerComponent.getModel("settings");
            if (oSettingsModel) {
                const oData = oSettingsModel.getData();
                oData.columns = this.createColumnConfig();
                oSettingsModel.refresh(true);
            } else {
                const settingsData = { columns: this.createColumnConfig() };
                this.oOwnerComponent.setModel(new JSONModel(settingsData), "settings");
            }

            // Register UI elements
            this.registerPageIds();

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

        /**
         * Fetch loan applications from backend.
         * Uses this.restMethodPost (from BaseController) which returns a jQuery Deferred promise.
         */
        // fetchLoanApplication: function () {
        //     const path = URLConstants.URL.loan_application_filter;
        //     const reqData = { showAll: true, pageNumber: 1, pageSize: 100 };

        //     // Log for debugging
        //     console.info("[LoanApplication] fetchLoanApplication ->", path, reqData);

        //     // restMethodPost returns a jQuery deferred; use then/catch/finally
        //     const oRequest = this.restMethodPost(path, reqData);

        //     if (!oRequest || typeof oRequest.then !== "function") {
        //         console.error("[LoanApplication] restMethodPost did not return a promise-like object");
        //         this.errorHandling("Internal error: restMethodPost not available");
        //         return;
        //     }

        //     this.showLoading(true);
        //     oRequest
        //         .then((res) => {
        //             console.info("[LoanApplication] fetch response:", res);

        //             // Some backends return { data: [...] } or directly an array
        //             const raw = res?.data ?? res ?? [];

        //             // Normalize fields for the view. This mapping depends on your backend response shape.
        //             // If your backend already returns payrollPeriod and applicationDate, mapping below is harmless.
        //             const loanapplication = (Array.isArray(raw) ? raw : []).map(item => ({
        //                 // mapping common keys (adjust if your backend uses different keys)
        //                 payrollPeriod: item.payroll_period ?? item.payrollPeriod ?? item.payrollPeriod,
        //                 applicationDate: item.applicationDate ?? item.application_date ?? item.application_date ?? item.date,
        //                 currency: item.currency ?? item.currencyCode ?? item.currency_code,
        //                 disbursalMethod: item.disbursalMethod ?? item.disbursal_method ?? item.disbursal_method,
        //                 remarks: item.remarks ?? item.remark ?? item.notes,
        //                 status: item.status != null ? parseInt(item.status, 10) : null,
        //                 // keep original item for any other fields
        //                 __raw: item
        //             }));

        //             this.getView().setModel(new JSONModel(loanapplication), "manageLoanApplicationMdl");
        //         })
        //         .catch((xhrOrError) => {
        //             // xhrOrError may be XHR object from jQuery or a JS Error
        //             console.error("[LoanApplication] fetch error:", xhrOrError);
        //             this.errorHandling(xhrOrError);
        //         })
        //         .finally(() => {
        //             this.showLoading(false);
        //         });
        // },

        /**
         * Universal error handler for API and logical errors.
         * Accepts string, Error, or jQuery XHR object.
         */
        errorHandling: function (error) {
            // Log full error
            console.error("Loan Application Error:", error);

            let sErrorMessage = "An error occurred while fetching loan applications.";

            // If it's a string
            if (typeof error === "string") {
                sErrorMessage = error;
            }
            // If it's an Error object
            else if (error && error.message) {
                sErrorMessage = error.message;
            }
            // If it's jQuery XHR (jqXHR)
            else if (error && error.responseText) {
                try {
                    const parsed = JSON.parse(error.responseText);
                    sErrorMessage = parsed.message || parsed.error || JSON.stringify(parsed) || sErrorMessage;
                } catch (e) {
                    // fallback to status and statusText if present
                    sErrorMessage = error.status ? `HTTP ${error.status} - ${error.statusText || ""}` : sErrorMessage;
                }
            } else if (error && error.statusText) {
                sErrorMessage = error.statusText;
            }

            // Show message to user
            MessageBox.error(sErrorMessage);
        },

        registerPageIds: function () {
            // store references for later usage (if the controls exist in view)
            this.pageId = this.byId("page_ManageLoanApplication");
            this.tableId = this.getView().byId("tableManageLoanApplication");
            // Note: those IDs should exist in view (if not present, these will be undefined)
            this.payroll_period = this.getView().byId("payroll_period");
            this.date = this.getView().byId("date");
            this.currency = this.getView().byId("currency");
            this.disbursal_method = this.getView().byId("disbursal_method");
            this.remarks = this.getView().byId("remarks");
            this.status = this.getView().byId("status");
        },

        initialModel: function () {
            const obj = { payrollPeriod: null, applicationDate: null, status: null };
            this.getView().setModel(new JSONModel(obj), "advancedFilterMdl");
            this.getView().setModel(new JSONModel([]), "manageLoanApplicationMdl");
        },

        onPressCreate: function () {
            this.oRouter.navTo("createLoanApplication", { layout: "TwoColumnsMidExpanded" });
        },

        createColumnConfig: function () {
            // Use property names matching the grid/view cells
            return [
                { label: "Payroll Period", property: "payrollPeriod", width: "25" },
                { label: "Date", property: "applicationDate", width: "25" },
                { label: "Currency", property: "currency", width: "25" },
                { label: "Disbursal Method", property: "disbursalMethod", width: "25" },
                { label: "Remarks", property: "remarks", width: "25" },
                { label: "Status", property: "status", width: "25" }
            ];
        },

        advancedFilter: function () {
            const mdl = this.getView().getModel("advancedFilterMdl");
            if (!mdl) return;

            const data = mdl.getData();
            const aFilters = [];

            if (data.payrollPeriod) {
                aFilters.push(new Filter("payrollPeriod", FilterOperator.Contains, data.payrollPeriod));
            }

            if (data.applicationDate) {
                // Expect Formatter.formatDateToYYYYMMDD to exist
                const formattedDate = Formatter.formatDateToYYYYMMDD
                    ? Formatter.formatDateToYYYYMMDD(data.applicationDate)
                    : data.applicationDate;
                aFilters.push(new Filter("applicationDate", FilterOperator.EQ, formattedDate));
            }

            if (data.status) {
                aFilters.push(new Filter("status", FilterOperator.EQ, parseInt(data.status, 10)));
            }

            const oBinding = this.byId("tableManageLoanApplication")?.getBinding("items");
            if (oBinding) {
                oBinding.filter(aFilters.length ? [new Filter(aFilters, true)] : []);
            }
        },

        onPressSelectRow: function (oEvent) {
            const oItem = oEvent.getParameter("listItem");
            if (!oItem) return;
            const oContext = oItem.getBindingContext("manageLoanApplicationMdl");
            const oData = oContext ? oContext.getObject() : null;
            if (oData) {
                MessageToast.show("Selected: " + (oData.remarks || oData.payrollPeriod || "record"));
            }
        },

        onPressView: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext("manageLoanApplicationMdl");
            const oItem = oContext ? oContext.getObject() : null;
            if (oItem) {
                MessageToast.show("Viewing loan: " + (oItem.remarks || oItem.payrollPeriod || "record"));
                // navigate to detailed route if required:
                // this.oRouter.navTo("loanApplicationDetail", { id: oItem.__raw?.id || oItem.id });
            }
        },

        handleExport: function () {
            const data = this.getView().getModel("manageLoanApplicationMdl").getData() || [];
            const columns = [
                { label: "Payroll Period", property: "payrollPeriod" },
                { label: "Date", property: "applicationDate" },
                { label: "Currency", property: "currency" },
                { label: "Disbursal Method", property: "disbursalMethod" },
                { label: "Remarks", property: "remarks" },
                { label: "Status", property: "status" }
            ];

            // Delegates to BaseController onExport (ensure it exists)
            if (typeof this.onExport === "function") {
                this.onExport(columns, data, "LoanApplications");
            } else {
                console.warn("onExport() not implemented in BaseController.");
                MessageToast.show("Export not available.");
            }
        },

        clearAllFilters: function () {
            const mdl = this.getView().getModel("advancedFilterMdl");
            if (mdl) {
                mdl.setData({ payrollPeriod: null, applicationDate: null, status: null });
            }
            const binding = this.byId("tableManageLoanApplication")?.getBinding("items");
            if (binding) binding.filter([]);
        }

    });
});
