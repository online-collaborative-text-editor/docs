const io = require('socket.io')(3001, {
    path: '/socket.io',
    cors: { origin: 'http://localhost:3000' },
    methods: ["GET", "POST"],
});

io.on('connection', (socket) => {
    // socket.on('send-changes', (delta) => {
    //     console.log('delta', delta);
    //     console.log(delta.ops[1].attributes)
    //     socket.broadcast.emit('receive-changes', delta);

    // });
    /* if (operations_array) {
                if (operations_array[1].insert) {
                    socket.emit('insert', { Index, insert: operations_array[1].insert })
                    console.log("inserted");

                } else if (operations_array[1].attributes.bold) {
                    socket.emit('bold', { Index, attributes: operations_array[1].attributes, bold_length: operations_array[1].attributes.retain })
                    console.log("bold");
                } else if (operations_array[1].delete) {
                    socket.emit('delete', { Index, delete: operations_array[1].delete })
                    console.log("deleted");
                    //italic event
                } else if (operations_array[1].attributes.italic) {
                    socket.emit('italic', { Index, attributes: operations_array[1].attributes, italic_length: operations_array[1].attributes.retain })
                    console.log("italic");
                }

            } */
    // Listen for 'insert' event from the client
    socket.on('insert', ({ Index, insert }) => {
        console.log(`Inserted text "${insert}" at index ${Index}`);
        // Emit the received insert event to all other clients
        socket.broadcast.emit('receive-changes', { ops: [{ retain: Index }, { insert }] });
    });

    // Listen for 'delete' event from the client
    socket.on('delete', ({ Index, delete: deleteLength }) => {
        console.log(`Deleted ${deleteLength} characters at index ${Index}`);
        // Emit the received delete event to all other clients
        socket.broadcast.emit('receive-changes', { ops: [{ retain: Index }, { delete: deleteLength }] });
    });

    // Listen for 'bold' event from the client
    socket.on('bold', ({ Index, attributes, bold_length }) => {
        console.log(`Bolded ${bold_length} characters at index ${Index}`);
        // Emit the received bold event to all other clients
        socket.broadcast.emit('receive-changes', { ops: [{ retain: Index }, { retain: bold_length, attributes }] });
    });

    // Listen for 'italic' event from the client
    socket.on('italic', ({ Index, attributes, italic_length }) => {
        console.log(`Italicized ${italic_length} characters at index ${Index}`);
        // Emit the received italic event to all other clients
        socket.broadcast.emit('receive-changes', { ops: [{ retain: Index }, { retain: italic_length, attributes }] });
    });
    console.log('connected habhouba');
})

module.exports = io; // Exporting io instance if needed elsewhere in your server code
