import React, { useContext } from "react";
import { sockets } from "./CreateGRPInterface";
import { themeContext } from "../App";
import axios from "axios";

const UserExitGroup = (props) => {
  let { setUserIsExitingTheGroup, userAccountNo, dark } =
    useContext(themeContext);
  const groupLeft = `https://mychatappbackend.xyz/groupleaving`;
  const groupDeletion = `https://mychatappbackend.xyz/groupDeletion`;
  const endPointToken = process.env.Token;
  const headers = {
    "Content-Type": "application/json",
    Authorization: endPointToken,
  };

  const handleLeaveGroup = (e) => {
    if (props.uniqueGroupKey !== "") {
      axios
        .delete(groupLeft, {
          data: {
            groupKey: props.uniqueGroupKey,
            userAccountNo: userAccountNo,
          },
          headers: headers,
        })
        .then((response) => {
          if (response.status !== 200) {
            throw Error("Server is busy Please Leave group Some Other Time");
          }
          if (response.data.message === "User left") {
            sockets.emit("userLeftTheGroup", {
              accountNo: response.data.userAccountNo,
              groupKey: response.data.groupKey,
            });

            setTimeout(() => {
              window.location.reload(false);
            }, 50);
          }
        })
        .catch((err) => console.error(err.message));
      setUserIsExitingTheGroup(false);
    }
  };

  const handleDeleteGroup = () => {
    if (props.uniqueGroupKey !== "") {
      axios
        .delete(groupDeletion, {
          data: {
            groupKey: props.uniqueGroupKey,
            isAdmin: props.userIsAdmin,
          },
          headers: headers,
        })
        .then((response) => {
          if (response.status !== 200) {
            throw Error(
              "You cannot delete the group at the moment try some other time !"
            );
          }
          if (response.data === "group Deleted") {
            window.location.reload(false);
          }
        })
        .catch((err) => console.error(err.message));
    }
  };

  const User_Exit_Group_Container_Styles = {
    background: dark ? "rgb(0 0 0 / 75%)" : "rgb(255 255 255 / 75%)",
    color: dark ? "rgb(193 189 189)" : "black",
    fontSize: " 12px",
    height: "15vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  };

  return (
    <div
      className="Create_Group_Interface_ChatJs_Container leaveGroup"
      style={User_Exit_Group_Container}>
      <div
        style={User_Exit_Group_Container_Styles}
        className="createGroupInterfaceContainer">
        {props.userIsAdmin === "Yes"
          ? "Are you sure you want to delete the group?"
          : "Are you sure you want to leave the group?"}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <button
            style={{ background: "rgb(71 147 222)" }}
            onClick={
              props.userIsAdmin === "Yes" ? handleDeleteGroup : handleLeaveGroup
            }>
            Yes
          </button>
          <button
            style={{ background: "rgb(71 147 222)" }}
            onClick={(e) => setUserIsExitingTheGroup(false)}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserExitGroup;
