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
        BusyIndicator.show(0);
        this.db = firebase.firestore();
        this.oView = this.getView();
        const oRouter = this.getRouter();
        oRouter
          .getRoute("documentation")
          .attachMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: async function (oEvent) {
        const oArgs = oEvent.getParameter("arguments").docId;
        console.log(oArgs);
        this.oArgs = oArgs;
        const documentationRef = this.db.collection("documentation").doc(oArgs);
        const reqId = oEvent.getParameter("arguments").reqId;
        const requestRef = this.db.collection("requests").doc(reqId);
        console.log(reqId);
        this.requestRef = requestRef;
        this.documentationRef = documentationRef;
        // const doc = await documentationRef.get();
        // this.document = doc.data();
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
      onHotelReservationFinish: async function () {
        const sHotelName = this.oView.byId("hotel-name").getValue();
        const sHotelAddress = this.oView.byId("hotel-address").getValue();
        const sHotelStreetNum = this.oView.byId("hotel-street-num").getValue();
        if (sHotelName && sHotelAddress && sHotelStreetNum) {
          await this.documentationRef.update({
            hotelName: sHotelName,
            hotelAddress: sHotelAddress,
            hotelStreetNum: sHotelStreetNum,
            hotelStatus: "Finished",
            hotelReservationInProgress: false,
          });
        } else {
          MessageBox.warning(
            "Please fill all informations about hotel to proceed."
          );
        }
      },
      onHotelReservationReset: async function () {
        await this.documentationRef.update({
          hotelReservationInProgress: true,
        });
      },
      onTransportReservationFinish: async function () {
        const sTransport = this.oView.byId("transport").getSelectedKey();
        if (sTransport !== "Empty") {
          await this.documentationRef.update({
            typeOfTransport: sTransport,
            transportReservationInProgress: false,
            transportStatus: "Finished",
          });
        } else {
          MessageBox.warning("Please choose type of transport.");
        }
      },
      onTransportReservationReset: async function () {
        await this.documentationRef.update({
          transportReservationInProgress: true,
        });
      },
      onInsuranceReservationFinish: async function () {
        const sInsurance = this.oView.byId("insurance-company").getValue();
        if (sInsurance) {
          await this.documentationRef.update({
            insuranceCompany: sInsurance,
            insuranceReservationInProgress: false,
            insuranceStatus: "Finished",
          });
        } else {
          MessageBox.warning("Please type name of Insurance Company");
        }
      },
      onInsuranceReservationReset: async function () {
        await this.documentationRef.update({
          insuranceReservationInProgress: true,
        });
      },
      onPaperWorkUpload: async function () {
        await this.documentationRef.update({
          paperWorkStatus: "Finished",
          documentationUploadInProgress: false,
        });
      },
      onPaperWorkReset: async function () {
        await this.documentationRef.update({
          documentationUploadInProgress: true,
        });
      },
      onPayment: async function () {
        const bHotelPayment = this.getView().byId("hotel-payment").getState();
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
        } else {
          MessageBox.warning("You have to do all reservations first");
        }
      },
      onPaymentReset: async function () {
        await this.documentationRef.update({
          paymentInProgress: true,
        });
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
