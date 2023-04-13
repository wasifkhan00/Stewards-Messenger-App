import React, { useContext } from "react";
import { themeContext } from "../App";
import { time_And_Date_Container_ImageSelectedView_Style } from "./Styles";

const ImageSelected = (props) => {
  let { dark } = useContext(themeContext);

  const fontColor = dark ? "#ffff" : "#000000";

  const date_Style = {
    padding: " 0 0.4rem",
    fontSize: ".7rem",
    color: fontColor,
  };

  return (
    <>
      <div>
        <div className="messages_Container">
          <span style={{ color: fontColor }}>{props.name}</span>
          <img
            src={props.imageSource}
            alt="image"
            onClick={props.onClick}
            className="sendUserImage"
          />

          <div style={time_And_Date_Container_ImageSelectedView_Style}>
            <small style={date_Style}>{props.date}</small>
            <span style={{ color: fontColor, marginTop: "0" }}>
              {props.Time}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageSelected;
