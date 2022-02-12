#!/usr/bin/env node

/**
 * Module dependencies.
 */
const dotenv = require('dotenv').config({ path: './.env' });
var app = require('./app');
var debug = require('debug')('boilerplate:server');
var http = require('http');
var mongoose = require('mongoose');
var ioserver = require('socket.io');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
var io = new ioserver.Server(server, {
    cors: {
        origin: "http://localhost:4200",
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
/**
 * Listen on provided port, on all network interfaces.
 */

var uri = process.env.MONGO_URL;
mongoose
    .connect(uri, {
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        serverStart();
    }).catch((err) => {
        console.log(err);
    });

// Comment below code if using mongoose database and uncomment above code
//serverStart(); 

function serverStart() {
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
}
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log('Listening on ', bind);
}

io.on("connection", (socket) => {
    console.log("recieved a client at id ", socket.id);
    // back to connected client    
    socket.on("disconnect", (data) => {
        console.log("user left ", socket.id);
        socket.broadcast.emit("userLeft",socket.id);
    })
    socket.on('selfcursormove', (data) => {
        console.log("recieved from client socket ", data);
        socket.broadcast.emit("cursormove", data);
    })

    socket.on('createComponent', (data) => {
        console.log("createComponent from client socket ", data);
        socket.broadcast.emit("otherComponent", data);
    })
})




