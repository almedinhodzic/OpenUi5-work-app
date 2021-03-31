// Here we initialize firebase to our project, and call it in base controller
sap.ui.define(["sap/ui/model/json/JSONModel"], function (JSONModel) {
  "use strict";
  const firebaseConfig = {
    apiKey: "AIzaSyBzzRrFZJIXvKh_ttgprbmDmSKAxS2MpLU",
    authDomain: "web-test-3f5f7.firebaseapp.com",
    projectId: "web-test-3f5f7",
    storageBucket: "web-test-3f5f7.appspot.com",
    messagingSenderId: "525966079302",
    appId: "1:525966079302:web:5f883d6fc0fec877df6147",
  };
  return {
    initializeFirebase: function () {
      firebase.initializeApp(firebaseConfig);

      const firestore = firebase.firestore();
      const oFirebase = {
        firestore: firestore,
      };

      // model
      const fbModel = new JSONModel(oFirebase);
      return fbModel;
    },
  };
});
