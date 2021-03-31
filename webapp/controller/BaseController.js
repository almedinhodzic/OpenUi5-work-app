// This is the Base controller for our project. In every other controller, we inherit functions from our base controller, which make functions reusable in many places.
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
  ],
  function (Controller, UIComponent, History) {
    "use strict";

    return Controller.extend("sap.btp.myUI5App.controller.BaseController", {
      // Router function
      getRouter: function () {
        return UIComponent.getRouterFor(this);
      },
      onNavBack: function () {
        // Navigation to go back
        let oHistory, sPreviousHash;

        oHistory = History.getInstance();
        sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          this.getRouter().navTo("home", {}, true /*no history*/);
        }
      },
    });
  }
);
