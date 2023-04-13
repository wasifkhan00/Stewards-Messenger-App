import React, { useContext } from "react";
import "../styles/dropdown.css";
import { themeContext } from "../App";

const Dropdown = (props) => {
  let {
    dark,
    setDark,
    setUserIsExitingTheGroup,
    setUserIsChagningGroupName,
    setShowRightSideMobile,
    showRightSideMobile,
  } = useContext(themeContext);

  const drop_Down_Container_Style = {
    backgroundColor: dark ? "rgb(59, 59, 59)" : "rgb(246, 246, 246)",
  };

  const fontColor = {
    color: dark ? "white" : "black",
  };

  const handleDarkButton = (e) => {
    props.setShowDarkAndLightModeDropDown(false);
    setDark(true);
  };

  const handleLightButton = (e) => {
    props.setShowDarkAndLightModeDropDown(false);
    setDark(false);
  };

  const handleLoggout = (e) => {
    props.setShowDarkAndLightModeDropDown(false);
    window.location.reload(false);
  };

  const handleExitGroup = (e) => {
    props.setShowDarkAndLightModeDropDown(false);
    setUserIsExitingTheGroup(true);
    setUserIsChagningGroupName(false);
  };

  const handleDeleteGroup = (e) => {
    props.setShowDarkAndLightModeDropDown(false);
    setUserIsExitingTheGroup(true);
    setUserIsChagningGroupName(false);
  };
  const handleGoBack = (e) => {
    props.setShowDarkAndLightModeDropDown(false);
    setShowRightSideMobile(false);
  };
  return (
    <div className="mainDropDownContainer">
      <div className="dropdowncontainer" style={drop_Down_Container_Style}>
        <div
          className="DD_firstChild common"
          style={fontColor}
          onClick={handleDarkButton}>
          Dark
        </div>

        <div
          className="DD_secondChild common"
          style={fontColor}
          onClick={handleLightButton}>
          Light
        </div>

        <div
          onClick={handleLoggout}
          className="DD_secondChild common"
          style={fontColor}>
          Logout
        </div>

        {props.userIsAdmin === "No" ? (
          <div
            onClick={handleExitGroup}
            className="DD_secondChild common"
            style={fontColor}>
            Exit Group
          </div>
        ) : (
          <div
            onClick={handleDeleteGroup}
            className="DD_secondChild common"
            style={fontColor}>
            Delete Group
          </div>
        )}

        {showRightSideMobile ? (
          <div
            onClick={handleGoBack}
            className="DD_secondChild common"
            style={fontColor}>
            Go Back
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dropdown;
