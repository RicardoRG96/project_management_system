const io = require('socket.io')();
const socketapi = {
    io: io
}

io.on('connection', (socket) => {
    socket.on('subscribe', (userId) => {
        socket.join(userId);
    });
});

module.exports = socketapi;