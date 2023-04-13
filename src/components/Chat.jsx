import React, { useContext, useState, useEffect } from "react";
import Hamburger from "./Hamburger";
import { themeContext } from "../App";
import axios from "axios";
import RightSideChat from "./RightSideChat";
import LeftSideEmpty from "./LeftSideEmpty";
import RightSideEmpty from "./RightSideEmpty";
import User from "./User";
import "../styles/chatInterface.css";
import Create_Group_Interface, { sockets } from "./CreateGRPInterface";
import Loading from "./Loading";
import AddFriends from "./AddFriends";
import Login from "./Login";
import UserExitGroup from "./UserExitGroup";
import EditGroupName from "./EditGroupName";
import { darkBackgroundImage, whiteBackgroundImage } from "./Styles";

const Chat = (props) => {
  let {
    userIsChagningGroupName,
    showRightSideMobile,
    setShowRightSideMobile,
    isChecked,
    loggOut,
    userIsExitingTheGroup,
    dark,
    messages,
    userAccountNo,
    addMoreFriendsInGroup,
    setShowDarkAndLightModeDropDown,
  } = useContext(themeContext);
  const [showCreateGroupIntf, setShowCreateGroupIntf] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState("");
  const [gotTheGroupName, setGotTheGroupName] = useState(false);
  const [lastMessageInfo, setLastMessageInfo] = useState({});
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState("");
  const [uniqueGroupKey, setUniqueGroupKey] = useState("");
  const fontColor = dark ? "#ffff" : "#000000";

  const checkGroupAvailability = `https://mychatappbackend.xyz/groupInformationz`;
  const endPointToken = process.env.Token;
  const headers = {
    "Content-Type": "application/json",
    Authorization: endPointToken,
  };

  useEffect(() => {
    axios
      .post(checkGroupAvailability, { userAccountNo }, { headers: headers })
      .then((response) => {
        if (response.status !== 200) {
          throw Error("Cannot Send Request to the server at the moment");
        }
        if (response.data !== "Couldnt FInd the group info") {
          setUserIsAdmin(response.data[0].isAdmin);
          setUniqueGroupKey(response.data[0].uniqueGroupKeys);
          setGroupMembers(response.data[0].member);
          props.setShowLoadingInterface(true);
          setTimeout(() => {
            props.setShowLoadingInterface(false);
            setGroupName(response.data[0].groupNames);
            setGotTheGroupName(true);
          }, 1000);
        } else {
          props.setShowLoadingInterface(false);
          setGotTheGroupName(false);
        }
      })
      .catch((err) => {
        if (err.code === "ERR_NETWORK") {
          window.location.reload(false);
        }
      });
  }, [userAccountNo]);

  useEffect(() => {
    if (messages) {
      messages.map((messageBox) => {
        setLastMessageInfo({
          LastMessage: messageBox.containsImage
            ? `  ${
                messageBox.accountNo === userAccountNo ? "You" : messageBox.Name
              }: sent an image`
            : messageBox.accountNo === userAccountNo
            ? `You : ${messageBox.Message}`
            : `${messageBox.Name} : ${messageBox.Message}`,
          LastMessageTime: messageBox.Time,
        });
      });
    }
  }, [sockets, messages]);

  const getGroupName = (data) => {
    setGroupName(data);
    setGotTheGroupName(true);
  };
  const groupMembersData = (data) => {
    setGroupMembers(data);
  };

  const uniqueKey = (data) => {
    setUniqueGroupKey(data);
  };

  const checkUserAdmin = (data) => {
    setUserIsAdmin(data);
  };

  const chatMainContainerStyle = {
    overflow: gotTheGroupName ? "visible" : "hidden",
    backgroundImage: gotTheGroupName
      ? dark
        ? ` linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7)), url(${darkBackgroundImage})`
        : `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),url(${whiteBackgroundImage})`
      : null,
    pointerEvents:
      showCreateGroupIntf || addMoreFriendsInGroup || props.showLoadingInterface
        ? "none"
        : "auto",
    filter:
      showCreateGroupIntf || addMoreFriendsInGroup || props.showLoadingInterface
        ? "blur(2px)"
        : "none",
  };

  const Create_Group_Interface_Container_ChatJs_Style = {
    display: showCreateGroupIntf || addMoreFriendsInGroup ? "flex" : "none",
  };

  const left_side_Style = {
    backgroundColor: dark ? "#3b3b3b" : "#ffff",
  };

  const left_side_Header_Style = {
    boxShadow: dark ? "0 4px 7px -6px #ffffff" : "0 4px 7px -6px black",
  };

  const wholeElementClicked = (e) => {
    if (window.matchMedia("(max-width: 580px)").matches) {
      setShowRightSideMobile(true);
    }
  };

  return (
    <>
      {userIsExitingTheGroup ? (
        <UserExitGroup
          userIsAdmin={userIsAdmin}
          uniqueGroupKey={uniqueGroupKey}
        />
      ) : null}

      {userIsChagningGroupName ? (
        <EditGroupName
          setGroupName={setGroupName}
          uniqueGroupKey={uniqueGroupKey}
        />
      ) : null}

      {props.showLoadingInterface ? <Loading /> : null}

      {loggOut ? (
        <>
          <Login />
        </>
      ) : (
        <>
          <div
            className="Create_Group_Interface_ChatJs_Container chatInterfAddFriends"
            style={Create_Group_Interface_Container_ChatJs_Style}>
            {addMoreFriendsInGroup ? (
              <AddFriends
                groupName={groupName}
                groupMembersData={groupMembersData}
              />
            ) : (
              <Create_Group_Interface
                checkUserAdmin={checkUserAdmin}
                uniqueKey={uniqueKey}
                groupMembersData={groupMembersData}
                getGroupName={getGroupName}
                setShowCreateGroupIntf={setShowCreateGroupIntf}
                showCreateGroupIntf={showCreateGroupIntf}
              />
            )}
          </div>

          <div className="main" style={chatMainContainerStyle}>
            <div
              className={
                gotTheGroupName
                  ? showRightSideMobile
                    ? "left_side_User leftSideMobileUser"
                    : "left_side_User"
                  : isChecked
                  ? "left_side leftSideMobile"
                  : "left_side"
              }
              onClick={(e) => setShowDarkAndLightModeDropDown(false)}
              style={left_side_Style}>
              <header style={left_side_Header_Style}>
                <div className="create_Group">
                  {!props.showLoadingInterface ? (
                    <>
                      <h4 style={{ color: fontColor }}>Group Messages</h4>
                      <h3 style={{ color: fontColor }}>
                        <Hamburger />
                      </h3>
                    </>
                  ) : null}
                </div>
              </header>
              {gotTheGroupName ? (
                <>
                  <User
                    showWholeElementCursor={true}
                    wholeElementClicked={wholeElementClicked}
                    topChatContainer={true}
                    groupName={groupName}
                    lastMessage={
                      Object.keys(lastMessageInfo).length !== 0
                        ? lastMessageInfo.LastMessage.length > 15
                          ? `${lastMessageInfo.LastMessage.substring(0, 15)}...`
                          : lastMessageInfo.LastMessage
                        : "Start conversation now"
                    }
                    time={
                      Object.keys(lastMessageInfo).length !== 0
                        ? lastMessageInfo.LastMessageTime
                        : null
                    }
                  />
                </>
              ) : (
                <LeftSideEmpty
                  setGroupMembers={setGroupMembers}
                  setGotTheGroupName={setGotTheGroupName}
                  setGroupName={setGroupName}
                  setUniqueGroupKey={setUniqueGroupKey}
                  setShowLoadingInterface={props.setShowLoadingInterface}
                  setShowCreateGroupIntf={setShowCreateGroupIntf}
                  showCreateGroupIntf={showCreateGroupIntf}
                  showLoadingInterface={props.showLoadingInterface}
                />
              )}
            </div>

            {gotTheGroupName ? (
              <>
                <RightSideChat
                  setShowLoadingInterface={props.setShowLoadingInterface}
                  userIsAdmin={userIsAdmin}
                  setShowCreateGroupIntf={setShowCreateGroupIntf}
                  showCreateGroupIntf={showCreateGroupIntf}
                  usersName={props.usersName}
                  uniqueGroupKey={uniqueGroupKey}
                  groupName={groupName}
                  groupMembers={groupMembers}
                />
              </>
            ) : (
              <RightSideEmpty
                showLoadingInterface={props.showLoadingInterface}
                setUniqueGroupKey={setUniqueGroupKey}
                setShowLoadingInterface={props.setShowLoadingInterface}
                setGroupName={setGroupName}
                setGotTheGroupName={setGotTheGroupName}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Chat;
