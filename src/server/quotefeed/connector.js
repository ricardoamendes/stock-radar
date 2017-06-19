// feed.js

import WebSocket from 'faye-websocket';
import schedule from 'node-schedule';

let dev = process.env.NODE_ENV === 'development';
let connection;

/**
 * Quote feed socket connector.
 */
class QuoteFeedConnector {

    /**
     * Initializes socket connection.
     * @param  {Object}   quoteConfig Config details
     * @param  {Object}   handlers    List of connection handlers
     * @return {void}
     */
    static init(quoteConfig, handlers) {
        let url = `${quoteConfig.host}/${quoteConfig.path}`;
        connection = new WebSocket.Client(url);
        this.initConnection(connection, handlers);
    }

    /**
     * Hook up socket connection handlers.
     * @param  {Object}   connection Socket connection instance
     * @return {void}
     */
    static initConnection(connection, handlers) {
        let {print} = this;
        connection.on('open', () => {
            print('Quote Feed Connector - Connection opened')
            handlers.onOpen(connection);
        });
        connection.on('message', (event) => handlers.onMessage(event.data));
        connection.on('close', (event) => {
            print('Quote Feed Connector - Connection closed');
            connection = null;
        });
    }

    static print(message) {
        if (dev) {
            console.log(message);
        }
    }
}

export default QuoteFeedConnector;