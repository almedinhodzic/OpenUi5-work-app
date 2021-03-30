sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("sap.btp.myUI5App.controller.App", {
    onInit: function () {
      const db = firebase.firestore();
      const oRouter = this.getRouter();
      oRouter.attachRouteMatched(async function (oEvent) {
        const sRouteName = oEvent.getParameter("name");
        await firebase.auth().onAuthStateChanged(async (user) => {
          if (sRouteName === "login" && user) {
            const usersRef = db.collection("users").doc(user.uid);
            const userData = await usersRef.get();
            // TODO: Navigation without dashboard
            console.log(userData.data().role);
            oRouter.navTo("dashboard");
          }
          if (sRouteName === "dashboard" && !user) {
            oRouter.navTo("login");
          }
        });
      });
    },
  });
});
