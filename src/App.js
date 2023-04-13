import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Loading from "./components/Loading";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hamburger from "./components/Chat";
import { createContext, useState } from "react";
import NotFound from "./components/Not Found";
// import EditGroupName from "./components/EditGroupName";
// import HandleErrors from "./components/HandleErrors";

export let themeContext = createContext(null);

function App() {
  const [userIsExitingTheGroup, setUserIsExitingTheGroup] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showRightSideMobile, setShowRightSideMobile] = useState(false);
  const [dark, setDark] = useState(false);
  const [userAccountNo, setUserAccountNo] = useState("");
  const [addMoreFriendsInGroup, setAddMoreFriendsInGroup] = useState(false);
  const [typing, setTyping] = useState(false);
  const [heIsTyping, setHeIsTyping] = useState("");
  const [messages, setMessages] = useState("");
  const [loggOut, setLoggOut] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(false);
  const [userIsChagningGroupName, setUserIsChagningGroupName] = useState(false);
  const [uploadedImageDimensions, setUploadedImageDimensions] = useState(null);
  const [sendImage, setSendImage] = useState(false);

  const [showDarkAndLightModeDropDown, setShowDarkAndLightModeDropDown] =
    useState(false);

  const gotTheAccountNo = (IncomingDataOfAccountNo) => {
    setUserAccountNo(IncomingDataOfAccountNo);
  };

  return (
    <>
      <BrowserRouter>
        <themeContext.Provider
          value={{
            sendImage,
            showRightSideMobile,
            setShowRightSideMobile,
            isChecked,
            setIsChecked,
            setSendImage,
            userIsChagningGroupName,
            setUserIsChagningGroupName,
            userIsExitingTheGroup,
            setUserIsExitingTheGroup,
            uploadedImageDimensions,
            setUploadedImageDimensions,
            unreadMessages,
            setUnreadMessages,
            messages,
            setMessages,
            typing,
            heIsTyping,
            setHeIsTyping,
            setTyping,
            loggOut,
            setLoggOut,
            showDarkAndLightModeDropDown,
            setShowDarkAndLightModeDropDown,
            dark,
            setDark,
            userAccountNo,
            addMoreFriendsInGroup,
            setAddMoreFriendsInGroup,
          }}>
          <Routes>
            <Route
              exact
              path="/"
              style={{ background: dark ? "white" : "black" }}
              element={<Login gotTheAccountNo={gotTheAccountNo} />}
            />

            <Route
              exact
              path="/register"
              element={<Register gotTheAccountNo={gotTheAccountNo} />}
            />
            <Route exact path="*" element={<NotFound />} />
            <Route exact path="dropdowns" element={<Loading />} />
          </Routes>
        </themeContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
