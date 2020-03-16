import React, { Component } from "react";
import cookie from "react-cookies";
import { Link } from "react-router-dom";

let timelineButtons = [
  {
    name: "Timeline",
    link: "/myindex/timeline"
  },
  {
    name: "About",
    link: "/"
  },
  {
    name: "Album",
    link: "/"
  },
  {
    name: "Pets",
    link: "/"
  },
  {
    name: "My Uploads",
    link: "/myindex/timeline/myuploads"
  }
];
export default class Timeline extends Component {
  constructor() {
    super();
    this.state = {
      timelineButtons: timelineButtons
    };
  }
  componentDidMount() {
    this.props.updateParent_Post_and_WillBePost(this.props.Posts);
  }
  handelTimelineButtons = ele => {
    let myBtnName = ele.target.href.split("/").pop();
    if (["timeline", "myuploads"].indexOf(myBtnName) >= 0) {
      if (myBtnName === "myuploads") {
        let mynewPost = this.props.Posts.filter(
          ele => ele.userid === cookie.load("userInfoForLogin")._id
        );
        this.props.updateParent_Post_and_WillBePost(mynewPost);
      } else this.props.updateParent_Post_and_WillBePost("null");
    } else ele.preventDefault();
  };
  render() {
    let activeBtn = 0;
    if (this.props.location.pathname.search("upload") >= 0) activeBtn = 4;
    return (
      <div className="contnt_1">
        <div className="list_1">
          {/* Friends and flags */}
          <ul>
            <li>
              <input type="checkbox" className="chk_bx" />
              Friends
            </li>
            <li>
              <input type="checkbox" className="chk_bx" />
              Flaged
            </li>
          </ul>
        </div>
        <div className="timeline_div">
          <div className="timeline_div1">
            <div className="profile_pic">
              <img src="/images/btn_iconb.png" alt="Profile_Pic" />
              <div className="profile_text">
                <a href="/" onClick={e => e.preventDefault()}>
                  Change Profile Pic
                </a>
              </div>
            </div>
            <div className="profile_info">
              <div className="edit_div">
                <a href="/" onClick={e => e.preventDefault()}>
                  Edit <img src="/images/timeline_img.png" alt="SettingIcon" />
                </a>
              </div>

              <div className="profile_form">
                <ul>
                  <li>
                    <div className="div_name1">Name :</div>
                    <div className="div_name2">
                      {cookie.load("userInfoForLogin")
                        ? (cookie.load("userInfoForLogin").firstname ||
                            cookie.load("userInfoForLogin").username) +
                          " " +
                          (cookie.load("userInfoForLogin").lastname || " ")
                        : "USER NAME"}
                    </div>
                  </li>
                  {/* <li>
                    <div className="div_name1">Sex :</div>
                    <div className="div_name2">Male</div>
                  </li> */}
                  <li>
                    <div className="div_name1">Description :</div>
                    <div className="div_name3">
                      This is an example of a comment. You can create as many
                      comments like this one or sub comments as you like and
                      manage all of your content inside Account.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="timeline_div2">
            <ul>
              {this.state.timelineButtons.map((ele, id) => (
                <li key={id}>
                  <Link
                    to={ele.link}
                    onClick={this.handelTimelineButtons}
                    className={id === activeBtn ? "active" : ""}
                  >
                    {ele.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
