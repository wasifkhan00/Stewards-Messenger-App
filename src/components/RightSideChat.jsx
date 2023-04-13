import React, { useState, useContext, useEffect, useRef } from "react";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import profilePicture from "../images/profile.png";
import AddedInTheGroup from "./AddedInTheGroup";
import { sockets } from "./CreateGRPInterface";
import { IoIosSearch } from "react-icons/io";
import ImageSelected from "./ImageSelected";
import SerndMessage from "./SerndMessage";
import MessagesBox from "./MessagesBox";
import NewUserChat from "./NewUserChat";
import { themeContext } from "../App";
import ViewImage from "./ViewImage";
import Dropdown from "./Dropdown";
import UserLeft from "./UserLeft";
import axios from "axios";

const RightSideChat = (props) => {
  const messagesArea = useRef("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrlView, setImageUrlView] = useState("");
  const [viewImage, setViewImage] = useState(false);
  const [viewImageContainer, setviewImageContainer] = useState(false);
  const [today, setToday] = useState("");
  const [yesterday, setYesterday] = useState("");
  const [showUserLeftGroup, setShowUserLeftGroup] = useState({});
  const [groupMems, setGroupMems] = useState("");
  const [addedInTheGroupBy, setAddedInTheGroupBy] = useState("");
  const [editGroupName, setEditGroupName] = useState(false);
  const [you, setYou] = useState(false);

  let {
    setUserIsExitingTheGroup,
    setUserIsChagningGroupName,
    uploadedImageDimensions,
    setUploadedImageDimensions,
    setUnreadMessages,
    setSendImage,
    showRightSideMobile,
    setShowRightSideMobile,
    messages,
    typing,
    heIsTyping,
    dark,
    userAccountNo,
    setAddMoreFriendsInGroup,
    showDarkAndLightModeDropDown,
    setShowDarkAndLightModeDropDown,
  } = useContext(themeContext);

  const userAddedBy = `https://mychatappbackend.xyz/groupInformationz`;
  const endPointToken = process.env.Token;
  const headers = {
    "Content-Type": "application/json",
    Authorization: endPointToken,
  };

  const getImageUrlIfAny = (incomingImageUrl) => {
    setImageUrl(incomingImageUrl);
  };

  useEffect(() => {
    sockets.on("connect", () => {
      if (props.uniqueGroupKey !== "") {
        sockets.emit("userJoined", props.uniqueGroupKey);
      }
    });
  }, [sockets]);

  const fontColor = dark ? "#ffff" : "#000000";

  useEffect(() => {
    messagesArea.current.scroll({
      top: messagesArea.current.scrollHeight,
      behavior: "smooth",
    });

    if (messages) {
      const findLast = messages.slice(-1);
      const lastMessageUser = findLast[0].accountNo;
      if (lastMessageUser !== userAccountNo) {
        setUnreadMessages(true);
      } else {
        setUnreadMessages(false);
      }
    }
  }, [messages]);

  useEffect(() => {
    const WhoAddedTheUser = async () => {
      await axios
        .post(userAddedBy, { userAccountNo }, { headers: headers })
        .then((response) => {
          if (response.status !== 200) {
            throw Error("Server denied to take requests at the moment");
          }
          if (response.data !== "Couldnt FInd the group info") {
            if (response.data[0].addedBy !== "None") {
              setAddedInTheGroupBy(response.data[0].addedBy);
            }
          }
        })
        .catch((err) => console.warn(err.message));
    };

    WhoAddedTheUser();
  }, []);

  useEffect(() => {
    sockets.on("userHasLeftGroup", (data) => {
      setShowUserLeftGroup({ UserWhoLeft: data.accountNo });
    });
  }, []);

  useEffect(() => {
    setGroupMems(props.groupMembers);

    if (groupMems.length > 0) {
      const accountNo = groupMems.indexOf(userAccountNo);
      groupMems.splice(accountNo, 1);
      setYou(true);
    }
  }, [props.groupMembers, groupMems]);

  const handleImageView = (e) => {
    const img = new Image();

    img.onload = () => {
      setUploadedImageDimensions({
        width: img.width,
        height: img.height,
      });
    };

    img.src = e.target.currentSrc;

    setImageUrlView(e.target.currentSrc);
    setTimeout(() => {
      setViewImage(true);
    }, 50);
  };

  useEffect(() => {
    const monthNames = [
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    var d = new Date(Date.now());
    const date = d.getDate();
    var month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    const fullDate = date + " " + month + " " + year;

    // Yesterday Calculation
    var defaultDate = d - 1000 * 60 * 60 * 24 * 1;
    const yesterdayTime = new Date(defaultDate);
    const yesterdayDate = yesterdayTime.getDate();
    var yesterdayMonth = monthNames[yesterdayTime.getMonth()];
    const YesterdayYear = d.getFullYear();

    const Yesterday =
      yesterdayDate + " " + yesterdayMonth + " " + YesterdayYear;

    setToday(fullDate);
    setYesterday(Yesterday);
  }, []);

  const mouserEnterHover = () =>
    setEditGroupName(() => {
      return true;
    });

  const mouserLeftHover = () =>
    setEditGroupName(() => {
      return false;
    });

  const right_Side_Header_Styles = {
    boxShadow: dark ? "0 4px 7px -6px #ffffff" : "0 4px 7px -6px black",
    filter: viewImageContainer ? "blur(2px)" : "none",
  };

  const right_side_Style = {
    backgroundColor: dark ? "#404040" : "rgb(255, 255, 255)",
  };

  const group_Name_Style = {
    color: fontColor,
    display: "flex",
    alignItems: "center",
  };

  const send_Image_style = {
    resizeMode: "cover",
    width:
      uploadedImageDimensions !== null
        ? uploadedImageDimensions.width < 850
          ? `${uploadedImageDimensions.width}px`
          : "100%"
        : null,

    height:
      uploadedImageDimensions !== null
        ? `${uploadedImageDimensions.height}px`
        : null,
  };

  const show_Image_Before_Sending_Style = {
    padding: "0.3rem 0.5rem",
    color: dark ? "#fff" : "rgb(10, 10, 10)",
  };

  const handleSendImage = (e) => {
    setSendImage(true);
    setviewImageContainer(false);
  };

  const handleCloseViewImage = (e) => {
    setviewImageContainer(false);
  };

  const handleShowAddMoreFriends = (e) => {
    setAddMoreFriendsInGroup(true);
    setShowDarkAndLightModeDropDown(false);
    setUserIsChagningGroupName(false);
    setUserIsExitingTheGroup(false);
  };

  const handleShowSettings = (e) => {
    e.target.classList.toggle("showDropDown");
    e.target.className.animVal.includes("showDropDown")
      ? setShowDarkAndLightModeDropDown(true)
      : setShowDarkAndLightModeDropDown(!showDarkAndLightModeDropDown);
  };

  return (
    <>
      {viewImageContainer ? (
        <div
          className="viewImage"
          style={{
            background: dark ? "rgb(74 72 72)" : "rgb(255 255 255 / 81%)",
          }}>
          <img src={imageUrl} alt="previewImage" />
          <button onClick={handleSendImage}>Send</button>
        </div>
      ) : null}
      {viewImage ? (
        <div
          className="viewImage rcvImg"
          id="recvd"
          style={{
            background: dark ? "rgb(74 72 72)" : "rgb(255 255 255 / 81%)",
          }}>
          <ViewImage imageSource={imageUrlView} />
        </div>
      ) : null}

      <div
        className="right_side"
        onClick={(e) => {
          setviewImageContainer(false);
          setViewImage(false);
        }}
        id={showRightSideMobile ? "showRightSideMobileUser" : null}
        style={right_side_Style}>
        <header style={right_Side_Header_Styles}>
          <div className="imgContainer">
            <div className="containerHeaderImage">
              <img src={profilePicture} alt="proifle_PIC" />
            </div>
            <div className="nameUsersContainer">
              <h3
                onMouseEnter={mouserEnterHover}
                onMouseLeave={mouserLeftHover}
                style={group_Name_Style}>
                {props.groupName}

                {editGroupName ? (
                  <MdOutlineModeEditOutline
                    onClick={(e) => {
                      setShowDarkAndLightModeDropDown(false);
                      setUserIsChagningGroupName(true);
                    }}
                  />
                ) : null}
              </h3>

              <h6 style={{ color: fontColor }}>
                {!typing ? "You," : null}

                {typing
                  ? `${heIsTyping}  Is typing.... `
                  : groupMems.length > 0 && you
                  ? groupMems.map((members) => {
                      const memberOfTheGroup = " " + members + ", ";
                      return memberOfTheGroup;
                    })
                  : "You"}
              </h6>
            </div>
          </div>

          <label htmlFor="search_account">
            <div className="searchAccount_input">
              {props.userIsAdmin === "Yes" ? (
                <span disabled={true}>
                  <IoIosSearch
                    onClick={handleShowAddMoreFriends}
                    className="search_account"
                    style={{ color: fontColor }}
                  />
                </span>
              ) : null}
              <span>
                <IoSettingsSharp
                  onClick={handleShowSettings}
                  className="search_account"
                  style={{ color: fontColor }}
                />
              </span>

              {showDarkAndLightModeDropDown ? (
                <Dropdown
                  userIsAdmin={props.userIsAdmin}
                  className="dropDown"
                  setShowDarkAndLightModeDropDown={
                    setShowDarkAndLightModeDropDown
                  }
                />
              ) : null}
            </div>
          </label>
        </header>

        <main
          ref={messagesArea}
          onClick={(e) => setShowDarkAndLightModeDropDown(false)}
          style={{
            backgroundColor: dark ? "#404040" : "rgb(255, 255, 255)",
          }}>
          <NewUserChat />

          {addedInTheGroupBy !== "" ? (
            <AddedInTheGroup referred={addedInTheGroupBy} />
          ) : null}

          {messages
            ? messages.map((messageBox) => {
                if (!messageBox.containsImage) {
                  return (
                    <React.Fragment key={messageBox._id}>
                      <MessagesBox
                        messageTime={messageBox.Time}
                        messages={messageBox.Message}
                        date={
                          today !== "" && today !== messageBox.fullDate
                            ? yesterday !== "" &&
                              messageBox.fullDate === yesterday
                              ? "Yesterday"
                              : messageBox.fullDate
                            : "Today"
                        }
                        Name={
                          messageBox.accountNo === userAccountNo
                            ? "You"
                            : messageBox.Name
                        }
                      />
                    </React.Fragment>
                  );
                } else {
                  return (
                    <React.Fragment key={messageBox._id}>
                      <ImageSelected
                        onClick={handleImageView}
                        date={
                          today !== "" && today !== messageBox.fullDate
                            ? yesterday !== "" &&
                              messageBox.fullDate === yesterday
                              ? "Yesterday"
                              : messageBox.fullDate
                            : "Today"
                        }
                        Time={messageBox.Time}
                        name={
                          messageBox.accountNo === userAccountNo
                            ? "You"
                            : messageBox.Name
                        }
                        imageSource={messageBox.Message}
                      />
                    </React.Fragment>
                  );
                }
              })
            : null}

          {Object.keys(showUserLeftGroup).length !== 0 ? (
            <UserLeft leftTheGroup={showUserLeftGroup.UserWhoLeft} />
          ) : null}
        </main>

        <section>
          <SerndMessage
            setShowLoadingInterface={props.setShowLoadingInterface}
            viewImage={viewImage}
            setViewImage={setViewImage}
            viewImageContainer={viewImageContainer}
            setviewImageContainer={setviewImageContainer}
            getImageUrlIfAny={getImageUrlIfAny}
            usersName={props.usersName}
            uniqueGroupKey={props.uniqueGroupKey}
            GroupMembers={props.groupMembers}
            GroupName={props.groupName}
          />
        </section>
      </div>
    </>
  );
};

export default RightSideChat;
