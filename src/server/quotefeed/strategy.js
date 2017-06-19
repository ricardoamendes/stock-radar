// quote-feed-strategy.js
import _ from 'lodash';
import quoteFeedCollector from '../quotefeed/collector';

let dev = process.env.NODE_ENV === 'development';

/**
 * Quote feed strategy module.
 */
class QuoteFeedStrategy {

    /**
     * Initializes quote feed strategy.
     * @return {void}
     */
    static init(connection, quoteIntervalOffset = 30, quoteValueOffset = 0.10) {
        this.connection = connection;
        this.quoteIntervalOffset = quoteIntervalOffset;
        this.quoteValueOffset = quoteValueOffset;
    }

    /**
     * Detect fluctuation over threshold for latest quotes.
     * @param {Number} Quote value
     * @return {void}
     */
    static checkQuoteFluctuation() {
        let {connection, quoteIntervalOffset, quoteValueOffset} = this;
        let quotes = quoteFeedCollector.getQuotes();
        let fluctuation = _.first(quotes) - _.last(quotes);
        let up = fluctuation > quoteValueOffset;
        let down = fluctuation < -(quoteValueOffset);

        if (connection) {
            connection.send(JSON.stringify({
                quote: _.first(quotes),
                fluctuation: _.round(fluctuation, 2)
            }));
        }
    }

    static print(message) {
        if (dev) {
            console.log(message);
        }
    }
}

export default QuoteFeedStrategy;