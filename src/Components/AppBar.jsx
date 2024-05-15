import React from "react";
import { useNavigate } from "react-router-dom";
import AnimatedH1 from "./AnimatedH1";

const AppBar = (props) => {
  const currentDashboardPage = props.currentDashboardPage
    ? props.currentDashboardPage
    : "all";
  const name = props.name;
  const page = props.page;
  const username = props.username;
  // console.log("inside appbar now , the passed currentDashboardPage is " + currentDashboardPage);
  const navigate = useNavigate();
  ////////////////////////////OWNED CLICK HANDLER////////////////////////////
  const handleOwnedClick = () => {
    console.log("Owned clicked");
    //navigate to dashbaord with page owned
    navigate("/dashboard", {
      state: { AppbarSelectedPage: "owned", username },
    });
  };
  ////////////////////////////EDITED CLICK HANDLER////////////////////////////
  const handleEditClick = () => {
    console.log("Edited clicked");
    navigate("/dashboard", {
      state: { AppbarSelectedPage: "edited", username },
    });
  };

  ////////////////////////////NEW CLICK HANDLER////////////////////////////
  const handleNewClick = () => {
    let docId;
    console.log("New clicked");
    const data = {
      documentName: "untitled",
    };
    fetch(`http://localhost:8080/api/files/create?documentName=untitled`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        console.log(response);
        if (response.status === 201) {
          console.log("document created");
          //get the id from the response body it is a string not json
          response.text().then((data) => {
            console.log("response data is:", data);
            docId = data;
            console.log("docId is:", docId);

            navigate("/editor", {
              state: {
                file: { name: "untitled", content: "" },
                AppbarSelectedPage: "created",
                username: username,
                docId: docId,
              },
            });
          });
        } else {
          console.log("document not created");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  ////////////////////////////ALL CLICK HANDLER////////////////////////////
  const handleAllClick = () => {
    console.log("All clicked");
    navigate("/dashboard", { state: { AppbarSelectedPage: "all", username } });
  };
  ////////////////////////////LOGOUT CLICK HANDLER////////////////////////////
  const handleLogoutClick = () => {
    console.log("Logout clicked");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };
  //

  ////////////////////////////RETURN STATEMENT////////////////////////////
  return (
    <div>
      <div className="appbar">
        {name ? <AnimatedH1>{name}</AnimatedH1> : null}
        {currentDashboardPage === "owned" && !name ? (
          <AnimatedH1>My files</AnimatedH1>
        ) : null}
        {currentDashboardPage === "edited" && !name ? (
          <AnimatedH1>Shared with me</AnimatedH1>
        ) : null}

        {currentDashboardPage === "created" && !name ? (
          <AnimatedH1>Create new file</AnimatedH1>
        ) : null}
        {currentDashboardPage === "all" && !name ? (
          <AnimatedH1>All files</AnimatedH1>
        ) : null}
        <div className="appbar-buttons">
          {currentDashboardPage !== "owned" && !name ? (
            <button onClick={handleOwnedClick}>My owned documents</button>
          ) : null}
          {currentDashboardPage !== "edited" && !name ? (
            <button onClick={handleEditClick}>Shared with me</button>
          ) : null}

          {currentDashboardPage !== "all" && !name ? (
            <button onClick={handleAllClick}>All</button>
          ) : null}
          {currentDashboardPage !== "created" && !name ? (
            <button onClick={handleNewClick}>Create new</button>
          ) : null}
          <button onClick={handleLogoutClick}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default AppBar;
