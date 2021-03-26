sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/btp/myUI5App/controller/BaseController"],
  function (Controller, BaseController) {
    "use strict";

    return BaseController.extend("sap.btp.myUI5App.controller.Review", {
      onInit: function () {
        var oRouter = this.getRouter();
        oRouter.getRoute("review").attachMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function (oEvent) {
        var oArgs, oView;
        oArgs = oEvent.getParameter("arguments").requestId;
        console.log(oArgs);
        oView = this.getView();

        oView.bindElement({
          path: "/requests" + oArgs,
          events: {
            change: this._onBindingChange.bind(this),
            dataRequested: function (oEvent) {
              oView.setBusy(true);
            },
            dataReceived: function (oEvent) {
              oView.setBusy(false);
            },
          },
        });
      },
      _onBindingChange: function (oEvent) {
        // No data for the binding
        if (!this.getView().getBindingContext()) {
          this.getRouter().getTargets().display("notFound");
        }
      },
    });
  }
);
