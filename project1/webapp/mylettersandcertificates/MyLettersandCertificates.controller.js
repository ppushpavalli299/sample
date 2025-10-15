sap.ui.define([
    "project1/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "project1/utils/Formatter"
], function (
    BaseController,
    JSONModel,
    MessageToast,
    MessageBox,
    Fragment,
    Filter,
    FilterOperator,
    Formatter
) {
    "use strict";

    return BaseController.extend("project1.mylettersAndcertificates.MyLettersAndCertificates", {
        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();
            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("mylettersandcertificates").attachMatched(this.onRouteMatched, this);
            this.pageId = this.getView().byId("page_manageMyLettersAndCertificates");
            this._tableId = this.getView().byId("tableMyLettersAndCertificates");

            // Filter model
            const oFilterModel = new JSONModel({
                employee: "",
                request_date: "",
                request_type: "",
                request_name: "",
                required_date: "",
                status: ""
            });
            this.getView().setModel(oFilterModel, "advancedFilterMdl");

            // Dummy table data
            const dummyData = [
                {
                    "employee": "John Doe",
                    "request_date": "2025-10-10",
                    "request_type": "1",
                    "request_name": "Experience Letter",
                    "required_date": "2025-10-15",
                    "status": "1"
                },
                {
                    "employee": "Emily Smith",
                    "request_date": "2025-09-28",
                    "request_type": "2",
                    "request_name": "Salary Certificate",
                    "required_date": "2025-10-02",
                    "status": "2"
                },
                {
                    "employee": "Michael Brown",
                    "request_date": "2025-10-01",
                    "request_type": "3",
                    "request_name": "Employment Verification",
                    "required_date": "2025-10-05",
                    "status": "3"
                },
                {
                    "employee": "Sophia Johnson",
                    "request_date": "2025-10-12",
                    "request_type": "1",
                    "request_name": "Transfer Certificate",
                    "required_date": "2025-10-20",
                    "status": "2"
                },
                {
                    "employee": "David Wilson",
                    "request_date": "2025-09-25",
                    "request_type": "2",
                    "request_name": "Salary Certificate",
                    "required_date": "2025-09-30",
                    "status": "3"
                }
            ];
            this.getView().setModel(new JSONModel(dummyData), "manageLettersAndCertificatesMdl");

            // ✅ SETTINGS MODEL FOR SORT / GROUP / PERSO DIALOGS
            const oSettingsModel = new JSONModel({
                columns: this.createColumnConfig(),
                selectedSortItem: "",
                initSort: true
            });
            this.getView().setModel(oSettingsModel, "settings");
        },

        onRouteMatched: function () {
            this.registerPageIds();
            this.clearAllFilters();

            const masterData = {
                request_type: [
                    { key: "1", text: "Letter" },
                    { key: "2", text: "Form" },
                    { key: "3", text: "Certificate" }
                ],
                status: [
                    { "key": "1", "text": "Approved" },
                    { "key": "2", "text": "Pending" },
                    { "key": "3", "text": "Rejected" }
                ]
            };
            this.getView().setModel(new JSONModel(masterData), "masterdataMdl");
        },

        registerPageIds: function () {
            this.pageId = this.byId("page_manageLettersAndCertificatesMdl");
            this.tableId = this.getView().byId("tableManageLoanApplication");
            this.employee = this.getView().byId("employee");
            this.request_date = this.getView().byId("request_date");
            this.request_type = this.getView().byId("request_type");
            this.request_name = this.getView().byId("request_name");
            this.required_date = this.getView().byId("required_date");
            this.status = this.getView().byId("status");
        },

        initialModel: function () {
            const obj = {
                employee: null,
                request_date: null,
                request_type: null,
                request_name: null,
                required_date: null,
                status: null
            };
            this.getView().setModel(new JSONModel(obj), "advancedFilterMdl");
            this.getView().setModel(new JSONModel(), "manageLettersAndCertificatesMdl");
        },

        onPressCreate: function () {
            this.oRouter.navTo("createMylettersandcertificates", { layout: "TwoColumnsMidExpanded" });
        },

        createColumnConfig: function () {
            return [
                { label: "Employee", property: "employee", width: "25" },
                { label: "Request date", property: "request_date", width: "25" },
                { label: "Request Type", property: "request_type", width: "25" },
                { label: "Request Name", property: "request_name", width: "25" },
                { label: "Required Date", property: "required_date", width: "25" },
                { label: "Status", property: "status", width: "25" }
            ];
        },

        advancedFilter: function () {
            const mdl = this.getView().getModel("advancedFilterMdl");
            const data = mdl.getData();
            const filters = [];

            if (data.employee) {
                filters.push(new Filter("employee", FilterOperator.Contains, data.employee));
            }
            if (data.request_date) {
                filters.push(new Filter("request_date", FilterOperator.EQ, data.request_date));
            }
            if (data.request_type) {
                filters.push(new Filter("request_type", FilterOperator.EQ, data.request_type));
            }
            if (data.request_name) {
                filters.push(new Filter("request_name", FilterOperator.Contains, data.request_name));
            }
            if (data.required_date) {
                filters.push(new Filter("required_date", FilterOperator.EQ, data.required_date));
            }
            if (data.status) {
                filters.push(new Filter("status", FilterOperator.EQ, data.status));
            }

            const binding = this.byId("tableMyLettersAndCertificates").getBinding("items");
            if (binding) {
                binding.filter(filters.length > 0 ? new Filter(filters, true) : []);
            }
        },

        clearAllFilters: function () {
            this.getView().getModel("advancedFilterMdl").setData({
                employee: "",
                request_date: "",
                request_type: "",
                request_name: "",
                required_date: "",
                status: ""
            });

            const binding = this.byId("tableMyLettersAndCertificates").getBinding("items");
            if (binding) {
                binding.filter([]);
            }
        },

        handleExport: function () {
            const dataSource = this.getView().getModel("manageLettersAndCertificatesMdl").getData();
            const columnConfig = this.createColumnConfig();
            this.onExport(columnConfig, dataSource, "Employee Data Export");
        }

    });
});
