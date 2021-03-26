sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
  ],
  function (Controller, UIComponent, History) {
    "use strict";

    return Controller.extend("sap.btp.myUI5App.controller.BaseController", {
      getRouter: function () {
        return UIComponent.getRouterFor(this);
      },
      onNavBack: function () {
        let oHistory, sPreviousHash;

        oHistory = History.getInstance();
        sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          this.getRouter().navTo("login", {}, true /*no history*/);
        }
      },
    });
  }
);
