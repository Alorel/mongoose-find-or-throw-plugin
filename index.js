const Query = require('mongoose/lib/query').prototype;
let isEmpty;

try {
  isEmpty = require('lodash/isEmpty');
} catch (e) {
  // istanbul ignore next
  try {
    isEmpty = require('lodash/lang/isEmpty');
  } catch (e) {
    isEmpty = require('lodash').isEmpty;
  }
}

function then(response) {
  if (isEmpty(response)) {
    const err = new Error('Not found');
    err.status = 404;
    throw err;
  }

  return response;
}

Query.throwIfEmpty = function () {
  const originalExec = this.exec;

  this.exec = function () {
    const applied = originalExec.apply(this, arguments);

    if (!applied || !applied.catch || !applied.then) {
      throw new Error('Use promises after calling throwIfEmpty()');
    }

    return applied.then(then)
  };

  return this;
};
