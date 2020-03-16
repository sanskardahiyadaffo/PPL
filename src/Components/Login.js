import React, { Component } from "react";
import InputWrap from "./Input_Wrap";
import { Link } from "react-router-dom";
import Axios from "axios";
import cookie from "react-cookies";
import { myUrl } from "../credentials";

let mydata = [
  {
    name: "Username",
    placeholder: "Enter Your Username"
  },
  {
    name: "Password",
    placeholder: "Enter Your Password",
    type: "password"
  }
];
function getValidatoin() {
  let data = {};
  mydata.forEach(ele => {
    let temp = {};
    temp.valid = true;
    temp.invalidMessage = "Fill Data";
    data[ele.name.toLowerCase()] = temp;
  });
  data.checkbox = { valid: true };

  return data;
}
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: mydata,
      dataValidation: getValidatoin(),
      isbtnClicked: false
    };
  }

  componentDidUpdate() {
    let old_validation = this.state.dataValidation;
    //filtering False validation value
    let data = Object.keys(old_validation).filter(
      ele => !old_validation[ele].valid
    );
    data.splice(data.indexOf("checkbox"), 1);
    // removing all alertss
    [...document.getElementsByClassName("show")].forEach(ele => {
      ele.classList.remove("show");
    });
    // Fetch new input tags to show alert
    let allInput = [...document.getElementsByTagName("input")].filter(ele => {
      return data.indexOf(ele.name) !== -1;
    });
    //Show Alert message
    allInput.forEach(ele => {
      let elem = ele.parentNode.getElementsByClassName("InvalidMessges");
      if (elem.length > 0) elem[0].classList.add("show");
    });
    if (this.state.isbtnClicked) {
      if (data.length === 0) {
        //Here we send axios signal'
        let formData = new FormData(document.getElementsByTagName("form")[0]);
        Axios.post(myUrl + "/user/login", formData)
          .then(res => {
            this.setState({ isbtnClicked: false });
            let oldData = this.state.dataValidation;
            oldData.password.valid = true;
            oldData.password.invalidMessage = "Fill Data";
            oldData.username.valid = true;
            oldData.username.invalidMessage = "Fill Data";
            if (res.data.status) {
              if (this.state.dataValidation.checkbox.valid) {
                console.log(
                  "Saving Data because checkbox is checked",
                  res.data.data
                );
                localStorage.setItem("username", res.data.data.username);
                localStorage.setItem("password", res.data.data.password);
              }
              cookie.save("userInfoForLogin", res.data.data, { path: "/" });
              this.props.toggelIsLoginState(true);
              console.log("Pushed to front");
              this.props.history.push("/myindex");
            } else {
              if (res.data.name === "Password-MisMatch") {
                //Invalid Password
                oldData.password.valid = false;
                oldData.password.invalidMessage = "Password MisMatch";
              } else if (res.data.data.name === "User Not Found") {
                // Invalid Username
                oldData.username.valid = false;
                oldData.username.invalidMessage = "User Not Found";
              }

              this.setState({ dataValidation: oldData });
            }
          })
          .catch(err => {
            console.log("Axios :RegistrationApi");
          });
      }
    }
  }

  handelFormDara = ele => {
    ele.preventDefault();
    let old_validation = this.state.dataValidation;
    Object.keys(old_validation).forEach(
      ele => (old_validation[ele].valid = false)
    );
    let input_tags = [...ele.target.getElementsByTagName("input")];
    input_tags.forEach(ele => {
      if (ele.type === "submit") return null;
      if (ele.type === "checkbox") {
        old_validation[ele.name].valid = ele.checked;
        return null;
      }
      old_validation[ele.name].valid = ele.value.trim() !== "";
    });
    setTimeout(() => {
      let oldData = this.state.dataValidation;
      for (let x in oldData) {
        oldData[x].valid = true;
      }
      if (window.location.href.search("/login") >= 0)
        this.setState({ dataValidation: oldData });
    }, 2000);
    this.setState({ dataValidation: old_validation, isbtnClicked: true });
  };
  render() {
    return (
      <div className="login_sec">
        <h1>Log In</h1>
        <form method="post" onSubmit={this.handelFormDara}>
          <ul>
            {this.state.data.map((ele, id) => (
              <div key={id}>
                <li>
                  <span>{ele.type === "checkbox" ? "" : ele.name}</span>
                  <InputWrap
                    name={ele.name}
                    type={ele.type}
                    userCredential={localStorage[ele.name.toLowerCase()] || ""}
                    placeholder={ele.placeholder || "Enter Data"}
                    invalidMessage={
                      this.state.dataValidation[ele.name.toLowerCase()]
                        ? this.state.dataValidation[ele.name.toLowerCase()]
                            .invalidMessage
                        : "Fill Data"
                    }
                    checked={localStorage.username ? true : false}
                  />
                  {ele.data}
                </li>
              </div>
            ))}
            <li>
              <div>
                <input
                  name="checkbox"
                  type="checkbox"
                  defaultChecked={localStorage.length !== 0}
                  onClick={ele => {
                    if (!ele.target.checked) {
                      if (localStorage.username)
                        localStorage.removeItem("username");
                      if (localStorage.password)
                        localStorage.removeItem("password");
                      this.setState({});
                    }
                  }}
                />
                Remember Me
              </div>
            </li>
            <li>
              <input type="submit" value="Log In" />
              {/* <Link to="/">Forgot Password</Link> */}
            </li>
          </ul>
        </form>
        <div className="addtnal_acnt">
          I do not have any account yet.
          <Link to="/user/registration">Create My Account Now !</Link>
        </div>
      </div>
    );
  }
}
