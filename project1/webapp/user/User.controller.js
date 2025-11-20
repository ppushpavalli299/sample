sap.ui.define([
  "project1/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "project1/utils/URLConstants",
  "sap/m/MessageBox",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast",
  "sap/ui/core/HTML",
  "sap/ui/Device",
  "project1/utils/Formatter",
  "sap/m/PDFViewer"
], function (
  BaseController,
  JSONModel,
  URLConstants,
  MessageBox,
  Filter,
  FilterOperator,
  MessageToast,
  HTML,
  Device,
  Formatter,
  PDFViewer
) {
  "use strict";

  return BaseController.extend("project1.user.User", {
    formatter: Formatter,

    onInit: function () {
      this.oRouter = this.getOwnerComponent().getRouter();
      this.oRouter.getRoute("user").attachMatched(this._onRouteMatched, this);
      this.oTable = this.byId("tableId_users");

      this.getView().setModel(
        new JSONModel({
          id: "",
          name: "",
          designation: "",
          createdBy: "",
          createdOn: null,
          status: []
        }),
        "advancedFilterMdl"
      );

      this.getView().setModel(new JSONModel({ messages: [] }), "messageModel");
    },

    _onRouteMatched: function () {
      // setup masterdataMdl and employeeMdl
      this.getView().setModel(
        new JSONModel({
          status: [
            { key: "1", text: "Draft" },
            { key: "2", text: "Active" },
            { key: "3", text: "InActive" }
          ]
        }),
        "masterdataMdl"
      );

      this.getView().setModel(
        new JSONModel([
          { id: "Manager", name: "Manager" },
          { id: "Developer", name: "Developer" },
          { id: "Software Engineer", name: "Software Engineer" },
          { id: "Tester", name: "Tester" },
          { id: "HR", name: "HR" }
        ]),
        "employeeMdl"
      );

      this.fetchUser();
    },

    fetchUser: async function () {
      const path = URLConstants.URL.user_filter;
      const reqData = { showAll: true, pageNumber: 1, pageSize: 100 };

      try {
        this.showLoading(true);
        const res = await this.restMethodPost(path, reqData);
        const users = res?.data ?? res ?? [];

        users.forEach((u) => {
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

    onListItemPress: function (oEvent) {
      const oItem = oEvent.getParameter("listItem");
      const oCtx = oItem.getBindingContext("userMdl");
      if (oCtx) {
        const oEmp = oCtx.getObject();
        this.oRouter.navTo("userdetail", {
          layout: "TwoColumnsMidExpanded",
          id: oEmp.id
        });
      }
    },

    onSearch: function () {
      const oData = this.getView().getModel("advancedFilterMdl").getData();
      const oMsgModel = this.getView().getModel("messageModel");
      const aMessages = [];

      // ---- VALIDATION ----
      if (!oData.id) {
        aMessages.push({ type: "Error", title: "Please enter ID", description: "ID is mandatory." });
      }
      if (!oData.name) {
        aMessages.push({ type: "Error", title: "Please enter Name", description: "Name is mandatory." });
      }
      if (!oData.designation) {
        aMessages.push({ type: "Error", title: "Please select Designation", description: "Designation is required." });
      }

      oMsgModel.setProperty("/messages", aMessages);

      if (aMessages.length > 0) {
        this._autoOpenMessagePopover();
        return;
      }

      this._applyTableFilters(oData);
    },

    _applyTableFilters: function (oData) {
      const aFilters = [];

      if (oData.id) {
        const i = parseInt(oData.id, 10);
        if (!isNaN(i)) aFilters.push(new Filter("id", FilterOperator.EQ, i));
      }
      if (oData.name) aFilters.push(new Filter("name", FilterOperator.Contains, oData.name));
      if (oData.designation) aFilters.push(new Filter("designation", FilterOperator.EQ, oData.designation));
      if (oData.createdBy) aFilters.push(new Filter("createdBy", FilterOperator.Contains, oData.createdBy));

      if (oData.createdOn instanceof Date && !isNaN(oData.createdOn)) {
        const filterDate = new Date(oData.createdOn).setHours(0, 0, 0, 0);
        aFilters.push(new Filter({
          path: "createdOn",
          test: function (value) {
            if (!value) return false;
            const v = new Date(value).setHours(0, 0, 0, 0);
            return v === filterDate;
          }
        }));
      }

      if (Array.isArray(oData.status) && oData.status.length) {
        const statusFilters = oData.status.map((key) => new Filter("status", FilterOperator.EQ, key));
        aFilters.push(new Filter({ filters: statusFilters, and: false }));
      }

      const oBinding = this.oTable.getBinding("items");
      if (oBinding) oBinding.filter(aFilters);
    },

    _autoOpenMessagePopover: function () {
      // Auto-open popover from footer button
      const oButton = this.byId("messagePopoverBtn");
      if (oButton) this._openMessagePopover(oButton);
    },

    // **Fixed method: removed getFooter() check**
    _openMessagePopover: function (oSource) {
      if (!this._oMessagePopover) {
        this._oMessagePopover = sap.ui.xmlfragment("project1.view.fragments.MessagePopover", this);
        this.getView().addDependent(this._oMessagePopover);
      }
      this._oMessagePopover.openBy(oSource);
    },

    onMessagePopoverPress: function (oEvent) {
      this._openMessagePopover(oEvent.getSource());
    },

    clearAllFilters: function () {
      this.getView().getModel("advancedFilterMdl").setData({
        id: "",
        name: "",
        designation: "",
        createdBy: "",
        createdOn: null,
        status: []
      });

      const oBinding = this.oTable.getBinding("items");
      if (oBinding) oBinding.filter([]);
    },

    onCreateUser: function () {
      this.oRouter.navTo("createUser", { layout: "TwoColumnsMidExpanded" });
    },

    onChangeCompany: function (oEvent) {
      this.getView().getModel("advancedFilterMdl").setProperty("/designation", oEvent.getSource().getSelectedKey());
    },

    onPressViewTemplate: async function (oEvent) {
      try {
        this.showLoading(true);
        const oButton = oEvent.getSource();
        const oContext = oButton.getBindingContext("userMdl");
        const oUser = oContext.getObject();

        const payload = {
          employee_id: oUser.id,
          payroll_month: null,
          payroll_year: null,
          view_or_download: 1
        };

        const result = await this.restMethodPost(URLConstants.URL.payroll_report, payload);

        if (result) this.loadPrevPDF([result]);
        else MessageToast.show("No PDF data received.");
      } catch (err) {
        this.errorHandling(err);
      } finally {
        this.showLoading(false);
      }
    },

    // loadPrevPDF: async function (pdfBase64Arr) {
    //   const contentType = "application/pdf";
    //   const base64String = pdfBase64Arr[0];
    //   const blob = this.b64toBlob(base64String, contentType);
    //   if (!blob) return MessageToast.show("Invalid PDF data.");

    //   const blobUrl = URL.createObjectURL(blob);
    //   jQuery.sap.addUrlWhitelist("blob");

    //   if (!this._pdfViewer) {
    //     this._pdfViewer = new sap.m.Dialog({
    //       title: "Payslip PDF",
    //       contentWidth: "100%",
    //       contentHeight: "100%",
    //       stretch: true, // <-- makes the Dialog fullscreen
    //       resizable: true,
    //       draggable: false,
    //       content: [
    //         new sap.ui.core.HTML({
    //           content: `<iframe src="${blobUrl}" width="100%" height="100%" style="border:none;"></iframe>`
    //         })
    //       ],
    //       endButton: new sap.m.Button({
    //         text: "Close",
    //         press: () => this._pdfViewer.close()
    //       })
    //     });
    //     this.getView().addDependent(this._pdfViewer);
    //   } else {
    //     this._pdfViewer.getContent()[0].setContent(
    //       `<iframe src="${blobUrl}" width="100%" height="100%" style="border:none;"></iframe>`
    //     );
    //   }

    //   this._pdfViewer.open();
    // },

    // b64toBlob: function (b64Data, contentType = "", sliceSize = 512) {
    //   if (b64Data.startsWith("data:")) b64Data = b64Data.split(",")[1];
    //   b64Data = b64Data.replace(/\s/g, "");
    //   let byteChars;
    //   try {
    //     byteChars = atob(b64Data);
    //   } catch (e) {
    //     console.error("Invalid base64:", e, b64Data.substring(0, 50));
    //     return null;
    //   }

    //   const byteArrays = [];
    //   for (let offset = 0; offset < byteChars.length; offset += sliceSize) {
    //     const slice = byteChars.slice(offset, offset + sliceSize);
    //     const byteNumbers = new Array(slice.length);
    //     for (let i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i);
    //     byteArrays.push(new Uint8Array(byteNumbers));
    //   }

    //   return new Blob(byteArrays, { type: contentType });
    // },
     loadPrevPDF: async function (pdfs) {
            const { PDFDocument } = PDFLib;
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


    // *** ERROR HANDLING METHOD ADDED TO FIX THE ERROR ***
    // errorHandling: function (error) {
    //   MessageBox.error(error.message || "An unexpected error occurred.");
    //   console.error(error);
    // }

  });
});
