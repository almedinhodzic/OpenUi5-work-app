sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("sap.btp.myUI5App.controller.User", {
      onInit: function () {
        const db = firebase.firestore();
        const citiesRef = db.collection("requests");

        const fnGetRequestsById = async (user) => {
          const snapshot = await citiesRef
            .where("userId", "==", user.uid)
            .get();
          const requests = await snapshot.docs.map((docRequests) => {
            return docRequests.data();
          });
          console.log(requests);
          const oRequestsModel = {
            requests,
          };
          const oRequests = new JSONModel(oRequestsModel);
          this.getView().setModel(oRequests);
        };
        firebase.auth().onAuthStateChanged(fnGetRequestsById);
      },
    });
  }
);
