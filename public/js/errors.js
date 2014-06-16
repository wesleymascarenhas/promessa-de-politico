var errorMessagesMap = {
  'politicianRegistration': {
    'politician.alreadyExists': 'Este político já foi cadastrado',
    'default': 'Erro ao registrar político'
  }
}

function errorMessage(section, errorKey) {
  var errorMessage = 'Erro desconhecido';
  var sectionMessages = errorMessagesMap[section];
  if(sectionMessages) {
    errorMessage = sectionMessages[errorKey];
    if(!errorMessage && 'default' in sectionMessages) {
      errorMessage = sectionMessages['default'];
    }    
  }
  return errorMessage;
}