import React, { useRef, useContext, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { themeContext } from "../App";
import axios from "axios";
import User from "./User";

const AddFriends = (props) => {
  const [selectedUserGroupInformation, setSelectedUserGroupInformation] =
    useState([
      {
        accountNo: "",
        uniqueGroupKey: "",
        groupName: "",
      },
    ]);
  const [isAdmin, setIsAdmin] = useState(true);
  const [userAlreadySelected, setUserAlreadySelected] = useState(false);
  const [inputsConditionsNotFullfilled, setInputsConditionsNotFullfilled] =
    useState(false);
  const [showResponsesFromApi, setShowResponsesFromApi] = useState(false);
  const [accountDoesntExist, setAccountDoesntExist] = useState(false);
  const [groupMembersResponse, setGroupMembersResponse] = useState([]);
  const [everyUserGroupInfoAccountNo, setEveryUserGroupInfoAccountNo] =
    useState([]);
  let { userAccountNo, setAddMoreFriendsInGroup, dark } =
    useContext(themeContext);
  const groupMembersInputValues = useRef(null);
  const [addingGroupMembers, setAddingGroupMembers] = useState([]);
  const [everyGroupMemberDataResp, setEveryGroupMemberDataResp] = useState([]);
  const [groupMembersInputValue, setGroupMembersInputValue] = useState("");
  const [groupMembersForSelectedUser, setGroupMembersForSelectedUser] =
    useState([]);
  const constantUniqueGroupKeyGenerator = "yt730129";
  const uniqueGroupKeyGenerator =
    userAccountNo + constantUniqueGroupKeyGenerator;

  const warning_Color = {
    color: "#d14b4b",
    fontSize: "10px",
    padding: userAlreadySelected ? "0.4rem" : "0.2rem",
    listStyleType: userAlreadySelected ? "square" : "none",
  };

  const warning_Font_Color = {
    padding: "0.6rem",
    color: "#d14b4b",
  };

  const checkIfUserHaveRegistered = `https://mychatappbackend.xyz/checkForGroupNames`;
  const updateGroupMembers = `https://mychatappbackend.xyz/updateGroupMembersArray`;
  const checkTotalGroupMembersAvailability = `https://mychatappbackend.xyz/groupInformationz`;
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

    axios
      .post(
        checkTotalGroupMembersAvailability,
        { userAccountNo },
        { headers: headers }
      )
      .then((response) => {
        if (response.status !== 200) {
          throw Error("For Some reason server has denied the request");
        }
        if (response.data !== "Couldnt FInd the group info") {
          response.data.map((element) => {
            setEveryGroupMemberDataResp(element.member);
          });
        }
      })
      .catch((err) => console.err(err.message));
  }, []);

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
            throw Error("Can not Send request to the server at the moment");
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
                  : console.warn("The query should not be empty")
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
        .catch((err) => console.warn(err.message));
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
      members: everyGroupMemberDataResp,
    };

    if (
      groupInformation.uniqueGroupKey !== "" &&
      groupInformation.members.length > 0 &&
      addingGroupMembers.length > 0 &&
      props.groupName !== ""
    ) {
      addingGroupMembers.map((el) => {
        everyGroupMemberDataResp.push(el);
      });

      setInputsConditionsNotFullfilled(false);

      setGroupMembersForSelectedUser(groupInformation.members);

      props.groupMembersData(groupInformation.members);

      axios
        .put(updateGroupMembers, groupInformation, { headers: headers })
        .then((res) => {
          if (res.status !== 200) {
            throw Error("Cannot update group members at the moment");
          }
          console.clear();
        })
        .catch((err) => console.warn(err.message));

      setTimeout(() => {
        setAddMoreFriendsInGroup(false);
      }, 200);

      setEveryGroupMemberDataResp([]);
    } else {
      setInputsConditionsNotFullfilled(true);
      e.preventDefault();
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
    const sendSelectedUsersData = async () => {
      selectedUserGroupInformation.forEach(async (elements) => {
        if (elements.accountNo !== "") {
          addingGroupMembers.push(userAccountNo);
          const groupInformation = {
            accountNo: elements.accountNo,
            uniqueGroupKey: elements.uniqueGroupKey,
            groupName: props.groupName,
            isAdmin: elements.isAdmin,
            members: groupMembersForSelectedUser,
            AddedBy: userAccountNo,
          };

          await axios
            .post(newUserCreateGroup, groupInformation, { headers: headers })
            .then((response) => {
              if (response.status !== 200) {
                throw Error("Server Has Denied the Request");
              }
              if (response.data === "Account number found") {
                console.clear();
              }
            })
            .catch((err) => console.error(err.message));
        }
      });
    };
    if (groupMembersForSelectedUser.length > 0) {
      sendSelectedUsersData();
    }
  }, [addingGroupMembers, groupMembersForSelectedUser]);

  function removeTheSpan(e) {
    setAddingGroupMembers([]);
    setUserAlreadySelected(false);
  }

  const handleGroupMemberResponse = (e) => {
    if (groupMembersResponse.length > 0) {
      setShowResponsesFromApi(!showResponsesFromApi);
    } else {
      return null;
    }
  };

  const handleSendRequestToApiForUserChecking = (e) => {
    if (e.target.value !== "") {
      setGroupMembersInputValue(e.target.value);
      setUserAlreadySelected(false);
      setInputsConditionsNotFullfilled(false);
    }
  };

  const handleCancelButton = (e) => {
    setAddMoreFriendsInGroup(false);
    groupMembersInputValues.current.value = "";
  };

  const add_Friends_Container_Input_Style = {
    color: dark ? "white" : "black",
    marginBottom: accountDoesntExist || userAlreadySelected ? ".2rem" : "1rem",
  };

  const container_Of_Responses_Add_Friends = {
    color: dark ? "black" : "white",
    background: dark ? "rgba(0, 0, 0, 0.90)" : "rgb(255 255 255 / 97%)",
    margin: "51px 35rem",
  };

  const Container_AddFriends_Style = {
    // margin: "1% 30%",
    background: dark ? "rgb(0 0 0 / 75%)" : "rgb(255 255 255 / 75%)",
  };
  return (
    <>
      <div
        className="createGroupInterfaceContainer"
        style={Container_AddFriends_Style}>
        <div className="inputSecondContainer">
          <input
            onChange={handleSendRequestToApiForUserChecking}
            style={add_Friends_Container_Input_Style}
            onClick={handleGroupMemberResponse}
            ref={groupMembersInputValues}
            type="text"
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
            <small id="warnings" style={warning_Font_Color}>
              Please fill the required fields*
            </small>
          ) : null}

          <div className="SelectedUsersContainer" style={warning_Font_Color}>
            {addingGroupMembers.length > 0
              ? addingGroupMembers.map((users) => {
                  return (
                    <>
                      <span style={{ display: "flex" }}>{users}</span>
                    </>
                  );
                })
              : null}
            {addingGroupMembers.length > 0 ? (
              <small onClick={removeTheSpan}>X</small>
            ) : null}
          </div>
        </div>

        {showResponsesFromApi ? (
          <div
            className="containerOfResponses"
            style={container_Of_Responses_Add_Friends}>
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
          <button onClick={handleGroupNameInformation}>Add Friends</button>
          <button onClick={handleCancelButton}>Cancel</button>
        </div>
      </div>
    </>
  );
};

export default AddFriends;
