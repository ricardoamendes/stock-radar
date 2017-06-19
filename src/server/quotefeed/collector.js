// quote-feed-collector.js

let dev = process.env.NODE_ENV === 'development';
let quotes = [];

let limit = 5;

/**
 * Quote feed collector module.
 */
class QuoteFeedCollector {

    /**
     * Initializes quote feed collector.
     * @return {void}
     */
    static init(limit) {
        limit = limit;
    }

    /**
     * Store quote.
     * @param {Number} Quote value
     * @return {void}
     */
    static add(quote) {
        quotes = [quote, ...quotes.slice(0, limit)];
    }

    /**
     * Retrieve quotes collected.
     * @return {void}
     */
    static getQuotes() {
        return quotes;
    }
}

export default QuoteFeedCollector;