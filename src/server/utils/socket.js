// socket.js

var WebSocketServer = require('websocket').server;
var http = require('http');

let dev = process.env.NODE_ENV === 'development';
let server;
let connection;

/**
 * Web Socket node server implementation.
 */
export default class Socket {

    /**
     * Initializes web socket server.
     *
     * @param  {String}   config    Socket connection config
     * @param  {Function} onMessage Handle messages received from clients
     * @return {void}
     */
    static init(config, onMessage) {

        // Initializes server and web socket connection
        server = new WebSocketServer({
            httpServer: http
                .createServer()
                .listen(config.port),
            autoAcceptConnections: false
        });

        // Listens when a client connects for the first time
        server.on('request', (request) => {
            // Make sure to accept requests from an allowed origin
            if (!this.originIsAllowed(config.host, request.origin)) {
                request.reject();
                return;
            }

            // Initiate a connection request
            connection = request.accept('echo-protocol', request.origin);

            this.initConnection(connection, onMessage);
        });
    }

    static initConnection(connection, onMessage) {
        let {print} = this;
        print(`${new Date()} Connection accepted`);
        connection.on('message', function (message) {
            print(`Received Message: ${message.utf8Data}`);
            onMessage(connection, message.utf8Data);
        });
        connection.on('close', (reasonCode, description) => print(`${new Date()} Peer ${connection.remoteAddress} disconnected`));
    }

    /**
     * Verify the connection's origin and decide whether or not to accept it.
     * @param  {String} origin The server origin with host and port
     * @param  {String} requestOrigin The origin with host and port
     * @return {Boolean} True if valid connection
     */
    static originIsAllowed(origin, requestOrigin) {
        return requestOrigin.includes(origin);
    }

    static print(message) {
        if (dev) {
            console.log(message);
        }
    }
}
