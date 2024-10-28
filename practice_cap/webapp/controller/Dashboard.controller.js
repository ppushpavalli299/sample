sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment", // Added Fragment
    "sap/ui/core/routing/History" // Import History
], function (Controller, JSONModel, MessageToast, Fragment, History) { 
    "use strict";

    return Controller.extend("app.practicecap.controller.DashBoard", {
        onInit: function () {
            // Create a JSON model
            var oModel = new JSONModel();
            this.getView().setModel(oModel, "dashboard");

            // Load data into the model
            this.loadData();
        },

        loadData: function () {
            // Simulated data for demonstration purposes
            var oData = {
                
                masterData: {
                    title: "Master Data",
                    items: [
                        {
                            header: "Customer",
                            subHeader: "",
                            icon: "sap-icon://customer",
                            footer: "Customer",
                            route: "customerMaster",
                            key: 5,
                            value: 0,
                            state: true
                        },
                    ]
                },
                Sample: {
                    title: "Sample",
                    items: [
                        {
                            header: "Sample",
                            subHeader: "",
                            icon: "",
                            footer: "Sample",
                            route: "Sample",
                            key: 0,
                            value: 0,
                            state: true
                        }
                    ]
                }
            };

            // Set the data to the model
            this.getView().getModel("dashboard").setData(oData);
        },
              //popover
        handleResponsivePopoverPress: function (oEvent) {
            var oButton = oEvent.getSource(),
                oView = this.getView();

            if (!this._pPopover) {
                this._pPopover = Fragment.load({
                    id: oView.getId(),
                    name: "app.practicecap.view.Popover",
                    controller: this
                }).then(function (oPopover) {
                    oView.addDependent(oPopover);
                    return oPopover;
                });
            }

            this._pPopover.then(function (oPopover) {
                oPopover.openBy(oButton);
            });
        },
            //menupopover
        menuPopover: function (oEvent) {
            var oButton = oEvent.getSource();
            var oView = this.getView();

            if (!this._menuPopover) {
                Fragment.load({
                    id: oView.getId(),
                    name: "app.practicecap.view.menuPopover",
                    controller: this
                }).then(function (oPopover) {
                    oView.addDependent(oPopover);
                    this._menuPopover = oPopover;
                    this._menuPopover.openBy(oButton);
                }.bind(this));
            } else {
                this._menuPopover.openBy(oButton);
            }
        },

        onCloseSetting: function (oEvent) {
            var oDialog = oEvent.getSource().getParent();
            oDialog.close();
        },
            //setting
        onPressSaveSetting: function () {
            MessageToast.show("Settings saved successfully!");
        },
        onPressSetting: function () {
            var oView = this.getView();
            if (!this._settingDialog) {
                this._settingDialog = sap.ui.xmlfragment(oView.getId(), "app.practicecap.view.Setting", this);
                oView.addDependent(this._settingDialog);
            }
            this._settingDialog.open();
        }, 
             //logout
        onPressLogOut: function () {
            // Create the dialog if it does not exist yet
            if (!this.oApproveDialog) {
                this.oApproveDialog = new sap.m.Dialog({
                    type: sap.m.DialogType.Message,
                    title: "Confirm",
                    content: new sap.m.Text({
                        text: "Are you sure you want to log off?"
                    }),
                    beginButton: new sap.m.Button({
                        type: sap.m.ButtonType.Emphasized,
                        text: "OK",
                        press: function () {
                            this.showChatBot(false);
                            this.getOwnerComponent().getRouter().navTo("Login");
                        }.bind(this)
                    }),
                    endButton: new sap.m.Button({
                        text: "Cancel",
                        press: function () {
                            this.oApproveDialog.close();
                        }.bind(this)
                    })
                });
            }
            // Open the dialog
            this.oApproveDialog.open();
        },
        showChatBot: function (isVisible) {
            var chat_id = document.getElementById("cai-webchat-div");
            if (chat_id) {
                chat_id.style.display = isVisible ? "block" : "none";
            }
        },

        onItemClose: function (oEvent) {
            var oItem = oEvent.getSource(),
                oList = oItem.getParent();
            oList.removeItem(oItem);
            MessageToast.show("Item Closed: " + oItem.getTitle());
        },
             //samplescreen naviagte
        onSamplePress: function () {
            // Get the router instance from the owner component
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Sample");
        },
              //Managecustomer navigation
        onPressManageCustomer: function () {
             var oRouter = this.getOwnerComponent().getRouter();
             oRouter.navTo("ManageCustomer"); 
        },
            //split container
            onPressNavToDetail: function () {
                this.getSplitContObj().to(this.createId("detailDetail"));
            },
    
            onPressDetailBack: function () {
                this.getSplitContObj().backDetail();
            },
    
            onPressMasterBack: function () {
                this.getSplitContObj().backMaster();
            },
    
            onPressGoToMaster: function () {
                this.getSplitContObj().toMaster(this.createId("master2"));
            },
    
            onListItemPress: function (oEvent) {
                var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
    
                this.getSplitContObj().toDetail(this.createId(sToPageId));
            },
    
            onPressModeBtn: function (oEvent) {
                var sSplitAppMode = oEvent.getSource().getSelectedButton().getCustomData()[0].getValue();
    
                this.getSplitContObj().setMode(sSplitAppMode);
                MessageToast.show("Split Container mode is changed to: " + sSplitAppMode, { duration: 5000 });
            },
    
            getSplitContObj: function () {
                var result = this.byId("SplitContDemo");
                if (!result) {
                    Log.error("SplitApp object can't be found");
                }
                return result;
            }

    });
});
