import React, { useRef, useContext } from "react";
import { buttonStyles, button_Container_Style } from "./Styles";
import { themeContext } from "../App";
import axios from "axios";

const EditGroupName = (props) => {
  let { setUserIsChagningGroupName, dark } = useContext(themeContext);
  const endPointToken = process.env.Token;
  const headers = {
    "Content-Type": "application/json",
    Authorization: endPointToken,
  };
  const groupNameChange = useRef("");
  const regEx = /[a-zA-Z]/;

  const changeGroupName = `https://mychatappbackend.xyz/updateGroupName`;

  const handleChangeGroup = (e) => {
    const groupInformation = {
      uniqueGroupKey: props.uniqueGroupKey,
      groupNames: groupNameChange.current.value,
    };

    if (
      groupNameChange.current.value !== "" &&
      groupNameChange.current.value.match(regEx) &&
      groupInformation.uniqueGroupKey !== ""
    ) {
      props.setGroupName(groupNameChange.current.value);

      axios
        .put(changeGroupName, groupInformation, { headers: headers })
        .then((res) => {
          if (res.status !== 200) {
            throw Error("Cannot request the server at the moment");
          }
          console.clear();
        })
        .catch((err) => console.warn(err.message));

      setUserIsChagningGroupName(false);
    }
  };

  const handleEnterPressed = (e) => {
    if (e.key === "Enter") {
      handleChangeGroup();
    }
  };

  const handleCancelButton = (e) => setUserIsChagningGroupName(false);

  const edit_GroupName_Container_Style = {
    background: dark ? "rgb(0 0 0 / 75%)" : "rgb(255 255 255 / 75%)",
    height: "17vh",
    color: "black",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  };

  const Edit_GroupName_Input_Style = {
    color: dark ? "rgb(193 189 189)" : "black",
    fontSize: "10px",
    padding: " .8em",
    height: "25px",
    // width: "20vw",
  };

  return (
    <div className="Create_Group_Interface_ChatJs_Container">
      <div
        style={edit_GroupName_Container_Style}
        className="createGroupInterfaceContainer">
        <input
          maxLength={34}
          onKeyDown={handleEnterPressed}
          ref={groupNameChange}
          style={Edit_GroupName_Input_Style}
          type="text"
          placeholder="Change Group Name... "
        />
        <div style={button_Container_Style}>
          <button onClick={handleChangeGroup} style={buttonStyles}>
            Change Name
          </button>
          <button onClick={handleCancelButton} style={buttonStyles}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGroupName;
