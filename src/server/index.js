import socket from './utils/socket';
import config from './config';

let messageReceivedHandler = (connection, message) => {
    connection.send(message);
};

socket.init(config.ws, messageReceivedHandler);