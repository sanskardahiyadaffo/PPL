import React from "react";
import Registration from "./Registration";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login";
import cookie from "react-cookies";
import { connect } from "react-redux";
import { toggelisLogin } from "../actions/toogleActions";

function LoginSignPSideBar(props) {
  if (cookie.load("userInfoForLogin")) {
    props.history.push("/");
  }
  return (
    <div>
      <div className="container">
        <div className="content">
          <div className="content_rgt">
            <Switch>
              <Route path="/user/registration" component={Registration} />

              <Route path="/user/login" component={Login} />
              <Route
                path="/user/logout"
                component={props1 => {
                  cookie.remove("userInfoForLogin", { path: "/" });
                  props.toggelisLogin(false);
                  props1.history.push("/");
                  return <div></div>;
                }}
              />
              <Redirect from="*" to="/" />
            </Switch>
          </div>
          {/* Here VVV */}
          <div className="content_lft">
            <h1>Welcome from PPL!</h1>
            <p className="discrptn">
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form, by
              injected humour, or randomised words which don't look even
              slightly believable. If you are going to use a passage of Lorem
              Ipsum, you need to be sure there isn't anything embarrassing
              hidden in the middle of text.
            </p>
            <img src="/images/img_9.png" alt="" />
          </div>
        </div>
      </div>
      <div className="clear" />
    </div>
  );
}

export default connect(null, { toggelisLogin })(LoginSignPSideBar);
