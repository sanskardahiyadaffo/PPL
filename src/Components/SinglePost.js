import React, { useState, useEffect } from "react";
import { myUrl } from "../credentials";
import Axios from "axios";
import cookie from "react-cookies";
export default function SinglePost(props) {
  console.log(props, "This is Single POst");
  const [post, postUpdater] = useState({
    comments: []
  });

  const getCurrentPost = async () => {
    try {
      let response = await Axios.get(
        myUrl + "/post/getpost?_id=" + props.match.params._id
      );
      let mydata = [];
      let l = response.data.length;
      for (let index = 0; index < l; index++) {
        const ele = response.data[index];
        // filter desire category only
        if (ele._id !== props.match.params._id) return null;
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
      console.log(mydata, "<<<Single Post");
      if (mydata[0]) postUpdater(mydata[0]);
    } catch (err) {
      console.log("Axios Error in single post");
    }
  };

  useEffect(() => {
    getCurrentPost();
  }, []);

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

  const handelComment = ele => {
    ele.preventDefault();
  };

  const handelCommentForm = ele => {
    ele.preventDefault();
    let value = ele.target.getElementsByTagName("input")[0].value;
    ele.target.getElementsByTagName("input")[0].value = "";
    post.comments.push({
      _id: cookie.load("userInfoForLogin")._id,
      username: cookie.load("userInfoForLogin").username,
      value: value
    });
    AxiosCall({ _id: post._id, value: post });
    postUpdater({ ...post });
  };
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
        <div className="div_title">{post.title}</div>
        {/*****CATEGORY***************************/}
        <div className="btm_rgt">
          <div className="btm_arc">{post.categoryName}</div>
        </div>
        <div className="div_top">
          <div className="div_top_lft">
            <img src={post.userImage} alt="UserImg" />
            {post.userName || "USERNAME"}
          </div>
          <div className="div_top_rgt">
            <span className="span_time">{post.postTime}</span>
            <span className="span_date">{post.postDate}</span>
          </div>
        </div>
        <div className="div_image">
          <img src={post.postImage} alt="pet" />
        </div>
        <div className="div_btm">
          <div className="btm_list">
            <ul>
              <li>
                <a href="/" onClick={handelShare}>
                  <span className="btn_icon">
                    <img src="/images/icon_001.png" alt="share" />
                  </span>
                  Share
                </a>
              </li>
              <li>
                <a href="/" onClick={handelFlag}>
                  <span className="btn_icon">
                    <img src="/images/icon_002.png" alt="share" />
                  </span>
                  {post.isFlaged ? "Unflag" : "Flag"}
                </a>
              </li>
              <li>
                <a href="/" onClick={handelComment}>
                  <span className="btn_icon">
                    <img src="/images/icon_004.png" alt="share" />
                  </span>
                  {post.comments.length || 0}
                  {post.comments.length > 1 ? " Comments" : " Comment"}
                </a>
              </li>
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

              <li style={{ float: "right" }}>
                <a
                  href="/"
                  onClick={ele => {
                    ele.preventDefault();
                    props.history.push("/myindex", {
                      cstmSinglePostData: post
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
      <div className="Comments" id={post._id}>
        {post.comments.map((ele, id) => (
          <div key={id} className="comment_div">
            <img src={post.userImage} alt="UserImg" />
            {ele.username || "UserName"}
            <div className="comment_txt">{ele.value || "Comment"}</div>
          </div>
        ))}
        <div className="comment_div">
          <div style={{ fontSize: "15px" }}>
            <img src={post.userImage} alt="UserImg" />
            &nbsp; &nbsp; &nbsp;
            {username111}
          </div>
          <form method="post" onSubmit={handelCommentForm}>
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

const AxiosCall = data => {
  Axios.post(myUrl + "/post/updatepost", data)
    .then(res => {
      console.log("Axios :postWrapper>", res);
    })
    .catch(err => {
      console.log("Axios ERR :postWrapper>");
    });
};
