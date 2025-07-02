sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("project1.controller.Dashboard", {
            onInit: function () {
                
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("dashboard").attachMatched(this._onRouteMatched, this);
                
    
                this._objectPageLayout = this.getView().byId("ObjectPageLayout");
                // this.userSettingsData();
            },
            _onRouteMatched: function (oEvent) {
              
            },
            onPressTile: function (oEvent) {
                // var that = this;
                var route = oEvent.getSource().getCustomData().find(e => e.getProperty("key") == "route").getValue();
                var key = oEvent.getSource().getCustomData().find(e => e.getProperty("key") == "key").getValue();
                
                // Ensure the context of 'this' is preserved
                var getRouter = sap.ui.core.UIComponent.getRouterFor(this);
                getRouter.navTo(route);
                if (key) {
                   this.sideNavigation(key);
                }
             },
            dynamicObjectPageSection: function () {
                let layout = this._objectPageLayout
                let section = new sap.uxap.ObjectPageSection();
                let subSection = new sap.uxap.ObjectPageSubSection();
                let container = new sap.f.GridContainer();
            },
            sideNavigation: function (key) {
                var oData = {
                    "navigation": [
                        {
                            "title": "Home",
                            "icon": "sap-icon://bbyd-dashboard",
                            "expanded": false,
                            "key": "dashboard"
                        },
                        {
                            "title": "My Web Page",
                            "key": 1,
                            "items": [
                                {
                                    "title": "Employee",
                                    "key": "employee",
                                    "enabled": true
                                }
                            ]
                        }
                    ],
                    "fixedNavigation": [
                        {
                            "title": "Validations",
                            "icon": "sap-icon://settings",
                            "expanded": false,
                            "key": "validation"
                        }
                    ]
                };
            
                // Filter navigation
                let filteredNav = oData.navigation.find(e => e.key == key);
                oData.title = filteredNav?.title;
                oData.navigation = filteredNav?.items;
                oData.selectedSectionKey = key;
            
                // Get the model
                let oModel = this.getOwnerComponent().getModel("sideNavigation");
            
                // Initialize the model if it doesn't exist
                if (!oModel) {
                    oModel = new sap.ui.model.json.JSONModel({});
                    this.getOwnerComponent().setModel(oModel, "sideNavigation");
                }
            
                // Merge and update model data
                let merge = { ...oModel.getData(), ...oData };
                oModel.setData(merge);
            
                // Refresh the model (only if the model exists)
                if (oModel) {
                    oModel.refresh();
                }
            }
            
        });
    });
