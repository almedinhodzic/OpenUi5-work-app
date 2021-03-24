sap.ui.define(
  ["sap/btp/myUI5App/controller/BaseController", "sap/m/MessageBox"],
  function (BaseController, MessageBox) {
    "use strict";

    return BaseController.extend("sap.btp.myUI5App.controller.Login", {
      onLoginClick: async function () {
        const sEmail = this.getView().byId("input-email").getValue();
        const sPassword = this.getView().byId("input-pw").getValue();
        console.log(sEmail, sPassword);
        try {
          const user = await firebase
            .auth()
            .signInWithEmailAndPassword(sEmail, sPassword);
          this.getRouter().navTo("dashboard");
        } catch (error) {
          MessageBox.error("Invalid Credentials");
        }
      },
    });
  }
);
