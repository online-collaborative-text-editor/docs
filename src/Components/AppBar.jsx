import React from "react";
import { useNavigate } from "react-router-dom";
import AnimatedH1 from "./AnimatedH1";

const AppBar = (props) => {
  const currentDashboardPage = props.currentDashboardPage
    ? props.currentDashboardPage
    : "all";
  const name = props.name;
  const page = props.page;
  // console.log("inside appbar now , the passed currentDashboardPage is " + currentDashboardPage);
  const navigate = useNavigate();
  ////////////////////////////OWNED CLICK HANDLER////////////////////////////
  const handleOwnedClick = () => {
    console.log("Owned clicked");
    //navigate to dashbaord with page owned
    navigate("/dashboard", { state: { AppbarSelectedPage: "owned" } });
  };
  ////////////////////////////EDITED CLICK HANDLER////////////////////////////
  const handleEditClick = () => {
    console.log("Edited clicked");
    navigate("/dashboard", { state: { AppbarSelectedPage: "edited" } });
  };
  ////////////////////////////VIEWED CLICK HANDLER////////////////////////////
  const handleViewedClick = () => {
    console.log("Viewed clicked");
    navigate("/dashboard", { state: { AppbarSelectedPage: "viewed" } });
  };
  ////////////////////////////NEW CLICK HANDLER////////////////////////////
  const handleNewClick = () => {
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
          navigate("/editor", {
            state: {
              file: { name: "untitled", content: "" },
              AppbarSelectedPage: "created",
            },
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
    navigate("/dashboard", { state: { AppbarSelectedPage: "all" } });
  };
  ////////////////////////////LOGOUT CLICK HANDLER//////////////////////////// 
  const handleLogoutClick = () => {
    console.log("Logout clicked");
    localStorage.removeItem("token");
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
          <AnimatedH1>Editable files</AnimatedH1>
        ) : null}
        {currentDashboardPage === "viewed" && !name ? (
          <AnimatedH1>View only files</AnimatedH1>
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
            <button onClick={handleEditClick}>Edited Docs</button>
          ) : null}
          {currentDashboardPage !== "viewed" && !name ? (
            <button onClick={handleViewedClick}>Viewed Docs</button>
          ) : null}
          {currentDashboardPage !== "created" && !name ? (
            <button onClick={handleNewClick}>Create new</button>
          ) : null}
          {currentDashboardPage !== "all" && !name ? (
            <button onClick={handleAllClick}>All</button>
          ) : null}
          <button onClick={handleLogoutClick}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default AppBar;
