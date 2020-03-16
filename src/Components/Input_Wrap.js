import React from "react";

class InputWrap extends React.Component {
  removeAlert = ele => {
    try {
      ele.target.parentNode
        .getElementsByClassName("InvalidMessges")[0]
        .classList.remove("show");
    } catch (err) {}
  };
  render() {
    let alert = <div></div>;
    alert = <div className="InvalidMessges">{this.props.invalidMessage}</div>;
    return (
      <div
        className={
          this.props.type === "checkbox"
            ? "checkbox_input InputWrapp "
            : "InputWrapp "
        }
      >
        <input
          name={this.props.name.toLowerCase()}
          type={this.props.type || "text"}
          placeholder={this.props.placeholder}
          onClick={this.removeAlert}
          onFocus={this.removeAlert}
          defaultValue={this.props.userCredential || ""}
          defaultChecked={this.props.checked}
          required={this.props.type === "checkbox"}
        />
        {alert}
      </div>
    );
  }
}
InputWrap.defaultProps = {
  type: "text"
};
export default InputWrap;
