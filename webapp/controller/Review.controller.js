sap.ui.define(
  [
    "sap/btp/myUI5App/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Text",
  ],
  function (
    BaseController,
    JSONModel,
    Dialog,
    DialogType,
    Button,
    ButtonType,
    Text
  ) {
    "use strict";

    return BaseController.extend("sap.btp.myUI5App.controller.Review", {
      onInit: function () {
        this.db = firebase.firestore();
        this.oView = this.getView();
        const oRouter = this.getRouter();
        oRouter.getRoute("review").attachMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: async function (oEvent) {
        const oArgs = oEvent.getParameter("arguments").requestId;
        console.log(oArgs);
        this.oArgs = oArgs;
        const requestRef = this.db.collection("requests").doc(oArgs);
        this.requestRef = requestRef;
        const doc = await requestRef.get();
        console.log(doc.data());
        const request = doc.data();
        console.log(request.reqId);
        this.id = request.reqId;
        this.fullName = request.fullName;
        this.destination = request.destination;
        this.dateRange = request.dateRange;
        this.email = request.email;
        if (request === undefined) {
          this.getRouter().navTo("notFound");
        } else {
          const oRequest = {
            request,
          };
          const requestModel = new JSONModel(oRequest);
          this.oView.setModel(requestModel);
        }
      },
      onApprove: async function () {
        await this.requestRef.update({
          status: "Approved",
          documentation: "Preparing",
        });
        const newDocument = this.db.collection("documentation").doc(this.id);
        await newDocument.set({
          fullName: this.fullName,
          destination: this.destination,
          dateRange: this.dateRange,
          email: this.email,
          documentationStatus: "Preparing",
          hotelName: "",
          hotelAddress: "",
          hotelStreetNum: "",
          hotelPaid: false,
          hotelReservationInProgress: true,
          hotelStatus: "Preparing",
          typeOfTransport: "",
          transportPaid: false,
          transportStatus: "Preparing",
          transportReservationInProgress: true,
          insuranceCompany: "",
          insurancePaid: false,
          insuranceStatus: "Preparing",
          paperWorkStatus: "Preparing",
          insuranceReservationInProgress: true,
          documentationStatus: "Preparing",
          documentationUploadInProgress: true,
        });
        this.getRouter().navTo("supervisor");
      },
      onReject: async function () {
        await this.requestRef.update({
          status: "Rejected",
        });
        this.getRouter().navTo("supervisor");
      },
      onApproveDialogPress: function () {
        if (!this.oApproveDialog) {
          this.oApproveDialog = new Dialog({
            type: DialogType.Message,
            title: "Confirm",
            content: new Text({
              text:
                "Are you sure you want to approve this request? Emails will be send to the user who requested travel and administrator to start preparing all needed documentation.",
            }),
            beginButton: new Button({
              type: ButtonType.Emphasized,
              text: "Confirm",
              press: function () {
                this.onApprove();
                this.oApproveDialog.close();
              }.bind(this),
            }),
            endButton: new Button({
              text: "Cancel",
              press: function () {
                this.oApproveDialog.close();
              }.bind(this),
            }),
          });
        }

        this.oApproveDialog.open();
      },
      onRejectDialogPress: function () {
        if (!this.oApproveDialog) {
          this.oApproveDialog = new Dialog({
            type: DialogType.Message,
            title: "Confirm",
            content: new Text({
              text:
                "Are you sure you want to reject this request? Email will be send to user with rejection message.",
            }),
            beginButton: new Button({
              type: ButtonType.Emphasized,
              text: "Confirm",
              press: function () {
                this.onReject();
                this.oApproveDialog.close();
              }.bind(this),
            }),
            endButton: new Button({
              text: "Cancel",
              press: function () {
                this.oApproveDialog.close();
              }.bind(this),
            }),
          });
        }

        this.oApproveDialog.open();
      },
    });
  }
);
