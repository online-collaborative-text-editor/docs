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
                <button>Create Doc</button>
            </div>
        </div>
    );
}

export default AppBar;