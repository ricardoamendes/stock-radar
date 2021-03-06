// socket.tsx

const dev = process.env.NODE_ENV === 'development';
let connection;

/**
 * W3C WebSocket API client.
 */
class Socket {

    /**
     * Initializes client socket connection.
     * @param  {String} host The host name
     * @param  {String} port The port number
     * @param  {Function} onMessage Handler for messages received
     * @return {void}
     */
    static init(host, port, onMessage) {

        if ("WebSocket" in window) {
            let protocol = dev ? "ws" : "wss";

            // Open web socket
            connection = new WebSocket(`${protocol}://${host}:${port}`, 'echo-protocol');

            connection.onopen = () => console.debug("Connection is opened");
            connection.onclose = () => console.debug("Connection is closed");
            connection.onmessage = onMessage;
        } else {
            // The browser doesn't support WebSocket
            alert("WebSocket NOT supported by your Browser!");
        }
    }
}

export default Socket;
