import React, { Component } from "react";
import Registration from "./Registration";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login";
import cookie from "react-cookies";
export default class LoginSignPSideBar extends Component {
  constructor(props) {
    super(props);
    if (cookie.load("userInfoForLogin")) {
      props.history.push("/");
    }
  }
  render() {
    return (
      <div>
        <div className="container">
          <div className="content">
            <div className="content_rgt">
              <Switch>
                <Route
                  path="/user/registration"
                  render={props => <Registration {...this.props} {...props} />}
                />
                <Route
                  path="/user/login"
                  render={props => <Login {...this.props} {...props} />}
                />
                <Route
                  path="/user/logout"
                  component={props => {
                    cookie.remove("userInfoForLogin", { path: "/" });
                    this.props.toggelIsLoginState(false);
                    props.history.push("/");
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
}
