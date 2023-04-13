import React, { useContext } from "react";
import { view_Image_Container_Style } from "./Styles";
import { themeContext } from "../App";

const ViewImage = (props) => {
  let { uploadedImageDimensions } = useContext(themeContext);


  const view_Image_Container_Image_Style = {
    resizeMode: "cover",
    width:
      uploadedImageDimensions !== null
        ? uploadedImageDimensions.width < 850
          ? `${uploadedImageDimensions.width}px`
          : "100%"
        : null,

    // height:
    //   uploadedImageDimensions !== null
    //     ? `${uploadedImageDimensions.height}px`
    //     : null,
  };

  return (
    <div className="viewImageContainer" style={view_Image_Container_Style}>
      <img
        className="viewImageRealImage"
        style={view_Image_Container_Image_Style}
        src={props.imageSource}
        alt="viewImage"
      />
    </div>
  );
};

export default ViewImage;
