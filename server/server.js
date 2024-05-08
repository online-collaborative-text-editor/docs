const io = require('socket.io')(3001, {
    path: '/socket.io',
    cors: { origin: 'http://localhost:3000' },
    methods: ["GET", "POST"],
});

io.on('connection', (socket) => {
    socket.on('send-changes', (delta) => {
        console.log('delta', delta);
        socket.broadcast.emit('receive-changes', delta);

    });
    console.log('connected habhouba');
});
module.exports = io; // Exporting io instance if needed elsewhere in your server code
