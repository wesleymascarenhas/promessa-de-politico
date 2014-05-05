window.viewHelpers = {
  getPromiseStateCssClass: function(state, button) {
    var cssClasss = null;
    if(state === "NONE") {
      if(button === true) {
        cssClasss = "none";
      } else {
        cssClasss = "default"
      }
    } else if(state === "STARTED") {
      cssClasss = "warning";
    } else if(state === "FULFILLED") {
      cssClasss = "success";
    } else {
      cssClasss = "danger";
    }
    return cssClasss;
  },
  getPromiseStateLabel: function(state) {
    console.log(state);
    var label = null;
    if(state === "NONE") {
      label = "Sem informação";
    } else if(state === "STARTED") {
      label = "Iniciada";
    } else if(state === "FULFILLED") {
      label = "Cumprida";
    } else {
      label = "Descartada";
    }
    return label;
  }
}