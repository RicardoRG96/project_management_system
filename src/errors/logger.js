const fs = require('node:fs');

exports.loggerError = (error) => {
    const logStream = fs.createWriteStream('error.log', { flags: 'a' });
    logStream.write(`[${new Date().toISOString()}] ${error.message}\n${error.stack}\n\n`);
    logStream.end();
}