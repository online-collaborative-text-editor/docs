// EditedListing.js
import React from 'react';
import docIcon2 from '../icons/docIcon2.png';
import AppBar from './AppBar';
import { useNavigate } from "react-router-dom";

// Define mock files with name and content
const mockFiles = [
    {
        name: 'Doc1', content: 'Content of file 1', owner: 'owner1'
    },
    { name: 'Doc2', content: 'Content of file 2', owner: 'owner2', contributers: ['heba', 'fatema', 'mohsen', 'hanzada'], created_at: '2021-09-01' },
    { name: 'Doc3', content: 'Content of file 3', owner: 'owner3', contributers: ['heba', 'fatema', 'mohsen', 'hanzada'], created_at: '2021-09-01' },
    { name: 'Doc4', content: 'Content of file 4', owner: 'owner4', contributers: ['heba', 'fatema', 'mohsen', 'hanzada'], created_at: '2021-09-01' },
    { name: 'Doc5', content: 'Content of file 5', owner: 'owner5', contributers: ['heba', 'fatema', 'mohsen', 'hanzada'], created_at: '2021-09-01' },
    { name: 'Doc6', content: 'Content of file 6', owner: 'owner6' },
    { name: 'Doc7', content: 'Content of file 7', owner: 'owner7' },
    { name: 'Doc8', content: 'Content of file 8', owner: 'owner8' },
    { name: 'Doc9', content: 'Content of file 9', owner: 'owner9' },
    { name: 'Doc10', content: 'Content of file 10', owner: 'owner10' },

];

const EditedListing = () => {
    const navigate = useNavigate();
    // Function to handle clicking on a file
    const handleFileClick = (file) => {

        navigate('/editor', { state: { file, page: "edited" } });
    };

    return (
        <div>
            <AppBar title="Edited by me" />

            <div className="docs-container">
                {mockFiles.map((file, index) => (
                    <div key={index} className="card" onClick={() => handleFileClick(file)}>
                        <img src={docIcon2} alt="Doc icon" />
                        <h2>{file.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EditedListing;
