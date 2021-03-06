// socket.js

const WebSocketServer = require('websocket').server;
const fs = require('fs');

const dev = process.env.NODE_ENV === 'development';
const http = dev ? require('http') : require('https');

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
     * @param  {Object}   handlers  List of connection handlers
     * @return {void}
     */
    static init(config, handlers) {
        let httpServer;
        if (dev) {
            httpServer = http.createServer();
        } else {
            httpServer = http.createServer({
                key: fs.readFileSync(config.ssl.key),
                cert: fs.readFileSync(config.ssl.cert)
            });
        }

        // Initializes server and web socket connection
        server = new WebSocketServer({
            httpServer: httpServer.listen(config.port)
        });

        // Listens when a client connects for the first time
        server.on('request', (request) => {
            // Make sure to accept requests from an allowed origin
            if (!this.originIsAllowed(dev ? config.localhost : config.remotehost, request.origin)) {
                request.reject();
                return;
            }

            // Initiate a connection request
            connection = request.accept('echo-protocol', request.origin);
            this.initConnection(connection, handlers);
            handlers.onRequest(connection);
        });
    }

    static initConnection(connection, handlers) {
        let {print} = this;
        print(`${new Date()} Connection accepted`);
        connection.on('message', function (message) {
            print(`Received Message: ${message.utf8Data}`);
            handlers.onMessage(connection, message.utf8Data);
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
        //if (dev) {
        console.log(message);
        //}
    }
}
