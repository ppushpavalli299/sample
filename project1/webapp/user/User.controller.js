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

  return BaseController.extend("project1.user.User", {
    formatter: Formatter,

    onInit: function () {
      this.oRouter = this.getOwnerComponent().getRouter();
      this.oRouter.getRoute("user").attachMatched(this._onRouteMatched, this);
      this.oTable = this.byId("tableId_users");

      // Filter model
      this.getView().setModel(new JSONModel({
        id: "",
        name: "",
        designation: "",
        createdBy: "",
        createdOn: null,
        status: []
      }), "advancedFilterMdl");
    },

    _onRouteMatched: function () {
      this.getView().setModel(new JSONModel({
        status: [
          { key: "1", text: "Draft" },
          { key: "2", text: "Active" },
          { key: "3", text: "InActive" }
        ]
      }), "masterdataMdl");

      this.getView().setModel(new JSONModel([
        { id: "Manager", name: "Manager" },
        { id: "Developer", name: "Developer" },
        { id: "Software Engineer", name: "Software Engineer" },
        { id: "Tester", name: "Tester" },
        { id: "HR", name: "HR" }
      ]), "employeeMdl");

      this.fetchUser();
    },

    fetchUser: async function () {
      const path = URLConstants.URL.user_filter;
      const reqData = { showAll: true, pageNumber: 1, pageSize: 100 };

      try {
        this.showLoading(true);
        const res = await this.restMethodPost(path, reqData);
        const users = res?.data ?? res ?? [];

        users.forEach(u => {
          u.status = parseInt(u.status, 10);
          if (typeof u.createdOn === "string" && u.createdOn.includes("/")) {
            const [d, m, y] = u.createdOn.split("/").map(Number);
            u.createdOn = new Date(y, m - 1, d);
          }
        });

        this.getView().setModel(new JSONModel(users), "userMdl");
      } catch (ex) {
        this.errorHandling(ex);
      } finally {
        this.showLoading(false);
      }
    },

    onSearch: function () {
      const oData = this.getView().getModel("advancedFilterMdl").getData();
      const aFilters = [];

      if (oData.id) {
        const i = parseInt(oData.id, 10);
        if (!isNaN(i)) {
          aFilters.push(new Filter("id", FilterOperator.EQ, i));
        }
      }
      if (oData.name) {
        aFilters.push(new Filter("name", FilterOperator.Contains, oData.name));
      }
      if (oData.designation) {
        aFilters.push(new Filter("designation", FilterOperator.EQ, oData.designation));
      }
      if (oData.createdBy) {
        aFilters.push(new Filter("createdBy", FilterOperator.Contains, oData.createdBy));
      }
      if (oData.createdOn instanceof Date && !isNaN(oData.createdOn)) {
        const filterDate = new Date(oData.createdOn).setHours(0, 0, 0, 0);
        aFilters.push(new Filter({
          path: "createdOn",
          test: value => {
            if (!value) return false;
            const v = new Date(value).setHours(0, 0, 0, 0);
            return v === filterDate;
          }
        }));
      }
      if (Array.isArray(oData.status) && oData.status.length) {
        const statusFilters = oData.status.map(key =>
          new Filter("status", FilterOperator.EQ, key)
        );
        aFilters.push(new Filter({ filters: statusFilters, and: false }));
      }

      const oBinding = this.oTable.getBinding("items");
      if (oBinding) {
        oBinding.filter(aFilters);
      }
    },

    clearAllFilters: function () {
      this.getView().getModel("advancedFilterMdl").setData({
        id: "", name: "", designation: "", createdBy: "", createdOn: null, status: []
      });
      const oBinding = this.oTable.getBinding("items");
      if (oBinding) {
        oBinding.filter([]);
      }
    },

    onCreateEmployee: function () {
      this.oRouter.navTo("create_employee", { layout: "TwoColumnsMidExpanded" });
    },

    onChangeCompany: function (oEvent) {
      this.getView().getModel("advancedFilterMdl").setProperty("/designation", oEvent.getSource().getSelectedKey());
    },

    onPressViewTemplate: async function () {
      try {
        this.showLoading(true);
        const payload = {
          employee_id: null,
          payroll_month: null,
          payroll_year: null,
          view_or_download: 1
        };
        const result = await this.restMethodPost(URLConstants.URL.payroll_report, payload);
        if (result) {
          this.loadPrevPDF([result]);
        }
      } catch (err) {
        this.errorHandling(err);
      } finally {
        this.showLoading(false);
      }
    },

    loadPrevPDF: async function (pdfBase64Arr) {
      const { PDFDocument } = PDFLib;
      const contentType = "application/pdf";
      const pdfDocDisp = await PDFDocument.create();

      for (let pdfBase64 of pdfBase64Arr) {
        const blob = this.b64toBlob(pdfBase64, contentType);
        if (!blob) continue;
        const buffer = await blob.arrayBuffer();
        const pdfSrcDoc = await PDFDocument.load(buffer);
        const pages = pdfSrcDoc.getPages();
        for (let i = 0; i < pages.length; i++) {
          const [page] = await pdfDocDisp.copyPages(pdfSrcDoc, [i]);
          pdfDocDisp.insertPage(pdfDocDisp.getPages().length, page);
        }
      }

      const base64String = await pdfDocDisp.saveAsBase64({ dataUri: false });
      const blob = this.b64toBlob(base64String, contentType);
      const blobUrl = URL.createObjectURL(blob);

      jQuery.sap.addUrlWhitelist("blob");
      this._pdfViewer = new PDFViewer({ source: blobUrl });
      this.getView().addDependent(this._pdfViewer);
      this._pdfViewer.open();
    },

    b64toBlob: function (b64Data, contentType = '', sliceSize = 512) {
      if (b64Data.startsWith("data:")) {
        b64Data = b64Data.split(",")[1];
      }
      b64Data = b64Data.replace(/\s/g, "");
      let byteChars;
      try {
        byteChars = atob(b64Data);
      } catch (e) {
        console.error("Invalid base64:", e, b64Data.substring(0, 50));
        return null;
      }
      const byteArrays = [];
      for (let offset = 0; offset < byteChars.length; offset += sliceSize) {
        const slice = byteChars.slice(offset, offset + sliceSize);
        const byteNumbers = Array.from(slice, c => c.charCodeAt(0));
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      return new Blob(byteArrays, { type: contentType });
    }
  });
});
