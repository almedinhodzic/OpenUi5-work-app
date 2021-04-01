// Controller for home page where we can register new account and assing role to it. If already have an account, we can simply login with email and password, and will be redirected to the dashboard
sap.ui.define(
  [
    "sap/btp/myUI5App/controller/BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
  ],
  function (BaseController, MessageBox, MessageToast) {
    "use strict";

    return BaseController.extend("sap.btp.myUI5App.controller.Home", {
      onInit: function () {
        this.oView = this.oView;
        this.db = firebase.firestore();
      },
      onLoginClick: async function () {
        const sEmail = this.oView.byId("login-email").getValue();
        this.sEmail = sEmail;
        const sPassword = this.oView.byId("login-password").getValue();
        try {
          const userCredential = await firebase
            .auth()
            .signInWithEmailAndPassword(sEmail, sPassword);
          MessageToast.show("Successfully logged in");
          const user = userCredential.user;
          const userRef = this.db.collection("users").doc(user.uid);
          const userData = await userRef.get();
          const role = userData.data().role;
          this.getRouter().navTo(role);
        } catch (error) {
          MessageBox.error(error.message);
        }
        this.oView.byId("login-email").setValue("");
        this.oView.byId("login-password").setValue("");
      },
      onRegisterClick: async function () {
        const sEmail = this.oView.byId("register-email").getValue();
        const sPassword = this.oView.byId("register-password").getValue();
        const sFirstName = this.oView.byId("register-name").getValue();
        const sLastName = this.oView.byId("register-lastName").getValue();
        const sRole = this.oView.byId("register-role").getSelectedKey();
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
              email: sEmail,
            });
            MessageToast.show("Successfully created an account");
            this.getRouter().navTo(sRole);
            this.oView.byId("register-email").setValue("");
            this.oView.byId("register-password").setValue("");
            this.oView.byId("register-name").setValue("");
            this.oView.byId("register-lastName").setValue("");
            this.oView.byId("register-role").setSelectedKey("Empty");
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
