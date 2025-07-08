sap.ui.define([
    "project1/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "project1/utils/URLConstants",
    "sap/ui/core/Core",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    'sap/ui/export/Spreadsheet',
    'sap/m/Token'

], function (BaseController, JSONModel, MessageToast, URLConstants, Core, MessageBox, Fragment, Spreadsheet, Token) {
    "use strict";

    return BaseController.extend("project1.customer.Customer", {

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();
            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("employee").attachMatched(this._onRouteMatched, this);
            // this.oRouter.getRoute("employee_detail").attachPatternMatched(this._onRouteMatchedemp, this);

            this.getView().setModel(new JSONModel(), "advancedFilterMdl");
            this.btn_request_type = this.getView().setModel(new JSONModel(), "advancedFilterMdl");
            this._tableId = this.byId("tableId_companies");
            this._pageId = this.byId("page_MngCompanies");

            this._mViewSettingsDialogs = {};

            let oModel = new JSONModel([
                { id: "E001", name: "John Doe", designation: "Software Engineer",  status: "1" },
                { id: "E002", name: "Jane Smith", designation: "Project Manager",  status: "2" },
                { id: "E003", name: "Amit Kumar", designation: "HR Executive",  status: "3" },
                { id: "E004", name: "Lisa Wong", designation: "UI Designer",  status: "2" }
            ]);

            this.getView().setModel(oModel, "employeeMdl");
        },
        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            var setDataModel = {
                status: [
                    { key: "1", text: "Draft" },
                    { key: "2", text: "Active" },
                    { key: "3", text: "Inactive" }
                ]
            };

            this.getView().setModel(new JSONModel(setDataModel), "masterdataMdl");
            // this.fetchemployee();
        },


        // fetchemp: async function () {
        //     try {
        //         let reqData = {
        //             "showAll": true,
        //             "id": null,
        //             "pageNumber": 1,
        //             "pageSize": 100
        //         };

        //         let path = URLConstants.URL.employee_filter;
        //         this.showLoading(true);
        //         let obj = await this.restMethodPost(path, reqData);
        //         if (obj && obj.length > 0) {
        //             obj.forEach(function (ele) {
        //                 if (ele && ele.status !== undefined) {  
        //                     ele.statusText = ele.status == 0 ? 'Inactive' : 'Active';
        //                 }
        //             });
        //         }
        //         this.getView().setModel(new JSONModel(obj), "employeeMdl");
        //         this.showLoading(false);
        //     }
        //     catch (ex) {
        //         this.showLoading(false);
        //         this.errorHandling(ex);
        //     }

        // },
        createColumnConfig: function () {
            return [
                {
                    label: 'Company Id',
                    property: 'compID',
                    width: "25"
                },
                {
                    label: 'Company Name',
                    property: 'compName',
                    width: "25"
                },
                {
                    label: 'Company Department',
                    property: 'compdept',
                    width: "25"
                }
            ];
        },
        advancedFilter: function () {
            let filters = [];
            let mdl = this.getView().getModel("advancedFilterMdl");
            let data = mdl.getData();

            for (let [key, value] of Object.entries(data)) {
                if (value != "") {

                    if (key == "name") {
                        filters.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.Contains, value));
                    } else {
                        filters.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.EQ, value));
                    }

                }
            }
            let binding = this._tableId.getBinding("items");
            binding.filter(filters);
        },
        clearAllFilters: function () {
            this.getView().setModel(new JSONModel(), "advancedFilterMdl");
            this.advancedFilter();
        },

        onCreateEmp: function () {
            this.oRouter.navTo("create_employee", { layout: "TwoColumnsMidExpanded" });
        },
         onListItemPress: function (oEvent) {
            let oItem = oEvent.getParameter("listItem"); 
            let oCtx = oItem.getBindingContext("empdetailsMdl");
            
            if (oCtx) {
                let oEmp = oCtx.getObject();
                this.oRouter.navTo("employee_detail", {
                    layout: "TwoColumnsMidExpanded",
                    id: oEmp.id 
                });
            } 
        },
         onPressViewTemplate: async function () {
            try {
                this.showLoading(true);
                const payload = {
                    id: null,
                    earnings: null,
                    master: null,
                    actual: null,
                    deductions: null,
                    actual2: null,
                    view_or_download: 1
                };
                let path = URLConstants.URL.payslip_template_report;
                let result = await this.restMethodPost(path, payload);
               if (result) {
                    let arr = [result];
                    this.loadPrevPDF(arr);
                }
                this.showLoading(false);
            } catch (err) {
                // this.errorHandling(err);
                this.showLoading(false);
            }
        },


      loadPrevPDF: async function (obj) {
            const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;
            var contentType = 'application/pdf';
            var pdfs = obj;// obj.getData();
            const pdfDocDisp = await PDFDocument.create()
            var firstPDF = pdfs[0];
            var blob = this.b64toBlob(firstPDF, contentType);
            var blobUrl = URL.createObjectURL(blob);
            var sourceBuffer = await fetch(blobUrl).then((res) => res.arrayBuffer())
            // Load a PDFDocument from the existing PDF bytes
            const pdfDoc = await PDFDocument.load(sourceBuffer);
            var isFirst = true;
            const pdfDoc1 = await PDFDocument.create()
            for (let pdf of pdfs) {
                //if(isFirst == false){
                var blob1 = this.b64toBlob(pdf, contentType);
                var blobUrl1 = URL.createObjectURL(blob1);
                var sourceBuffer1 = await fetch(blobUrl1).then((res) => res.arrayBuffer())
                // Load a PDFDocument from the existing PDF bytes
                var pdfItems = await PDFDocument.load(sourceBuffer1);
                const pages = pdfItems.getPages();
                for (let i = 0; i < pages.length; i++) {
                    const firstPage = pages[i]
                    const [existingPage] = await pdfDocDisp.copyPages(pdfItems, [i])
                    pdfDocDisp.insertPage(pdfDocDisp.getPages().length, existingPage);
                }
                //}
                isFirst = false;
            }
            const base64String = await pdfDocDisp.saveAsBase64();
            var blob = this.b64toBlob(base64String, contentType);
            var blobUrl = URL.createObjectURL(blob);
            jQuery.sap.addUrlWhitelist("blob");
            this._pdfViewer = new PDFViewer();
            this.getView().addDependent(this._pdfViewer);
            this._pdfViewer.setSource(blobUrl);
            //this._pdfViewer.setTitle("Sales Order");
            //this._pdfViewer.setPopupHeaderTitle("Sales Order");
            this._pdfViewer.open();
            this.showLoading(false);
        },

        b64toBlob: function (b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, { type: contentType });
            return blob;
        }

    });
});



   