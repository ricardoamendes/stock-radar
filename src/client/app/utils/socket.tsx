// socket.tsx

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

            // Open web socket
            connection = new WebSocket(`ws://${host}:${port}/`, 'echo-protocol');

            connection.onopen = () => console.debug("Connection is opened");
            connection.onclose = () => console.debug("Connection is closed");
            connection.onmessage = onMessage;

            setTimeout(this.sendNumber, 10000);
        } else {
            // The browser doesn't support WebSocket
            alert("WebSocket NOT supported by your Browser!");
        }
    }

    static sendNumber() {
        if (connection.readyState === connection.OPEN) {
            console.log("attempt to send", connection)
            var number = Math.round(Math.random() * 0xFFFFFF);
            connection.send(number.toString());
        }
    }
}

export default Socket;
