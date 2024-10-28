

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessagePopover",
    "sap/m/MessagePopoverItem",
    "sap/m/MessageToast"
], function (Controller, MessagePopover, MessagePopoverItem, MessageToast) {
    "use strict";

    return Controller.extend("app.practicecap.master_data.Customer.ManageCustomer", {

        onInit: function () {
            // Initialization logic
            this._oFilterBar = this.byId("customerFilterBar"); 
        },

        // Handle the MessagePopover press for errors
        handleMessagePopoverPress: function (oEvent) {
            var oErrorModel = this.getView().getModel("errors");

            if (!this._oMessagePopover) {
                this._oMessagePopover = new MessagePopover({
                    items: {
                        path: "errors>/",
                        template: new MessagePopoverItem({
                            title: "{errors>message}",
                            description: "{errors>details}"
                        })
                    }
                });
                this.getView().addDependent(this._oMessagePopover);
            }
            this._oMessagePopover.openBy(oEvent.getSource());
        },

        // Handle FilterBar Search
        onSearch: function (oEvent) {
            var oFilterItems = this._oFilterBar.getAllFilterItems(true);
            var aFilters = [];

            // Loop through all the filter items to apply the search logic
            oFilterItems.forEach(function (oFilterItem) {
                var oControl = this._oFilterBar.determineControlByFilterItem(oFilterItem);
                var sValue = oControl.getValue();

                // Example: Add filters based on field names
                if (sValue) {
                    var sPath = oFilterItem.getName(); 
                    var oFilter = new sap.ui.model.Filter();
                    aFilters.push(oFilter);
                }
            }.bind(this));

            // Apply filters to the table or other models
            var oTable = this.getView().byId("customerTable"); 
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
            
            // Notify the user
            MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("filterAppliedMessage"));
        },

        // Handle FilterBar Reset
        onReset: function (oEvent) {
           
            this._oFilterBar.getAllFilterItems(true).forEach(function (oFilterItem) {
                var oControl = this._oFilterBar.determineControlByFilterItem(oFilterItem);
                if (oControl.setValue) {
                    oControl.setValue(""); 
                } else if (oControl.setSelectedKeys) {
                    oControl.setSelectedKeys([]); 
                }
            }.bind(this));

            // Clear table filters
            var oTable = this.getView().byId("customerTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter([]);

            // Notify the user
            MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("filtersResetMessage"));
        },

        // Handle Date Range Selection Change
        handleChangeDateRange: function (oEvent) {
            var oDateRangeSelection = oEvent.getSource();
            var oSelectedDates = oDateRangeSelection.getDateValue();
            if (oSelectedDates) {
                MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("dateRangeSelectedMessage"));
            }
        },
        onPressCustomerCreate: function () {
            MessageToast.show("Create Customer button pressed");
           
        },
            
               //sort button
        handleSortButtonPressed: function () {
            // Implement sorting logic
            var oTable = this.byId("customerTable");
            var oBinding = oTable.getBinding("items");
            var aSorters = [];
            aSorters.push(new Sorter("name", false)); // Example: sort by 'name'
            oBinding.sort(aSorters);
        },
             //group button

        handleGroupButtonPressed: function () {
            MessageToast.show("Group Button Pressed");
            // Implement your grouping logic here
        },
             //setting button

        handlePersoButtonPressed: function () {
            MessageToast.show("Settings Button Pressed");
            // Implement personalization logic for the table
        },
             //tablecolumn list items
        onListItemPress: function (oEvent) {
            var oSelectedItem = oEvent.getSource();
            var oBindingContext = oSelectedItem.getBindingContext();
            var sPath = oBindingContext.getPath();
            
            MessageToast.show("Item pressed: " + sPath);
            // Navigate to customer detail page or perform other logic
        }

    });
});
