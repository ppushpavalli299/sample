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
], function (
    BaseController, JSONModel, MessageToast, URLConstants, Core, MessageBox, Fragment,Spreadsheet, Token,ErrorMessage
) {
    "use strict";
    return BaseController.extend("project1.employee.CreateEmployee", {

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            
            this.oRouter.getRoute("create_employee").attachPatternMatched(this._onRouteMatched, this);
            // this.oRouter.getRoute("employee").attachPatternMatched(this._onRouteMatchedEmp, this);

            let oSource = ((sId) => this.getView().byId(sId));
            [this.formId, this.pageId, this.popoverBtn] = [oSource('form_id'), oSource('id_CreateEmp'), oSource('errorBtn')]
        
        },
        _onRouteMatched: function (oEvent) {
            var setDataModel = {
                status: [
                    { key: "1", text: "Active" },
                    { key: "2", text: "Inactive" },
                    { key: "3", text: "Draft" }
                ],


            };
            this.getView().setModel(new JSONModel(setDataModel), "masterdataMdl")
            this.setInitialModel();
            this.errorPopoverParams();
        },
        errorPopoverParams: function () {
            //******Set Initially Empty Error Mdl******
            this.eMdl = this.getOwnerComponent().getModel("errors");
            ErrorMessage.removeValueState([this.formId], this.eMdl);
            this.eMdl.setData([]);
        },
        setInitialModel: function () {
            let obj = {
                name: null,
                designation: null,
                status: 1,
               
            };
            this.getView().setModel(new JSONModel(obj), "createEmpMdl");
        },
        _onRouteMatchedEmp: function (oEvent) {
        },
        handleFullScreen: function () {
            //var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
            this.oRouter.navTo("create_employee", { layout: "MidColumnFullScreen" });
        },
        handleExitFullScreen: function () {
            //var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
            this.oRouter.navTo("create_employee", { layout: "TwoColumnsMidExpanded" });
        },
        handleClose: function () {
            // var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.oRouter.navTo("employee", { layout: "OneColumn" });
        },
        onExit: function () {
            this.oRouter.getRoute("employee").detachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("create_employee").detachPatternMatched(this._onRouteMatched, this);
        },
        onPressCancel: function () {
            this.oRouter.navTo("employee", { layout: "OneColumn" });
        },

        onPressSave: async function () {
            try {
                 ErrorMessage.formValidation([this.formId], this.eMdl, this.pageId);
                let reqData = this.getView().getModel("createEmpMdl")?.getData();
                let valid = this.eMdl?.getData() || [];
                if (valid.length === 0) {
                    this.errorMessagePopoverClose();
                    this.showLoading(true);
                    let path = URLConstants.URL.emp_add;
                    let response = await this.restMethodPost(path, reqData);
        
                    this.getView().setModel(new JSONModel(response), "createEmpMdl");
        
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
        

    });
});
