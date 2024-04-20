import React from 'react';
import docIcon2 from '../icons/docIcon2.png';
import AppBar from './AppBar'; 

var ownedDocsNames = ['Doc1', 'Doc2', 'Doc3', 'Doc4', 'Doc5', 'Doc6', 'Doc7', 'Doc8', 'Doc9', 'Doc10'];

const DashBoard = () => {
    return (
        <div>
            <AppBar title="My Docs" /> 
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