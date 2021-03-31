// In this controller, data is fetched for user with all his requests, and it is shown to him. Only approved requests are clickable and user can track documentation process. User can make new request at any moment, and live changes will be applied with change in database.
sap.ui.define(
  [
    "sap/btp/myUI5App/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator",
  ],
  function (BaseController, JSONModel, Fragment, MessageBox, BusyIndicator) {
    "use strict";

    return BaseController.extend("sap.btp.myUI5App.controller.User", {
      onInit: function () {
        this.oView = this.getView();
        const db = firebase.firestore();
        const fnGetRequestsById = async (user) => {
          if (user) {
            const requestsRef = await db
              .collection("requests")
              .where("userId", "==", user.uid);

            const oRequests = {
              requests: [],
            };

            const requestModel = new JSONModel(oRequests);

            this.oView.setModel(requestModel);

            this.getRealTimeRequests(requestsRef);
          }
        };

        firebase.auth().onAuthStateChanged(fnGetRequestsById);
      },
      getRealTimeRequests: function (requestsRef) {
        BusyIndicator.show(0);
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
          this.oView.byId("requestTable").getBinding("items").refresh();
          BusyIndicator.hide();
        });
      },
      onOpenDialog: function () {
        const oView = this.oView;
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

        const sFullName = this.oView.byId("full-name-input").getValue();
        const sDestination = this.oView.byId("destination-input").getValue();
        const sDateRange = this.oView.byId("date-pick").getValue();
        const fnSetRequest = async (user) => {
          await requestsRef.doc().set({
            fullName: sFullName,
            destination: sDestination,
            userId: user.uid,
            email: user.email,
            dateRange: sDateRange,
            status: "Pending",
            reqId: requestsRef.doc().id,
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
        this.oView.byId("full-name-input").setValue("");
        this.oView.byId("destination-input").setValue("");
        this.oView.byId("date-pick").setValue("");
      },
      onSubmitError: function () {
        this.oView.byId("destination-input").setValueState("Error");
        this.oView.byId("full-name-input").setValueState("Error");
        this.oView.byId("date-pick").setValueState("Error");
      },
      onDestinationChange: function () {
        const sDestination = this.oView.byId("destination-input").getValue();
        if (sDestination === "") {
          this.oView.byId("destination-input").setValueState("Error");
        } else {
          this.oView.byId("destination-input").setValueState("Success");
        }
      },
      onFullNameChange: function () {
        const sFullName = this.oView.byId("full-name-input").getValue();

        if (sFullName === "") {
          this.oView.byId("full-name-input").setValueState("Error");
        } else {
          this.oView.byId("full-name-input").setValueState("Success");
        }
      },
      onDateChange: function () {
        const sDateRange = this.oView.byId("date-pick").getValue();
        if (sDateRange === "") {
          this.oView.byId("date-pick").setValueState("Error");
        } else {
          this.oView.byId("date-pick").setValueState("Success");
        }
      },
      onPress: function (oEvent) {
        let oItem, oCtx;
        oItem = oEvent.getSource();
        oCtx = oItem.getBindingContext();
        this.getRouter().navTo("documentStatus", {
          docId: oCtx.getProperty("reqId"),
        });
      },
    });
  }
);
