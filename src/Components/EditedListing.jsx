import React from 'react';
import docIcon2 from '../icons/docIcon2.png';
import AppBar from './AppBar'; 

var editedDocsNames = ['edit1', 'edit2', 'edit3', 'edit4', 'edit5', 'edit6', 'edit7', 'edit8', 'edit9', 'edit10'];

const EditedListing = () => {
    return (
        <div>
            <AppBar title="Edited by me" /> 
            
            <div className='docs-container'>
                {editedDocsNames.map((docName, index) => (
                    <div key={index} className='card'>
                        <img src={docIcon2} alt="Doc icon" />
                        <h2>{docName}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EditedListing;