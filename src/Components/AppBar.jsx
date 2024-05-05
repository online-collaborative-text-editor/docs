import React from 'react';
import { Link } from 'react-router-dom';

const AppBar = ({ name, page }) => {
    console.log(name);
    console.log(page);
    return (
        <div className='appbar'>

            <p>{name}</p>
            <div className='appbar-buttons'>

                {page !== "dashboard" ? <Link to="/dashboard"><button>Owned Docs</button></Link> : null}
                {page !== "edited" ? <Link to="/edited"><button>Edited Docs</button></Link> : null}

                {page !== "viewed" ? <Link to="/viewed"><button>Viewed Docs</button></Link> : null}

                {/* {page !== "created" ? <Link to="/editor"><button>Create Doc</button></Link> : null} */}
                {page !== "created" ?
                    <Link to={{ pathname: "/editor", state: { file: { name: name, content: "ay kalam" }, page: "created" } }}>
                        <button>Create Doc</button>
                    </Link>
                    : null}
            </div>
        </div>
    );
}

export default AppBar;