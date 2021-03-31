sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("sap.btp.myUI5App.controller.App", {
    onInit: function () {
      const db = firebase.firestore();
      const oRouter = this.getRouter();
      oRouter.attachRouteMatched(async function (oEvent) {
        const sRouteName = oEvent.getParameter("name");
        await firebase.auth().onAuthStateChanged(async (user) => {
          if (user) {
            const usersRef = db.collection("users").doc(user.uid);
            const userData = await usersRef.get();
            // TODO: Navigation without dashboard
            const userRole = userData.data().role;
            if (sRouteName === "home" && user) {
              oRouter.navTo(userRole);
            }
            if (
              (sRouteName === "supervisor" || sRouteName === "review") &&
              userRole !== "supervisor"
            ) {
              oRouter.navTo(userRole);
            }
            if (
              (sRouteName === "admin" || sRouteName === "documentation") &&
              userRole !== "admin"
            ) {
              oRouter.navTo(userRole);
            }
          } else {
            if (
              sRouteName === "user" ||
              sRouteName === "documentStatus" ||
              sRouteName === "supervisor" ||
              sRouteName === "review" ||
              sRouteName === "admin" ||
              sRouteName === "documentation"
            ) {
              oRouter.navTo("home");
            }
          }

          if (
            (sRouteName === "user" || sRouteName === "documentStatus") &&
            userRole !== "user"
          ) {
            oRouter.navTo(userRole);
          }
        });
      });
    },
  });
});
