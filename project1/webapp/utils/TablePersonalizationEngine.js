sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/p13n/Engine',
    'sap/m/p13n/SelectionController',
    'sap/m/p13n/SortController',
    'sap/m/p13n/GroupController',
    'sap/m/p13n/MetadataHelper',
    'sap/ui/model/Sorter',
    'sap/m/ColumnListItem',
    'sap/m/Text'
], function (Controller, JSONModel, Engine, SelectionController, SortController, GroupController, MetadataHelper, Sorter, ColumnListItem, Text) {
    "use strict";
    return {
        onSendPersoParams: function (oTable, oColumns, oView, oModelName) {
            this.oTable = oTable;
            this.oColumns = oColumns.map(e => { e.key = e.property; e.path = e.property; delete e.property; delete e.width; return e })
            this.oView = oView;
            this.oModelName = oModelName;

            var oData = this.oView.getModel(oModelName).getData()

            var oModel = new JSONModel(oData);

            this.oView.setModel(oModel);

            this._registerForP13n();
        },

        _registerForP13n: function () {
            var oTable = this.oTable;

            this.oMetadataHelper = new MetadataHelper(this.oColumns);

            Engine.getInstance().register(oTable, {
                helper: this.oMetadataHelper,
                controller: {
                    Columns: new SelectionController({
                        targetAggregation: "columns",
                        control: oTable
                    }),
                    Sorter: new SortController({
                        control: oTable
                    }),
                    Groups: new GroupController({
                        control: oTable
                    })
                }
            });

            Engine.getInstance().attachStateChange(this.handleStateChange.bind(this));
        },

        openPersoDialog: function (oEvt) {
            var oTable = this.oTable;

            Engine.getInstance().show(oTable, ["Columns", "Sorter", "Groups"], {
                contentHeight: "35rem",
                contentWidth: "32rem",
                source: oEvt.getSource()
            });
        },

        _getKey: function (oControl) {
            return this.oView.getLocalId(oControl.getId());
        },

        handleStateChange: function (oEvt) {
            var oTable = this.oTable;
            let oColumns = this.oColumns;
            let oModelName = this.oModelName;
            var oState = oEvt.getParameter("state");

            if (!oState) {
                return;
            } else {
               // oState.Columns = this.oColumns.map(e=>{return {key:e.key}});
            }

            var aSorter = [];
            oState.Sorter.forEach(function (oSorter) {
                aSorter.push(new Sorter(this.oMetadataHelper.getProperty(oSorter.key).path, oSorter.descending));
            });

            oState.Groups.forEach(function (oGroup) {
                var oExistingSorter = aSorter.find(function (oSorter) {
                    return oSorter.sPath === oGroup.key;
                });

                if (oExistingSorter) {
                    oExistingSorter.vGroup = true;
                } else {
                    aSorter.push(new Sorter(this.oMetadataHelper.getProperty(oGroup.key).path, false, true));
                }
            }.bind(this));

            oTable.getColumns().forEach(function (oColumn, iIndex) {
                oColumn.setVisible(false);
            });

            oState.Columns.forEach(function (oProp, iIndex) {
                var oCol = oTable.getColumns().find(e => e.getId() == oProp.key)
                oCol.setVisible(true);

                oTable.removeColumn(oCol);
                oTable.insertColumn(oCol, iIndex);
            }.bind(this));

            var aCells = oState.Columns.map(function (oColumnState, index) {
                return new Text({
                    text: "{" + oModelName + ">" + oColumns[index].key + "}"
                });
            });

            oTable.bindItems({
                templateShareable: false,
                path: oModelName + ">/",
                sorter: aSorter,
                template: new ColumnListItem({
                    cells: aCells
                })
            });

        }
    };
});