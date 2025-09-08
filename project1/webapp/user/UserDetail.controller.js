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
    "project1/utils/Formatter"

], function (
    BaseController, JSONModel, MessageToast, URLConstants, Core, MessageBox, Fragment, Spreadsheet, Token, ErrorMessage,Formatter
) {
    "use strict";

    return BaseController.extend("project1.user.UserDetail", {
         formatter: Formatter,

        onInit() {
            this.oOwnerComponent = this.getOwnerComponent();
            this.oRouter = this.oOwnerComponent.getRouter();

            // View models
            this.getView().setModel(new JSONModel(), "userdetailsMdl");
            this.getView().setModel(new JSONModel({ edit: false, view: true }), "visible");
            this.eMdl = new JSONModel([]);
            this.getView().setModel(this.eMdl, "errors");

            // Form elements
            let oSource = ((sId) => this.getView().byId(sId));
            [this.formId, this.pageId, this.popoverBtn] = [
                oSource("form_id"),
                oSource("oplConfigDetail"),
                oSource("errorBtnEditsystem")
            ];

            // Attach route
            this.oRouter.getRoute("userdetail").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched(oEvent) {
            const oArgs = oEvent.getParameter("arguments");
            this._item = oArgs.id;
            this._route = oEvent.getParameter("config").name;

            // Status master data
            const statusModel = {
                status: [
                    { key: "1", text: "Draft" },
                    { key: "2", text: "Active" },
                    { key: "3", text: "InActive" }
                ]
            };
            this.getView().setModel(new JSONModel(statusModel), "masterdataMdl");

            this.fetchUserById();
        },

        fetchUserById: async function () {
            try {
                this.showLoading(true);
                const path = URLConstants.URL.user_by_id.replace("{id}", this._item);
                const response = await this.restMethodGet(path);

                // Populate user model
                this.getView().getModel("userdetailsMdl").setData(response);
            } catch (ex) {
                this.errorHandling(ex);
            } finally {
                this.showLoading(false);
            }
        },

        handleFullScreen() {
            this.oRouter.navTo("userdetail", { layout: "MidColumnFullScreen", id: this._item });
        },

        handleExitFullScreen() {
            this.oRouter.navTo("userdetail", { layout: "TwoColumnsMidExpanded", id: this._item });
        },

        handleClose() {
            this.oRouter.navTo("user", { layout: "OneColumn" });
        },

        onPressEdit: function () {
            const vModel = this.getView().getModel("visible");
            if (vModel) {
                const vData = vModel.getData();
                vData.edit = !vData.edit;
                vData.view = !vData.view;
                vModel.refresh();
            }
        },

        // onPressSave: async function () {
        //     try {
        //         ErrorMessage.formValidation([this.formId], this.eMdl, this.pageId);
        //         const reqData = this.getView().getModel("userdetailsMdl")?.getData();
        //         const validationErrors = this.eMdl?.getData() || [];

        //         if (validationErrors.length === 0) {
        //             this.showLoading(true);
        //             const path = URLConstants.URL.emp_add_edit;
        //             const response = await this.restMethodPost(path, reqData);

        //             this.showLoading(false);
        //             this.setInitialModel();

        //             MessageBox.information("Saved successfully!", {
        //                 actions: [MessageBox.Action.OK],
        //                 onClose: () => {
        //                     this.oRouter.navTo("user", { layout: "OneColumn" });
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
                let reqData = this.getView().getModel("userdetailsMdl")?.getData();
                let valid = this.eMdl?.getData() || [];

                if (valid.length === 0) {
                    this.showLoading(true);
                    let path = URLConstants.URL.user_add_edit;
                    let response = await this.restMethodPost(path, reqData);

                    this.showLoading(false);
                    this.setInitialModel();

                    MessageBox.information("Saved successfully!", {
                        actions: [MessageBox.Action.OK],
                        onClose: () => {
                            this.getRouter().navTo("user", { layout: "OneColumn" });
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
            this.getView().getModel("userdetailsMdl").setData({});
            const vModel = this.getView().getModel("visible");
            if (vModel) {
                vModel.setData({ edit: false, view: true });
            }
        },

        onPressCancel: function () {
            this.oRouter.navTo("user", { layout: "OneColumn" });
        },

        onExit() {
            this.oRouter.getRoute("userdetail").detachPatternMatched(this._onRouteMatched, this);
        },



    });
});
