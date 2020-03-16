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
  },
  {
    name: "Email",
    placeholder: "Enter Your Email"
  },

  {
    name: "First Name",
    placeholder: "Enter Your First Name"
  },
  {
    name: "Last Name",
    placeholder: "Last Name"
  },
  {
    name: "Checkbox",
    type: "checkbox",
    data: "I agree to Term & Conditions"
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
  return data;
}
export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: mydata,
      dataValidation: getValidatoin(),
      isbtnClicked: false
    };
    console.log("state>>>", this.state);
  }
  check_Validate = ele => {
    let statedata = this.state.dataValidation;
    Axios.post(myUrl + "/user/validate", { name: ele.name, value: ele.value })
      .then(res => {
        if (res.data.status === true) {
          //validation Sucessfull
          statedata[ele.name].valid = true;
          statedata[ele.name].invalidMessage = "Fill Data";
        } else {
          //validaiton UnSucessfuk
          statedata[ele.name].valid = false;
          statedata[ele.name].invalidMessage = ele.name + " Already Registered";
        }
        this.setState({ dataValidation: statedata });
      })
      .catch(err => {
        console.log("Axios Validation Err");
      });

    return true;
  };

  componentDidUpdate() {
    let old_validation = this.state.dataValidation;
    let data = Object.keys(old_validation).filter(
      ele => !old_validation[ele].valid
    );
    [...document.getElementsByClassName("show")].forEach(ele => {
      ele.classList.remove("show");
    });
    let allInput = [...document.getElementsByTagName("input")].filter(ele => {
      return data.indexOf(ele.name) !== -1;
    });
    //Show Alert message
    allInput.forEach(ele => {
      ele.parentNode
        .getElementsByClassName("InvalidMessges")[0]
        .classList.add("show");
    });
    if (this.state.isbtnClicked) {
      if (data.length === 0) {
        //Here we send axios signal'

        let formData = new FormData(document.getElementsByTagName("form")[0]);
        Axios.post(myUrl + "/user/registration", formData)
          .then(res => {
            this.setState({ isbtnClicked: false });
            if (res.data.status) {
              console.log("res>>>data>>", res.data, res.data.data || "null");
              cookie.save("userInfoForLogin", res.data.data, { path: "/" });
              this.props.history.push("/myindex");
            } else {
            }
            console.log("res,data", res);
          })
          .catch(err => {
            console.log("Axios :RegistrationApi");
          });
      }
    }
  }
  handelForm = ele => {
    ele.preventDefault();
    try {
      setTimeout(() => {
        let oldData = this.state.dataValidation;
        for (let x in oldData) {
          oldData[x].valid = true;
        }
        if (window.location.href.search("/regis") >= 0)
          this.setState({ dataValidation: oldData });
      }, 2000);

      let old_validation = this.state.dataValidation;
      Object.keys(old_validation).forEach(
        ele => (old_validation[ele].valid = false)
      );
      let input_tags = [...ele.target.getElementsByTagName("input")];
      input_tags.forEach(ele => {
        if (ele.type === "submit") return null;
        if (ele.type === "checkbox") {
          old_validation[ele.name].valid = true;
          return null;
        }
        if (ele.name === "username" && ele.value !== "") {
          this.check_Validate(ele, this.state.dataValidation);
          return null;
        }
        if (ele.name === "email" && ele.value !== "") {
          if (
            ele.value.match(
              /^([a-zA-Z0-9_\-\\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
            ) === null
          ) {
            old_validation[ele.name].invalidMessage = "Invalid Email";
          } else {
            this.check_Validate(ele);
            old_validation[ele.name].invalidMessage = "";
          }
          return null;
        }
        old_validation[ele.name].valid = ele.value.trim() !== "";
      });
      this.setState({ dataValidation: old_validation, isbtnClicked: true });
      //Here We Check Whether we need to send data or not
      // IN didUpdate we send data
    } catch (err) {
      return null;
    }
  };
  render() {
    return (
      <div className="register_sec">
        <form method="post" onSubmit={this.handelForm}>
          <h1>Create An Account</h1>
          <ul>
            {this.state.data.map((ele, id) => (
              <div key={id}>
                <li>
                  <span>{ele.type === "checkbox" ? "" : ele.name}</span>
                  <InputWrap
                    name={ele.name}
                    type={ele.type}
                    placeholder={ele.placeholder || "Enter Data"}
                    invalidMessage={
                      this.state.dataValidation[ele.name.toLowerCase()]
                        ? this.state.dataValidation[ele.name.toLowerCase()]
                            .invalidMessage
                        : "Fill Data"
                    }
                  />
                  {ele.data}
                </li>
              </div>
            ))}
            <li>
              <input type="submit" value="Register" />
            </li>
          </ul>
        </form>
        <div className="addtnal_acnt">
          I already have an account.
          <Link to="/user/login">Login My Account !</Link>
        </div>
      </div>
    );
  }
}
