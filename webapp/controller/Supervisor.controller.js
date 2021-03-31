// In this controller, supervisor fetch all requests from all users and can click on pending requests and chose to approve or reject them. Rejected requests can be deleted by supervisor, and also will be deleted for user who submitted. Any change in database will be visible for supervisor immediately.
sap.ui.define(
  ["sap/btp/myUI5App/controller/BaseController", "sap/ui/model/json/JSONModel"],
  function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("sap.btp.myUI5App.controller.Supervisor", {
      onInit: function () {
        this.oView = this.oView;
        this.db = firebase.firestore();
        const requestsRef = this.db.collection("requests");
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
          this.oView
            .byId("supervisorRequestTable")
            .getBinding("items")
            .refresh();
        });
      },
      onPress: function (oEvent) {
        let oItem, oCtx;
        oItem = oEvent.getSource();
        oCtx = oItem.getBindingContext();
        this.getRouter().navTo("review", {
          requestId: oCtx.getProperty("id"),
        });
      },
      onItemDelete: async function (oEvent) {
        let oItem, oCtx;
        oItem = oEvent.getSource();
        oCtx = oItem.getBindingContext();
        await this.db
          .collection("requests")
          .doc(oCtx.getProperty("id"))
          .delete();
      },
    });
  }
);
