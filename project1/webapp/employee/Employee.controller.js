sap.ui.define([
    "project1/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "project1/utils/URLConstants",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, URLConstants, MessageBox, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("project1.employee.Employee", {

        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("employee").attachMatched(this._onRouteMatched, this);

            this.oTable = this.byId("tableId_companies");

            // Filter model
            this.getView().setModel(new JSONModel({
                id: "",
                name: "",
                designation: "",
                status: []
            }), "advancedFilterMdl");
        },

        _onRouteMatched: function () {
            const statusData = {
                status: [
                    { key: "1", text: "Draft" },
                    { key: "2", text: "Active" },
                    { key: "3", text: "Inactive" }
                ]
            };
            this.getView().setModel(new JSONModel(statusData), "masterdataMdl");
            this.fetchEmployee();
        },

        fetchEmployee: async function () {
            try {
                const path = URLConstants.URL.employee_filter;
                const reqData = {
                    showAll: true,
                    pageNumber: 1,
                    pageSize: 100
                };

                this.showLoading(true);
                const result = await this.restMethodPost(path, reqData);

                const mapped = result.map(emp => {
                    let statusText = "Draft";
                    let statusState = "Warning";

                    if (emp.status == 2) {
                        statusText = "Active";
                        statusState = "Success";
                    } else if (emp.status == 3) {
                        statusText = "Inactive";
                        statusState = "Error";
                    }

                    return {
                        ...emp,
                        statusText,
                        statusState
                    };
                });

                this.getView().setModel(new JSONModel({ employees: mapped }), "employeeMdl");
            } catch (ex) {
                this.errorHandling(ex);
            } finally {
                this.showLoading(false);
            }
        },

        onSearch: function () {
            const oData = this.getView().getModel("advancedFilterMdl").getData();
            const aFilters = [];

            if (oData.id) {
                aFilters.push(new Filter("id", FilterOperator.EQ, oData.id));
            }
            if (oData.name) {
                aFilters.push(new Filter("name", FilterOperator.Contains, oData.name));
            }
            if (oData.designation) {
                aFilters.push(new Filter("designation", FilterOperator.Contains, oData.designation));
            }
            if (Array.isArray(oData.status) && oData.status.length > 0) {
                const aStatusFilters = oData.status.map(key =>
                    new Filter("status", FilterOperator.EQ, parseInt(key))
                );
                aFilters.push(new Filter({ filters: aStatusFilters, and: false }));
            }

            this.oTable.getBinding("items").filter(aFilters);
        },

        clearAllFilters: function () {
            this.getView().getModel("advancedFilterMdl").setData({
                id: "",
                name: "",
                designation: "",
                status: []
            });
            this.oTable.getBinding("items").filter([]);
        }

    });
});
