// import styled from "styled-components";
import React, { useState, useRef } from "react";
import { sockets } from "./CreateGRPInterface";
import { Link } from "react-router-dom";
import axios from "axios";
import Chat from "./Chat";
import "../App.css";

const Login = (props) => {
  const [incorrectEmail_Password, setIncorrectEmail_Password] = useState(false);
  const [usersName, setUsersName] = useState("");
  const [showLoadingInterface, setShowLoadingInterface] = useState(false);
  const [account_login, setAccount_Login] = useState("");
  const [password_login, setPassword_login] = useState("");
  const [showChat, setShowChat] = useState(false);
  const isContainsNumber = /^(?=.*[0-9]).*$/;
  const accountNoInput = useRef("");
  const passwordInput = useRef("");
  const Login = `https://mychatappbackend.xyz/login`;
  const endPointToken = process.env.Token;
  const headers = {
    "Content-Type": "application/json",
    Authorization: endPointToken,
  };

  const handleLogin = (e) => {
    const loginData = {
      account: account_login,
      password: password_login,
    };

    if (
      loginData.account === "" ||
      loginData.password === "" ||
      loginData.password.length < 8 ||
      !isContainsNumber.test(loginData.password)
    ) {
      setIncorrectEmail_Password(true);
    } else {
      axios
        .post(Login, loginData, { headers: headers })
        .then((res) => {
          if (!res.status === 200) {
            throw Error("Could not fetch the data at this time");
          }

          if (res.data === "Account no or Password not found") {
            setIncorrectEmail_Password(true);
          } else {
            setUsersName(res.data[0].names);
            setIncorrectEmail_Password(false);
            props.gotTheAccountNo(loginData.account);
            setShowChat(true);
            sockets.connect();
            sockets.emit(
              "checkGroupUniqueFromDBViaAccountNo",
              loginData.account
            );
          }
        })
        .catch((err) => {
          if (err.code !== "" || err.message !== "") {
            console.log(err);
            // window.location.reload(false);
          }
        });
    }
  };

  const handleGuestUserOne = (e) => {
    accountNoInput.current.value = "guest1";
    passwordInput.current.value = "guest123";
    setAccount_Login("guest1");
    setPassword_login("guest123");
  };

  const handleGuestUserTwo = (e) => {
    accountNoInput.current.value = "guest2";
    passwordInput.current.value = "guest123";

    setAccount_Login("guest2");
    setPassword_login("guest123");
  };

  const handleFirstInputChange = (e) => {
    setAccount_Login(e.target.value);
    setIncorrectEmail_Password(false);
  };

  const handleEnterKeyPressed = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleChangeSecondInput = (e) => {
    setPassword_login(e.target.value);
    setIncorrectEmail_Password(false);
  };
  return (
    <>
      {showChat ? (
        <Chat
          usersName={usersName}
          showLoadingInterface={showLoadingInterface}
          setShowLoadingInterface={setShowLoadingInterface}
        />
      ) : (
        <div className="App">
          <div className="container">
            <div className="form_inputs">
              <div className="heading_top">
                <h3>Log In</h3>
              </div>

              <div className="inputOne">
                <label htmlFor="account">
                  <b> Account No</b>
                </label>
                <input
                  ref={accountNoInput}
                  maxLength={6}
                  name="account"
                  type="text"
                  onChange={handleFirstInputChange}
                  placeholder="Enter your account no"
                />
              </div>
              <div className="inputTwo">
                <label htmlFor="password">
                  <b>Password</b>
                </label>
                <input
                  ref={passwordInput}
                  type="password"
                  maxLength={40}
                  onKeyDown={handleEnterKeyPressed}
                  onChange={handleChangeSecondInput}
                  placeholder="Enter Your Password"
                />

                {incorrectEmail_Password ? (
                  <small id="warnings">
                    <span> &#9888;</span>
                    {"Account no or Password not found"}
                  </small>
                ) : null}
              </div>
              <button className="button" onClick={handleLogin}>
                Login
              </button>

              <button className="button" onClick={handleGuestUserOne}>
                Guest User One
              </button>

              <button className="button" onClick={handleGuestUserTwo}>
                Guest User Two
              </button>

              <span>
                {"Doesn't have an account ? "}
                <Link to="/register" style={{ color: "white" }}>
                  Register Now
                </Link>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
