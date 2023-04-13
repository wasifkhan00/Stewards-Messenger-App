import React, { useRef, useContext, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { themeContext } from "../App";
import axios from "axios";
import User from "./User";
import { io } from "socket.io-client";

const socketIoConnection = `https://mychatappbackend.xyz/`;

export const sockets = io(socketIoConnection, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 10,
});

const Create_Group_Interface = (props) => {
  const [selectedUserGroupInformation, setSelectedUserGroupInformation] =
    useState([
      {
        accountNo: "",
        uniqueGroupKey: "",
        groupName: "",
        isAdmin: "",
      },
    ]);
  const [groupNameForSelectedUser, setGroupNameForSelectedUser] = useState("");
  const [groupMembersInputValue, setGroupMembersInputValue] = useState("");
  const [addedUserAccountNo, setAddedUserAccountNo] = useState("");
  const [showResponsesFromApi, setShowResponsesFromApi] = useState(false);
  const [userAlreadySelected, setUserAlreadySelected] = useState(false);
  const [groupCreatedByAdmin, setGroupCreatedByAdmin] = useState(false);
  const [accountDoesntExist, setAccountDoesntExist] = useState(false);
  const [inputsConditionsNotFullfilled, setInputsConditionsNotFullfilled] =
    useState(false);
  const [groupMembersResponse, setGroupMembersResponse] = useState([]);
  const [everyUserGroupInfoAccountNo, setEveryUserGroupInfoAccountNo] =
    useState([]);
  const [addingGroupMembers, setAddingGroupMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true);
  const groupMembersInputValues = useRef(null);
  let { userAccountNo } = useContext(themeContext);
  const constantUniqueGroupKeyGenerator = "yt730129daw$$wao";
  const uniqueGroupKeyGenerator =
    userAccountNo + constantUniqueGroupKeyGenerator;
  const groupNameInput = useRef(null);
  const regEx = /[a-zA-Z]/;
  const warning_Color = {
    color: "#d14b4b",
    fontSize: "11px",
    padding: userAlreadySelected ? "0.4rem" : "0.2rem",
    listStyleType: userAlreadySelected ? "square" : "none",
  };
  const checkIfUserHaveRegistered = `https://mychatappbackend.xyz/checkForGroupNames`;
  const newUserCreateGroup = `https://mychatappbackend.xyz/groupInformation`;
  const EverySingleUserGroupsData = `https://mychatappbackend.xyz/EveryGroupsData`;
  const endPointToken = process.env.Token;
  const headers = {
    "Content-Type": "application/json",
    Authorization: endPointToken,
  };

  useEffect(() => {
    // User Exists and Havent Created Any Group or Added by others
    const checkIfUserAlreadyCreatedGroup = async () => {
      await axios
        .get(EverySingleUserGroupsData, { headers: headers })
        .then((response) => {
          if (response.status !== 200) {
            throw Error("Cannot send Request to the server now  ");
          } else {
            response.data.length > 0 &&
            response.data !== "There are no groups Created yet"
              ? response.data.map((groupsData) => {
                  setEveryUserGroupInfoAccountNo((prevState) => [
                    ...prevState,
                    groupsData.accountNos,
                  ]);
                })
              : console.error("There are no groups Created yet");
          }
        })
        .catch((err) => console.error(err.message));
    };
    checkIfUserAlreadyCreatedGroup();
  }, []);

  useEffect(() => {}, [everyUserGroupInfoAccountNo]);

  useEffect(() => {
    const checkForGroupNames = async () => {
      await axios
        .post(
          checkIfUserHaveRegistered,
          { groupMembersInputValue },
          { headers: headers }
        )
        .then((response) => {
          if (response.status !== 200) {
            throw Error("Cannot send Request to the server now  ");
          }
          if (response.data !== "Account doesn't exists") {
            setShowResponsesFromApi(true);
            setAccountDoesntExist(false);
            response.data
              .filter((users) =>
                groupMembersInputValue !== ""
                  ? users.accounts
                      .toLowerCase()
                      .includes(groupMembersInputValue)
                  : console.error("The query should not be empty")
              )
              .map((user) => {
                const accountNumber = user.accounts;
                const accountName = user.names;
                const uniqueId = user._id;
                setGroupMembersResponse((prevState) => [
                  {
                    accountNames: accountName,
                    accountNumbers: accountNumber,
                    id: uniqueId,
                  },
                ]);
              });
          } else {
            setAccountDoesntExist(true);
            setShowResponsesFromApi(false);
          }
        })
        .catch((err) => console.error(err.message));
    };

    const checkForGroupNamesDebounced = debounce(checkForGroupNames, 1100);

    if (groupMembersInputValue !== "") {
      checkForGroupNamesDebounced();
    }
  }, [groupMembersInputValue]);

  const handleGroupNameInformation = (e) => {
    const groupInformation = {
      accountNo: userAccountNo,
      uniqueGroupKey: uniqueGroupKeyGenerator,
      groupName: groupNameInput.current.value,
      isAdmin: isAdmin ? "Yes" : "No",
      members: addingGroupMembers,
      AddedBy: "None",
    };

    props.uniqueKey(groupInformation.uniqueGroupKey);
    props.checkUserAdmin(groupInformation.isAdmin);

    if (
      groupNameInput.current.value !== "" &&
      groupNameInput.current.value.match(regEx) &&
      addingGroupMembers.length > 0
    ) {
      addingGroupMembers.push(userAccountNo);

      setGroupNameForSelectedUser(groupInformation.groupName);
      props.getGroupName(groupNameInput.current.value);
      props.groupMembersData(addingGroupMembers);
      setGroupCreatedByAdmin(true);
      groupNameInput.current.value = "";
      props.setShowCreateGroupIntf(!props.showCreateGroupIntf);

      axios
        .post(newUserCreateGroup, groupInformation, { headers: headers })
        .then((response) => {
          if (response.status !== 200) {
            throw Error("Cannot send request to the server now");
          }
          if (response.data === "Account number found") {
          }
          sockets.emit(
            "checkGroupUniqueFromDBViaAccountNo",
            groupInformation.accountNo
          );
        })
        .catch((err) => console.error(err.message));

      setUserAlreadySelected(false);
      setGroupMembersInputValue("");
      setTimeout(() => {
        setAddingGroupMembers([]);
      }, 200);
    } else {
      setInputsConditionsNotFullfilled(true);
    }
  };

  function usersComponentOnclick(e) {
    setShowResponsesFromApi(false);
    setUserAlreadySelected(false);
    setInputsConditionsNotFullfilled(false);

    if (
      addingGroupMembers.length !== 4 &&
      !addingGroupMembers.includes(e.target.innerText.toLowerCase()) &&
      e.target.innerText.toLowerCase() !== userAccountNo &&
      // everyUserGroupInfoAccountNo.length > 0 &&
      !everyUserGroupInfoAccountNo.includes(e.target.innerText.toLowerCase())
    ) {
      setAddingGroupMembers((prevState) => [
        ...prevState,
        ...new Set([e.target.innerText.toLowerCase()]),
      ]);

      setAddedUserAccountNo(e.target.innerText.toLowerCase());

      setSelectedUserGroupInformation((prevState) => [
        ...prevState,
        {
          accountNo: e.target.innerText,
          uniqueGroupKey: uniqueGroupKeyGenerator,
          isAdmin: isAdmin ? "No" : "Yes",
        },
      ]);
    } else {
      setUserAlreadySelected(true);
    }
  }

  useEffect(() => {
    if (groupCreatedByAdmin && groupNameForSelectedUser) {
      selectedUserGroupInformation.forEach((elements) => {
        if (elements.accountNo !== "") {
          const groupInformation = {
            accountNo: elements.accountNo,
            uniqueGroupKey: elements.uniqueGroupKey,
            groupName: groupNameForSelectedUser,
            isAdmin: elements.isAdmin,
            members: addingGroupMembers,
            AddedBy: userAccountNo,
          };

          axios
            .post(newUserCreateGroup, groupInformation, { headers: headers })
            .then((response) => {
              if (response.status !== 200) {
                throw Error("Cannot Register the users now");
              }
              if (response.data === "Account number found") {
                console.clear();
              }
            });
        }
      });
    }
  }, [addingGroupMembers, groupCreatedByAdmin]);

  function removeTheSpan(e) {
    setAddingGroupMembers([]);
    setUserAlreadySelected(false);
  }
  const handleClickOnFirstInput = (e) => {
    setShowResponsesFromApi(false);
    setInputsConditionsNotFullfilled(false);
  };

  const handleClickSecondInputContainer = (e) => {
    if (groupMembersResponse.length > 0) {
      setShowResponsesFromApi(!showResponsesFromApi);
    } else {
      return null;
    }
  };

  const handleChangeSecondInput = (e) => {
    if (e.target.value !== "") {
      setGroupMembersInputValue(e.target.value);
      setUserAlreadySelected(false);
      setInputsConditionsNotFullfilled(false);
    }
  };

  const handleCancelButton = (e) => {
    props.setShowCreateGroupIntf(!props.showCreateGroupIntf);
    groupNameInput.current.value = "";
    groupMembersInputValues.current.value = "";
  };

  const second_Input_Container_Style = {
    marginBottom: accountDoesntExist || userAlreadySelected ? ".2rem" : "1rem",
  };
  return (
    <>
      <div className="createGroupInterfaceContainer">
        <input
          onClick={handleClickOnFirstInput}
          ref={groupNameInput}
          type="text"
          maxLength={34}
          placeholder="Choose your group's name..."
          required
        />

        <div className="inputSecondContainer">
          <input
            ref={groupMembersInputValues}
            onClick={handleClickSecondInputContainer}
            style={second_Input_Container_Style}
            type="text"
            onChange={handleChangeSecondInput}
            required
            maxLength={34}
            placeholder="Add your friends by account no..."
          />

          {accountDoesntExist || userAlreadySelected ? (
            <>
              <li id="warnings" style={warning_Color}>
                {userAlreadySelected
                  ? "Users should be unique members "
                  : " User not found !"}
              </li>
              <li id="warnings" style={warning_Color}>
                {userAlreadySelected ? "Users Should not have a group " : null}
              </li>

              <li id="warnings" style={warning_Color}>
                {userAlreadySelected ? "Only 4 Users can be added" : null}
              </li>
            </>
          ) : null}

          {inputsConditionsNotFullfilled ? (
            <li id="warnings" style={warning_Color}>
              Please fill the required fields*
            </li>
          ) : null}

          <div className="SelectedUsersContainer" style={warning_Color}>
            {addingGroupMembers.length > 0
              ? addingGroupMembers.map((users) => {
                  return (
                    <React.Fragment>
                      <span style={{ display: "flex" }}>{users}</span>
                    </React.Fragment>
                  );
                })
              : null}
            {addingGroupMembers.length > 0 ? (
              <small onClick={removeTheSpan}>X</small>
            ) : null}
          </div>
        </div>

        {showResponsesFromApi ? (
          <div className="containerOfResponses">
            {groupMembersResponse.length > 0
              ? groupMembersResponse.map((users) => {
                  return (
                    <React.Fragment key={users.id}>
                      <User
                        showCursor={true}
                        marginTop=".4rem"
                        groupName={users.accountNumbers}
                        lastMessage={users.accountNames}
                        onClick={usersComponentOnclick}
                      />
                    </React.Fragment>
                  );
                })
              : null}
          </div>
        ) : null}

        <div className="createGroupInterfaceButtons">
          <button onClick={handleGroupNameInformation}>Create Group</button>
          <button onClick={handleCancelButton}>Cancel</button>
        </div>
      </div>
    </>
  );
};

export default Create_Group_Interface;
