import React from 'react';
import { Link } from 'react-router-dom';

const AppBar = ({ title }) => {
    return (
        <div className='appbar'>
            <h1>Welcome to Docs</h1>
            <p>{title}</p>
            <div className='appbar-buttons'>
                <Link to="/dashboard"><button>Owned Docs</button></Link>
                <Link to="/edited"><button>Edited Docs</button></Link>
                <Link to="/viewed"><button>Viewed Docs</button></Link>
                <Link to ="/editor"><button>Create Doc</button></Link>
            </div>
        </div>
    );
}

export default AppBar;