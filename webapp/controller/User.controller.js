sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator",
    "sap/f/library",
  ],
  function (
    Controller,
    JSONModel,
    Fragment,
    MessageBox,
    BusyIndicator,
    fioriLibrary
  ) {
    "use strict";

    return Controller.extend("sap.btp.myUI5App.controller.User", {
      onInit: function () {
        this.oView = this.getView();
        const db = firebase.firestore();
        const fnGetRequestsById = async (user) => {
          const requestsRef = await db
            .collection("requests")
            .where("userId", "==", user.uid);

          const oRequests = {
            requests: [],
          };

          const requestModel = new JSONModel(oRequests);

          this.oView.setModel(requestModel);

          this.getRealTimeRequests(requestsRef);
        };

        firebase.auth().onAuthStateChanged(fnGetRequestsById);
      },
      getRealTimeRequests: function (requestsRef) {
        BusyIndicator.show(0);
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
          this.getView().byId("requestTable").getBinding("items").refresh();
          BusyIndicator.hide();
        });
      },
      onOpenDialog: function () {
        const oView = this.getView();
        if (!this.pDialog) {
          this.pDialog = Fragment.load({
            id: oView.getId(),
            name: "sap.btp.myUI5App.view.CreateRequestDialog",
            controller: this,
          }).then((oDialog) => {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this.pDialog.then((oDialog) => {
          oDialog.open();
        });
      },
      onCloseDialog: function () {
        this.byId("requestDialog").close();
      },
      onSubmitRequest: function () {
        const db = firebase.firestore();
        const requestsRef = db.collection("requests");

        const sFullName = this.getView().byId("full-name-input").getValue();
        const sDestination = this.getView()
          .byId("destination-input")
          .getValue();
        const sDateRange = this.getView().byId("date-pick").getValue();
        const fnSetRequest = async (user) => {
          await requestsRef.doc().set({
            fullName: sFullName,
            destination: sDestination,
            userId: user.uid,
            email: user.email,
            dateRange: sDateRange,
            status: "Pending",
            id: requestsRef.doc().id,
          });
        };
        if (sFullName === "" || sDestination === "" || sDateRange === "") {
          MessageBox.warning("All fields are required! Please try again.");
          this.onSubmitError();
        } else {
          firebase.auth().onAuthStateChanged(fnSetRequest);
          MessageBox.success("Your request has been submited!");
          this.onCloseDialog();
        }
      },
      onSubmitError: function () {
        this.getView().byId("destination-input").setValueState("Error");
        this.getView().byId("full-name-input").setValueState("Error");
        this.getView().byId("date-pick").setValueState("Error");
      },
      onDestinationChange: function () {
        const sDestination = this.getView()
          .byId("destination-input")
          .getValue();
        if (sDestination === "") {
          this.getView().byId("destination-input").setValueState("Error");
        } else {
          this.getView().byId("destination-input").setValueState("Success");
        }
      },
      onFullNameChange: function () {
        const sFullName = this.getView().byId("full-name-input").getValue();

        if (sFullName === "") {
          this.getView().byId("full-name-input").setValueState("Error");
        } else {
          this.getView().byId("full-name-input").setValueState("Success");
        }
      },
      onDateChange: function () {
        const sDateRange = this.getView().byId("date-pick").getValue();
        if (sDateRange === "") {
          this.getView().byId("date-pick").setValueState("Error");
        } else {
          this.getView().byId("date-pick").setValueState("Success");
        }
      },
    });
  }
);
