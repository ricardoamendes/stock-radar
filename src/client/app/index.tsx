import "core-js/shim";
import * as React from "react";
import * as ReactDOM from "react-dom";

import PushNotification from "utils/PushNotification";
import App from "./components/App";

PushNotification.init();

ReactDOM.render(
    <App/>, document.getElementById("app"));