sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
    "project1/utils/URLConstants"
], function (Controller, JSONModel, MessageToast, History, MessageBox, URLConstants) {
    "use strict";

    return Controller.extend("project1.controller.BaseController", {
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oModel = this.getOwnerComponent().getModel();
            this.oView = this.getView();
            this._mViewSettingsDialogs = {};

            const oSideNavModel = new JSONModel({
                navigationItems: [
                    { key: "customer", text: "Customer" },
                    { key: "createCustomer", text: "Create Customer" },
                    { key: "customerDetails", text: "Customer Details" },
                    { key: "manage_configuration", text: "Manage Configuration" },
                    { key: "configuration_detail", text: "Configuration Detail" },
                    { key: "create_configuration", text: "Create Configuration" }
                ]
            });
            this.setModel(oSideNavModel, "sideNavigation");
        },

        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        getResourceBundle: function (text) {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(text);
        },

        navTo: function (sRoute, oParams) {
            this.oRouter.navTo(sRoute, oParams);
        },

        onNavBack: function () {
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.navTo("home");
            }
        },

        showLoading: function (bShow) {
            bShow ? sap.ui.core.BusyIndicator.show(0) : sap.ui.core.BusyIndicator.hide();
        },

        showMessage: function (sMessage) {
            MessageToast.show(sMessage);
        },

        showBusyIndicator: function (bShow) {
            this.getView().setBusy(bShow);
        },

        restMethodGet: function (url) {
            const deferred = $.Deferred();
            $.ajax({
                type: "GET",
                url: URLConstants.URL.app_endPoint + url,
                contentType: "application/json",
                success: response => deferred.resolve(response),
                error: xhr => deferred.reject(xhr)
            });
            return deferred.promise();
        },

        restMethodPost: function (url, request) {
            const deferred = $.Deferred();
            $.ajax({
                type: "POST",
                url: URLConstants.URL.app_endPoint + url,
                data: JSON.stringify(request),
                contentType: "application/json",
                xhrFields: {
                    withCredentials: true // ⬅️ Required if using cookies/session
                },
                success: response => deferred.resolve(response),
                error: xhr => deferred.reject(xhr.responseJSON)
            });

            return deferred.promise();
        },

        customErrorObject(errorMessages, pageId, oControl, description) {
            return {
                type: "Error",
                active: true,
                control: oControl,
                title: errorMessages,
                subTitle: null,
                description: description,
                page: pageId
            };
        },

        // errorHandling: function (ex, oControl) {
        //     if (!this.errorData || !ex) {
        //         this.errorData = [];
        //     }

        //     const isInvalidSession = ex?.errorDescription?.includes("301") || ex?.errorDescription?.includes("Invalid Session");

        //     if (isInvalidSession) {
        //         MessageBox.error(ex.errorDescription, {
        //             actions: [MessageBox.Action.OK],
        //             onClose: () => this.getRouter().navTo("login")
        //         });
        //         this.showLoading(false);
        //         return;
        //     }

        //     // Ensure the errors model exists
        //     let eModel = this.getOwnerComponent().getModel("errors");
        //     if (!eModel) {
        //         eModel = new JSONModel([]);
        //         this.getOwnerComponent().setModel(eModel, "errors");
        //     }

        //     const errorTitle = ex?.responseJSON?.errorDescription || ex?.responseJSON?.debugMessage || ex?.errorDescription;
        //     const exists = this.errorData.some(e => e.title === errorTitle);

        //     if (!exists) {
        //         const errorObject =
        //             ex?.responseJSON?.debugMessage ? this.customErrorObject(ex.responseJSON.debugMessage, this.pageId, null, null) :
        //                 ex?.responseJSON?.errorDescription ? this.customErrorObject(ex.responseJSON.errorDescription, this.pageId, null, null) :
        //                     ex?.responseJSON?.error ? this.customErrorObject(ex.responseJSON.error, this.pageId, null, null) :
        //                         ex?.errorDescription || ex?.debugMessage ? this.customErrorObject(ex.errorDescription || ex.debugMessage, this.pageId, null, null) :
        //                             ex?.status ? this.customErrorObject(`${ex.status} ${ex.statusText}`, this.pageId, null, null) :
        //                                 this.customErrorObject(ex, this.pageId, oControl, null);

        //         this.errorData.push(errorObject);
        //     }

        //     const mergedData = [...(eModel.getData() || []), ...this.errorData];
        //     eModel.setData(mergedData);

        //     if (mergedData.length) {
        //         this.errorMessagePopover(this.popoverBtn);
        //     }

        //     this.showLoading(false);
        // },

        // errorMessagePopover: async function (popoverBtn) {
        //     const oButton = popoverBtn;
        //     const oView = this.getView();

        //     try {
        //         if (!this.oPopover) {
        //             this.oPopover = await this.loadFragment({
        //                 name: "project1.view.ErrorMessage"
        //             });
        //             oView.addDependent(this.oPopover);
        //         }
        //         this.oPopover.openBy(oButton);
        //     } catch (error) {
        //         console.error("Error loading popover:", error);
        //     }
        // },

        // errorMessagePopoverClose() {
        //     if (this.oPopover) {
        //         this.oPopover.close();
        //     }
        // }
        errorHandling: function (ex, oControl) {
            if (!this.errorData || !ex) {
                this.errorData = [];
            }

            const isInvalidSession = ex?.errorDescription?.includes("301") || ex?.errorDescription?.includes("Invalid Session");

            if (isInvalidSession) {
                MessageBox.error(ex.errorDescription, {
                    actions: [MessageBox.Action.OK],
                    onClose: () => this.getRouter().navTo("login")
                });
                this.showLoading(false);
                return;
            }

            let eModel = this.getOwnerComponent().getModel("errors");
            if (!eModel) {
                eModel = new JSONModel([]);
                this.getOwnerComponent().setModel(eModel, "errors");
            }

            const errorTitle = ex?.responseJSON?.errorDescription || ex?.responseJSON?.debugMessage || ex?.errorDescription;
            const exists = this.errorData.some(e => e.title === errorTitle);

            if (!exists) {
                const errorObject =
                    ex?.responseJSON?.debugMessage ? this.customErrorObject(ex.responseJSON.debugMessage, this.pageId, oControl, null) :
                        ex?.responseJSON?.errorDescription ? this.customErrorObject(ex.responseJSON.errorDescription, this.pageId, oControl, null) :
                            ex?.responseJSON?.error ? this.customErrorObject(ex.responseJSON.error, this.pageId, oControl, null) :
                                ex?.errorDescription || ex?.debugMessage ? this.customErrorObject(ex.errorDescription || ex.debugMessage, this.pageId, oControl, null) :
                                    ex?.status ? this.customErrorObject(`${ex.status} ${ex.statusText}`, this.pageId, oControl, null) :
                                        this.customErrorObject(ex, this.pageId, oControl, null);

                this.errorData.push(errorObject);
            }

            const mergedData = [...(eModel.getData() || []), ...this.errorData];
            eModel.setData(mergedData);

            // ✅ Use fallback button if none provided
            const btn = oControl || this.getView().byId("errorButton") || this.getView();
            if (mergedData.length) {
                this.errorMessagePopover(btn);
            }

            this.showLoading(false);
        },
        // errorMessagePopover: async function (popoverBtn) {
        //     try {
        //         const oButton = popoverBtn || this.getView().byId("errorButton");
        //         if (!oButton) {
        //             console.warn("Popover trigger button not found.");
        //             return;
        //         }

        //         if (!this.oPopover) {
        //             this.oPopover = await this.loadFragment({
        //                 name: "project1.view.ErrorMessage"
        //             });
        //             this.getView().addDependent(this.oPopover);
        //         }

        //         this.oPopover.openBy(oButton);
        //     } catch (error) {
        //         console.error("Error loading popover:", error);
        //     }
        // },
        // handleMessagePopoverPress(oEvent) {
        //     let oSource = oEvent.getSource();
        //     this.popoverBtn = oSource; // Set reference to source
        //     this.errorMessagePopover(oSource);
        // }



    });
});
