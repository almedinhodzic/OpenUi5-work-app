sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel"],
  function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("sap.btp.myUI5App.controller.App", {
      onInit: function () {
        const oRouter = this.getRouter();
        oRouter.attachRouteMatched(async function (oEvent) {
          const sRouteName = oEvent.getParameter("name");
          await firebase.auth().onAuthStateChanged((user) => {
            if (sRouteName === "login" && user) {
              oRouter.navTo("dashboard");
            }
            if (sRouteName === "dashboard" && !user) {
              oRouter.navTo("login");
            }
          });
        });
      },
    });
  }
);
