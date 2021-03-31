sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("sap.btp.myUI5App.controller.Navbar", {
    onSignOutPress: function () {
      firebase.auth().signOut();
      this.getRouter().navTo("home");
    },
  });
});
