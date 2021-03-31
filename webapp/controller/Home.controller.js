sap.ui.define(
  ["sap/btp/myUI5App/controller/BaseController", "sap/m/MessageBox"],
  function (BaseController, MessageBox) {
    "use strict";

    return BaseController.extend("sap.btp.myUI5App.controller.Home", {
      onInit: function () {
        this.db = firebase.firestore();
      },
      onLoginClick: async function () {
        const sEmail = this.getView().byId("login-email").getValue();
        const sPassword = this.getView().byId("login-password").getValue();
        console.log(sEmail, sPassword);
        try {
          const userCredential = await firebase
            .auth()
            .signInWithEmailAndPassword(sEmail, sPassword);
          const user = userCredential.user;
          const userRef = this.db.collection("users").doc(user.uid);
          const userData = await userRef.get();
          const role = userData.data().role;
          this.getRouter().navTo(role);
        } catch (error) {
          MessageBox.error(error.message);
        }
        this.getView().byId("login-email").setValue("");
        this.getView().byId("login-password").setValue("");
      },
      onRegisterClick: async function () {
        const sEmail = this.getView().byId("register-email").getValue();
        const sPassword = this.getView().byId("register-password").getValue();
        const sFirstName = this.getView().byId("register-name").getValue();
        const sLastName = this.getView().byId("register-lastName").getValue();
        const sRole = this.getView().byId("register-role").getSelectedKey();
        if (
          sEmail &&
          sPassword &&
          sFirstName &&
          sLastName &&
          sRole !== "Empty"
        ) {
          try {
            const userCredential = await firebase
              .auth()
              .createUserWithEmailAndPassword(sEmail, sPassword);
            const user = userCredential.user;
            await this.db.collection("users").doc(user.uid).set({
              name: sFirstName,
              lastName: sLastName,
              role: sRole,
            });
            this.getRouter().navTo(sRole);
            this.getView().byId("register-email").setValue("");
            this.getView().byId("register-password").setValue("");
            this.getView().byId("register-name").setValue("");
            this.getView().byId("register-lastName").setValue("");
            this.getView().byId("register-role").setSelectedKey("Empty");
          } catch (error) {
            MessageBox.error(error.message);
          }
        } else {
          MessageBox.warning("All fields are required!");
        }
      },
    });
  }
);
