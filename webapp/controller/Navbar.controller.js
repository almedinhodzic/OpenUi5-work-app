// Controller for navigation, but only there is sign out button, where user can log out from his account, and will be redirected to the home page.
sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("sap.btp.myUI5App.controller.Navbar", {
    onSignOutPress: function () {
      firebase.auth().signOut();
      this.getRouter().navTo("home");
    },
  });
});
