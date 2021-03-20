sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent"],
  function (Controller, UIComponent) {
    "use strict";

    return Controller.extend("sap.btp.myUI5App.controller.BaseController", {
      getRouter: function () {
        return UIComponent.getRouterFor(this);
      },
      db: function () {
        return firebase.firestore();
      },
    });
  }
);
