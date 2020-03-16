import React from "react";
import cookie from "react-cookies";
import Axios from "axios";
import { myUrl } from "../credentials";

export default function UploadPost(props) {
  const handelUpload = async ele => {
    ele.preventDefault();
    // Will send this data for upload
    if (document.getElementById("ImageAlert").style.display === "none") {
      let formdata = new FormData(document.getElementById("Upload_Form"));
      formdata.append("userid", cookie.load("userInfoForLogin")._id);
      formdata.append("userName", cookie.load("userInfoForLogin").username);
      console.log("Will Upload data", cookie.load("userInfoForLogin")._id);
      document.getElementById("Upload_Form").style.outline = "none";
      await Axios.post(myUrl + "/post/upload", formdata);
      props.history.push("/myindex", { data: "Uploaddone" });
    }
    return false;
  };
  return (
    <div className="post_div">
      <form method="POST" onSubmit={handelUpload} id="Upload_Form">
        <div className="post_txt">
          <div>
            <input
              type="test"
              placeholder="Enter Title"
              name="title"
              style={{ width: "90%" }}
              required
            />
          </div>
          <div>
            <input
              type="file"
              name="photo"
              style={{ width: "90%" }}
              onChange={e => {
                try {
                  if (
                    e.target.files[0].size > 500000 ||
                    ["image/gif", "image/jpeg", "image/png"]
                      .indexOf(e.target.files[0]["type"])
                      .toString() === "-1"
                  )
                    document.getElementById("ImageAlert").style.display =
                      "inline-block";
                  else
                    document.getElementById("ImageAlert").style.display =
                      "none";
                } catch (e) {
                  document.getElementById("ImageAlert").style.display =
                    "inline-block";
                }
              }}
              required
            />
            <span
              id="ImageAlert"
              style={{
                color: "Red",
                outline: "1px solid red",
                padding: "5px",
                margin: "5px",
                display: "none"
              }}
            >
              Selected image in not a valid Image or Image size exceed..!!
              Max-Sixe:500kb
            </span>
          </div>

          <div>
            Choose Category:
            {props.myCategories.map((ele, id) => (
              <span key={id} className="UploadRadio">
                <input
                  type="radio"
                  name="categoryName"
                  value={ele.name}
                  required
                />
                {ele.name}
              </span>
            ))}
          </div>
        </div>
        <div className="post_list">
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly"
            }}
          >
            <input type="submit" value="Upload" id="UploadBtn" />
            <input
              type="submit"
              value="back"
              id="BackBtn"
              onClick={() => {
                props.history.push("/myindex");
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
