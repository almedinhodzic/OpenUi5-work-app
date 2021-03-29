sap.ui.define(
  [
    "sap/btp/myUI5App/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
  ],
  function (BaseController, JSONModel, BusyIndicator, MessageBox) {
    "use strict";

    return BaseController.extend("sap.btp.myUI5App.controller.Documentation", {
      onInit: function () {
        this.db = firebase.firestore();
        this.oView = this.getView();
        const oRouter = this.getRouter();
        oRouter
          .getRoute("documentation")
          .attachMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: async function (oEvent) {
        BusyIndicator.show(0);
        const oArgs = oEvent.getParameter("arguments").docId;
        console.log(oArgs);
        this.oArgs = oArgs;
        const documentationRef = this.db.collection("documentation").doc(oArgs);
        const reqId = oEvent.getParameter("arguments").reqId;
        const requestRef = this.db.collection("requests").doc(reqId);
        console.log(reqId);
        this.requestRef = requestRef;
        this.documentationRef = documentationRef;
        const doc = await documentationRef.get();
        this.document = doc.data();
        documentationRef.onSnapshot((docSnap) => {
          const oDocument = {
            document: docSnap.data(),
          };
          const docModel = new JSONModel(oDocument);
          this.oView.setModel(docModel);
          BusyIndicator.hide();
        });
      },
      onHotelReservationFinish: async function () {
        const sHotelName = this.oView.byId("hotel-name").getValue();
        const sHotelAddress = this.oView.byId("hotel-address").getValue();
        const sHotelStreetNum = this.oView.byId("hotel-street-num").getValue();
        await this.documentationRef.update({
          hotelName: sHotelName,
          hotelAddress: sHotelAddress,
          hotelStreetNum: sHotelStreetNum,
          hotelStatus: "Finished",
          hotelReservationInProgress: false,
        });
        console.log("done");
      },
      onTransportReservationFinish: async function () {
        const sTransport = this.oView.byId("transport").getSelectedKey();
        await this.documentationRef.update({
          typeOfTransport: sTransport,
          transportReservationInProgress: false,
          transportStatus: "Finished",
        });
        console.log("done");
				console.log(this.document);
				
      },
      onInsuranceReservationFinish: async function () {
        const sInsurance = this.oView.byId("insurance-company").getValue();
        await this.documentationRef.update({
          insuranceCompany: sInsurance,
          insuranceReservationInProgress: false,
          insuranceStatus: "Finished",
        });
        console.log("done");
      },
      onPaperWorkUpload: async function () {
        await this.documentationRef.update({
          paperWorkStatus: "Finished",
          documentationUploadInProgress: false,
        });
        console.log("done");
      },
      onPayment: async function () {
        const bHotelPayment = this.getView().byId("hotel-payment").getState();
        console.log(this.document);
        if (
          !this.document.transportReservationInProgress &&
          !this.document.insuranceReservationInProgress &&
          !this.document.hotelReservationInProgress
        ) {
          await this.documentationRef.update({
            hotelPaid: bHotelPayment,
            insurancePaid: true,
            transportPaid: true,
            paymentInProgress: false,
          });
          console.log("done");
        } else {
          console.log("cant");
        }
      },
      onFinish: async function () {
        if (
          !this.document.transportReservationInProgress &&
          !this.document.insuranceReservationInProgress &&
          !this.document.hotelReservationInProgress &&
          !this.document.paymentInProgress &&
          !this.document.documentationUploadInProgress
        ) {
          await this.documentationRef.update({
            documentationStatus: "Finished",
          });
          await this.requestRef.update({
            documentation: "Finished",
          });
          this.getRouter().navTo("admin");
        } else {
          MessageBox.error("You have to prepare everything before action!");
        }
      },
    });
  }
);
