import React, { useContext } from "react";
import { Left_Side_Empty_Container_para_Style } from "./Styles";
import { themeContext } from "../App";
import Svg from "./Svg";
import axios from "axios";

const LeftSideEmpty = (props) => {
  let { dark, userAccountNo } = useContext(themeContext);

  const checkGroupAvailability = `https://mychatappbackend.xyz/groupInformationz`;
  const endPointToken = process.env.Token;
  const headers = {
    "Content-Type": "application/json",
    Authorization: endPointToken,
  };

  const handleCreateGroup = (e) => {
    props.setShowCreateGroupIntf(!props.showCreateGroupIntf);
    axios
      .post(checkGroupAvailability, { userAccountNo }, { headers: headers })
      .then((response) => {
        if (response.data !== "Couldnt FInd the group info") {
          props.setShowCreateGroupIntf(false);
          props.setUniqueGroupKey(response.data[0].uniqueGroupKeys);
          props.setGroupMembers(response.data[0].member);
          props.setShowLoadingInterface(true);
          setTimeout(() => {
            props.setShowLoadingInterface(false);
            props.setGroupName(response.data[0].groupNames);
            props.setGotTheGroupName(true);
          }, 1000);
        } else {
          props.setShowLoadingInterface(false);
          props.setGotTheGroupName(false);
        }
      });
  };

  const Left_Side_Empty_Container_Style = {
    display: "flex",
    overflow: "hidden",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "7rem",
    color: dark ? "#e3e3e3" : "#7c7171",
  };

  return (
    <div
      className="leftSideEmptyContainer"
      style={Left_Side_Empty_Container_Style}>
      {props.showLoadingInterface ? null : (
        <>
          <div className="left_Side_Svg_Container">
            <Svg />
          </div>
          <h2>Welcome To Group Messages!</h2>
          <p style={Left_Side_Empty_Container_para_Style}>
            Share media, moments, <br />
            memes and love.
          </p>
          <button className="create_Group_btn" onClick={handleCreateGroup}>
            Create Group
          </button>
        </>
      )}
    </div>
  );
};

export default LeftSideEmpty;
