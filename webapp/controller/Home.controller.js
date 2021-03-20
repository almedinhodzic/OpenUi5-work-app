sap.ui.define(
  ["sap/btp/myUI5App/controller/BaseController"],
  function (BaseController) {
    "use strict";

    return BaseController.extend("sap.btp.myUI5App.controller.Home", {
      onNavToLogin: function () {
        this.getRouter().navTo("login");
      },
    });
  }
);
