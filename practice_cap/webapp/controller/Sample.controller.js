sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History", 
    "sap/base/Log" 
], function (Controller, JSONModel, Fragment, History, Log) {
    "use strict";

    return Controller.extend("app.practicecap.controller.Sample", {
        onInit: function () {
            var oModel = new JSONModel();
            var sDataPath = sap.ui.require.toUrl("app/practicecap/mockdata/products.json");

            // Load JSON data and add error handling
            oModel.loadData(sDataPath);
            oModel.attachRequestCompleted(function (oEvent) {
                if (oEvent.getParameter("success")) {
                    this.getView().setModel(oModel);
                    Log.info("Data loaded successfully:", oModel.getData());
                } else {
                    Log.error("Failed to load data:", oEvent.getParameter("errorObject"));
                }
            }.bind(this));

            oModel.attachRequestFailed(function (oEvent) {
                Log.error("Loading of data failed:", oEvent.getParameter("message"));
            });
        },

        // Back navigation handler
		onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                // Navigate back in the browser history
                window.history.go(-1);
            } else {
                // If no previous history, navigate to the dashboard route
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("DashBoard", {}, true); 
            }
		},

        getPage : function() {
            return this.byId("dynamicPageId");
        },

        onToggleFooter: function () {
            this.getPage().setShowFooter(!this.getPage().getShowFooter());
        },

        toggleAreaPriority: function () {
            var oTitle = this.getPage().getTitle(),
                sDefaultShrinkRatio = oTitle.getMetadata().getProperty("areaShrinkRatio").getDefaultValue(),
                sNewShrinkRatio = oTitle.getAreaShrinkRatio() === sDefaultShrinkRatio ? "1.6:1:1.6" : sDefaultShrinkRatio;
            oTitle.setAreaShrinkRatio(sNewShrinkRatio);
        },

        onPressOpenPopover: function (oEvent) {
            var oView = this.getView(),
                oSourceControl = oEvent.getSource();

            if (!this._pPopover) {
                this._pPopover = Fragment.load({
                    id: oView.getId(),
                    name: "app.practicecap.view.Popover"
                }).then(function (oPopover) {
                    oView.addDependent(oPopover);
                    return oPopover;
                });
            }

            this._pPopover.then(function (oPopover) {
                oPopover.openBy(oSourceControl);
            });
        }
    });
});
