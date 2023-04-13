import React, { useContext } from "react";
import { themeContext } from "../App";
import Hamburger from "./Hamburger";
import RightSideImage from "../images/rightSideChat.jpg";

const RightSideEmpty = (props) => {
  let { isChecked } = useContext(themeContext);

  return (
    <>
      <header
        className={
          isChecked
            ? "right_side_Empty_Header rightSideMobile"
            : "right_side_Empty_Header"
        }>
        <Hamburger />
      </header>
      <div
        className={
          isChecked ? "right_side_Empty rightSideMobile" : "right_side_Empty"
        }>
        {!props.showLoadingInterface ? (
          <main>
            <div className="imgContainerEmpty">
              <img src={RightSideImage} alt="" />
            </div>
            <span>
              You can create only one group at a time , If someone adds you in
              the group and you already have a group created, You'll not be
              added unless you delete your own group and see this page. You can
              leave the group later. If you're the admin and you deleted your
              group every message you did in the group and every member's
              messages will be deleted permanently.
            </span>
          </main>
        ) : null}
      </div>
    </>
  );
};

export default RightSideEmpty;
