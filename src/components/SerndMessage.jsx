import React, { useState, useContext, useRef, useEffect } from "react";
import { IoMdPhotos, IoMdSend } from "react-icons/io";
import { themeContext } from "../App";
import imageCompression from "browser-image-compression";

import { sockets } from "./CreateGRPInterface";
import axios from "axios";

const SendMessage = (props) => {
  let {
    setSendImage,
    sendImage,
    setMessages,
    dark,
    setHeIsTyping,
    userAccountNo,
    setTyping,
    uploadedImageDimensions,
    setUploadedImageDimensions,
    setShowDarkAndLightModeDropDown,
  } = useContext(themeContext);
  const fontColor = dark ? "#ffff" : "#000000";
  const message = useRef(null);
  const [userSelectedImage, setUserSelectedImage] = useState("");
  const endPointToken = process.env.Token;
  const headers = {
    "Content-Type": "application/json",
    Authorization: endPointToken,
  };
  const fetchMessages = `https://mychatappbackend.xyz/fetchMessages`;

  useEffect(() => {
    sockets.on("rcvMsg", (data) => {
      // Desktop Notification Learning
      setMessages((prevState) => [...prevState, data.Message_Data]);
    });

    sockets.on("userIsTyping", (data) => {
      setTyping(true);
      setHeIsTyping(data.userAccount);
    });

    sockets.on("userHasStoppedTyping", (data) => {
      setTyping(false);
    });
  }, []);

  useEffect(() => {
    if (props.uniqueGroupKey !== "") {
      axios
        .post(
          fetchMessages,
          { uniqueGroupKey: props.uniqueGroupKey },
          { headers: headers }
        )
        .then((response) => {
          props.setShowLoadingInterface(true);

          if (response.status !== 200) {
            props.setShowLoadingInterface(false);
            throw Error("Failed to fetch messages");
          }
          setTimeout(() => {
            props.setShowLoadingInterface(false);
            response.data.map((messages) => {
              setMessages((prevState) => [...prevState, messages]);
            });
          }, 500);
          // response.data.map((messages) => {
          //   setMessages((prevState) => [...prevState, messages]);
          // });
        })
        .catch((err) => {
          console.error(err.message);
        });
    }
  }, [props.uniqueGroupKey]);

  const handleImageSubmit = async (e) => {
    props.setViewImage(false);

    let fileData = e.target.files[0];

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(fileData, options);

      let reader = new FileReader();
      reader.readAsDataURL(compressedFile);

      reader.onload = (e) => {
        const img = new Image();

        img.onload = function () {
          setUploadedImageDimensions({
            width: img.width,
            height: img.height,
          });
        };

        img.src = e.target.result;
        const urlImage = e.target.result;
        props.setviewImageContainer(true);
        props.getImageUrlIfAny(urlImage);
        setUserSelectedImage(urlImage);
        setUserSelectedImage(urlImage);
      };
    } catch (error) {
      console.error(error.message);
    }
  };
  const sendMessage = (e) => {
    const time = new Date();
    const FullTime = time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

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
    var dayName = days[d.getDay()];
    var month = monthNames[d.getMonth()];

    if (
      userSelectedImage ||
      message.current.value !== "" ||
      props.GroupMembers.length > 1
    ) {
      const Message_Data = {
        Name: props.usersName,
        accountNo: userAccountNo,
        Group: props.GroupName,
        Message: userSelectedImage ? userSelectedImage : message.current.value,
        groupKey: props.uniqueGroupKey,
        Time: FullTime,
        fullDate: d.getDate() + " " + month + " " + d.getFullYear(),
        month: month,
        date: d.getDate(),
        year: d.getFullYear(),
        day: dayName,
        containsImage: userSelectedImage ? true : false,
        imageDimension:
          userSelectedImage && uploadedImageDimensions !== null
            ? uploadedImageDimensions
            : {},
      };

      setMessages((prev) => [...prev, Message_Data]);
      setTyping(false);
      sockets.emit("sendMessage", { Message_Data });
      message.current.value = "";
      setUserSelectedImage("");
      setSendImage(false);
    } else {
      console.error(
        "Your Request Could not be Proceed at the moment please try again later"
      );
    }
  };

  const handleSendMessageOnEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
      message.current.value = "";
    }
  };

  const handleMessageInputChange = (e) => {
    setTimeout(() => {
      sockets.emit("userTyping", {
        userAccount: userAccountNo,
        groupKey: props.uniqueGroupKey,
      });
    }, 600);
  };

  const handleUserStoppedTyping = (e) => {
    setTimeout(() => {
      sockets.emit("userStoppedTyping", {
        userAccount: userAccountNo,
        groupKey: props.uniqueGroupKey,
      });
    }, 2800);
  };

  useEffect(() => {
    if (sendImage) {
      sendMessage();
    }
  }, [sendImage]);

  const message_Input_Style = {
    color: fontColor,
    boxShadow: dark
      ? "0px 3px 1px rgb(76 76 76)"
      : "0px 3px 1px rgb(202, 201, 201)",
  };

  const send_Icon_Style = {
    color: fontColor,
    cursor: props.viewImageContainer ? "auto" : "pointer",
  };

  return (
    <div
      onClick={(e) => setShowDarkAndLightModeDropDown(false)}
      className="send_Message_Input">
      <div className="attachments_emojis">
        <label htmlFor="media">
          <span style={{ color: fontColor }}>
            <IoMdPhotos />
          </span>
        </label>
        <input
          onChange={handleImageSubmit}
          type="file"
          id="media"
          name="media"
          accept="image/*"
          style={{ display: "none" }}
        />
      </div>

      <textarea
        disabled={props.viewImageContainer ? true : false}
        onKeyDown={handleSendMessageOnEnter}
        onChange={handleMessageInputChange}
        onKeyUp={handleUserStoppedTyping}
        style={message_Input_Style}
        ref={message}
        id="comment"
        name="comment"
        cols="150"
        rows="2"
        autoFocus={true}
        placeholder="Type your message here..."></textarea>

      <span
        disabled={props.viewImageContainer ? true : false}
        className="sendIcon"
        style={send_Icon_Style}>
        <IoMdSend onClick={sendMessage} />
      </span>
    </div>
  );
};

export default SendMessage;
