import React from 'react';
import docIcon2 from '../icons/docIcon2.png';
import AppBar from './AppBar'; 

var viewedDocsNames = ['view1', 'view2', 'view3', 'view4', 'view5', 'view6', 'view7', 'view8', 'view9', 'view10'];

const ViewedListing = () => {
    return (
        <div>
            <AppBar title="Viewed by me" /> 
            
            <div className='docs-container'>
                {viewedDocsNames.map((docName, index) => (
                    <div key={index} className='card'>
                        <img src={docIcon2} alt="Doc icon" />
                        <h2>{docName}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViewedListing;