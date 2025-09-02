sap.ui.define([
    "project1/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "project1/utils/URLConstants",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/PDFViewer",
    "project1/utils/Formatter"
], function (
    BaseController,
    JSONModel,
    URLConstants,
    MessageBox,
    Filter,
    FilterOperator,
    PDFViewer,
    Formatter
) {
    "use strict";

    return BaseController.extend("project1.user.User", {
        formatter: Formatter,

        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("user").attachMatched(this._onRouteMatched, this);
            this.oTable = this.byId("tableId_users");

            // Initialize filter model
            this.getView().setModel(new JSONModel({
                id: "",
                name: "",
                designation: "",
                createdBy: "",
                createdOn: null,
                status: []
            }), "advancedFilterMdl");
        },

        _onRouteMatched: function () {
            // Set status master data
            const statusData = {
                status: [
                    { key: "1", text: "Draft" },
                    { key: "2", text: "Active" },
                    { key: "3", text: "InActive" }
                ]
            };
            this.getView().setModel(new JSONModel(statusData), "masterdataMdl");

            // Set designation dropdown data
            const employeeData = [
                { id: "Manager", name: "Manager" },
                { id: "Developer", name: "Developer" },
                { id: "Software Engineer", name: "Software Engineer" },
                { id: "Tester", name: "Tester" },
                { id: "HR", name: "HR" }
            ];
            this.getView().setModel(new JSONModel(employeeData), "employeeMdl");

            // Load user data
            this.fetchUser();
        },

        fetchUser: async function () {
            const path = URLConstants.URL.user_filter;
            const reqData = { showAll: true, pageNumber: 1, pageSize: 100 };
            try {
                this.showLoading(true);
                const res = await this.restMethodPost(path, reqData);
                const user = res?.data ?? res ?? [];

                user.forEach(e => {
                    e.status = parseInt(e.status, 10);

                    // Convert "dd/MM/yyyy" string to Date object
                    if (typeof e.createdOn === "string" && e.createdOn.includes("/")) {
                        const [day, month, year] = e.createdOn.split("/").map(Number);
                        e.createdOn = new Date(year, month - 1, day);
                    }
                });

                this.getView().setModel(new JSONModel(user), "userMdl");
            } catch (ex) {
                this.errorHandling(ex);
            } finally {
                this.showLoading(false);
            }
        },

        onSearch: function () {
            const oData = this.getView().getModel("advancedFilterMdl").getData();
            const aFilters = [];

            // ID Filter (exact match)
            if (oData.id) {
                const iId = parseInt(oData.id, 10);
                if (!isNaN(iId)) {
                    aFilters.push(new Filter("id", FilterOperator.EQ, iId));
                }
            }

            // Name Filter (contains)
            if (oData.name) {
                aFilters.push(new Filter("name", FilterOperator.Contains, oData.name));
            }

            // Designation Filter (exact match)
            if (oData.designation) {
                aFilters.push(new Filter("designation", FilterOperator.EQ, oData.designation));
            }

            // Created By Filter (contains)
            if (oData.createdBy) {
                aFilters.push(new Filter("createdBy", FilterOperator.Contains, oData.createdBy));
            }

            // Created On Filter (custom filter function for exact date)
            if (oData.createdOn instanceof Date && !isNaN(oData.createdOn)) {
                const filterDate = new Date(oData.createdOn);
                filterDate.setHours(0, 0, 0, 0);

                aFilters.push(new Filter({
                    path: "createdOn",
                    test: function (value) {
                        if (!value) return false;

                        const valDate = new Date(value);
                        valDate.setHours(0, 0, 0, 0);

                        return valDate.getTime() === filterDate.getTime();
                    }
                }));
            }

            // Status Filter (multi-selection)
            if (Array.isArray(oData.status) && oData.status.length) {
                const aStatusFilters = oData.status.map(key =>
                    new Filter("status", FilterOperator.EQ, key)
                );
                aFilters.push(new Filter({ filters: aStatusFilters, and: false })); // OR between statuses
            }

            // Apply filters to the table binding
            const oBinding = this.oTable.getBinding("items");
            if (oBinding) {
                oBinding.filter(aFilters);
            }
        },

        clearAllFilters: function () {
            this.getView().getModel("advancedFilterMdl").setData({
                id: "",
                name: "",
                designation: "",
                createdBy: "",
                createdOn: null,
                status: []
            });

            const oBinding = this.oTable.getBinding("items");
            if (oBinding) {
                oBinding.filter([]);
            }
        },

        onCreateEmployee: function () {
            this.oRouter.navTo("create_employee", {
                layout: "TwoColumnsMidExpanded"
            });
        },

        onChangeCompany: function (oEvent) {
            const oSelectedKey = oEvent.getSource().getSelectedKey();
            this.getView().getModel("advancedFilterMdl").setProperty("/designation", oSelectedKey);
        }
    });
});
