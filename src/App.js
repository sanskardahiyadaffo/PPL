import React from "react";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { Switch, Route, Redirect } from "react-router-dom";
import LoginSignPSideBar from "./Components/login_signup_sideBAR";
import cookie from "react-cookies";
import Index from "./Components";
import { connect } from "react-redux";
import { toggelisLogin } from "./actions/toogleActions";
function App(props) {
  // if(cookie.load("userInfoForLogin"))
  const logged = cookie.load("userInfoForLogin") ? true : false;
  if (logged !== props.isLogin) props.toggelisLogin(logged);
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
      <Route path="/" component={Header} />

      <Switch>
        <Route path="/user" component={LoginSignPSideBar} />
        <Route path="/myindex" component={Index} />
        {cstmRedirect}
      </Switch>
      <Route path="/" component={Footer} />
    </div>
  );
}

export default connect(s => s.toogleReduecer, { toggelisLogin })(App);
