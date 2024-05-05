import React from 'react';
import docIcon2 from '../icons/docIcon2.png';
import AppBar from './AppBar';
import { useNavigate } from 'react-router-dom';

const mockFiles = [
    {
        name: 'Doc1', content: 'Content of file 1', owner: 'owner1'
    },
    { name: 'Doc2', content: 'Content of file 2', owner: 'owner2' },
    { name: 'Doc3', content: 'Content of file 3', owner: 'owner3' },
    { name: 'Doc4', content: 'Content of file 4', owner: 'owner4' },
    { name: 'Doc5', content: 'Content of file 5', owner: 'owner5' },
    { name: 'Doc6', content: 'Content of file 6', owner: 'owner6' },
    { name: 'Doc7', content: 'Content of file 7', owner: 'owner7' },
    { name: 'Doc8', content: 'Content of file 8', owner: 'owner8' },
    { name: 'Doc9', content: 'Content of file 9', owner: 'owner9' },
    { name: 'Doc10', content: 'Content of file 10', owner: 'owner10' },

];
const ViewedListing = () => {
    const navigate = useNavigate();
    const handleFileClick = (file) => {
        navigate('/editor', { state: { file, page: "viewed" } });
    }
    return (
        <div>
            <AppBar title="Viewed by me" />

            <div className="docs-container">
                {mockFiles.map((file, index) => (
                    <div key={index} className="card" onClick={() => handleFileClick(file)}>
                        <img src={docIcon2} alt="Doc icon" />
                        <h2>{file.name}</h2>
                        <h3>{file.owner}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViewedListing;