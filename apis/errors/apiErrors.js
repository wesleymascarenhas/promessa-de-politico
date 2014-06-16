var util    = require('util');

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

var errorMapping = {
  'ER_DUP_ENTRY': AlreadyExistsError
}

function fromDatabaseError(model, err) {
  var errorType = errorMapping[err.clientError.cause.code];
  if(errorType) {
    return new errorType(model);
  } else {
    return new GenericError(400, 'unknown');
  }
}

exports.fromDatabaseError = fromDatabaseError;
exports.GenericError = GenericError;
exports.NotFoundError = NotFoundError;
