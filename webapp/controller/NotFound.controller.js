// Empty controller for notFound Page, but if we want to add some logic later, we can use it.
sap.ui.define(
  ["sap/btp/myUI5App/controller/BaseController"],
  function (BaseController) {
    "use strict";

    return BaseController.extend("sap.btp.myUI5App.controller.NotFound", {
      onInit: function () {},
    });
  }
);
