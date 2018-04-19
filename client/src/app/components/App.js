import React, {Component} from "react";
import PropTypes from "prop-types";

import {retrieveCookie, removeCookie} from "../helpers/cookies.helper";
import Warzone from "../containers/warzone";
import config from "../../config/globalConfig";
import logo_light from "../../img/101_logo_light.svg";
import logo_dark from "../../img/101_logo_dark.svg";
import Loader from "../components/Loader";
import Toaster from "../containers/toaster";
import "../scss/App.css";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        this.logoTheme = [logo_dark, logo_light];

        this.askCode = this.askCode.bind(this);
        this.keyDown = this.keyDown.bind(this);
    }
    
    componentDidMount() {
        this.checkConnection();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.globalState.connected !== nextProps.globalState.connected) {
            if (!nextProps.globalState.connected) {
                document.addEventListener("keydown", this.keyDown);
            }
            else {
                document.removeEventListener("keydown", this.keyDown);
            }
        }
        if (this.props.globalState.connected && !nextProps.globalState.connected) {
            this.props.socket.disconnect();
        }
        if (this.props.globalState.connected !== nextProps.globalState.connected && nextProps.globalState.connected) {
            this.setState({loading: false});
        }
    }

    keyDown({keyCode}) {
        if (keyCode === 32 || keyCode === 13) {
            this.askCode();
        }
    }

    checkConnection() {
        const params = new URLSearchParams(window.location.search);
        const userToken = retrieveCookie("userToken");
        if (userToken || params.get("code")) {
            this.props.socket.connect(params.get("code"), userToken)
                .then(() => {
                    this.props.connectApp();
                })
                .catch(()=> {
                    removeCookie("userToken");
                    this.setState({loading: false});
                });
        }
        else {
            this.setState({loading:false});
            document.addEventListener("keydown", this.keyDown);
        }
    }

    askCode() {
        window.location.replace(`${config.apiEndPoint}/oauth/authorize?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code`);
    }

    renderApp() {
        if (this.props.globalState.connected) {
            return (<Warzone key={"Component1"} />);
        }
        else {
            return (
                <div key={"Component0"} className="wrapper">
                    <div className={"loginWrapper"}>
                        <h1>The Matrix</h1>
                        <img
                            className={"logo"}
                            src={this.logoTheme[this.props.globalState.themes.value]}
                            alt={"Logo"}
                        />
                        <div
                            className={"loginButton"}
                            onClick={this.askCode}
                        >
                            <p>{"Login"}</p>
                        </div>
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div className={`themeWrapper ${this.props.globalState.themes.array[this.props.globalState.themes.value]}`}>
                <Loader key="ComponentLoader" in={this.state.loading}/>
                {this.renderApp()}
                <Toaster />
            </div>
        );
    }
}

App.propTypes = {
    socket: PropTypes.object.isRequired
};

export default App;