sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/btp/myUI5App/controller/BaseController",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("sap.btp.myUI5App.controller.Admin", {
      onInit: function () {
        const db = firebase.firestore();
        const requestsRef = db
          .collection("requests")
          .where("status", "==", "Approved");
        const oRequests = {
          requests: [],
        };

        const requestModel = new JSONModel(oRequests);

        this.getView().setModel(requestModel);

        this.getRealTimeRequests(requestsRef);
      },
      getRealTimeRequests: function (requestsRef) {
        requestsRef.onSnapshot((snapshot) => {
          const requestsModel = this.getView().getModel();
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
          this.getView().getModel().refresh(true);
          this.getView()
            .byId("adminRequestTable")
            .getBinding("items")
            .refresh();
        });
      },
    });
  }
);
