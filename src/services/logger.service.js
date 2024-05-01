"use strict";

class loggerService {

  constructor() {}

  log(message) {
    console.log(message);
  }

  error(message, stack) {
    console.error(message);
    if (stack) {
      console.error(stack);
    }
  }

  warn(message) {
    console.warn(message);
  }

  info(message) {
    console.info(message);
  }

  debug(message) {
    console.debug(message);
  }
}

module.exports = { loggerService };
