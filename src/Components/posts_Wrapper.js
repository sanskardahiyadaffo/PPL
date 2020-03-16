import React, { useState } from "react";
import { myUrl } from "../credentials";
import Axios from "axios";

import cookie from "react-cookies";
export default function PostWrapper(props) {
  const [post, postUpdater] = useState(props.post);
  const handelSignlePost = ele => {
    ele.preventDefault();
    props.history.push("/myindex/singlepost/" + post._id, post);
  };

  // Setting new data to it's state
  if (props.post._id !== post._id) {
    postUpdater({ ...props.post });
  }

  const handelShare = ele => {
    ele.preventDefault();
    console.log("This is Share");
  };

  const handelFlag = ele => {
    ele.preventDefault();
    console.log("This is Flag");
  };

  const handelLike = ele => {
    ele.preventDefault();
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
    postUpdater({ ...post });
    AxiosCall({ _id: post._id, value: post });
  };

  const handelUnlike = ele => {
    ele.preventDefault();
    if (post.isUnliked)
      post.allUnlikes.splice(
        post.allUnlikes.indexOf(cookie.load("userInfoForLogin")._id),
        1
      );
    else post.allUnlikes.push(cookie.load("userInfoForLogin")._id);
    post.unlikes = post.allUnlikes.length;
    post.isUnliked = !post.isUnliked;
    postUpdater({ ...post });
    AxiosCall({ _id: post._id, value: post });
  };

  let myPostComments = "0 Comment";
  if (post.comments) {
    myPostComments =
      (post.comments.length || 0) +
      (post.comments.length > 1 ? " Comments" : " Comment");
  }
  return (
    <div className="contnt_2">
      <div className="div_a">
        {/*****TITLE***************************/}
        <div className="div_title">{props.post.title}</div>
        {/*****CATEGORY***************************/}
        <div className="btm_rgt">
          <div className="btm_arc">{props.post.categoryName}</div>
        </div>
        <div className="div_top" onClick={handelSignlePost}>
          {post.postImage ? (
            <div className="div_top_lft">
              <img src={props.post.userImage} alt="UserImg" />
              {props.post.userName || "USERNAME"}
            </div>
          ) : (
            <></>
          )}
          <div className="div_top_rgt">
            <span className="span_date">{props.post.postDate || ""}</span>
            <span className="span_time">{props.post.postTime || ""}</span>
          </div>
        </div>
        <div
          className="div_image"
          onClick={handelSignlePost}
          style={{ display: "flex", justifyContent: "center" }}
        >
          {post.postImage ? (
            <img
              src={props.post.postImage}
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
              {post.allFlags ? (
                <li>
                  <a href="/" onClick={handelShare}>
                    <span className="btn_icon">
                      <img src="/images/icon_001.png" alt="share" />
                    </span>
                    Share
                  </a>
                </li>
              ) : (
                <></>
              )}
              {post.allFlags ? (
                <li>
                  <a href="/" onClick={handelFlag}>
                    <span className="btn_icon">
                      <img src="/images/icon_002.png" alt="share" />
                    </span>
                    {post.isFlaged ? "Unflag" : "Flag"}
                  </a>
                </li>
              ) : (
                <></>
              )}
              {post.comments ? (
                <li>
                  <a href="/" onClick={handelSignlePost}>
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
              {post.allLikes ? (
                <>
                  <li>
                    <a href="/" onClick={handelLike}>
                      <span className="btn_icon">
                        <img src="/images/icon_003.png" alt="share" />
                      </span>
                      {post.likes > 1 ? "Likes" : "Like"}
                    </a>
                  </li>
                  <div className="like_count" style={{ marginRight: "10px" }}>
                    <span className="lft_cnt" />
                    <span className="mid_cnt">{post.likes}</span>
                    <span className="rit_cnt" />
                  </div>
                </>
              ) : (
                <></>
              )}
              {/********UNLIKES***************************/}
              {post.allUnlikes ? (
                <>
                  <li>
                    <a href="/" onClick={handelUnlike}>
                      <span className="btn_icon">
                        <img src="/images/icon_003.png" alt="share" />
                      </span>
                      {post.unlikes > 1 ? "Unlikes" : "Unlike"}
                    </a>
                  </li>
                  <div className="like_count">
                    <span className="lft_cnt" />
                    <span className="mid_cnt">{post.unlikes}</span>
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

const AxiosCall = data => {
  Axios.post(myUrl + "/post/updatepost", data)
    .then(res => {
      console.log("Axios :postWrapper>", res);
    })
    .catch(err => {
      console.log("Axios ERR :postWrapper>");
    });
};
