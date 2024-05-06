import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedH1 from './AnimatedH1';
import Font from 'react-font'
const AppBar = (probs) => {
    const currentDashboardPage = probs.currentDashboardPage;

    console.log("inside appbar now , the passed currentDashboardPage is " + currentDashboardPage);
    const navigate = useNavigate();
    ////////////////////////////OWNED CLICK HANDLER////////////////////////////
    const handleOwnedClick = () => {
        console.log("Owned clicked");
        //navigate to dashbaord with page owned 
        navigate('/dashboard', { state: { AppbarSelectedPage: "owned" } });
    }
    ////////////////////////////EDITED CLICK HANDLER////////////////////////////
    const handleEditClick = () => {
        console.log("Edited clicked");
        navigate('/dashboard', { state: { AppbarSelectedPage: "edited" } });
    }
    ////////////////////////////VIEWED CLICK HANDLER////////////////////////////
    const handleViewedClick = () => {
        console.log("Viewed clicked");
        navigate('/dashboard', { state: { AppbarSelectedPage: "viewed" } });
    }
    ////////////////////////////NEW CLICK HANDLER////////////////////////////
    const handleNewClick = () => {
        console.log("New clicked");
        navigate('/dashboard', { state: { AppbarSelectedPage: "created" } });
    }
    ////////////////////////////ALL CLICK HANDLER////////////////////////////
    const handleAllClick = () => {
        console.log("All clicked");
        navigate('/dashboard', { state: { AppbarSelectedPage: "all" } });
    }
    ////////////////////////////RETURN STATEMENT////////////////////////////
    return (
        <Font family="Roboto" weight={100}>
            <div className='appbar'>
                {currentDashboardPage === "owned" ? <AnimatedH1>My files</AnimatedH1> : null}
                {currentDashboardPage === "edited" ? <AnimatedH1>Editable files</AnimatedH1> : null}
                {currentDashboardPage === "viewed" ? <AnimatedH1>View only files</AnimatedH1> : null}
                {currentDashboardPage === "created" ? <AnimatedH1>Create new file</AnimatedH1> : null}
                {currentDashboardPage === "all" ? <AnimatedH1>All files</AnimatedH1> : null}
                <div className='appbar-buttons'>
                    {currentDashboardPage !== "owned" ? <button onClick={handleOwnedClick}>My owned documents</button> : null}
                    {currentDashboardPage !== "edited" ? <button onClick={handleEditClick}>Edited Docs</button> : null}
                    {currentDashboardPage !== "viewed" ? <button onClick={handleViewedClick}>Viewed Docs</button> : null}
                    {currentDashboardPage !== "created" ? <button onClick={handleNewClick}>Create new</button> : null}
                    {currentDashboardPage !== "all" ? <button onClick={handleAllClick}>All</button> : null}
                </div>
            </div>
        </Font>
    );
}

export default AppBar;