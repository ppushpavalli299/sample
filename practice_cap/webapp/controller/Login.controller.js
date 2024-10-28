sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("app.practicecap.controller.Login", {
        onInit: function () {
         
            var oModel = new sap.ui.model.json.JSONModel({
                username: "",
                password: "",
                isLoginEnabled: true
            });

            this.getView().setModel(oModel);
        },

        onInputChange: function () {
            var oModel = this.getView().getModel();
            var sUsername = oModel.getProperty("/username");
            var sPassword = oModel.getProperty("/password");
        
            // Check if both fields have values
            var isLoginEnabled = sUsername.trim() !== "" && sPassword.trim() !== "";
            oModel.setProperty("/isLoginEnabled");
        },
        

        onLoginPress: function () {
            var oModel = this.getView().getModel();
            var sUsername = oModel.getProperty("/username");
            var sPassword = oModel.getProperty("/password");
        
            // Perform simple validation (you can expand this logic)
            if (sUsername && sPassword) {
                
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Dashboard"); 
            } else {
                // Optionally show a message if login fails
                sap.m.MessageToast.show("Please enter both username and password.");
            }
        }
        
        
        
        
    });
});