import React, { Component } from "react";
import { myUrl } from "../credentials";
import Axios from "axios";

import cookie from "react-cookies";
export default class PostWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: props.post
    };
  }

  handelSignlePost = ele => {
    ele.preventDefault();
    this.props.history.push(
      "/myindex/singlepost/" + this.state.post._id,
      this.state.post
    );
  };

  componentDidUpdate() {
    // Setting new data to it's state
    if (this.props.post._id !== this.state.post._id) {
      this.setState({ post: this.props.post });
    }
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

  render() {
    let myPostComments = "0 Comment";
    if (this.state.post.comments) {
      myPostComments =
        (this.state.post.comments.length || 0) +
        (this.state.post.comments.length > 1 ? " Comments" : " Comment");
    }
    return (
      <div className="contnt_2">
        <div className="div_a">
          {/*****TITLE***************************/}
          <div className="div_title">{this.props.post.title}</div>
          {/*****CATEGORY***************************/}
          <div className="btm_rgt">
            <div className="btm_arc">{this.props.post.categoryName}</div>
          </div>
          <div className="div_top" onClick={this.handelSignlePost}>
            {this.state.post.postImage ? (
              <div className="div_top_lft">
                <img src={this.props.post.userImage} alt="UserImg" />
                {this.props.post.userName || "USERNAME"}
              </div>
            ) : (
              <></>
            )}
            <div className="div_top_rgt">
              <span className="span_date">
                {this.props.post.postDate || ""}
              </span>
              <span className="span_time">
                {this.props.post.postTime || ""}
              </span>
            </div>
          </div>
          <div
            className="div_image"
            onClick={this.handelSignlePost}
            style={{ display: "flex", justifyContent: "center" }}
          >
            {this.state.post.postImage ? (
              <img
                src={this.props.post.postImage}
                alt="pet"
                style={{ maxHeight: "500px", width: "auto", minWidth: "25%" }}
              />
            ) : (
              <></>
            )}
          </div>
          {/*******POST BOTTOM BUTTONS******************************/}
          <div className="div_btm">
            <div className="btm_list">
              <ul>
                {this.state.post.allFlags ? (
                  <li>
                    <a href="/" onClick={this.handelShare}>
                      <span className="btn_icon">
                        <img src="/images/icon_001.png" alt="share" />
                      </span>
                      Share
                    </a>
                  </li>
                ) : (
                  <></>
                )}
                {this.state.post.allFlags ? (
                  <li>
                    <a href="/" onClick={this.handelFlag}>
                      <span className="btn_icon">
                        <img src="/images/icon_002.png" alt="share" />
                      </span>
                      {this.state.post.isFlaged ? "Unflag" : "Flag"}
                    </a>
                  </li>
                ) : (
                  <></>
                )}
                {this.state.post.comments ? (
                  <li>
                    <a href="/" onClick={this.handelSignlePost}>
                      <span className="btn_icon">
                        <img src="/images/icon_004.png" alt="share" />
                      </span>
                      {myPostComments}
                    </a>
                  </li>
                ) : (
                  <></>
                )}
                {/********LIKES***************************/}
                {this.state.post.allLikes ? (
                  <>
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
                  </>
                ) : (
                  <></>
                )}
                {/********UNLIKES***************************/}
                {this.state.post.allUnlikes ? (
                  <>
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
                  </>
                ) : (
                  <></>
                )}
              </ul>
            </div>
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
