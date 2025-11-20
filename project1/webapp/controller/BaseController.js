sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
    "project1/utils/URLConstants",
    "sap/m/PDFViewer",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ui/Device",
    "project1/utils/TablePersonalizationEngine"
], function (
    Controller, JSONModel, MessageToast, History, MessageBox, URLConstants,
    PDFViewer, Fragment, Filter, Sorter, Device, TablePersonalizationEngine
) {
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

        restMethodPost: function (url, request) {
            const deferred = $.Deferred();
            $.ajax({
                type: "POST",
                url: URLConstants.URL.app_endPoint + url,
                data: JSON.stringify(request),
                contentType: "application/json",
                success: function (response) {
                    deferred.resolve(response);
                },
                error: function (xhr) {
                    deferred.reject(xhr);
                }
            });
            return deferred.promise();
        },

        restMethodPostLink: function (url, request) {
            const deferred = $.Deferred();
            $.ajax({
                type: "POST",
                url: URLConstants.URL.app_endPoint + url,
                data: JSON.stringify(request),
                contentType: "application/json",
                success: function (response) {
                    deferred.resolve(response);
                },
                error: function (xhr) {
                    deferred.reject(xhr);
                }
            });
            return deferred.promise();
        },

        /// *********** Dialog Fragment Loader (Modern Way) *********** ///
        getViewSettingsDialog: async function (sDialogFragmentName) {
            if (!this._mViewSettingsDialogs[sDialogFragmentName]) {
                const oDialog = await Fragment.load({
                    name: sDialogFragmentName,
                    controller: this
                });

                const oSettingsModel = this.getOwnerComponent().getModel("settings");
                oDialog.setModel(new JSONModel(oSettingsModel.getData()), "settings");

                this.getView().addDependent(oDialog);
                this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;
            }

            return this._mViewSettingsDialogs[sDialogFragmentName];
        },

        handleGroupButtonPressed: async function () {
            const oDialog = await this.getViewSettingsDialog("project1.view.fragment.GroupDialog");
            oDialog.open();
        },

        handleSortButtonPressed: async function () {
            const oSettingMdl = this.getOwnerComponent().getModel("settings");
            const sSelSortItem = oSettingMdl.getProperty("/selectedSortItem");
            const bInitial = oSettingMdl.getProperty("/initSort");

            if (!this.oSortDialog) {
                this.oSortDialog = await Fragment.load({
                    name: "project1.view.fragment.SortDialog",
                    controller: this
                });
                this.getView().addDependent(this.oSortDialog);
            }

            if (bInitial) {
                this.oSortDialog.destroy();
                this.oSortDialog = await Fragment.load({
                    name: "project1.view.fragment.SortDialog",
                    controller: this
                });
                this.getView().addDependent(this.oSortDialog);
                this.oSortDialog.setSelectedSortItem(sSelSortItem);
            }

            this.oSortDialog.open();
        },

        handlePersoButtonPressed: async function () {
            if (!this._persoDialog) {
                this._persoDialog = await Fragment.load({
                    name: "project1.view.fragment.TablePersoDialog",
                    controller: this
                });

                const oSettingsModel = this.getOwnerComponent().getModel("settings");
                this._persoDialog.setModel(new JSONModel(oSettingsModel.getData()), "settings");

                this._persoDialogTable = this._persoDialog.getCustomTabs()[0].getContent()[0];
                this.getView().addDependent(this._persoDialog);
            }

            this._persoDialog.open();
        },

        handleSortDialogConfirm: function (oEvent) {
            const oTable = this._tableId,
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items");

            const sPath = mParams.sortItem?.getKey();
            const bDescending = mParams.sortDescending;

            const aSorters = sPath ? [new Sorter(sPath, bDescending)] : [];

            oBinding.sort(aSorters);
        },

        handleGroupDialogConfirm: function (oEvent) {
            const oTable = this._tableId,
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items");

            if (mParams.groupItem) {
                const sPath = mParams.groupItem.getKey();
                const bDescending = mParams.groupDescending;

                const groupFunction = function (oContext) {
                    return oContext.getProperty(sPath);
                };

                oBinding.sort([new Sorter(sPath, bDescending, groupFunction)]);
            } else if (this.groupReset) {
                oBinding.sort();
                this.groupReset = false;
            }
        },

        resetGroupDialog: function () {
            this.groupReset = true;
        },

        handleTablePersoDialogConfirm: function () {
            const oTable = this._tableId;
            const pTable = this._persoDialogTable;

            const selectedItems = pTable.getSelectedItems();

            if (selectedItems && !this.persoReset) {
                const visibleColumns = selectedItems.map(item =>
                    item.getCells()[0].getText()
                );

                oTable.getColumns().forEach(col => {
                    const colName = col.getHeader()?.getText();
                    col.setVisible(visibleColumns.includes(colName));
                });
            } else if (this.persoReset) {
                oTable.getColumns().forEach(col => col.setVisible(true));
                this.persoReset = false;
            }
        },

        resetPersoDialog: function () {
            this.persoReset = true;
            this._persoDialogTable?.removeSelections();
        },
        customErrorObject: function (errorMessages, pageId, oControl, description) {
            return {
                type: "Error",
                active: true,
                control: oControl,
                title: errorMessages || "Unknown Error",
                subTitle: null,
                description: description || "",
                page: pageId || "",
            };
        },

        errorHandling: function (ex, oControl) {
            try {
                if (!this.errorData) {
                    this.errorData = [];
                }

                if (!ex) {
                    return;
                }

                // Handle session timeout or invalid session
                const isInvalidSession = ex?.errorDescription?.includes("301") ||
                    ex?.errorDescription?.includes("Invalid Session");

                if (isInvalidSession) {
                    sap.m.MessageBox.error(ex.errorDescription, {
                        actions: [sap.m.MessageBox.Action.OK],
                        emphasizedAction: "OK",
                        onClose: () => this.getRouter().navTo("login")
                    });
                    this.showLoading(false);
                    return;
                }

                const eModel = this.getOwnerComponent().getModel("errors");
                const errorTitle =
                    ex?.responseJSON?.errorDescription ||
                    ex?.responseJSON?.debugMessage ||
                    ex?.errorDescription ||
                    ex?.message ||
                    "An unexpected error occurred.";

                // Prevent duplicate error entries
                const exists = this.errorData.some(e => e.title === errorTitle);

                if (!exists) {
                    let errorObj;

                    if (ex?.responseJSON?.debugMessage) {
                        errorObj = this.customErrorObject(ex.responseJSON.debugMessage, this.pageId, oControl, null);
                    } else if (ex?.responseJSON?.errorDescription) {
                        errorObj = this.customErrorObject(ex.responseJSON.errorDescription, this.pageId, oControl, null);
                    } else if (ex?.responseJSON?.error) {
                        errorObj = this.customErrorObject(ex.responseJSON.error, this.pageId, oControl, null);
                    } else if (ex?.status) {
                        errorObj = this.customErrorObject(`${ex.status} ${ex.statusText}`, this.pageId, oControl, null);
                    } else {
                        errorObj = this.customErrorObject(errorTitle, this.pageId, oControl, null);
                    }

                    this.errorData.push(errorObj);
                }

                // Merge and update the "errors" model
                const mergedData = [...(eModel.getData() || []), ...this.errorData];
                eModel.setData(mergedData);

                // Show error popover or message
                if (mergedData.length) {
                    this.errorMessagePopover(this.popoverBtn);
                }

                this.showLoading(false);

            } catch (err) {
                console.error("Error in errorHandling():", err);
                sap.m.MessageBox.error("Something went wrong while processing the error.");
                this.showLoading(false);
            }
        },

        errorMessagePopover: function (oButton) {
            const eModel = this.getOwnerComponent().getModel("errors");
            const aErrors = eModel.getData();

            if (!aErrors || !aErrors.length) {
                sap.m.MessageToast.show("No errors to display");
                return;
            }

            // Create the popover only once
            if (!this._oErrorPopover) {
                this._oErrorPopover = new sap.m.Popover({
                    title: "Error Details",
                    placement: sap.m.PlacementType.Bottom,
                    contentWidth: "400px",
                    content: [
                        new sap.m.List({
                            items: {
                                path: "errors>/",
                                template: new sap.m.StandardListItem({
                                    title: "{errors>title}",
                                    description: "{errors>description}"
                                })
                            }
                        })
                    ]
                });
                this.getView().addDependent(this._oErrorPopover);
                this._oErrorPopover.setModel(eModel, "errors");
            }

            this._oErrorPopover.openBy(oButton);
        },

    }
    );
});

