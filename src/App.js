import React, { Component } from "react";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { Switch, Route, Redirect } from "react-router-dom";
import LoginSignPSideBar from "./Components/login_signup_sideBAR";
import cookie from "react-cookies";
import Index from "./Components";

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLogin: cookie.load("userInfoForLogin") ? true : false
    };
  }
  toggelIsLoginState = value => {
    this.setState({ isLogin: value || false });
  };
  render() {
    // if(cookie.load("userInfoForLogin"))

    let cstmRedirect;
    if (cookie.load("userInfoForLogin"))
      cstmRedirect = <Redirect from="*" to="/myindex" />;
    else cstmRedirect = <Redirect from="*" to="/user/login" />;
    return (
      <div className="App">
        <link href="/css/bootstrap.css" rel="stylesheet" type="text/css" />
        <link
          href="/css/bootstrap-responsive.css"
          rel="stylesheet"
          type="text/css"
        />

        <Route
          path="/"
          render={props => <Header {...props} isLogin={this.state.isLogin} />}
        />
        <Switch>
          <Route
            path="/user"
            render={props => (
              <LoginSignPSideBar
                {...props}
                toggelIsLoginState={this.toggelIsLoginState}
              />
            )}
          />
          <Route path="/myindex" component={Index} />
          {cstmRedirect}
        </Switch>
        <Route path="/" component={Footer} />
      </div>
    );
  }
}

export default App;
