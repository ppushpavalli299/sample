sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("project1.controller.View", {
        onInit: function () {
            this.initLoginModel();
        },

        initLoginModel: function () {
            var oLoginModel = new JSONModel({
                userName: "Pushpavalli",
                password: "12345",
                enableLogin: true,
                isPasswordVisible: false
            });
            this.getView().setModel(oLoginModel, "loginModel");
        },

        onInputChange: function () {
            var oModel = this.getView().getModel("loginModel");
            var sUsername = oModel.getProperty("/userName") || "";
            var sPassword = oModel.getProperty("/password") || "";

            var isLoginEnabled = sUsername.trim() !== "" && sPassword.trim() !== "";
            oModel.setProperty("/enableLogin", isLoginEnabled);
        },
    

        onLoginPress: function () {
            var oModel = this.getView().getModel("loginModel");
            var sUsername = oModel.getProperty("/userName");
            var sPassword = oModel.getProperty("/password");

            if (sUsername === "Pushpavalli" && sPassword === "12345") {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("dashboard");
            } else {
                MessageToast.show("Invalid username or password.");
            }
        },
       
        onShowPassword: function (oEvent) {
            var oInput = oEvent.getSource();
            var currentType = oInput.getType();

            if (currentType === "Password") {
                oInput.setType("Text");
                oInput.setValueHelpIconSrc("sap-icon://hide");
            } else {
                oInput.setType("Password");
                oInput.setValueHelpIconSrc("sap-icon://show");
            }
        },

        onPressChangePassword: function () {
            MessageToast.show("Forgot Password functionality not implemented.");
        }
    });
});
