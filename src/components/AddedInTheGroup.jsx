import React from "react";
import { added_In_The_Group_Container_Style } from "./Styles";

const AddedInTheGroup = (props) => {
  return (
    <div style={added_In_The_Group_Container_Style}>
      <div className="user_Joined" style={{ color: "#5d9281" }}>
        {`${props.referred} added you in the group`}
      </div>
    </div>
  );
};

export default AddedInTheGroup;
