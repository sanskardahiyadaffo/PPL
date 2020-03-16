import React from "react";
import { Link } from "react-router-dom";
const getMyMonthNumber = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12"
};
let myPostFilterBtn = [
  {
    name: "Latest First",
    link: "#",
    icon: "/images/img_1.png"
  },
  {
    name: "Oldest First",
    link: "#",
    icon: "/images/img_2.png"
  },
  {
    name: "Most Pet",
    link: "#",
    icon: "/images/img_3.png"
  },
  {
    name: "Most Liked",
    link: "#",
    icon: "/images/img_4.png"
  },
  {
    name: "Most Commented",
    link: "#",
    icon: "/images/img_5.png"
  }
];
export default function IndexForPostContent(props) {
  const getNewPostNumber = props.newPost || 0;

  const handelPostFiltersButtons = ele => {
    ele = ele.target.parentNode.parentNode.getElementsByClassName("name");
    if (ele.length === 1) {
      ele = ele[0].innerHTML;

      let mynewPost = props.Posts.sort((a, b) => {
        if (fetchDateTime(a) - fetchDateTime(b) === 0) return 0;
        else if (fetchDateTime(a) > fetchDateTime(b)) return -1;
        else return 1;
      });
      switch (ele) {
        // case "Latest First":
        //   // console.log("Latest First");
        //   mynewPost =  props.Posts.sort((a, b) => {
        //     if (fetchDateTime(a) - fetchDateTime(b) === 0) return 0;
        //     else if (fetchDateTime(a) > fetchDateTime(b)) return -1;
        //     else return 1;
        //   });
        //   break;
        case "Oldest First":
          // console.log("Oldest First");
          mynewPost = props.Posts.sort((a, b) => {
            if (fetchDateTime(a) - fetchDateTime(b) === 0) return 0;
            else if (fetchDateTime(a) > fetchDateTime(b)) return 1;
            else return -1;
          });
          break;
        case "Most Commented":
          // console.log("Most comments");
          mynewPost = props.Posts.sort((a, b) => {
            if (a.comments.length - b.comments.length === 0) return 0;
            else if (a.comments.length - b.comments.length < 0) return 1;
            else return -1;
          });
          break;
        case "Most Liked":
          // console.log("Most comments");
          mynewPost = props.Posts.sort((a, b) => {
            if (a.allLikes.length - b.allLikes.length === 0) return 0;
            else if (a.allLikes.length - b.allLikes.length < 0) return 1;
            else return -1;
          });
          break;
        case "Most Pet":
          break;
        default:
          break;
      }
      props.updateParent_Post_and_WillBePost(mynewPost);
    }
  };

  return (
    <div className="contnt_1">
      {/*****2 RADIO BTNS***************************/}
      <div className="list_1">
        <ul>
          {/* <li>
              <input type="checkbox" className="chk_bx" />
              Friends
            </li> */}
          <li>
            <input
              type="checkbox"
              className="chk_bx"
              onClick={e => {
                e = e.target;
                console.log("Flag Clicked", e.checked);
              }}
            />
            Flaged
          </li>
        </ul>
      </div>

      <div className="post_div">
        {/*****POST FILTER BTNS***************************/}
        <div className="post_list">
          <ul>
            {myPostFilterBtn.map((ele, id) => (
              <li key={id}>
                <Link to={ele.link} onClick={handelPostFiltersButtons}>
                  <span className="list_img">
                    <img src={ele.icon} alt={ele.name} />
                  </span>
                  <span className="name">{ele.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/*****NEW POST UPDATE***************************/}
        <div className="post_txt" onClick={props.handelNewPosts}>
          {getNewPostNumber} More Post Are Available..!! Click To Update
        </div>
      </div>
    </div>
  );
}

const fetchDateTime = a => {
  let date = a.postDate.split(" ");
  date[1] = getMyMonthNumber[date[1]];
  date = date.join("");
  let time = a.postTime.split(":");
  time[0] = time[1].search("pm") !== -1 ? parseInt(time[0]) + 12 : time[0];
  time[1] = time[1].slice(0, -2);
  time = time.join("");
  return date + time;
};
