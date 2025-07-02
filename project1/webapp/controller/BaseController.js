sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog",
    "sap/ui/model/Filter",
    "sap/m/Button",
    "project1/utils/URLConstants",
    "sap/ui/core/routing/History",
    "sap/ui/core/Element",
    "sap/ui/core/Fragment",
    "sap/m/library",
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/Sorter",
    "sap/ui/Device",
    'sap/m/MessageBox'
], function (Controller,JSONModel,Dialog,Filter,Button, URLConstants,History,Element,Fragment,library,Spreadsheet,Sorter,Device,MessageBox) {
    "use strict";
    return Controller.extend(
        "project1.controller.BaseController",
        {
          onInit: function () {
            //console.log("test")
          },
          getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
          },
          /**
           * Convenience method for getting the view model by name.
           * @public
           * @param {string} [sName] the model name
           * @returns {sap.ui.model.Model} the model instance
           */
          getModel: function (sName) {
            return this.getView().getModel(sName);
          },
  
          /**
           * Convenience method for setting the view model.
           * @public
           * @param {sap.ui.model.Model} oModel the model instance
           * @param {string} sName the model name
           * @returns {sap.ui.mvc.View} the view instance
           */
          setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
          },
  
          /**
           * Getter for the resource bundle.
           * @public
           * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
           */
          getResourceBundle: function (text) {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(text);
          },
         
          showLoading: function (status) {
            this.getView().setBusy(status);
          },
          onDialogOpen: function () {
            this._oDialog.open();
            this._startCounter();
          },
          onDialogClose: function () {
            this._oDialog.close();
            this._stopCounter();
          },
          
          getViewSettingsDialog: function (sDialogFragmentName) {
            var that = this;
            var pDialog = this._mViewSettingsDialogs[sDialogFragmentName];
            if (!pDialog) {
              pDialog = sap.ui.xmlfragment(sDialogFragmentName, that);
              pDialog.setModel(
                new JSONModel(
                  this.getOwnerComponent().getModel("settings").getData()
                ),
                "settings"
              );
              this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
            }
            return pDialog;
          },
          handleSortButtonPressed: function () {
            this.getViewSettingsDialog(
              "com.project1.view.fragment.SortDialog"
            ).open();
          },
  
          handleGroupButtonPressed: function () {
            this.getViewSettingsDialog(
              "com.project1.view.fragment.GroupDialog"
            ).open();
          },
          handlePersoButtonPressed: function () {
            //this.getViewSettingsDialog("com.payroll.payrollapp.view.fragment.TablePersoDialog").open();
            this._persoDialog;
            this._persoDialogTable;
            if (!this._persoDialog) {
              this._persoDialog = sap.ui.xmlfragment(
                "com.project1.fragment.TablePersoDialog",
                this
              );
              this._persoDialog.setModel(
                new JSONModel(
                  this.getOwnerComponent().getModel("settings").getData()
                ),
                "settings"
              );
              this._persoDialogTable = this._persoDialog
                .getCustomTabs()[0]
                .getContent()[0];
            }
            this._persoDialog.open();
          },
          handleGroupDialogConfirm: function (oEvent) {
            var oTable = this._tableId,
              mParams = oEvent.getParameters(),
              oBinding = oTable.getBinding("items"),
              sPath,
              bDescending,
              vGroup,
              aGroups = [];
  
            let gContext = function (oContext) {
              return oContext.getProperty(sPath);
            };
  
            if (mParams.groupItem) {
              sPath = mParams.groupItem.getKey();
              bDescending = mParams.groupDescending;
              //vGroup = this.mGroupFunctions[sPath];
              aGroups.push(new Sorter(sPath, bDescending, gContext));
              // apply the selected group settings
              oBinding.sort(aGroups);
            } else if (this.groupReset) {
              oBinding.sort();
              this.groupReset = false;
            }
          },
          resetGroupDialog: function (oEvent) {
            this.groupReset = true;
          },
          handleTablePersoDialogConfirm: function (oEvent) {
            //Handle Table Perso Confirm functionality
            let oTable = this._tableId,
              pTable = this._persoDialogTable;
  
            this.selItems = pTable.getSelectedItems();
            if (this.selItems && !this.persoReset) {
              let colNames = this.selItems.map((e) =>
                e.getCells()[0].getProperty("text")
              );
              this._tableId.getColumns().forEach((e) => {
                let colName = colNames.some(
                  (e1) => e1 == e.getHeader().getText()
                );
                if (colName) {
                  e.setVisible(true);
                } else {
                  e.setVisible(false);
                }
              });
            } else if (this.persoReset) {
              this._tableId.getColumns().forEach((e) => e.setVisible(true));
              this.persoReset = false;
            }
          },
          resetPersoDialog: function (oEvent) {
            this.persoReset = true;
            this._persoDialogTable.removeSelections();
          },
          onExport: function (columns, dataSource, fileName) {
            //**Export table functionality enabled here**
            let aCols, oSettings, oSheet, oContext;
  
            aCols = columns;
            oContext = {
              sheetName: fileName
            };
  
            oSettings = {
              workbook: {
                columns: aCols,
                context: oContext
              },
              dataSource: dataSource,
              fileName: fileName,
            };
  
            oSheet = new Spreadsheet(oSettings);
            oSheet
              .build()
              .then(function () {
                sap.m.MessageToast.show("Spreadsheet export has finished");
              })
              .finally(function () {
                oSheet.destroy();
              });
          },
         
          setColulmnsIntoModel: function () {
            let oSettingsModel = this.oOwnerComponent.getModel("settings");
            oSettingsModel.getData().columns = this.createColumnConfig();
            oSettingsModel.refresh(true);
          },
          ///************API Calls***********///
          restMethodGet: function (url) {
            let that = this;
            url = URLConstants.URL.app_endPoint + url;
            var deferred = $.Deferred();
           
              $.ajax({
                type: "GET",
                beforeSend: function (xhr) {
                  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
                },
                url: url,
                contentType: "application/json",
                //headers: { "my-token": token },
                success: function (response) {
                  deferred.resolve(response);
                },
                error: function (xhr) {
                  deferred.reject(xhr); //.responseJSON.message);
                  if (xhr && xhr.status == "401") {
                   
                  }
                },
              });
           
            return deferred.promise();
          },
          restMethodPost(url, request) {
            url = URLConstants.URL.app_endPoint + url;
            var deferred = $.Deferred();
            $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(request),
                contentType: "application/json",
                /* headers: {
                  "sessionCookie": this.getStorage("userContext").sessionCookie || null
                }, */
                success: ((response) => {
                    deferred.resolve(response);
                }),
                error: ((xhr) => {
                    deferred.reject(xhr.responseJSON);
                })
            });
            return deferred.promise();
        },
        restMethodPostLogin(url, request)//without cookie
        {
            url = URLConstants.URL.app_endPoint + url;
            var deferred = $.Deferred();
            $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(request),
                contentType: "application/json",
                success: ((response) => {
                    deferred.resolve(response);
                }),
                error: ((xhr) => {
                    deferred.reject(xhr.responseJSON);
                })
            });
            return deferred.promise();
        },
        onNavBack() {
          var oHistory, sPreviousHash;

          oHistory = History.getInstance();
          sPreviousHash = oHistory.getPreviousHash();

          if (sPreviousHash !== undefined) {
              window.history.go(-1);
          } else {
              this.getRouter().navTo("login", {}, true /*no history*/);
          }
      },
      onPressHome() {
        this.getRouter().navTo("dashboard");
    },
    customErrorObject(
      errorMessages,
      pageId,
      oControl,
      description
  ) {
      return {
          type: "Error",
          active: true,
          control: oControl,
          title: errorMessages,
          subTitle: null,
          description: description,
          page: pageId,
      };
  },
  errorMessagePopoverClose() {
    if (this.oPopover != undefined) {
        this.oPopover.close();
    }
},
handleMessagePopoverPress(oEvent) {
  let isDialog = false;
  let oSource;
  if (oEvent?.oSource) {
      oSource = oEvent.getSource();
  } else {
      oSource = oEvent;
  }
  if (!this.oPopover) {
      this.errorMessagePopover(oSource);
  } else {
      this.oPopover.toggle(oSource);
  }
},
//Error Popover Start
async errorMessagePopover(popoverBtn) {
  let oButton = popoverBtn,
      oView = this.getView();

  try {
      if (!this.oPopover) {
          this.oPopover = await this.loadFragment({
              name: "project1.view.ErrorMessage",
          });
          oView.addDependent(this.oPopover);
      }

      this.oPopover.openBy(oButton);
  } catch (error) {
      console.log(error);
  }

},
onActiveTitlePress(oEvent) {
  var getSelItem = oEvent.getParameter("item").getBindingContext("errors").getObject();
  var control = getSelItem.control;
  var oPage = getSelItem.page;
  var oControl = Element.registry.get(control.getId());

  if (oControl) {
      jQuery.sap.delayedCall(500, this, function () {
          oControl.focus();
      });
      if (oControl?.getAccessibilityInfo) {
          var type = oControl?.getAccessibilityInfo()?.type;
      }
      if (type == "Checkbox") {
          var text = oControl.getText();
          var oPopover = new sap.m.Popover({
              showHeader: false,
              placement: "Bottom",
              content: [
                  new sap.m.Text({
                      text: text,
                      width: "auto",
                  }).addStyleClass("sapUiTinyMargin"),
              ],
          });
          oPopover.openBy(oControl);
      }
  }
},
customErrorObject(
  errorMessages,
  pageId,
  oControl,
  description
) {
  return {
      type: "Error",
      active: true,
      control: oControl,
      title: errorMessages,
      subTitle: null,
      description: description,
      page: pageId,
  };
},
    errorHandling(ex, oControl) {
      if (!this.errorData || !ex) {
          this.errorData = [];
      }

      const isInvalidSession = ex?.errorDescription?.includes("301") || ex?.errorDescription?.includes("Invalid Session");

      if (isInvalidSession) {
          sap.m.MessageBox.error(ex.errorDescription, {
              actions: [sap.m.MessageBox.Action.OK],
              emphasizedAction: "OK",
              onClose: () => this.getRouter().navTo('login')
          });
          this.showLoading(false);
          return;
      }

      const eModel = this.getOwnerComponent().getModel("errors");
      const errorTitle = ex?.responseJSON?.errorDescription || ex?.responseJSON?.debugMessage || ex?.errorDescription;

      // Check if the error already exists
      const exists = this.errorData.some(e => e.title === errorTitle);

      if (!exists && ex) {
          const errorObject =
              ex?.responseJSON?.debugMessage ? this.customErrorObject(ex.responseJSON.debugMessage, this.pageId, null, null) :
                  ex?.responseJSON?.errorDescription ? this.customErrorObject(ex.responseJSON.errorDescription, this.pageId, null, null) :
                      ex?.responseJSON?.error ? this.customErrorObject(ex.responseJSON.error, this.pageId, null, null) :
                          ex?.errorDescription || ex?.debugMessage ? this.customErrorObject(ex?.errorDescription || ex?.debugMessage, this.pageId, null, null) :
                              ex?.status ? this.customErrorObject(`${ex.status} ${ex.statusText}`, this.pageId, null, null) :
                                  this.customErrorObject(ex, this.pageId, oControl, null);

          this.errorData.push(errorObject);
      }

      // Merge existing and new error data
      const mergedData = [...(eModel.getData() ?? []), ...this.errorData];
      eModel.setData(mergedData);

      // Show the error message popover if there are errors
      if (mergedData.length) {
          this.errorMessagePopover(this.popoverBtn);
      }

      this.showLoading(false);
  },
        }
      );
});