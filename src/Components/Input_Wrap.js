import React from "react";

function InputWrap(props) {
  const removeAlert = ele => {
    try {
      ele.target.parentNode
        .getElementsByClassName("InvalidMessges")[0]
        .classList.remove("show");
    } catch (err) {}
  };
  let alert = <div></div>;
  alert = <div className="InvalidMessges">{props.invalidMessage}</div>;
  return (
    <div
      className={
        props.type === "checkbox" ? "checkbox_input InputWrapp " : "InputWrapp "
      }
    >
      <input
        name={props.name.toLowerCase()}
        type={props.type || "text"}
        placeholder={props.placeholder}
        onClick={removeAlert}
        onFocus={removeAlert}
        defaultValue={props.userCredential || ""}
        defaultChecked={props.checked}
        required={props.type === "checkbox"}
      />
      {alert}
    </div>
  );
}

export default InputWrap;
