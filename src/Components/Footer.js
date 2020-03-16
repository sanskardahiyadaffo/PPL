import React from "react";
import { Link } from "react-router-dom";

const externalLinks = [
  {
    name: "1",
    img: "/images/social_1.png",
    link: "#"
  },
  {
    name: "2",
    img: "images/social_2.png",
    link: "#"
  },
  {
    name: "3",
    img: "images/social_3.png",
    link: "#"
  },
  {
    name: "4",
    img: "images/social_4.png",
    link: "#"
  }
];

export default function Footer() {
  return (
    <div className="footr">
      <div className="footr_lft">
        <div className="footer_div1">
          Copyright &copy; Pet-Socail {new Date().getFullYear()} All Rights
          Reserved
        </div>
        <div className="footer_div2">
          <Link to="#">Privacy Policy </Link>|
          <Link to="#">Terms &amp; Conditions </Link>
        </div>
      </div>
      <div className="footr_rgt">
        <ul>
          {externalLinks.map((ele, id) => (
            <li key={id}>
              <Link to={ele.link}>
                <img
                  src={ele.img.search("/") === 0 ? ele.img : "/" + ele.img}
                  alt={ele.name}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
