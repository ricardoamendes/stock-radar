import * as React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import _ from 'lodash';
import Socket from "utils/Socket";
import PushNotification from "utils/PushNotification";

import config from "config";
import {Sparklines, SparklinesLine, SparklinesBars} from 'react-sparklines';

class App extends React.Component <any, any> {

    constructor() {
        super();
        this.state = {
            price: 0,
            fluctuation: 0,
            limit: 100,
            threshold: 0.5,
            quotes: []
        };
    }

    render() {
        return (
            <div>
                <div>{this.state.price}</div>
                <div>{this.state.fluctuation}</div>
                <Sparklines data={this.state.quotes} limit={this.state.limit}>
                     <SparklinesBars style={{ fill: "#41c3f9" }} />
                </Sparklines>
            </div>
        );
    }

    componentWillMount() {
        Socket.init(config.getConfig().ws.host, config.getConfig().ws.port, this.onMessageReceive.bind(this));
    }

    componentDidMount() {
        console.log("Component did mount");
    }

    onMessageReceive(message : any) {
        let {state} = this;
        let data = JSON.parse(message.data);
        let delimiter = ",";
        let quotes = state.quotes
        let quoteSet = _.isArray(data) && data;
        this.setState({
            price: quoteSet ? _.last(quoteSet) : data.quote,
            fluctuation: quoteSet ? 0 : data.fluctuation,
            quotes: quoteSet || this.transformQuotes(quotes, data.quote)
        });
        if (Math.abs(state.fluctuation) > state.threshold) {
            PushNotification.create(state.fluctuation);
        }
    }

    transformQuotes(quotes, quote) {
        quotes.push(quote);
        if (quotes.length >= this.state.limit) {
            quotes.shift();
        }
        return quotes;
    }
}

export default App;