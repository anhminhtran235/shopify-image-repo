class CustomError extends Error {
  constructor(messages, statusCode) {
    super();
    this.messages = messages;
    this.statusCode = statusCode;
  }
}

module.exports = CustomError;
