import React, { Component } from "react";
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

const myPosts = [
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
let i = 2;

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myPosts: myPosts,
      myAllposts: [],
      myCategories: [],
      CategoryId: "",
      limit: 5,
      dataRecived: false
    };
    //If not loggedIn then redirect to user
    if (!cookie.load("userInfoForLogin")) {
      console.log("user not loggin");
      this.props.history.push("/");
    }
  }
  GetCategories = async () => {
    Axios.get(myUrl + "/category/get").then(res => {
      let myCategories = res.data[0].myCategories;
      myCategories.push({
        name: "OTHERS",
        imgUrl: "/images/icon_05.png"
      });
      //Setting Categories
      this.setState({
        //Get _id for further insertion
        CategoryId: res.data[0]._id,
        myCategories: myCategories
      });
    });
  };
  // isBottom = el => {
  //   return el.getBoundingClientRect().bottom <= window.innerHeight;
  // };
  // trackScrolling = () => {
  //   const wrappedElement = document.getElementById("root");
  //   if (this.isBottom(wrappedElement)) {
  //     console.log("header bottom reached");
  //     this.setState({
  //       limit: this.state.limit + 5
  //     });
  //     if (this.state.myPosts.length === this.state.myAllposts.length)
  //       document.removeEventListener("scroll", this.trackScrolling);
  //   }
  // };
  componentDidUpdate() {
    // Just fetch new post if any and show user to update profile
    console.log("Index.js>>>DidUpdate Function called " + i++);
    if (this.props.location.state && this.props.location.state.data) {
      this.getAllPosts();
      // console.log("this.props.location.state", this.props.location.state);
    } else if (
      this.props.location.state &&
      this.props.location.state.cstmSinglePostData
    ) {
      let newPosts = this.state.myPosts.map(e => {
        if (e._id === this.props.location.state.cstmSinglePostData._id)
          return this.props.location.state.cstmSinglePostData;
        return e;
      });
      // console.log(">>>props of index", this.props.location.state);
      this.props.location.state = "null";
      this.setState({ myPosts: newPosts });
    }
    // else if (this.state.dataRecived) {
    //   document.addEventListener("scroll", this.trackScrolling);
    //   if (this.state.myPosts.length > this.state.limit) {
    //     this.setState({
    //       myPosts: this.state.myAllposts.slice(0, this.state.limit)
    //     });
    //   } else if (
    //     this.state.myAllposts.length !== this.state.myPosts.length &&
    //     this.state.myPosts.length < this.state.limit
    //   ) {
    //     this.setState({
    //       myPosts: this.state.myAllposts.slice(0, this.state.limit)
    //     });
    //   }
    // }
    //  else this.getAllPosts();
  }
  //When we Click on new update
  updateNewPosts = () => {
    this.setState({ myPosts: this.state.myAllposts });
    // this.getAllPosts(true);
  };

  update_MyPost_and_WillBeMyPost = post => {
    if (post === "null") {
      this.setState({
        myPosts: this.state.myAllposts
      });
    } else {
      this.setState({
        myPosts: post
      });
    }
  };

  getAllPosts = async (isShowNow = false) => {
    try {
      // this.setState({ dataRecived: false });
      //Getting new posts
      const response = await Axios.get(myUrl + "/post/getpost");
      //Check if we need to update or not

      if (
        isShowNow ||
        response.data.length - this.state.myAllposts.length > 0
      ) {
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

          if (isShowNow) this.setState({ myPosts: mydata });
        }
        this.setState({
          // dataRecived: true,
          myAllposts: mydata
        });
      }
    } catch (err) {
      console.log("Axios Error:getAllPosts");
    }
  };

  componentDidMount() {
    if (cookie.load("userInfoForLogin")) {
      //Fetching all post
      this.getAllPosts(true);
      this.GetCategories();

      // //Get new posts if any after every hour
      // setInterval(() => {
      //   this.getAllPosts();
      // }, 1000 * 60 * 60);
    }
  }

  render() {
    return (
      <div className="container">
        <div className="content" id="mycontent">
          <Switch>
            <Route
              path="/myindex"
              component={props => (
                <RightIndex
                  {...props}
                  myCategories={this.state.myCategories}
                  Posts={this.state.myAllposts}
                  updateParentNewPosts={this.updateNewPosts}
                  updateParent_Post_and_WillBePost={
                    this.update_MyPost_and_WillBeMyPost
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
                    Posts={this.state.myAllposts}
                    updateParentNewPosts={this.updateNewPosts}
                    updateParent_Post_and_WillBePost={
                      this.update_MyPost_and_WillBeMyPost
                    }
                  />
                )}
              />
              <Route
                path="/myindex/upload"
                component={props => (
                  <UploadPost
                    {...props}
                    myCategories={this.state.myCategories}
                  />
                )}
              />
              <Route
                path="/myindex/category"
                render={props => (
                  <CategoryUpdate
                    {...props}
                    myCategories={this.state.myCategories}
                    _id={this.state.CategoryId}
                    updateCategory={this.GetCategories}
                  />
                )}
              />
              <Route
                exact
                path="/myindex"
                component={props => (
                  <IndexForPostContent
                    {...props}
                    newPost={
                      this.state.myAllposts.length - this.state.myPosts.length >
                      0
                        ? this.state.myAllposts.length -
                          this.state.myPosts.length
                        : 0
                    }
                    Posts={this.state.myPosts}
                    updateParentNewPosts={this.updateNewPosts}
                    updateParent_Post_and_WillBePost={
                      this.update_MyPost_and_WillBeMyPost
                    }
                    handelNewPosts={this.updateNewPosts}
                  />
                )}
              />
            </Switch>
            <Switch>
              <Route path="/myindex/singlepost/:_id" component={SinglePost} />
              <Route
                path="/myindex"
                component={props =>
                  this.state.myPosts.map((ele, id) => {
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
}

// let myCategories = [
//   {
//     name: "CATS",
//     imgUrl: "/images/icon_01.png"
//   },
//   {
//     name: "DOGS",
//     imgUrl: "/images/icon_02.png"
//   },
//   {
//     name: "BIRDS",
//     imgUrl: "/images/icon_03.png"
//   },
//   {
//     name: "RABBIT",
//     imgUrl: "/images/icon_04.png"
//   },

//   {
//     name: "OTHERS",
//     imgUrl: "/images/icon_05.png"
//   }
// ];
