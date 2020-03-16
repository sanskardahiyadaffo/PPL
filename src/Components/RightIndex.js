import React from "react";
import { Link } from "react-router-dom";

let myFeatures = [
  {
    name: "Cats",
    imgUrl: "/images/feat_img1.png",
    text: "Lorem Ipusum Text"
  },
  {
    name: "Dogs",
    imgUrl: "/images/feat_img2.png",
    text: "Lorem Ipusum Text"
  },
  {
    name: "Rabbits",
    imgUrl: "/images/feat_img3.png",
    text: "Lorem Ipusum Text"
  }
];

let myRightBtn = [
  {
    name: "Upload Post",
    link: "/myindex/upload",
    image: "/images/btn_iconb.png"
  },
  {
    name: "Add Category",
    link: "#",
    image: "/images/btn_icona.png"
  }
];

export default function RightIndex(props) {
  let myCategories = props.myCategories || [];
  const handelClickForButtons = ele => {
    ele.preventDefault();
    if (ele.target.innerHTML.search("pload") >= 0) {
      props.history.push("/myindex/upload");
    } else {
      //This is Category
      props.history.push("/myindex/category");
    }
  };
  const handelCategoryFilters = elem => {
    elem.preventDefault();
    elem = elem.target;
    if (elem.name !== "ALL") {
      let mynewPost = props.Posts.filter(
        ele =>
          elem.name.toString().toUpperCase() ===
          ele.categoryName.toString().toUpperCase()
      );
      if (mynewPost.length === 0)
        mynewPost = [{ title: "No Post Found", categoryName: elem.name }];
      props.updateParent_Post_and_WillBePost(mynewPost);
    } else props.updateParentNewPosts();
    if (props.location.pathname !== "/myindex") {
      console.log("Redirect to myindex");
      props.history.push("/myindex");
    }
  };
  return (
    <div className="content_rgt">
      {/********RIGHT BUTTONS************************************************/}
      <div>
        {myRightBtn.map((ele, id) => (
          <div className="rght_btn" key={id}>
            <span className="rght_btn_icon">
              <img src={ele.image} alt="up" />
            </span>
            <span className="btn_sep">
              <img src="/images/btn_sep.png" alt="sep" />
            </span>
            <a href={ele.link} onClick={handelClickForButtons}>
              {ele.name}
            </a>
          </div>
        ))}
      </div>

      {/********CATEGORIES************************************************/}
      <div className="rght_cate">
        <div
          className="rght_cate_hd"
          id="rght_cat_bg"
          onClick={e => {
            e.preventDefault();
            // eslint-disable-next-line
            eval("$('.rght_list').toggle('slide');");
          }}
        >
          Categories
        </div>
        <div className="rght_list" style={{ display: "block" }}>
          <ul>
            <li style={{ minHeight: "40px", verticalAlign: "middel" }}>
              <Link to="#" onClick={handelCategoryFilters} name="ALL">
                <span className="list_icon">
                  <img
                    src="/CategoriesPhotos/92880867104014091583320633546.jpeg"
                    alt="up"
                    style={{ maxHeight: "39px" }}
                  />
                </span>
                ALL
              </Link>
            </li>
            {myCategories.map((ele, id) => (
              <li
                key={id}
                style={{ minHeight: "40px", verticalAlign: "middel" }}
              >
                <Link to="#" onClick={handelCategoryFilters} name={ele.name}>
                  <span className="list_icon">
                    <img
                      src={ele.imgUrl}
                      alt="up"
                      style={{ maxHeight: "39px" }}
                    />
                  </span>
                  {ele.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/********FEATURES************************************************/}
      <div className="rght_cate">
        <div
          className="rght_cate_hd"
          id="opn_cat_bg"
          onClick={e => {
            e.preventDefault();
            // eslint-disable-next-line
            eval("$('.sub_dwn').toggle('slide');");
          }}
        >
          Featured
        </div>
        <div className="sub_dwn">
          {myFeatures.map((ele, id) => (
            <div className="feat_sec" key={id}>
              <div className="feat_sec_img">
                <img src={ele.imgUrl} alt="myimage" />
              </div>
              <div className="feat_txt">{ele.text}</div>
              <div className="btm_rgt">
                <div className="btm_arc">{ele.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
