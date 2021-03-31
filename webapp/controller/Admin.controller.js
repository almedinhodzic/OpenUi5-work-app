// In this controller we make model for Admin view, where we display only
// Approved requests after supervisor's check. Admin will get email about approved request and he is ready to make documentation for travel
// Model will refresh automatically on every change in firestore, and admin has realtime updates
// on requests.
sap.ui.define(
  ["sap/btp/myUI5App/controller/BaseController", "sap/ui/model/json/JSONModel"],
  function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("sap.btp.myUI5App.controller.Admin", {
      onInit: function () {
        const db = firebase.firestore();
        this.oView = this.getView();
        const requestsRef = db
          .collection("requests")
          .where("status", "==", "Approved");
        const oRequests = {
          requests: [],
        };

        const requestModel = new JSONModel(oRequests);

        this.oView.setModel(requestModel);

        this.getRealTimeRequests(requestsRef);
      },
      getRealTimeRequests: function (requestsRef) {
        requestsRef.onSnapshot((snapshot) => {
          const requestsModel = this.oView.getModel();
          const requestsData = requestsModel.getData();
          snapshot.docChanges().forEach((change) => {
            const oRequest = change.doc.data();
            oRequest.id = change.doc.id;
            if (change.type === "added") {
              requestsData.requests.push(oRequest);
            } else if (change.type === "modified") {
              const index = requestsData.requests
                .map((request) => {
                  return request.id;
                })
                .indexOf(oRequest.id);
              requestsData.requests[index] = oRequest;
            } else if (change.type === "removed") {
              const index = requestsData.requests
                .map((request) => {
                  return request.id;
                })
                .indexOf(oRequest.id);
              requestsData.requests.splice(index, 1);
            }
          });
          this.oView.getModel().refresh(true);
          this.oView.byId("adminRequestTable").getBinding("items").refresh();
        });
      },
      onPress: function (oEvent) {
        let oItem, oCtx;
        oItem = oEvent.getSource();
        oCtx = oItem.getBindingContext();
        this.getRouter().navTo("documentation", {
          docId: oCtx.getProperty("reqId"),
          reqId: oCtx.getProperty("id"),
        });
      },
    });
  }
);
