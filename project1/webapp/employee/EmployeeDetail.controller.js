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

], function (
    BaseController, JSONModel, MessageToast, URLConstants, Core, MessageBox, Fragment, Spreadsheet, Token
) {
    "use strict";

    return BaseController.extend("project1.employee.EmployeeDetail", {


        onInit() {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("employee").detachPatternMatched(this._onRouteMatchedemp, this);
            this.oRouter.getRoute("employee_detail").attachPatternMatched(this._onRouteMatched, this);

        },

        _onRouteMatched(oEvent) {
            this._item = oEvent.getParameter("arguments").id;
            this._route = oEvent.getParameter("config").name;
            var setDataModel = {
                status: [

                    { key: "1", text: "Draft" },
                    { key: "2", text: "Active" },
                    { key: "3", text: "InActive" },


                ],


            };
            this.getView().setModel(new JSONModel(setDataModel), "masterdataMdl");
            this.fetchEmpById();
        },


        fetchEmpById: async function () {
            try {
                this.showLoading(true);
                let companyByIdPath = URLConstants.URL.employee_by_id.replace("{id}", this._item);
                let response = await this.restMethodGet(companyByIdPath);

                // Set the employee details to the "empdetailsMdl" model
                this.getView().setModel(new JSONModel(response), "empdetailsMdl");

            } catch (ex) {
                this.errorHandling(ex);
            } finally {
                this.showLoading(false);
            }
        },

        

        handleFullScreen() {
            //var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
            this.oRouter.navTo("employee_detail", { layout: "MidColumnFullScreen", id: this._item });
        },

        handleExitFullScreen() {
            //var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
            this.oRouter.navTo("employee_detail", { layout: "TwoColumnsMidExpanded", id: this._item });
        },

        handleClose() {
            // var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.oRouter.navTo("employee", { layout: "OneColumn" });
        },

        onExit() {
            this.oRouter.getRoute("employee").detachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("employee_detail").detachPatternMatched(this._onRouteMatched, this);
        },

    });
});
