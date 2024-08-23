const { handleError } = require('./error-handler');

process.on('uncaughtException', (error) => {
    handleError(error);
});