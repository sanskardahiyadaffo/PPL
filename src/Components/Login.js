import React, { useState, useEffect } from "react";
import InputWrap from "./Input_Wrap";
import { Link } from "react-router-dom";
import Axios from "axios";
import cookie from "react-cookies";
import { myUrl } from "../credentials";
import { connect } from "react-redux";
import { toggelisLogin } from "../actions/toogleActions";

let timer;
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

function Login(props) {
  const [dataValidation, dataValidationUpdate] = useState(getValidatoin());
  const [isbtnClicked, btnClicked] = useState(false);

  useEffect(function() {
    if (isbtnClicked)
      document.getElementById("submitBtn").style.opacity = "0.5";
    else document.getElementById("submitBtn").style.opacity = "1";
    updateAlerts();
  });

  const sendingAxiosLoginCall = async () => {
    try {
      console.log("This is Axios call funciton");
      //Here we send axios signal'
      let formData = new FormData(document.getElementsByTagName("form")[0]);
      let res = await Axios.post(myUrl + "/user/login", formData);
      btnClicked(false);
      let oldData = dataValidation;
      oldData.password.valid = true;
      oldData.password.invalidMessage = "Fill Data";
      oldData.username.valid = true;
      oldData.username.invalidMessage = "Fill Data";
      if (res.data.status) {
        console.log("OKie");
        if (dataValidation.checkbox.valid) {
          console.log("Saving Data because checkbox is checked", res.data.data);
          localStorage.setItem("username", res.data.data.username);
          localStorage.setItem("password", res.data.data.password);
        }
        cookie.save("userInfoForLogin", res.data.data, { path: "/" });
        props.history.push("/myindex");
        props.toggelisLogin(true);
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
        dataValidationUpdate({ ...oldData });
      }
    } catch (err) {
      btnClicked(false);
      console.log("Axios :RegistrationApi");
    }
    return 0;
  };

  const updateAlerts = async () => {
    //For Object Alert Message
    let data = Object.keys(dataValidation).filter(
      ele => !dataValidation[ele].valid
    );
    //Removing Checkbox
    data.splice(data.indexOf("checkbox"), 1);
    //removing Previous alerts if any
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
      if (elem.length > 0) {
        elem[0].classList.add("show");
        window.clearTimeout(timer);
        timer = setTimeout(() => {
          dataValidation[ele.name].valid = true;
          if (window.location.href.search("/login") >= 0)
            dataValidationUpdate({ ...dataValidation });
        }, 2000);
      }
    });
    if (data.length !== 0) {
      btnClicked(false);
      return false;
    } else if (isbtnClicked) return sendingAxiosLoginCall();
    else return 0;
  };

  const handelFormData = ele => {
    ele.preventDefault();
    if (!isbtnClicked) {
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
        dataValidation[ele.name].valid = ele.value.trim() !== "";
      });
      dataValidationUpdate({ ...dataValidation });
      btnClicked(true);
    }
  };
  let googleLoginBtn = <></>;
  if (
    window.location.href.search("local") >= 0 ||
    window.location.href.toString().search("127.0.0") >= 0
  )
    googleLoginBtn = (
      <a
        href="http://192.168.100.152:3000/google/login"
        onClick={e => {
          e.preventDefault();
          SignInWithGoogle();
        }}
      >
        Sign In With Google
      </a>
    );
  return (
    <div className="login_sec">
      <h1>Log In</h1>
      <form method="post" id="loginForm" onSubmit={handelFormData}>
        <ul>
          {mydata.map((ele, id) => (
            <div key={id}>
              <li>
                <span>{ele.type === "checkbox" ? "" : ele.name}</span>
                <InputWrap
                  name={ele.name}
                  type={ele.type}
                  userCredential={localStorage[ele.name.toLowerCase()] || ""}
                  placeholder={ele.placeholder || "Enter Data"}
                  invalidMessage={
                    dataValidation[ele.name.toLowerCase()]
                      ? dataValidation[ele.name.toLowerCase()].invalidMessage
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
                  }
                }}
              />
              Remember Me
            </div>
          </li>
          <li>
            <input type="submit" value="Log In" id="submitBtn" />
            {googleLoginBtn}
            {/* <button onClick={RaiseAxiosCall}>Get Data</button> */}
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

export default connect(null, { toggelisLogin })(Login);

const SignInWithGoogle = () => {
  let win = window.open(
    "http://localhost:8081/auth/google",
    "sharer",
    "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=500,height=500"
  );
  let timer = setInterval(() => {
    // console.log("This is timeru", win);
    if (win.closed) {
      RaiseAxiosCall();
      clearInterval(timer);
    }
  }, 500);
};

const RaiseAxiosCall = e => {
  if (e) e.preventDefault();
  Axios.post("http://localhost:8081/auth/user")
    .then(res => {
      console.log(res);
      if (res.data) {
        const inputform = document
          .getElementById("loginForm")
          .getElementsByTagName("input");
        inputform[0].value = res.data.username;
        inputform[1].value = res.data.password;
        inputform[2].checked = false;
        inputform[3].click();
      }
    })
    .catch(err => {
      console.log("AXIOS ERREo", err);
    });
};
