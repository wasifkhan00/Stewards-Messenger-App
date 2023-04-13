// import styled from "styled-components";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";
import "../styles/chat.css";
import Chat from "./Chat";

const Register = (props) => {
  const [errorNetworkWarning, setErrorNetworkWarning] = useState(false);
  const [fullNameValidator, setFullNameValidator] = useState(false);
  const [fullName_Reg, setFullName_Reg] = useState("");
  const [accountValidator, setaccountValidator] = useState(false);
  const [accountNo, setAccountNo] = useState("");
  const [passwordValidator, setPasswordValidator] = useState(false);
  const [password_Reg, setPassword_Reg] = useState("");
  const [cPasswordValidator, setCPasswordValidator] = useState(false);
  const [confirmPassword_Reg, setConfirmPassword_Reg] = useState("");
  const [alreadyExistsAccountNo, setAlreadyExistsAccountNo] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [showChat, setShowChat] = useState(false);
  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?`]/;
  const isContainsNumber = /^(?=.*[0-9]).*$/;
  const register = `https://mychatappbackend.xyz/register`;
  const endPointToken = process.env.Token;
  const headers = {
    "Content-Type": "application/json",
    Authorization: endPointToken,
  };

  const hangleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      name: fullName_Reg,
      account: accountNo,
      password: password_Reg,
      cPassword: confirmPassword_Reg,
    };

    if (
      formData.name !== "" &&
      formData.account !== "" &&
      formData.password !== "" &&
      formData.cPassword !== "" &&
      fullNameValidator !== true &&
      accountValidator !== true &&
      passwordValidator !== true &&
      cPasswordValidator !== true &&
      alreadyExistsAccountNo !== true
    ) {
      axios
        .post(register, formData, { headers: headers })
        .then((response) => {
          if (response.status !== 200) {
            throw Error("Can not register you at the moment");
          }
          if (response.data === "Account Successfully Registered") {
            setSuccessMessage(true);

            setTimeout(() => {
              setShowChat(true);
              props.gotTheAccountNo(formData.account);
            }, 2000);

            document.getElementsByName("fullName")[0].value = "";
            document.getElementsByName("account")[0].value = "";
            document.getElementsByName("password")[0].value = "";
            document.getElementsByName("cpassword")[0].value = "";
            setFullName_Reg("");
            setAccountNo("");
            setPassword_Reg("");
            setConfirmPassword_Reg("");
          } else {
            setAlreadyExistsAccountNo(true);

            document.getElementsByName("fullName")[0].value = "";
            document.getElementsByName("account")[0].value = "";
            document.getElementsByName("password")[0].value = "";
            document.getElementsByName("cpassword")[0].value = "";
          }
        })
        .catch((err) => {
          if (err.code !== "" || err.message !== "") {
            window.location.reload(false);
          }
        });
    } else {
      e.preventDefault();
      setFullNameValidator(true);
      setAlreadyExistsAccountNo(false);
      setaccountValidator(true);
      setPasswordValidator(true);
      setCPasswordValidator(true);
    }
  };

  const handleFullNameChange = (e) => {
    if (
      e.target.value === "" ||
      e.target.value.length < 5 ||
      e.target.value.match(format) ||
      e.target.value.includes("     ")
    ) {
      setFullNameValidator(true);
    } else {
      setFullName_Reg(e.target.value);
      setFullNameValidator(false);
    }
    setAlreadyExistsAccountNo(false);
    setaccountValidator(false);
    setPasswordValidator(false);
    setCPasswordValidator(false);
  };

  const handleAccountNoChange = (e) => {
    if (
      e.target.value === "" ||
      e.target.value.match(format) ||
      !isContainsNumber.test(e.target.value) ||
      e.target.value.length < 5 ||
      e.target.value.includes(" ")
    ) {
      setaccountValidator(true);
    } else {
      setAccountNo(e.target.value);
      setaccountValidator(false);
    }
    setFullNameValidator(false);
    setAlreadyExistsAccountNo(false);
    setPasswordValidator(false);
    setCPasswordValidator(false);
  };

  const handlePasswordChange = (e) => {
    if (
      e.target.value === "" ||
      e.target.value.length < 8 ||
      !isContainsNumber.test(e.target.value)
    ) {
      setPasswordValidator(true);
    } else {
      setPassword_Reg(e.target.value);
      setPasswordValidator(false);
    }
    setaccountValidator(false);
    setFullNameValidator(false);
    setAlreadyExistsAccountNo(false);
    setCPasswordValidator(false);
  };

  const handleConfirmPasswordChange = (e) => {
    if (e.target.value !== password_Reg) {
      setCPasswordValidator(true);
    } else {
      setConfirmPassword_Reg(e.target.value);
      setCPasswordValidator(false);
    }
    setaccountValidator(false);
    setFullNameValidator(false);
    setAlreadyExistsAccountNo(false);
    setPasswordValidator(false);
  };

  return (
    <>
      {showChat ? (
        <Chat />
      ) : (
        <div className="App">
          <form className="form_inputs_Container">
            <div className="heading_top">
              <h3>Sign Up</h3>
            </div>

            <div className="inputOne">
              <label htmlFor="fullName">
                <b>Full name</b>
              </label>
              <input
                type="text"
                name="fullName"
                maxLength={18}
                onChange={handleFullNameChange}
                placeholder="Enter Your Full Name"
              />

              {fullNameValidator ? (
                <small id="warnings">
                  <span> &#9888;</span>
                  Must be 5 char long without any special char
                </small>
              ) : null}
            </div>
            <div className="inputOne">
              <label htmlFor="account">
                <b> Account No</b>
              </label>

              <input
                type="text"
                name="account"
                maxLength={6}
                onChange={handleAccountNoChange}
                placeholder="Choose a unique account no "
              />

              {accountValidator ? (
                <small id="warnings">
                  <span> &#9888; </span>

                  {`Must be 5 chars and must have num without any special char`}
                </small>
              ) : null}
            </div>

            <div className="inputTwo">
              <label htmlFor="password">
                <b>Password</b>
              </label>
              <input
                type="password"
                maxLength={40}
                name="password"
                onChange={handlePasswordChange}
                placeholder="Set a Password"
              />

              {passwordValidator ? (
                <small id="warnings">
                  <span> &#9888; </span>
                  {`Must be 8-40 digits long and must have nums`}
                </small>
              ) : null}
            </div>

            <div className="inputTwo">
              <label htmlFor="cpassword">
                <b>Confirm password</b>
              </label>
              <input
                type="password"
                name="cpassword"
                maxLength={40}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm Your Password"
              />

              {cPasswordValidator ? (
                <small id="warnings">
                  <span> &#9888; </span>
                  {`Password and Confirm Password Doesn't match `}
                </small>
              ) : null}
            </div>

            <button onClick={hangleSubmit}>Sign Up</button>

            <span id="Have_an_Account">
              Already have an account ?{" "}
              <Link to="/" style={{ color: "white" }}>
                Login
              </Link>
            </span>

            {errorNetworkWarning ? (
              <small id="warnings">
                <span> &#9888; </span>
                {`Please make sure you have a stable internet Connection`}
              </small>
            ) : null}

            {alreadyExistsAccountNo ? (
              <small id="warnings">
                <span> &#9888; </span>
                {`An account already exists with this account no`}
              </small>
            ) : null}

            {successMessage ? (
              <small id="warnings" className="success">
                <span> &#9989;</span>
                {`Registeration Successful ! We're Redirecting you to the website `}
              </small>
            ) : null}
          </form>
        </div>
      )}
    </>
  );
};

export default Register;
