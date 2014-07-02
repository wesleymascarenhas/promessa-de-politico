angular
  .module("politiciansPromiseApp")
  .controller("alertController", ["$scope", "alertService", function($scope, alertService) {
    $scope.alerts = alertService.getAlerts();
    $scope.closeAlert = alertService.closeAlert;
  }])
  .controller("contactController", ["$scope", "alertService", "userService", function($scope, alertService, userService) {
    $scope.sendEmail = function() {
      NProgress.start();
      userService.sendEmail($scope.name, $scope.email, $scope.subject, $scope.message).then(function(response) {
        alertService.addAlert("success", "E-mail enviado com sucesso, aguarde o nosso contato.");
        $scope.name = "";
        $scope.email = "";
        $scope.subject = "";
        $scope.message = "";
        $scope.contactForm.$setPristine();
      }).catch(function(response) {
        alertService.addAlert("danger", "Erro ao enviar e-mail, por favor tente novamente mais tarde.");
      }).finally(function() {
        NProgress.done();
      });
    }
  }])
  .controller("headerController", ["$scope", "$window", "backendData", "politicianService", "authenticationService", function($scope, $window, backendData, politicianService, authenticationService) {
    $scope.user = authenticationService.getUser();
    $scope.howItWorksActive = backendData.howItWorksActive;
    $scope.contributeActive = backendData.contributeActive;
    $scope.contactActive = backendData.contactActive;
    $scope.authenticate = function() {
      authenticationService.ensureAuth();
    }
    $scope.searchPoliticians = function(value) {
      NProgress.start();
      return politicianService.searchPoliticians(value, ["id", "name", "nickname", "slug"]).then(function(response) {
        NProgress.done();
        var politicians = []
        response.data.data.forEach(function(politician) {
          politician.displayName = politician.name + (politician.nickname ? " (" + politician.nickname + ")" : "");
          politicians.push(politician);
        });
        return politicians;
      });
    };
    $scope.selectPolitician = function(politician) {
      $window.location.href = "/politico/" + politician.slug;
    };
    $scope.isSectionActive = function(section) {
      return true === $scope[section];
    };
  }])
  .controller("politicianController", ["$scope", "$window", "backendData", "dataService", "politicianService", "promiseService", "authenticationService", "alertService", function($scope, $window, backendData, dataService, politicianService, promiseService, authenticationService, alertService) {
    $scope.editedPolitician = {};
    $scope.tabId = "LatestPromises";
    $scope.newPromise = {state: "", evidence_date: moment().toDate(), evidences: [""]};
    $scope.promisePage = 1;
    $scope.editingPolitician = false;
    $scope.registeringPolitician = false;
    $scope.hasMorePromises = true;
    $scope.flowModel = {};
    $scope.flowConfig = {
      target: "/upload/politico",
      singleFile: true,
      query: function(flowFile, flowChunk) {
        return {politician_id: $scope.editedPolitician.id};
      }
    };
    dataService.mergeData(backendData, $scope);

    $scope.hasPermissionToEditPolitician = function() {
      return authenticationService.isUserAuthenticated() && (authenticationService.getUser().permission === "ADMIN" || authenticationService.getUser().id === politician.registeredByUser.id);
    };
    $scope.hasOnePromise = function() {
      return $scope.totalPromises == 1;
    };
    $scope.totalPoliticianUpUsersVotes = function() {
      return "UP" in $scope.totalPoliticianUsersVotes ? $scope.totalPoliticianUsersVotes["UP"] : 0;
    };
    $scope.totalPoliticianDownUsersVotes = function() {
      return "DOWN" in $scope.totalPoliticianUsersVotes ? $scope.totalPoliticianUsersVotes["DOWN"] : 0;
    };
    $scope.incrementTotalPoliticianUsersVotes = function(vote_type) {
      $scope.totalPoliticianUsersVotes[vote_type] = vote_type in $scope.totalPoliticianUsersVotes ? $scope.totalPoliticianUsersVotes[vote_type] + 1 : 1;
    };
    $scope.decrementTotalPoliticianUsersVotes = function(vote_type) {
      $scope.totalPoliticianUsersVotes[vote_type] = vote_type in $scope.totalPoliticianUsersVotes ? $scope.totalPoliticianUsersVotes[vote_type] - 1 : 0;
    };
    $scope.votedInPolitician = function(vote_type) {
      return $scope.politicianUserVote && $scope.politicianUserVote.vote_type === vote_type;
    };
    $scope.voteInPolitician = function(vote_type) {
      if(authenticationService.ensureAuth()) {
        var oldPoliticianUserVote = $scope.politicianUserVote;
        NProgress.start();
        politicianService.voteInPolitician($scope.politician, vote_type).then(function(response) {
          NProgress.done();
          $scope.politicianUserVote = response.data.data.politicianUserVote;
          if($scope.politicianUserVote) {
            if($scope.politicianUserVote.vote_type === "UP") {
              $scope.incrementTotalPoliticianUsersVotes("UP");
            } else {
              $scope.incrementTotalPoliticianUsersVotes("DOWN");
            }
            if(oldPoliticianUserVote) {
              $scope.decrementTotalPoliticianUsersVotes(oldPoliticianUserVote.vote_type);
            }
          } else {
            $scope.decrementTotalPoliticianUsersVotes(oldPoliticianUserVote.vote_type);
          }
        });
      }
    };
    $scope.totalPromisesOfCategory = function(category) {
      var totalPromises = $scope.totalPromisesByCategory[category.id];
      if(!totalPromises) {
        totalPromises = 0;
      }
      return totalPromises;
    };
    $scope.totalPromiseUsersVotes = function(promise) {
      var totalVotes = $scope.totalUsersVotesByPromise[promise.id];
      if(!totalVotes) {
        totalVotes = 0;
      }
      return totalVotes;
    };
    $scope.incrementTotalPromiseUsersVotes = function(promise) {
      var totalVotes = $scope.totalPromiseUsersVotes(promise);
      totalVotes++;
      $scope.totalUsersVotesByPromise[promise.id] = totalVotes;
    };
    $scope.decrementTotalPromiseUsersVotes = function(promise) {
      var totalVotes = $scope.totalPromiseUsersVotes(promise);
      if(totalVotes > 0) {
        totalVotes--;
      }
      $scope.totalUsersVotesByPromise[promise.id] = totalVotes;
    };
    $scope.totalPromiseUsersComments = function(promise) {
      var totalUsersComments = $scope.totalUsersCommentsByPromise[promise.id];
      if(!totalUsersComments) {
        totalUsersComments = 0;
      }
      return totalUsersComments;
    };
    $scope.totalPromiseEvidences = function(promise) {
      var totalEvidences = $scope.totalEvidencesByPromise[promise.id];
      if(!totalEvidences) {
        totalEvidences = 0;
      }
      return totalEvidences;
    };
    $scope.votedOnPromise = function(promise) {
      var voted = false;
      if($scope.userVotesByPromise) {
        voted = promise.id in $scope.userVotesByPromise;
      }
      return voted;
    };
    $scope.voteOnPromise = function(promise) {
      if(authenticationService.ensureAuth()) {
        NProgress.start();
        promiseService.voteOnPromise(promise).then(function(response) {
          NProgress.done();
          var promiseUserVote = response.data.data.promiseUserVote;
          if(promiseUserVote) {
            $scope.userVotesByPromise[promise.id] = promiseUserVote;
            $scope.incrementTotalPromiseUsersVotes(promise);
          } else {
            delete $scope.userVotesByPromise[promise.id];
            $scope.decrementTotalPromiseUsersVotes(promise);
          }
        });
      }
    };
    $scope.isCurrentCategory = function(category) {
      return $scope.category.id === category.id;
    };
    $scope.selectCategory = function(category) {
      NProgress.start();
      promiseService.getPromises($scope.politician, category).then(function(response) {
        NProgress.done();
        dataService.mergeData(response.data.data, $scope);
        $scope.category = category;
      });
    };
    $scope.containsPromises = function() {
      return $scope.totalPromises && $scope.totalPromises > 0;
    }
    $scope.nextPromisePage = function(tabId) {
      $scope.promisePage++;
      var resources = {
        "LatestPromises": promiseService.getLatestPromises,
        "MajorPromises": promiseService.getMajorPromises,
        "OlderPromises": promiseService.getOlderPromises
      }

      var promise = null;
      if(tabId === "AllPromises" && $scope.promisePage === 1) {
        promise = promiseService.getAllPromises($scope.politician)
      } else {
        promise = resources[tabId]($scope.politician, $scope.promisePage, 20)
      }

      return promise;
    };
    $scope.appendNextPromisePage = function() {
      var promise = $scope.nextPromisePage($scope.tabId);
      NProgress.start();
      promise.then(function(response) {
        NProgress.done();
        $scope.promises = $scope.promises.concat(response.data.data.promises);
        if(response.data.data.promises.length < 20) {
          $scope.hasMorePromises = false;
        }
      });
    };
    $scope.isCurrentTab = function(tabId) {
      return $scope.tabId === tabId;
    };
    $scope.selectTab = function(tabId) {
      $scope.promisePage = 0;
      var promise = $scope.nextPromisePage(tabId);
      NProgress.start();
      promise.then(function(response) {
        NProgress.done();
        $scope.tabId = tabId;
        dataService.mergeData(response.data.data, $scope);
      });
    };
    $scope.isFirstIndex = function(index) {
      return index === 0;
    };
    $scope.registerPromise = function() {
      if(authenticationService.ensureAuth()) {
        $window.location.href = "/politico/" + $scope.politician.slug + "/nova-promessa";
      }
    };
    $scope.isRegisteringPolitician = function() {
      return $scope.registeringPolitician === true;
    };
    $scope.isEditingPolitician = function() {
      return $scope.editingPolitician === true;
    };
    $scope.editPolitician = function() {
      if(authenticationService.ensureAuth()) {
        if(!$scope.politicalParties || !$scope.politicalOffices || !$scope.states) {
          politicianService.getPoliticalAssociations().then(function(response) {
            dataService.mergeData(response.data.data, $scope);
          });
        }
        $scope.editedPolitician = angular.copy($scope.politician);
        $scope.editingPolitician = true;
      }
    };
    $scope.cancelPoliticianEdition = function() {
      $scope.editingPolitician = false;
    };
    $scope.savePoliticianEdition = function() {
      NProgress.start();
      $scope.flowModel.flow.on("complete", function () {
        politicianService.findPolitician($scope.editedPolitician.id, ["party", "state", "office"]).then(function(response) {
          $scope.politician = response.data.data;
          NProgress.done();
          if($scope.isEditingPolitician()) {
            $scope.cancelPoliticianEdition();
            alertService.addAlert("success", "Informações do político atualizadas com sucesso!");
          } else if($scope.isRegisteringPolitician()) {
            $window.location.href = "/politico/" + $scope.politician.slug;
          }
        });
      });

      var promise = null;
      if($scope.isEditingPolitician()) {
        promise = politicianService.updatePolitician;
      } else if($scope.isRegisteringPolitician()) {
        promise = politicianService.registerPolitician;
      }
      promise($scope.editedPolitician).then(function(response) {
        $scope.editedPolitician.id = response.data.data.id;
        $scope.flowModel.flow.upload();
      }).catch(function(response) {
        NProgress.done();
        alertService.addAlert("danger", errorMessage("politicianRegistration", response.data.key));
      });
    };
    $scope.isPresidentOfficeSelected = function() {
      return $scope.editedPolitician.political_office_id === 1;
    };
    $scope.politicalPartySelected = function() {
      $scope.editedPolitician.political_party_id = $scope.editedPolitician.party.id;
    };
    $scope.politicalOfficeSelected = function() {
      $scope.editedPolitician.political_office_id = $scope.editedPolitician.office.id;
    };
    $scope.stateSelected = function() {
      $scope.editedPolitician.state_id = $scope.editedPolitician.state.id;
    };
  }])
  .controller("promiseController", ["$scope", "$window", "backendData", "dataService", "politicianService", "promiseService", "oembedService", "authenticationService", "modalService", "alertService", function($scope, $window, backendData, dataService, politicianService, promiseService, oembedService, authenticationService, modalService, alertService) {
    $scope.editingPromise = false;
    $scope.registeringPromise = false;
    dataService.mergeData(backendData, $scope);

    if($scope.registeringPromise) {
      $scope.editedPromise = {state: "NON_STARTED", category: backendData.category, category_id: backendData.category.id, evidences: [{}]};
      $scope.fulfilledPromise = false;
    } else {
      $scope.editedPromise = {};
      $scope.fulfilledPromise = backendData.promise && backendData.promise.state === "FULFILLED";
    }

    $scope.evidenceDatePickerFormat = "dd/MM/yyyy";
    $scope.openEvidenceDatePicker = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.evidenceDatePickerOpened = true;
    };
    $scope.evidenceDatePickerMaxDate = new Date();
    $scope.evidenceDatePickerMinDate = new Date("2005-01-01");

    $scope.fulfilledDatePickerFormat = "dd/MM/yyyy";
    $scope.openFulfilledDatePicker = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.fulfilledDatePickerOpened = true;
    };
    $scope.fulfilledDatePickerMaxDate = new Date();
    $scope.fulfilledDatePickerMinDate = new Date("2005-01-01");

    $scope.isUserAuthenticated = function() {
      return authenticationService.isUserAuthenticated();
    };
    $scope.authenticate = function() {
      authenticationService.ensureAuth();
    };
    $scope.comment = function(content) {
      if(authenticationService.ensureAuth()) {
        promiseService.commentPromise($scope.promise, content).then(function(response) {
          var comment = response.data.data;
          comment.registration_date = new Date();
          $scope.promise.comments.unshift(comment);
          $scope.totalPromiseUsersComments++;
        });
      }
    };
    $scope.removeComment = function(comment, index) {
      if(authenticationService.ensureAuth()) {
        var modalScope = {
          headerText: "Remover comentário",
          bodyText: "Deseja realmente remover este comentário?"
        };
        modalService.show({}, modalScope).then(function(result) {
          NProgress.start();
          promiseService.removeComment(comment).then(function(response) {
            NProgress.done();
            $scope.promise.comments.splice(index, 1);
            $scope.totalPromiseUsersComments--
            alertService.addAlert("success", "Comentário removido com sucesso!");
          });
        });
      }
    };
    $scope.isCommentOwner = function(comment) {
      return authenticationService.getUser() && comment.user_id === authenticationService.getUser().id;
    }
    $scope.votedOnPromise = function() {
      return authenticationService.isUserAuthenticated() && $scope.promiseUserVote && $scope.promiseUserVote.promise_id === $scope.promise.id;
    };
    $scope.voteOnPromise = function() {
      if(authenticationService.ensureAuth()) {
        NProgress.start();
        promiseService.voteOnPromise($scope.promise).then(function(response) {
          NProgress.done();
          var promiseUserVote = response.data.data.promiseUserVote;
          $scope.promiseUserVote = promiseUserVote;
          if(promiseUserVote) {
            $scope.totalPromiseUsersVotes++;
          } else {
            $scope.totalPromiseUsersVotes--;
          }
        });
      }
    };
    $scope.totalPoliticianUpUsersVotes = function() {
      return "UP" in $scope.totalPoliticianUsersVotes ? $scope.totalPoliticianUsersVotes["UP"] : 0;
    };
    $scope.totalPoliticianDownUsersVotes = function() {
      return "DOWN" in $scope.totalPoliticianUsersVotes ? $scope.totalPoliticianUsersVotes["DOWN"] : 0;
    };
    $scope.incrementTotalPoliticianUsersVotes = function(vote_type) {
      $scope.totalPoliticianUsersVotes[vote_type] = vote_type in $scope.totalPoliticianUsersVotes ? $scope.totalPoliticianUsersVotes[vote_type] + 1 : 1;
    };
    $scope.decrementTotalPoliticianUsersVotes = function(vote_type) {
      $scope.totalPoliticianUsersVotes[vote_type] = vote_type in $scope.totalPoliticianUsersVotes ? $scope.totalPoliticianUsersVotes[vote_type] + -1 : 0;
    };
    $scope.votedInPolitician = function(vote_type) {
      return $scope.politicianUserVote && $scope.politicianUserVote.vote_type === vote_type;
    };
    $scope.voteInPolitician = function(vote_type) {
      if(authenticationService.ensureAuth()) {
        var oldPoliticianUserVote = $scope.politicianUserVote;
        NProgress.start();
        politicianService.voteInPolitician($scope.politician, vote_type).then(function(response) {
          NProgress.done();
          $scope.politicianUserVote = response.data.data.politicianUserVote;
          if($scope.politicianUserVote) {
            if($scope.politicianUserVote.vote_type === "UP") {
              $scope.incrementTotalPoliticianUsersVotes("UP");
            } else {
              $scope.incrementTotalPoliticianUsersVotes("DOWN");
            }
            if(oldPoliticianUserVote) {
              $scope.decrementTotalPoliticianUsersVotes(oldPoliticianUserVote.vote_type);
            }
          }
        });
      }
    };
    $scope.isTextEvidence = function(evidence) {
      return evidence.type === "TEXT";
    };
    $scope.isVideoEvidence = function(evidence) {
      return evidence.type === "VIDEO";
    };
    $scope.editPromise = function() {
      if(authenticationService.ensureAuth()) {
        $scope.editedPromise = angular.copy($scope.promise);
        $scope.editedPromise.evidences.push({});
        if($scope.editedPromise.evidence_date) {
          $scope.editedPromise.evidence_date = new Date($scope.editedPromise.evidence_date);
        }
        if(!$scope.categories) {
          NProgress.start();
          promiseService.getAllCategories().then(function(response) {
            NProgress.done();
            dataService.mergeData(response.data.data, $scope);
          });
        }
        $scope.editingPromise = true;
      }
    };
    $scope.isRegisteringPromise = function() {
      return $scope.registeringPromise === true;
    };
    $scope.registerPromise = function() {
      var evidencesData = [];
      var editedPromise = $scope.editedPromise;
      for(var index in editedPromise.evidences) {
        var evidence = editedPromise.evidences[index];
        if(evidence.url) {
          evidencesData.push(evidence);
        }
      }
      NProgress.start();
      promiseService.registerPromise($scope.politician, editedPromise, evidencesData).then(function(response) {
        NProgress.done();
        var promise = response.data.data.promise;
        $window.location.href = "/politico/" + $scope.politician.slug + "/" + promise.id + "/" + promise.slug;
      });
    };
    $scope.isEditingPromise = function() {
      return $scope.editingPromise === true;
    };
    $scope.cancelPromiseEdition = function() {
      $scope.editingPromise = false;
    };
    $scope.savePromiseEdition = function() {
      var evidencesData = [];
      var editedPromise = $scope.editedPromise;

      for(var index in editedPromise.evidences) {
        var evidence = editedPromise.evidences[index];
        if(!evidence.id && evidence.url) {
          evidencesData.push(evidence);
        } else {
          editedPromise.evidences.splice(index, 1);
        }
      }

      NProgress.start();
      promiseService.editPromise(editedPromise, evidencesData).then(function(response) {
        $scope.promise = angular.copy(editedPromise);
        dataService.mergeData(response.data.data.promise, $scope.promise);
        $scope.totalPromiseEvidences = response.data.data.totalPromiseEvidences;
        $scope.cancelPromiseEdition();
        alertService.addAlert("success", "Promessa editada com sucesso!");
      }).catch(function(response) {
        alertService.addAlert("danger", errorMessage("promiseEdition", response.data.key));
      }).finally(function() {
        NProgress.done();
      });
    };
    $scope.isPromiseStateChoosed = function(state) {
      return $scope.editedPromise.state === state;
    };
    $scope.choosePromiseState = function(state) {
      $scope.editedPromise.state = state;
      $scope.fulfilledPromise = state === "FULFILLED";
      if(state !== "FULFILLED" || (state === "FULFILLED" && $scope.editedPromise.fulfilled_date)) {
        $scope.promiseForm.fulfilled_date.$setValidity("required", true);
      } else {
        $scope.promiseForm.fulfilled_date.$setValidity("required", false);
      }
    };
    $scope.isLastEvidence = function(index) {
      return $scope.editedPromise.evidences.length === index + 1;
    };
    $scope.isHiddenEvidence = function(index) {
      return index > 1 && !$scope.showHiddenEvidences;
    };
    $scope.showAllEvidences = function() {
      $scope.showHiddenEvidences = true;
    }
    $scope.addEvidence = function() {
      $scope.editedPromise.evidences.push({});
    };
    $scope.removeEvidence = function(evidence, index) {
      if(authenticationService.ensureAuth()) {
        if(!evidence.id) {
          $scope.editedPromise.evidences.splice(index, 1);
        } else {
          var modalScope = {
            headerText: "Deseja remover essa evidência ?",
            bodyText: "A evidência é o meio mais importante para comprovar o andamento da promessa. Deseja realmente remover essa evidência ?"
          };
          modalService.show({}, modalScope).then(function(result) {
            NProgress.start();
            promiseService.removeEvidence(evidence).then(function(response) {
              NProgress.done();
              $scope.editedPromise.evidences.splice(index, 1);
            });
          });
        }
      }
    };
    $scope.categorySelected = function() {
      $scope.editedPromise.category_id = $scope.editedPromise.category.id;
    };
    $scope.getEvidenceInfos = function(evidence, event) {
      var url = event.originalEvent.clipboardData.getData("text/plain");
      NProgress.start();
      oembedService.getOEmbed(encodeURIComponent(url)).then(function(response) {
        var data = response.data.data;
        var meta = data.meta;
        if(meta.title) {
          evidence.title = meta.title;
        }
        if(meta.canonical) {
          evidence.url = meta.canonical;
        }
        if(meta.description) {
          evidence.description = meta.description;
        }
        if(meta.site) {
          evidence.source = meta.site;
        }
        if(data.host) {
          evidence.host = data.host;
        }

        if(data.links.thumbnail) {
          evidence.image = data.links.thumbnail[0].href;
        }
        if(!evidence.image && data.links.icon) {
          evidence.image = data.links.icon[0].href;
        }

        $scope.addEvidence();
      }).catch(function() {
        evidence.url = url;
        $scope.addEvidence();
      }).finally(function() {
        NProgress.done();
      });
    };
  }])
  .controller("indexController", ["$scope", "$window", "politicianService", "authenticationService", "backendData", "dataService", function($scope, $window, politicianService, authenticationService, backendData, dataService) {
    dataService.mergeData(backendData, $scope);
    $scope.politicalParties.unshift({acronym: "Todos os partidos"});
    $scope.selectedPoliticalParty = $scope.politicalParties[0];
    $scope.states.unshift({name: "Todos os estados"});
    $scope.selectedState = $scope.states[0];

    $scope.registerPolitician = function() {
      if(authenticationService.ensureAuth()) {
        $window.location.href = "/politico/cadastro";
      }
    };
    $scope.existsBestPoliticians = function() {
      return $scope.bestPoliticians.length !== 0;
    };
    $scope.existsWorstPoliticians = function() {
      return $scope.worstPoliticians.length !== 0;
    };
    $scope.existsPoliticiansWithoutPromises = function() {
      return $scope.politiciansWithoutPromises.length !== 0;
    };
    $scope.hasPoliticalPartySelected = function() {
      return $scope.selectedPoliticalParty.id;
    };
    $scope.hasStateSelected = function() {
      return $scope.selectedState.id;
    };
    $scope.filterSelected = function() {
      politicianService.filterPoliticians(1, 12, $scope.selectedPoliticalParty, $scope.selectedState).then(function(response) {
        dataService.mergeData(response.data.data, $scope);
      });
    };
    $scope.totalPoliticianUpUsersVotes = function(politician) {
      var count = 0;
      if(politician.id in $scope.usersVotesCounts) {
        if("UP" in $scope.usersVotesCounts[politician.id]) {
          count = $scope.usersVotesCounts[politician.id]["UP"];
        }
      }
      return count;
    };
    $scope.totalPoliticianDownUsersVotes = function(politician) {
      var count = 0;
      if(politician.id in $scope.usersVotesCounts) {
        if("DOWN" in $scope.usersVotesCounts[politician.id]) {
          count = $scope.usersVotesCounts[politician.id]["DOWN"];
        }
      }
      return count;
    };
    $scope.votedInPolitician = function(politician, vote_type) {
      var voted = false;
      if($scope.userVotes && politician.id in $scope.userVotes) {
        voted = $scope.userVotes[politician.id] !== null && $scope.userVotes[politician.id].vote_type == vote_type;
      }
      return voted;
    };
    $scope.voteInPolitician = function(politician, vote_type) {
      if(authenticationService.ensureAuth()) {
        var oldPoliticianUserVote = $scope.userVotes[politician.id];
        NProgress.start();
        politicianService.voteInPolitician(politician, vote_type).then(function(response) {
          NProgress.done();
          $scope.userVotes[politician.id] = response.data.data.politicianUserVote;
          if($scope.userVotes[politician.id] && $scope.userVotes[politician.id] !== null) {
            if($scope.userVotes[politician.id].vote_type === "UP") {
              $scope.incrementTotalPoliticianUsersVotes(politician, "UP");
            } else {
              $scope.incrementTotalPoliticianUsersVotes(politician, "DOWN");
            }
            if(oldPoliticianUserVote) {
              $scope.decrementTotalPoliticianUsersVotes(politician, oldPoliticianUserVote.vote_type);
            }
          } else {
            $scope.decrementTotalPoliticianUsersVotes(politician, oldPoliticianUserVote.vote_type);
          }
        });
      }
    };
    $scope.incrementTotalPoliticianUsersVotes = function(politician, vote_type) {
      if(politician.id in $scope.usersVotesCounts && $scope.usersVotesCounts[politician.id] !== null) {
        $scope.usersVotesCounts[politician.id][vote_type] = vote_type in $scope.usersVotesCounts[politician.id] ? $scope.usersVotesCounts[politician.id][vote_type] + 1 : 1;
      } else {
        vote_type === "UP" ? $scope.usersVotesCounts[politician.id] = {"UP": 1} : $scope.usersVotesCounts[politician.id] = {"DOWN": 1};
      }
    };
    $scope.decrementTotalPoliticianUsersVotes = function(politician, vote_type) {
      if(politician.id in $scope.usersVotesCounts && $scope.usersVotesCounts[politician.id] !== null) {
        $scope.usersVotesCounts[politician.id][vote_type] = vote_type in $scope.usersVotesCounts[politician.id] ? $scope.usersVotesCounts[politician.id][vote_type] - 1 : 0;
      } else {
        $scope.usersVotesCounts[politician.id] = {vote_type: 0};
      }
    };
  }])
  .controller("politiciansRankController", ["$scope", "$window", "politicianService", "authenticationService", "backendData", "dataService", function($scope, $window, politicianService, authenticationService, backendData, dataService) {
    dataService.mergeData(backendData, $scope);
    $scope.hasMorePoliticians = true;
    $scope.rankPage = 1;
    $scope.politicalParties.unshift({acronym: "Todos os partidos"});
    $scope.selectedPoliticalParty = $scope.politicalParties[0];
    $scope.states.unshift({name: "Todos os estados"});
    $scope.selectedState = $scope.states[0];
    $scope.actualPage = 1;

    $scope.isBestRank = function() {
      return $scope.rankType === "best";
    };
    $scope.isWorstRank = function() {
      return $scope.rankType === "worst";
    };
    $scope.isWithoutPromisesRank = function() {
      return $scope.rankType === "withoutPromises";
    };
    $scope.registerPolitician = function() {
      if(authenticationService.ensureAuth()) {
        $window.location.href = "/politico/cadastro";
      }
    };
    $scope.existsPoliticians = function() {
      return $scope.politicians.length !== 0;
    };
    $scope.hasPoliticalPartySelected = function() {
      return $scope.selectedPoliticalParty.id;
    };
    $scope.hasStateSelected = function() {
      return $scope.selectedState.id;
    };
    $scope.filterSelected = function() {
      var filterPoliticiansPromise = null;
      if($scope.isBestRank()) {
        filterPoliticiansPromise = politicianService.bestPoliticians;
      } else if($scope.isWorstRank()) {
        filterPoliticiansPromise = politicianService.worstPoliticians;
      } else {
        filterPoliticiansPromise = politicianService.politiciansWithoutPromises;
      }
      filterPoliticiansPromise($scope.actualPage, 24, $scope.selectedPoliticalParty, $scope.selectedState).then(function(response) {
        $scope.politicians = response.data.data;
      });
    };
    $scope.totalPoliticianUpUsersVotes = function(politician) {
      var count = 0;
      if(politician.id in $scope.usersVotesCounts) {
        if("UP" in $scope.usersVotesCounts[politician.id]) {
          count = $scope.usersVotesCounts[politician.id]["UP"];
        }
      }
      return count;
    };
    $scope.totalPoliticianDownUsersVotes = function(politician) {
      var count = 0;
      if(politician.id in $scope.usersVotesCounts) {
        if("DOWN" in $scope.usersVotesCounts[politician.id]) {
          count = $scope.usersVotesCounts[politician.id]["DOWN"];
        }
      }
      return count;
    };
    $scope.votedInPolitician = function(politician, vote_type) {
      var voted = false;
      if($scope.userVotes && politician.id in $scope.userVotes) {
        voted = $scope.userVotes[politician.id] !== null && $scope.userVotes[politician.id].vote_type == vote_type;
      }
      return voted;
    };
    $scope.voteInPolitician = function(politician, vote_type) {
      if(authenticationService.ensureAuth()) {
        var oldPoliticianUserVote = $scope.userVotes[politician.id];
        NProgress.start();
        politicianService.voteInPolitician(politician, vote_type).then(function(response) {
          NProgress.done();
          $scope.userVotes[politician.id] = response.data.data.politicianUserVote;
          if($scope.userVotes[politician.id] && $scope.userVotes[politician.id] !== null) {
            if($scope.userVotes[politician.id].vote_type === "UP") {
              $scope.incrementTotalPoliticianUsersVotes(politician, "UP");
            } else {
              $scope.incrementTotalPoliticianUsersVotes(politician, "DOWN");
            }
            if(oldPoliticianUserVote) {
              $scope.decrementTotalPoliticianUsersVotes(politician, oldPoliticianUserVote.vote_type);
            }
          } else {
            $scope.decrementTotalPoliticianUsersVotes(politician, oldPoliticianUserVote.vote_type);
          }
        });
      }
    };
    $scope.incrementTotalPoliticianUsersVotes = function(politician, vote_type) {
      if(politician.id in $scope.usersVotesCounts && $scope.usersVotesCounts[politician.id] !== null) {
        $scope.usersVotesCounts[politician.id][vote_type] = vote_type in $scope.usersVotesCounts[politician.id] ? $scope.usersVotesCounts[politician.id][vote_type] + 1 : 1;
      } else {
        vote_type === "UP" ? $scope.usersVotesCounts[politician.id] = {"UP": 1} : $scope.usersVotesCounts[politician.id] = {"DOWN": 1};
      }
    };
    $scope.decrementTotalPoliticianUsersVotes = function(politician, vote_type) {
      if(politician.id in $scope.usersVotesCounts && $scope.usersVotesCounts[politician.id] !== null) {
        $scope.usersVotesCounts[politician.id][vote_type] = vote_type in $scope.usersVotesCounts[politician.id] ? $scope.usersVotesCounts[politician.id][vote_type] - 1 : 0;
      } else {
        $scope.usersVotesCounts[politician.id] = {vote_type: 0};
      }
    };
    $scope.appendNextRankPage = function() {
      $scope.rankPage++;

      var promise;
      if($scope.rankType === "best") {
        promise = politicianService.bestPoliticians;
      } else if($scope.rankType === "worst") {
        promise = politicianService.worstPoliticians;
      } else {
        promise = politicianService.politiciansWithoutPromises;
      }

      NProgress.start();
      promise($scope.rankPage, 24, $scope.selectedPoliticalParty, $scope.selectedState).then(function(response) {
        $scope.politicians = $scope.politicians.concat(response.data.data);
        if(response.data.data.length < 24) {
          $scope.hasMorePoliticians = false;
        }
      }).finally(function() {
        NProgress.done();
      });
    };
  }]);