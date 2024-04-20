import React from 'react';
import { Link } from 'react-router-dom';
import docIcon from '../icons/docIcon.jpg';
import docIcon2 from '../icons/docIcon2.png';

var ownedDocsNames = ['Doc1', 'Doc2', 'Doc3', 'Doc4', 'Doc5', 'Doc6', 'Doc7', 'Doc8', 'Doc9', 'Doc10'];

const DashBoard = () => {
    return (
        <div>
            <div className='appbar'>
                <h1>Welcome to Docs</h1>
            <p>My Docs</p>
                <div className='appbar-buttons'>
                    <button>Owned Docs</button>
                    <button>Edited Docs</button>
                    <button>Viewed Docs</button>
                    <button>Create Doc</button>
                </div>
            </div>
            
            <div className='docs-container'>
                {ownedDocsNames.map((docName, index) => (
                    <div key={index} className='card'>
                        <img src={docIcon2} alt="Doc icon" />
                        <h2>{docName}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DashBoard;