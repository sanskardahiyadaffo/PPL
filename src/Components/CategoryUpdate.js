import React from "react";
import Axios from "axios";
import { myUrl } from "../credentials";

export default function CategoryUpdate(props) {
  console.log("This is category Update", props);
  const handelUpload = ele => {
    ele.preventDefault();
    // Will send this data for upload
    if (document.getElementById("CategoryAlert").style.display === "none") {
      let formdata = new FormData(
        document.getElementById("Upload_Form_category")
      );
      formdata.append("_id", props._id);
      Axios.post(myUrl + "/category/add", formdata)
        .then(res => {
          props.updateCategory();
          props.history.push("/myindex");
        })
        .catch(err => {
          console.log("Axios ERR:CategoryUpdate ");
          props.history.push("/myindex");
        });
    } else {
      document.getElementById("UploadBtn").style.color = "red";
    }
  };
  const checkCategory = ele => {
    let value = ele.target.value.toUpperCase();
    let mydata = props.myCategories.map(ele => ele.name);
    document.getElementById("CategoryAlert").style.display = "none";
    document.getElementById("UploadBtn").style.color = "black";
    if (mydata.indexOf(value) !== -1) {
      document.getElementById("CategoryAlert").style.display = "inline";
    }
  };
  return (
    <div className="post_div">
      <form method="POST" onSubmit={handelUpload} id="Upload_Form_category">
        <div className="post_txt">
          <div>
            <span>
              <input
                type="test"
                placeholder="Enter Category"
                name="name"
                style={{ width: "90%" }}
                required
                onChange={checkCategory}
              />
            </span>
          </div>
          <div>
            <span
              id="CategoryAlert"
              style={{
                color: "Red",
                outline: "1px solid red",
                padding: "5px",
                margin: "5px",
                display: "none"
              }}
            >
              This Category Already Exists..!!
            </span>
          </div>
          <div>
            Category Image:&nbsp;&nbsp;
            <span>
              <input type="file" name="photo" required />
            </span>
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
            <input type="submit" value="Add Category" id="UploadBtn" />
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
