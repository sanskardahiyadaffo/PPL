import React, { useState, useEffect } from "react";
import RightIndex from "./RightIndex";
import IndexForPostContent from "./index_postContent";
import PostWrapper from "./posts_Wrapper";
import { Switch, Route } from "react-router-dom";
import UploadPost from "./UploadPost";
import Axios from "axios";
import cookie from "react-cookies";
import { myUrl } from "../credentials";
import CategoryUpdate from "./CategoryUpdate";
import SinglePost from "./SinglePost";
import Timeline from "./Timeline";

let myInitialCategories = [
  {
    name: "CATS",
    imgUrl: "/images/icon_01.png"
  },
  {
    name: "DOGS",
    imgUrl: "/images/icon_02.png"
  },
  {
    name: "BIRDS",
    imgUrl: "/images/icon_03.png"
  },
  {
    name: "RABBIT",
    imgUrl: "/images/icon_04.png"
  },

  {
    name: "OTHERS",
    imgUrl: "/images/icon_05.png"
  }
];

const myInitialPosts = [
  {
    _id: "cstm1",
    title: "User Interface PSD Source files Web Designing for web",
    categoryName: "Cats",
    postDate: "02 Jan 2014",
    postTime: "11:15am",
    postImage: "/images/lft_img.png",
    userImage: "/images/img_6.png",
    userName: "Steave Waugh",
    likes: 0,
    allLikes: [],
    allUnlikes: [],
    allFlags: [],
    unlikes: 0,
    comments: [],
    isFlaged: false,
    isLiked: false,
    isUnliked: false
  },
  {
    _id: "cstm2",
    title: "User Interface PSD Source files Web Designing for web",
    categoryName: "Dogs",
    postDate: "02 Jan 2014",
    postTime: "11:15am",
    postImage: "/images/lft_img1.png",
    userImage: "/images/img_6.png",
    userName: "Steave Waugh",
    isFlaged: false,
    likes: 0,
    allLikes: [],
    allUnlikes: [],
    allFlags: [],
    unlikes: 0,
    comments: []
  }
];

let showPost = true;
export default function Index(props) {
  // console.log(props.location.key, "Index.js props");
  const [myCategories, categoryUpdater] = useState(myInitialCategories);
  const [myPosts, myPostsUpdater] = useState(myInitialPosts);
  const [myAllposts, myAllpostsUpdater] = useState([]);
  const [CategoryId, CategoryIdUpdater] = useState("");

  const getAllPosts = async (isShowNow = false) => {
    try {
      //Getting new posts
      const response = await Axios.get(myUrl + "/post/getpost");
      //Check if we need to update or not

      if (isShowNow || response.data.length - myAllposts.length > 0) {
        const mydata = [];
        const l = response.data.length;
        for (let index = l - 1; index >= 0; index--) {
          let ele = response.data[index];
          //Fethcing User Info
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
          // myAllposts = mydata;
          if (isShowNow) myPostsUpdater([...mydata]);
        }
        myAllpostsUpdater(mydata);
      }
    } catch (err) {
      console.log("Axios Error:getAllPosts");
    }
  };

  if (showPost) {
    showPost = false;
    getAllPosts(true);
    //Setitng interval to get new post
    setInterval(() => getAllPosts(), 1000 * 10);
  }

  useEffect(() => {
    if (cookie.load("userInfoForLogin")) {
      GetCategories();
    }
  }, []);

  if (props.location.state && props.location.state.data === "Uploaddone") {
    console.log("Upload Data");
    getAllPosts(false);
    props.location.state = {};
  }
  // Just fetch new post if any and show user to update profile
  else if (props.location.state && props.location.state.cstmSinglePostData) {
    console.log("SinglePost Data", props.location.state, myPosts);
    let newPosts = myPosts.map(e => {
      if (e._id === props.location.state.cstmSinglePostData._id)
        return props.location.state.cstmSinglePostData;
      return e;
    });
    myPostsUpdater([...newPosts]);
    props.location.state = {};
  }

  //If not loggedIn then redirect to user
  if (!cookie.load("userInfoForLogin")) {
    console.log("user not loggin");
    props.history.push("/");
  }

  const GetCategories = async () => {
    try {
      let res = await Axios.get(myUrl + "/category/get");
      let Categories = res.data[0].myCategories;
      Categories.push({
        name: "OTHERS",
        imgUrl: "/images/icon_05.png"
      });
      // Setting Categories
      CategoryIdUpdater(res.data[0]._id);
      // return Categories;
      categoryUpdater([...Categories]);
    } catch (e) {}
  };

  //When we Click on new update
  const updateNewPosts = () => {
    myPostsUpdater(myAllposts);
  };

  const update_MyPost_and_WillBeMyPost = post => {
    if (post === "null") myPostsUpdater(myAllposts);
    else myPostsUpdater(post);
  };

  return (
    <div className="container">
      <div className="content" id="mycontent">
        <Switch>
          <Route
            path="/myindex"
            render={props => (
              <RightIndex
                {...props}
                myCategories={myCategories}
                Posts={myAllposts}
                updateParentNewPosts={updateNewPosts}
                updateParent_Post_and_WillBePost={
                  update_MyPost_and_WillBeMyPost
                }
              />
            )}
          />
        </Switch>
        <div className="content_lft">
          <Switch>
            <Route
              path="/myindex/timeline"
              render={props => (
                <Timeline
                  {...props}
                  Posts={myAllposts}
                  updateParentNewPosts={updateNewPosts}
                  updateParent_Post_and_WillBePost={
                    update_MyPost_and_WillBeMyPost
                  }
                />
              )}
            />
            <Route
              path="/myindex/upload"
              render={props => (
                <UploadPost {...props} myCategories={myCategories} />
              )}
            />
            <Route
              path="/myindex/category"
              render={props => {
                return (
                  <CategoryUpdate
                    {...props}
                    myCategories={myCategories}
                    _id={CategoryId}
                    updateCategory={GetCategories}
                  />
                );
              }}
            />
            <Route
              exact
              path="/myindex"
              component={props => (
                <IndexForPostContent
                  {...props}
                  newPost={Math.max(myAllposts.length - myPosts.length, 0)}
                  Posts={myPosts}
                  updateParentNewPosts={updateNewPosts}
                  updateParent_Post_and_WillBePost={
                    update_MyPost_and_WillBeMyPost
                  }
                  handelNewPosts={updateNewPosts}
                />
              )}
            />
          </Switch>
          <Switch>
            <Route path="/myindex/singlepost/:_id" component={SinglePost} />
            <Route
              path="/myindex"
              component={props =>
                myPosts.map((ele, id) => {
                  return <PostWrapper {...props} key={id} post={ele} />;
                })
              }
            />
          </Switch>
        </div>
      </div>
      <div className="clear" />
    </div>
  );
}
