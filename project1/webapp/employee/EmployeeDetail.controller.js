sap.ui.define([
    "project1/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "project1/utils/URLConstants",
    "sap/ui/core/Core",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/export/Spreadsheet",
    "sap/m/Token",
    "project1/utils/ErrorMessage",
], function (
    BaseController, JSONModel, MessageToast, URLConstants, Core, MessageBox, Fragment, Spreadsheet, Token, ErrorMessage
) {
    "use strict";

    return BaseController.extend("project1.employee.EmployeeDetail", {

        onInit() {
            this.oOwnerComponent = this.getOwnerComponent();
            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("employee").detachPatternMatched(this._onRouteMatchedemp, this);
            this.oRouter.getRoute("employee_detail").attachPatternMatched(this._onRouteMatched, this);


            this.getView().setModel(new JSONModel(), "empdetailsMdl");
            this.getView().setModel(new JSONModel({ edit: false, view: true }), "visible");

            this.eMdl = new JSONModel([]);
            this.getView().setModel(this.eMdl, "errors");

            let oSource = ((sId) => this.getView().byId(sId));
            [this.formId, this.pageId, this.popoverBtn, this.oTable] = [
                oSource("form_id"),
                oSource("oplConfigDetail"),
                oSource("errorBtnEditsystem")

            ];

            this.oRouter.getRoute("employee_detail").attachPatternMatched(this._onRouteMatched, this);
        },


        _onRouteMatched(oEvent) {
            this._item = oEvent.getParameter("arguments").id;
            this._route = oEvent.getParameter("config").name;

            var setDataModel = {
                status: [
                    { key: "1", text: "Draft" },
                    { key: "2", text: "Active" },
                    { key: "3", text: "InActive" }
                ]
            };

            this.getView().setModel(new JSONModel(setDataModel), "masterdataMdl");
            this.fetchEmployeeById();
        },

        fetchEmployeeById: async function () {
            try {
                this.showLoading(true);
                let companyByIdPath = URLConstants.URL.employee_by_id.replace("{id}", this._item);
                let response = await this.restMethodGet(companyByIdPath);

                // Set the employee details to the "empdetailsMdl" model
                this.getView().setModel(new JSONModel(response), "empdetailsMdl");

            } 
            finally {
                this.showLoading(false);
            }
        },

        handleFullScreen() {
            this.oRouter.navTo("employee_detail", { layout: "MidColumnFullScreen", id: this._item });
        },

        handleExitFullScreen() {
            this.oRouter.navTo("employee_detail", { layout: "TwoColumnsMidExpanded", id: this._item });
        },

        handleClose() {
            this.oRouter.navTo("employee", { layout: "OneColumn" });
        },

        onPressEdit: function () {
            let vModel = this.getView().getModel("visible");
            if (vModel) {
                let vData = vModel.getData();
                vData.edit = !vData.edit;
                vData.view = !vData.view;
                vModel.refresh();
            }
        },

        onExit() {
            this.oRouter.getRoute("employee").detachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("employee_detail").detachPatternMatched(this._onRouteMatched, this);
        },

        // onPressSave: async function () {
        //     try {
        //         ErrorMessage.formValidation([this.formId], this.eMdl, this.pageId);
        //         let reqData = this.getView().getModel("employeeMdl")?.getData();
        //         let valid = this.eMdl?.getData() || [];
        //         if (valid.length === 0) {

        //             this.showLoading(true);
        //             let path = URLConstants.URL.emp_add_edit;
        //             let response = await this.restMethodPost(path, reqData);

        //             this.getView().setModel(new JSONModel(response), "employeeMdl");

        //             this.showLoading(false);
        //             this.setInitialModel();

        //             MessageBox.information("Saved successfully!", {
        //                 actions: [MessageBox.Action.OK],
        //                 onClose: () => {
        //                     this.getRouter().navTo("employee", { layout: "OneColumn" });
        //                 }
        //             });
        //         } else {
        //             this.errorHandling();
        //         }
        //     } catch (ex) {
        //         this.errorHandling(ex);
        //     }
        // },
        onPressSave: async function () {
            try {
                ErrorMessage.formValidation([this.formId], this.eMdl, this.pageId);
                let reqData = this.getView().getModel("empdetailsMdl")?.getData();
                let valid = this.eMdl?.getData() || [];

                if (valid.length === 0) {
                    this.showLoading(true);
                    let path = URLConstants.URL.emp_add_edit;
                    let response = await this.restMethodPost(path, reqData);

                    this.showLoading(false);
                    this.setInitialModel();

                    MessageBox.information("Saved successfully!", {
                        actions: [MessageBox.Action.OK],
                        onClose: () => {
                            this.getRouter().navTo("employee", { layout: "OneColumn" });
                        }
                    });
                } else {
                    this.errorHandling();
                }
            } catch (ex) {
                this.errorHandling(ex);
            }
        },
        setInitialModel: function () {
            this.getView().getModel("empdetailsMdl").setData({});
            let vModel = this.getView().getModel("visible");
            if (vModel) {
                vModel.setData({ edit: false, view: true });
            }
        },

      
        onPressCancel: function () {
            this.oRouter.navTo("employee", { layout: "OneColumn" });
        },

    });
});
