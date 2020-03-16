import React, { useState, useEffect } from "react";
import InputWrap from "./Input_Wrap";
import { Link } from "react-router-dom";
import Axios from "axios";
import cookie from "react-cookies";
import { myUrl } from "../credentials";
import { toggelisLogin } from "../actions/toogleActions";
import { connect } from "react-redux";
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

function Registration(props) {
  const [dataValidation, dataValidationUpdate] = useState(getValidatoin());
  const [isbtnClicked, btnClicked] = useState(false);

  useEffect(() => {
    console.log("use Effect starts");
    if (isbtnClicked)
      document.getElementById("submitBtn").style.opacity = "0.5";
    else document.getElementById("submitBtn").style.opacity = "1";
    updateAlerts();
    console.log(isbtnClicked, dataValidation);
    console.log("use Effect sends");
  });

  const updateAlerts = async () => {
    let old_validation = dataValidation;
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
    if (isbtnClicked) {
      if (data.length === 0) {
        //Here we send axios signal'

        let formData = new FormData(document.getElementsByTagName("form")[0]);
        Axios.post(myUrl + "/user/registration", formData)
          .then(res => {
            btnClicked(false);
            if (res.data.status) {
              console.log("res>>>data>>", res.data, res.data.data || "null");
              cookie.save("userInfoForLogin", res.data.data, { path: "/" });
              props.history.push("/myindex");
              props.toggelisLogin(true);
            } else {
            }
            console.log("res,data", res);
          })
          .catch(err => {
            console.log("Axios :RegistrationApi");
          });
      }
    }
  };

  const check_Validate = ele => {
    Axios.post(myUrl + "/user/validate", { name: ele.name, value: ele.value })
      .then(res => {
        if (res.data.status === true) {
          //validation Sucessfull
          dataValidation[ele.name].valid = true;
          dataValidation[ele.name].invalidMessage = "Fill Data";
        } else {
          //validaiton UnSucessfuk
          dataValidation[ele.name].valid = false;
          dataValidation[ele.name].invalidMessage =
            ele.name + " Already Registered";
        }
        dataValidationUpdate({ ...dataValidation });
      })
      .catch(err => {
        console.log("Axios Validation Err");
      });

    return true;
  };

  const handelForm = ele => {
    ele.preventDefault();
    //Set each validatoin to false
    Object.keys(dataValidation).forEach(
      ele => (dataValidation[ele].valid = false)
    );
    //Fetch All Input Tags
    let input_tags = [...ele.target.getElementsByTagName("input")];
    input_tags.forEach(ele => {
      if (ele.type === "submit") return null;
      if (ele.type === "checkbox") {
        dataValidation[ele.name].valid = ele.checked;
        return null;
      }

      if (ele.name === "username" && ele.value !== "") {
        check_Validate(ele, dataValidation);
        return null;
      }
      if (ele.name === "email" && ele.value !== "") {
        if (
          ele.value.match(
            /^([a-zA-Z0-9_\-\\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
          ) === null
        ) {
          dataValidation[ele.name].invalidMessage = "Invalid Email";
        } else {
          check_Validate(ele);
          dataValidation[ele.name].invalidMessage = "";
        }
        return null;
      }

      dataValidation[ele.name].valid = ele.value.trim() !== "";
    });
    dataValidationUpdate({ ...dataValidation });
    btnClicked(true);
  };
  return (
    <div className="register_sec">
      <form method="post" onSubmit={handelForm}>
        <h1>Create An Account</h1>
        <ul>
          {mydata.map((ele, id) => (
            <div key={id}>
              <li>
                <span>{ele.type === "checkbox" ? "" : ele.name}</span>
                <InputWrap
                  name={ele.name}
                  type={ele.type}
                  placeholder={ele.placeholder || "Enter Data"}
                  invalidMessage={
                    dataValidation[ele.name.toLowerCase()]
                      ? dataValidation[ele.name.toLowerCase()].invalidMessage
                      : "Fill Data"
                  }
                />
                {ele.data}
              </li>
            </div>
          ))}
          <li>
            <input type="submit" value="Register" id="submitBtn" />
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

export default connect(null, { toggelisLogin })(Registration);
