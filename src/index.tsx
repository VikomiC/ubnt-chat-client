import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "./components/App";
import { SocketService } from "./services/SocketService";

const socketService = new SocketService();

ReactDOM.render(
    <App socketService={socketService} />,
    document.getElementById("app"),
);
