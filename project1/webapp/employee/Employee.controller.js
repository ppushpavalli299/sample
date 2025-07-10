sap.ui.define([
    "project1/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "project1/utils/URLConstants",
    "sap/ui/core/Core",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function (BaseController, JSONModel, URLConstants, Core, MessageBox, Fragment) {
    "use strict";

    return BaseController.extend("project1.employee.Employee", {

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();
            this.oRouter = this.oOwnerComponent.getRouter();

            this.oRouter.getRoute("employee").attachMatched(this._onRouteMatched, this);

            this.oFilterBar = this.byId('filterbar');
            this.oTable = this.byId('tableId_companies');

            // Initialize filter model
            var oFilterModel = new JSONModel({
                id: "",
                name: "",
                designation: "",
                status: ""
            });
            this.getView().setModel(oFilterModel, "advancedFilterMdl");
        },

        _onRouteMatched: function () {
            // Set status master data
            var setDataModel = {
                status: [
                    { key: "1", text: "Draft" },
                    { key: "2", text: "Active" },
                    { key: "3", text: "Inactive" }
                ]
            };
            this.getView().setModel(new JSONModel(setDataModel), "masterdataMdl");

            // Load employee list
            this.fetchEmployee();
        },

        fetchEmployee: async function () {
            try {
                let reqData = {
                    showAll: true,
                    id: null,
                    pageNo: 1,
                    pageSize: 10
                };

                let path = URLConstants.URL.employee_filter;

                this.showLoading(true);
                let obj = await this.restMethodPost(path, reqData);

                if (Array.isArray(obj) && obj.length > 0) {
                    obj.forEach(function (ele) {
                        if (ele && ele.status !== undefined) {
                            let status = ele.status.toString();
                            ele.statusText = status === "1" ? "Draft" :
                                status === "2" ? "Active" :
                                    status === "3" ? "Inactive" : "Unknown";
                        }
                    });
                }

                this.getView().setModel(new JSONModel({ employees: obj }), "employeeMdl");
                this.showLoading(false);

            } catch (ex) {
                this.showLoading(false);
                this.errorHandling(ex);
            }
        },

        onCreateEmployee: function () {
            this.oRouter.navTo("create_employee", {
                layout: "TwoColumnsMidExpanded"
            });
        },

        onListItemPress: function (oEvent) {
            let oItem = oEvent.getParameter("listItem");
            let oCtx = oItem.getBindingContext("employeeMdl");

            if (oCtx) {
                let oEmp = oCtx.getObject();
                this.oRouter.navTo("employee_detail", {
                    layout: "TwoColumnsMidExpanded",
                    id: oEmp.id
                });
            }
        },

        // advancedFilter: function () {
        //     const oFilterModel = this.getView().getModel("advancedFilterMdl");
        //     const filterData = oFilterModel.getData();

        //     const requestData = {
        //         name: filterData.name || null,
        //         designation: filterData.designation || null,
        //         status: filterData.status || null,
        //         pageNo: 1,
        //         pageSize: 10
        //     };

        //     const path = URLConstants.URL.employee_filter;

        //     this.showLoading(true);

        //     this.restMethodPost(path, requestData)
        //         .then((response) => {
        //             response.forEach(function (ele) {
        //                 if (ele && ele.status !== undefined) {
        //                     let status = ele.status.toString();
        //                     ele.statusText = status === "1" ? "Draft" :
        //                                      status === "2" ? "Active" :
        //                                      status === "3" ? "Inactive" : "Unknown";
        //                 }
        //             });

        //             this.getView().setModel(new JSONModel({ employees: response }), "employeeMdl");
        //             this.showLoading(false);
        //         })
        //         .catch((ex) => {
        //             this.showLoading(false);
        //             this.errorHandling(ex);
        //         });
        // },

        clearAllFilters: function () {
            const model = this.getView().getModel("advancedFilterMdl");
            model.setData({
                id: "",
                name: "",
                designation: "",
                status: ""
            });

            this.fetchEmployee();
        },
        onSearch: function (oEvent) {
            let oModel = this.getView().getModel('advancedFilterMdl');
            let oData = oModel.getData();

            const aFilter = [];
            // Loop over the filter fields and create filters
            for (let [key, value] of Object.entries(oData)) {
                if (value) {
                    // If the value is an array, apply multiple filters (for example, for status)
                    if (Array.isArray(value)) {
                        const multiFilters = [];
                        value.forEach(e => {
                            multiFilters.push(new Filter(key, FilterOperator.EQ, parseInt(e))); // Assume status is numeric
                        });
                        aFilter.push(new Filter({ filters: multiFilters, and: false }));
                    } else {
                        // For other fields, use contains operator
                        aFilter.push(new Filter(key, FilterOperator.Contains, value));
                    }
                }
            }



            // Apply the filters to the table binding
            this.oTable.getBinding("items").filter(aFilter, "Application");

            // Hide overlay after filtering
            this.oTable.setShowOverlay(false);
        },

    });
});
