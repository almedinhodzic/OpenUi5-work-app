// In this controller, supervisor fetch request from user, and has 2 choises. He can approve request from user to travel, or reject. If approve, admin we get new request to make documentation, but if he rejects, only user who submitted request will se it. In both cases user will get an email with message about approval or rejection. On approval, admin will get email about it.
sap.ui.define(
  [
    "sap/btp/myUI5App/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Text",
    "sap/m/MessageBox",
  ],
  function (
    BaseController,
    JSONModel,
    Dialog,
    DialogType,
    Button,
    ButtonType,
    Text,
    MessageBox
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
        this.oArgs = oArgs;
        // Get admin mails to send email on request approval
        const usersRef = this.db.collection("users");
        const users = await usersRef.where("role", "==", "admin").get();
        const adminList = [];
        users.forEach((doc) => {
          adminList.push(doc.data().email);
        });
        this.adminList = adminList;
        // Request and informations from it
        const requestRef = this.db.collection("requests").doc(oArgs);

        this.requestRef = requestRef;
        const doc = await requestRef.get();
        if (!doc.exists) {
          console.log("nope");
        }

        const request = doc.data();

        this.id = request.reqId;
        this.fullName = request.fullName;
        this.destination = request.destination;
        this.dateRange = request.dateRange;
        this.email = request.email;

        const oRequest = {
          request,
        };
        const requestModel = new JSONModel(oRequest);
        this.oView.setModel(requestModel);
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
          paymentInProgress: true,
        });
        this.db.collection("mail").add({
          to: this.email,
          template: {
            name: "approval",
            data: {
              fullName: this.fullName,
              destination: this.destination,
              dateRange: this.dateRange,
            },
          },
        });
        this.db.collection("mail").add({
          to: this.adminList,
          template: {
            name: "adminDocs",
            data: {
              fullName: this.fullName,
              destination: this.destination,
              dateRange: this.dateRange,
            },
          },
        });
        this.getRouter().navTo("supervisor");
      },
      onReject: async function () {
        await this.requestRef.update({
          status: "Rejected",
        });
        this.db.collection("mail").add({
          to: this.email,
          template: {
            name: "rejection",
            data: {
              fullName: this.fullName,
              destination: this.destination,
              dateRange: this.dateRange,
            },
          },
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
