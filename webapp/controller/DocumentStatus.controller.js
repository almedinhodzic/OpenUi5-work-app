sap.ui.define(
  [
    "sap/btp/myUI5App/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
  ],
  function (BaseController, JSONModel, BusyIndicator) {
    "use strict";

    return BaseController.extend("sap.btp.myUI5App.controller.DocumentStatus", {
      onInit: function () {
        BusyIndicator.show(0);
        this.db = firebase.firestore();
        this.oView = this.getView();
        const oRouter = this.getRouter();
        oRouter
          .getRoute("documentStatus")
          .attachMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: async function (oEvent) {
        const oArgs = oEvent.getParameter("arguments").docId;
        console.log(oArgs);
        this.oArgs = oArgs;
        const documentationRef = this.db.collection("documentation").doc(oArgs);
        this.documentationRef = documentationRef;

        const oDocument = {
          document: {},
        };
        const docModel = new JSONModel(oDocument);
        this.oView.setModel(docModel);
        this.onDataRefresh(documentationRef);
      },
      onDataRefresh: function (documentationRef) {
        documentationRef.onSnapshot((docSnap) => {
          const docModel = this.oView.getModel();
          const docData = docModel.getData();
          docData.document = docSnap.data();
          this.document = docData.document;
          console.log(docData.document);
          this.getView().getModel().refresh(true);
          BusyIndicator.hide();
        });
      },
    });
  }
);
