import serverSocket from './utils/socket';
import quoteFeedConnector from './quotefeed/connector';
import quoteFeedHandlers from './quotefeed/handlers';
import quoteFeedCollector from './quotefeed/collector';
import quoteFeedStrategy from './quotefeed/strategy';
import config from './config';

const serverCfg = config.server;
const quoteFeedCfg = config.quoteFeed;

const serverSocketHandlers = {
    onRequest: (connection, message) => {
        connection.send(JSON.stringify(quoteFeedCollector.getQuotes()));
        quoteFeedStrategy.init(connection);
    },
    onMessage: (connection, message) => {
        connection.send(message);
    }
}

serverSocket.init(serverCfg, serverSocketHandlers);
quoteFeedHandlers.init(quoteFeedCfg);
quoteFeedConnector.init(quoteFeedCfg, quoteFeedHandlers.getHandlers());

// var googleFinance = require('google-finance');

// googleFinance.companyNews({
//   symbol: 'NASDAQ:AAPL'
// }, function (err, news) {
//   console.log(news)
// });