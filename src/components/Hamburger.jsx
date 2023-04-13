import React, { useState, useContext } from "react";
import { themeContext } from "../App";
import "../styles/hamburger.css";

const Hamburger = (props) => {
  let { isChecked, setIsChecked } = useContext(themeContext);

  const handleHamburger = (e) => {
    if (e.target.checked) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  };
  return (
    <>
      <nav>
        <input
          onClick={handleHamburger}
          id="dropdown"
          className="input-box"
          type="checkbox"
          style={{ display: "none" }}
        />

        <label htmlFor="dropdown" className="dropdown">
          <span className="hamburger">
            <span
              className={isChecked ? "icon-bar top-bar" : "icon-bar"}></span>
            <span
              className={isChecked ? "icon-bar middle-bar" : "icon-bar"}></span>
            <span
              className={isChecked ? "icon-bar bottom-bar" : "icon-bar"}></span>
          </span>
        </label>
      </nav>
    </>
  );
};

export default Hamburger;
