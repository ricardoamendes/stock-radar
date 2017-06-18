import * as React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import socket from "utils/socket";
import config from "config";

class App extends React.Component <any, any> {

    constructor() {
        super();
        this.state = {
            price: 0
        };
    }

    render() {
        return (
            <div>
                <div>{this.state.price}</div>
            </div>
        );
    }

    componentWillMount() {
        socket.init(config.getConfig().ws.host, config.getConfig().ws.port, this.onMessageReceive.bind(this));
    }

    componentDidMount() {
        console.log("Component did mount");
    }

    onMessageReceive(message : any) {
        console.log("Message received", message.data);
        this.setState({price: message.data});
    }
}

export default App;