import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

function Header(props) {
  return (
    <div>
      <div className="navbar navbar-inverse navbar-fixed-top">
        <div className="navbar-inner">
          <div className="container">
            <button
              type="button"
              className="btn btn-navbar"
              data-toggle="collapse"
              data-target=".nav-collapse"
            >
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <Link to="/myindex">
              <span className="brand">PPL</span>
            </Link>
            <UserProfileMenu isLogin={props.isLogin} />
            <NavBar
              ulclass="nav"
              divclass="nav-collapse collapse"
              isLogin={props.isLogin}
            />
          </div>
        </div>
      </div>
      <div className="header">
        <div className="header_lft">
          <Link to="/myindex">
            <div className="logo">
              <img src="/images/logo.png" alt="" />
            </div>
          </Link>

          <NavBar divclass="navigatn" isLogin={props.isLogin} />
        </div>
        {props.isLogin ? (
          <div className="header_rgt">
            <div className="flag_div">
              <img src="/images/flag.png" alt="flag" />
            </div>
            <input type="text" placeholder="Search" className="txt_box" />
            <Link
              to="message"
              style={{ textDecoration: "None", color: "white" }}
            >
              <div className="msg_box">
                <span className="msg_count">0</span>
              </div>
            </Link>
            <UserProfileMenuLagre isLogin={props.isLogin} />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default connect(s => s.toogleReduecer, {})(Header);

class UserProfileMenu extends Component {
  render() {
    let links;
    if (this.props.isLogin)
      links = [
        { name: "Home", link: "/myindex" },
        { name: "My Profile", link: "/myindex/timeline" },
        { name: "Logout", link: "/user/logout" }
      ];
    else
      links = [
        { name: "Login", link: "/user/login" },
        { name: "Register", link: "/user/registration" }
      ];
    return (
      <div className="pro_info pull-right" style={{ width: "auto" }}>
        <div className="pro_icn">
          <img src="/images/pic_small.png" alt=" " />
        </div>
        <div className="pro_txt">
          Me
          <b className="caret" />
        </div>
        <ul className="dropdown-menu" role="menu" aria-labelledby="dLabel">
          {links.map((ele, id) => {
            return (
              <li key={id}>
                <Link to={ele.link} tabIndex={-1}>
                  {ele.name}
                </Link>
              </li>
            );
          })}
          <li className="divider" />
          <li>
            <Link to="/" tabIndex={-1}>
              <input type="text" placeholder="search" />
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

class UserProfileMenuLagre extends Component {
  render() {
    let links;
    if (this.props.isLogin)
      links = [
        { name: "Home", link: "/myindex" },
        { name: "My Profile", link: "/myindex/timeline" },
        { name: "Logout", link: "/user/logout" }
      ];
    else
      links = [
        { name: "Login", link: "/user/login" },
        { name: "Register", link: "/user/registration" }
      ];
    return (
      <div className="pro_info pull-right" style={{ width: "auto" }}>
        <div className="pro_icn">
          <img src="/images/pic_small.png" alt=" " />
        </div>
        <div className="pro_txt">
          Me
          <b className="caret" />
        </div>
        <ul className="dropdown-menu" role="menu" aria-labelledby="dLabel">
          {links.map((ele, id) => {
            return (
              <li key={id}>
                <Link to={ele.link} tabIndex={-1}>
                  {ele.name}
                </Link>
              </li>
            );
          })}
          <li></li>
        </ul>
      </div>
    );
  }
}

class NavBar extends Component {
  render() {
    let links;
    if (this.props.isLogin)
      links = [
        { name: "Home", link: "/myindex" },
        { name: "My Profile", link: "/myindex/timeline" },
        { name: "Logout", link: "/user/logout" }
      ];
    else
      links = [
        { name: "Login", link: "/user/login" },
        { name: "Register", link: "/user/registration" }
      ];
    return (
      <div className={this.props.divclass}>
        <ul className={this.props.ulclass}>
          {links.map((ele, id) => {
            return (
              <li key={id}>
                <Link to={ele.link}>{ele.name}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
