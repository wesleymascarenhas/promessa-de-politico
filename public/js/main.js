moment.lang('pt-br');

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
  },
  getPromises: function(data) {
    var promises = data.promises;
    _.each(promises, function(promise) {
      promise.politicianSlug = data.politician ? data.politician.slug: null;
      if(data.priorityVotesByPromise && data.priorityVotesByPromise[promise.id]) {
        promise.voted = true;
      }
      if(data.totalPriorityVotesByPromise && data.totalPriorityVotesByPromise[promise.id]) {
        promise.totalVotes = data.totalPriorityVotesByPromise[promise.id];
      }
      if(data.totalEvidencesByPromise && data.totalEvidencesByPromise[promise.id]) {
        promise.totalEvidences = data.totalEvidencesByPromise[promise.id];
      }
      if(data.totalCommentsByPromise && data.totalCommentsByPromise[promise.id]) {
        promise.totalComments = data.totalCommentsByPromise[promise.id];
      }
    });
    return promises;
  }
}