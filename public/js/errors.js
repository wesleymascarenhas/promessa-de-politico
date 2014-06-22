var errorMessagesMap = {
  "politicianRegistration": {
    "politician.alreadyExists": "Este político já foi cadastrado",
    "default": "Erro ao registrar o político"
  },
  "promiseEdition": {
    "promise.validation.fulfilledDateRequired": "Por favor informe a data em que a promessa foi cumprida",
    "promise.validation.fulfilledDateAfterEvidenceDate": "A data em que a promessa foi cumprida deve ser posterior à data em que a promessa foi feita",
    "default": "Erro ao editar a promessa"
  }
}

function errorMessage(section, errorKey) {
  var errorMessage = "Erro desconhecido";
  var sectionMessages = errorMessagesMap[section];
  if(sectionMessages) {
    errorMessage = sectionMessages[errorKey];
    if(!errorMessage && "default" in sectionMessages) {
      errorMessage = sectionMessages["default"];
    }
  }
  return errorMessage;
}