sap.ui.define([
    "project1/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "project1/utils/URLConstants",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/PDFViewer",
    "project1/utils/Formatter"
], function (
    BaseController,
    JSONModel,
    URLConstants,
    MessageBox,
    Filter,
    FilterOperator,
    PDFViewer,
    Formatter
) {
    "use strict";

    return BaseController.extend("project1.employee.Employee", {
        formatter: Formatter,
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("employee").attachMatched(this._onRouteMatched, this);
            this.oTable = this.byId("tableId_companies");

            this.getView().setModel(new JSONModel({
                id: "",
                name: "",
                designation: "",
                status: []
            }), "advancedFilterMdl");
        },

        _onRouteMatched: function () {
            const statusData = {
                status: [
                    { key: "1", text: "Draft" },
                    { key: "2", text: "Active" },
                    { key: "3", text: "InActive" }
                ]
            };
            this.getView().setModel(new JSONModel(statusData), "masterdataMdl");
            this.fetchEmployee();
        },
        fetchEmployee: async function () {
            const path = URLConstants.URL.employee_filter;
            const reqData = { showAll: true, pageNumber: 1, pageSize: 100 };
            try {
                this.showLoading(true);
                const res = await this.restMethodPost(path, reqData);
                const employees = res?.data ?? res ?? [];

                employees.forEach((e) => {
                    e.status = parseInt(e.status, 10);
                });

                this.getView().setModel(new JSONModel(employees), "employeeMdl");
            } catch (ex) {
                this.errorHandling(ex);
            } finally {
                this.showLoading(false);
            }
        },

        onSearch: function () {
            const oData = this.getView().getModel("advancedFilterMdl").getData();
            const aFilters = [];

            if (oData.id) aFilters.push(new Filter("id", FilterOperator.EQ, oData.id));
            if (oData.name) aFilters.push(new Filter("name", FilterOperator.Contains, oData.name));
            if (oData.designation) aFilters.push(new Filter("designation", FilterOperator.Contains, oData.designation));

            if (Array.isArray(oData.status) && oData.status.length) {
                const aStatusFilters = oData.status.map(key =>
                    new Filter("status", FilterOperator.EQ, parseInt(key, 10))
                );
                aFilters.push(new Filter({ filters: aStatusFilters, and: false }));
            }

            this.oTable.getBinding("items").filter(aFilters);
        },

        clearAllFilters: function () {
            this.getView().getModel("advancedFilterMdl").setData({
                id: "",
                name: "",
                designation: "",
                status: []
            });
            this.oTable.getBinding("items").filter([]);
        },

        // onPressViewTemplate: async function () {
        //     try {
        //         this.showLoading(true);

        //         const payload = {
        //             employee_id: null,
        //             payroll_month: null,
        //             payroll_year: null,
        //             view_or_download: 1

        //         };

        //         const blob = await this.restMethodPosLink(
        //             URLConstants.URL.payslip_template_report_full,
        //             payload
        //         );

        //         if (blob && blob.size > 0) {
        //             this.showBlobInPdfViewer(blob, "Employee Payslip");
        //         }
        //     } catch (ex) {
        //         this.errorHandling(ex);
        //     } finally {
        //         this.showLoading(false);
        //     }
        // },

        onPressViewTemplate: async function () {
            try {
                this.showLoading(true);
                let payload = {
                    employee_id: null,
                    payroll_month: null,
                    payroll_year: null,
                    view_or_download: 1
                };
                let path = URLConstants.URL.payslip_template_report_full;
                let result = await this.restMethodPost(path, payload);
                if (result) {
                    let arr = [result];
                    this.loadPrevPDF(arr);
                }
            } catch (err) {
                this.errorHandling(err);
            } finally {
                this.showLoading(false);
            }
        },

        loadPrevPDF: async function (pdfs) {
            const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;
            const contentType = 'application/pdf';
            const pdfDocDisp = await PDFDocument.create();

            for (let pdf of pdfs) {
                const blob = this.b64toBlob(pdf, contentType);
                const buffer = await blob.arrayBuffer();
                const pdfDoc = await PDFDocument.load(buffer);
                const pages = await pdfDoc.getPages();
                for (let i = 0; i < pages.length; i++) {
                    const [copiedPage] = await pdfDocDisp.copyPages(pdfDoc, [i]);
                    pdfDocDisp.addPage(copiedPage);
                }
            }

            const base64String = await pdfDocDisp.saveAsBase64();
            const finalBlob = this.b64toBlob(base64String, contentType);
            const blobUrl = URL.createObjectURL(finalBlob);

            jQuery.sap.addUrlWhitelist("blob");
            this._pdfViewer = new PDFViewer();
            this.getView().addDependent(this._pdfViewer);
            this._pdfViewer.setSource(blobUrl);
            this._pdfViewer.open();
        },

        b64toBlob: function (b64Data, contentType = '', sliceSize = 512) {
            const byteCharacters = atob(b64Data);
            const byteArrays = [];

            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                const slice = byteCharacters.slice(offset, offset + sliceSize);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                byteArrays.push(new Uint8Array(byteNumbers));
            }

            return new Blob(byteArrays, { type: contentType });
        },
        // onListItemPress: function (oEvent) {
        //     let oItem = oEvent.getParameter("listItem");
        //     let oCtx = oItem.getBindingContext("employeeMdl");

        //     if (oCtx) {
        //         let oEmp = oCtx.getObject();
        //         this.oRouter.navTo("employee_detail", {
        //             layout: "TwoColumnsMidExpanded",
        //             id: oEmp.id
        //         });
        //     }
        // },
    });
});
