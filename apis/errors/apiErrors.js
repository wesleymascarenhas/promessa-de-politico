var util    = require('util');

var errorMapping = {
  'ER_DUP_ENTRY': AlreadyExistsError
}

function GenericError(statusCode, key) {
  GenericError.super_.call(this, key);
  this.statusCode = statusCode;
  this.key = key;
  this.toJSON = function() {
    return {statusCode: this.statusCode, key: this.key};
  };
};
util.inherits(GenericError, Error);

function NotFoundError(model) {
  NotFoundError.super_.call(this, 404, model + ".notFound");
};
util.inherits(NotFoundError, GenericError);

function AlreadyExistsError(model) {
  AlreadyExistsError.super_.call(this, 400, model + ".alreadyExists");
};
util.inherits(AlreadyExistsError, GenericError);

function ValidationError(model, validationKey) {
  ValidationError.super_.call(this, 400, model + ".validation." + validationKey);
};
util.inherits(ValidationError, GenericError);

function fromDatabaseError(model, err) {
  var errorType = errorMapping[err.clientError.cause.code];
  if(errorType) {
    return new errorType(model);
  } else {
    return new GenericError(400, 'unknown');
  }
}

module.exports = {
  fromDatabaseError: fromDatabaseError,
  GenericError: GenericError,
  NotFoundError: NotFoundError,
  AlreadyExistsError: AlreadyExistsError,
  ValidationError: ValidationError
}