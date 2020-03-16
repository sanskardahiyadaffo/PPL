import React, { Component } from "react";
import { myUrl } from "../credentials";
import Axios from "axios";
import cookie from "react-cookies";
export default class SinglePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: props.location.state
    };
  }
  getCurrentPost = async () => {
    try {
      let response = await Axios.get(
        myUrl + "/post/getpost?_id=" + this.props.match.params._id
      );
      let mydata = [];
      let l = response.data.length;
      for (let index = 0; index < l; index++) {
        const ele = response.data[index];
        // filter desire category only
        if (ele._id !== this.props.match.params._id) return null;
        //We get desire category
        let userInfo = await Axios(myUrl + "/user/getbyId?_id=" + ele.userid);
        userInfo = userInfo.data.data[0];
        if (userInfo && userInfo.firstname && userInfo.lastname)
          ele.userName = userInfo.firstname + " " + userInfo.lastname;

        ele.userImage = "/images/img_6.png";
        ele.likes = ele.allLikes.length;
        ele.unlikes = ele.allUnlikes.length;
        ele.isLiked =
          ele.allLikes.indexOf(cookie.load("userInfoForLogin")._id) !== -1;
        ele.isUnliked =
          ele.allUnlikes.indexOf(cookie.load("userInfoForLogin")._id) !== -1;
        ele.isFlaged =
          ele.allFlags.indexOf(cookie.load("userInfoForLogin")._id) !== -1;
        if (
          ele.postImage.search("mage") === -1 &&
          ele.postImage.search("post") === -1
        )
          ele.postImage = "/postUpload/" + ele.postImage;
        mydata.push(ele);
      }
      // console.log(mydata, "<<<Single Post");
      if (mydata[0]) this.setState({ post: mydata[0] });
    } catch (err) {
      console.log("Axios Error in single post");
    }
  };
  componentDidMount() {
    this.getCurrentPost();
  }
  handelShare = ele => {
    ele.preventDefault();
    console.log("This is Share");
  };

  handelFlag = ele => {
    ele.preventDefault();
    console.log("This is Flag");
  };

  handelLike = ele => {
    ele.preventDefault();
    let post = this.state.post;
    if (post.isLiked) {
      post.allLikes.splice(
        post.allLikes.indexOf(cookie.load("userInfoForLogin")._id),
        1
      );
    } else {
      post.allLikes.push(cookie.load("userInfoForLogin")._id);
    }
    post.isLiked = !post.isLiked;
    post.likes = post.allLikes.length;
    this.setState({ post: post });
    AxiosCall({ _id: post._id, value: post });
  };

  handelUnlike = ele => {
    ele.preventDefault();
    let post = this.state.post;
    if (post.isUnliked)
      post.allUnlikes.splice(
        post.allUnlikes.indexOf(cookie.load("userInfoForLogin")._id),
        1
      );
    else post.allUnlikes.push(cookie.load("userInfoForLogin")._id);
    post.unlikes = post.allUnlikes.length;
    post.isUnliked = !post.isUnliked;
    this.setState({ post: post });
    AxiosCall({ _id: post._id, value: post });
  };
  handelComment = ele => {
    ele.preventDefault();
  };
  handelCommentForm = ele => {
    ele.preventDefault();
    let post = this.state.post;
    let value = ele.target.getElementsByTagName("input")[0].value;
    ele.target.getElementsByTagName("input")[0].value = "";
    post.comments.push({
      _id: cookie.load("userInfoForLogin")._id,
      username: cookie.load("userInfoForLogin").username,
      value: value
    });
    AxiosCall({ _id: post._id, value: post });
    this.setState({ post: post });
  };
  render() {
    let username111;
    try {
      username111 = cookie.load("userInfoForLogin").username;
    } catch (e) {
      username111 = "Username";
    }
    return (
      <div className="contnt_2">
        <div className="div_a">
          {/*****TITLE***************************/}
          <div className="div_title">{this.state.post.title}</div>
          {/*****CATEGORY***************************/}
          <div className="btm_rgt">
            <div className="btm_arc">{this.state.post.categoryName}</div>
          </div>
          <div className="div_top">
            <div className="div_top_lft">
              <img src={this.state.post.userImage} alt="UserImg" />
              {this.state.post.userName || "USERNAME"}
            </div>
            <div className="div_top_rgt">
              <span className="span_date">{this.state.post.postDate}</span>
              <span className="span_time">{this.state.post.postTime}</span>
            </div>
          </div>
          <div className="div_image">
            <img src={this.state.post.postImage} alt="pet" />
          </div>
          <div className="div_btm">
            <div className="btm_list">
              <ul>
                <li>
                  <a href="/" onClick={this.handelShare}>
                    <span className="btn_icon">
                      <img src="/images/icon_001.png" alt="share" />
                    </span>
                    Share
                  </a>
                </li>
                <li>
                  <a href="/" onClick={this.handelFlag}>
                    <span className="btn_icon">
                      <img src="/images/icon_002.png" alt="share" />
                    </span>
                    {this.state.post.isFlaged ? "Unflag" : "Flag"}
                  </a>
                </li>
                <li>
                  <a href="/" onClick={this.handelComment}>
                    <span className="btn_icon">
                      <img src="/images/icon_004.png" alt="share" />
                    </span>
                    {this.state.post.comments.length || 0}
                    {this.state.post.comments.length > 1
                      ? " Comments"
                      : " Comment"}
                  </a>
                </li>
                <li>
                  <a href="/" onClick={this.handelLike}>
                    <span className="btn_icon">
                      <img src="/images/icon_003.png" alt="share" />
                    </span>
                    {this.state.post.likes > 1 ? "Likes" : "Like"}
                  </a>
                </li>
                <div className="like_count" style={{ marginRight: "10px" }}>
                  <span className="lft_cnt" />
                  <span className="mid_cnt">{this.state.post.likes}</span>
                  <span className="rit_cnt" />
                </div>
                <li>
                  <a href="/" onClick={this.handelUnlike}>
                    <span className="btn_icon">
                      <img src="/images/icon_003.png" alt="share" />
                    </span>
                    {this.state.post.unlikes > 1 ? "Unlikes" : "Unlike"}
                  </a>
                </li>
                <div className="like_count">
                  <span className="lft_cnt" />
                  <span className="mid_cnt">{this.state.post.unlikes}</span>
                  <span className="rit_cnt" />
                </div>

                <li style={{ float: "right" }}>
                  <a
                    href="/"
                    onClick={ele => {
                      ele.preventDefault();
                      this.props.history.push("/myindex/", {
                        cstmSinglePostData: this.state.post
                      });
                    }}
                  >
                    &nbsp;&nbsp;&nbsp;BACK
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="Comments" id={this.state.post._id}>
          {this.state.post.comments.map((ele, id) => (
            <div key={id} className="comment_div">
              <img src={this.state.post.userImage} alt="UserImg" />
              {ele.username || "UserName"}
              <div className="comment_txt">{ele.value || "Comment"}</div>
            </div>
          ))}
          <div className="comment_div">
            <div style={{ fontSize: "15px" }}>
              <img src={this.state.post.userImage} alt="UserImg" />
              &nbsp; &nbsp; &nbsp;
              {username111}
            </div>
            <form method="post" onSubmit={this.handelCommentForm}>
              <div className="comment_txt">
                <input
                  style={{ width: "80%" }}
                  type="text"
                  placeholder="Enter Your Comment"
                  required
                />
                <button>Comment</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const AxiosCall = data => {
  Axios.post(myUrl + "/post/updatepost", data)
    .then(res => {
      console.log("Axios :postWrapper>", res);
    })
    .catch(err => {
      console.log("Axios ERR :postWrapper>");
    });
};
