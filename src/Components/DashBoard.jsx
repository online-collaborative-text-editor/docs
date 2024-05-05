import React from 'react';
import docIcon2 from '../icons/docIcon2.png';
import AppBar from './AppBar';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRef } from 'react';
import delete_Icon from '../icons/delete_Icon.png';
import info_Icon from '../icons/info_Icon.png';
import rename_Icon from '../icons/rename_Icon.png';
const saveButtonStyle = {

    boxSizing: 'border-box',
    width: '50%',
    height: '50px',
    border: 'none',
    outline: 'none',
    borderRadius: '40px',
    boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#333',
    fontWeight: '700',
    background: '#ffcab0',
    display: 'block',
    margin: 'auto',

};
let mockFiles = [
    {
        name: 'Doc1', content: 'Content of file 1', owner: 'owner1'
    },
    { name: 'Doc2', content: 'You cannot edit this content', owner: 'owner2', contributers: ['heba', 'fatema', 'mohsen', 'hanzada'], created_at: '2021-09-01' },
    { name: 'Doc3', content: 'Content of file 3', owner: 'owner3', contributers: ['heba', 'fatema', 'mohsen', 'hanzada'], created_at: '2021-09-01' },
    { name: 'Doc4', content: 'Content of file 4', owner: 'owner4', contributers: ['heba', 'fatema', 'mohsen', 'hanzada'], created_at: '2021-09-01' },
    { name: 'Doc5', content: 'Content of file 5', owner: 'owner5', contributers: ['heba', 'fatema', 'mohsen', 'hanzada'], created_at: '2021-09-01' },
    { name: 'Doc6', content: 'Content of file 6', owner: 'owner6' },
    { name: 'Doc7', content: 'Content of file 7', owner: 'owner7' },
    { name: 'Doc8', content: 'Content of file 8', owner: 'owner8' },
    { name: 'Doc9', content: 'Content of file 9', owner: 'owner9' },
    { name: 'Doc10', content: 'Content of file 10', owner: 'owner10' },

];
let infoModalOpen = true;
const DashBoard = () => {
    const [infoModalOpen, setInfoModalOpen] = useState(false); // State variable for info modal
    const [DeleteModalOpen, setDeleteModalOpen] = useState(false); // State variable for info modal
    const [RenameModalOpen, setRenameModalOpen] = useState(false); // State variable for info modal

    const [selectedFile, setSelectedFile] = useState(null); // State variable to store selected file
    const renameInputRef = useRef(null); // Create a ref for the input field
    const [renderKey, setRenderKey] = useState(0); // State variable to force re-render
    const navigate = useNavigate();

    const handleFileClick = (file) => {
        navigate('/editor', { state: { file, page: "owned" } });
    }

    const handleDelete = (file) => {
        //are you sure you want to delete this file?
        //if yes, delete the file
        //if no, do nothing

        //set DeleteModalOpen to true
        //setSelectedFile to the file that we want to delete
        setDeleteModalOpen(true);
        setSelectedFile(file);



        //remove the file from the mockFiles array 
        mockFiles = mockFiles.filter((f) => f.name !== file.name);
        // Implement delete functionality here
    }
    const handleInfo = (file) => {

        setSelectedFile(file); // Set the selected file
        setInfoModalOpen(true); // Open the info modal
    }
    const handleRename = (file) => {
        setSelectedFile(file); // Set the selected file
        setRenameModalOpen(true); // Open the info modal
        // Implement rename functionality here 


        //refresh the page 


    }
    const handleCloseRenameModal = () => {
        setRenameModalOpen(false);
        const newName = renameInputRef.current.value;
        setSelectedFile(prevFile => ({ ...prevFile, name: newName })); // Update selectedFile with the new name
        setRenderKey(prevKey => prevKey + 1); // Update renderKey to force re-render
    }

    const handleCloseInfoModal = () => {
        setSelectedFile(null); // Clear the selected file
        setInfoModalOpen(false); // Close the info modal
        setRenderKey(prevKey => prevKey + 1); // Update renderKey to force re-render
    }
    const handleCloseDeleteModal = () => {
        setSelectedFile(null); // Clear the selected file
        setDeleteModalOpen(false); // Close the info modal
        setRenderKey(prevKey => prevKey + 1); // Update renderKey to force re-render
    }
    const handleCloseCancelModal = () => {
        setSelectedFile(null); // Clear the selected file
        setDeleteModalOpen(false); // Close the info modal
        setRenderKey(prevKey => prevKey + 1); // Update renderKey to force re-render
    }
    return (
        <div>
            <AppBar name="My Docs" page="dashboard" />

            <div className="docs-container">
                {mockFiles.map((file, index) => (
                    <div key={index} className="card">
                        <div className="file-info" onClick={() => handleFileClick(file)}>
                            <img src={docIcon2} alt="Doc icon" />
                            <h2>{file.name}</h2>
                        </div>
                        <div className="icon-container">
                            <img src={info_Icon} alt="Info icon" onClick={() => handleInfo(file)} />
                            <img src={rename_Icon} alt="Rename icon" onClick={() => handleRename(file)} />

                            <img src={delete_Icon} alt="Delete icon" onClick={() => handleDelete(file)} />
                        </div>
                    </div>
                ))}

            </div>
            {infoModalOpen && (
                <div className="info-modal">
                    <div className="info-modal-content">
                        <h2>File Information</h2>
                        <p>Owner: {selectedFile.owner}</p>
                        <p>Created At: {selectedFile.created_at}</p>
                        <p>Filename: {selectedFile.name}</p>
                        {selectedFile.contributers && ( // Check if contributors is defined
                            <div>
                                <p>Contributors:</p>
                                <ul>
                                    {selectedFile.contributers.map((contributers, index) => (
                                        <li key={index}>{contributers}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <button onClick={handleCloseInfoModal} style={saveButtonStyle}>Close</button>
                    </div>
                </div>
            )}

            {DeleteModalOpen && (
                <div className="info-modal">
                    <div className="info-modal-content">
                        <h1>Are you sure you want to delete this file ? </h1>
                        <br>
                        </br>
                        <br>
                        </br>
                        <br>
                        </br>
                        <br>
                        </br>
                        <br>
                        </br>
                        <br>
                        </br>

                        <button onClick={handleCloseDeleteModal} style={saveButtonStyle}>Delete</button>
                        <br></br>
                        <button onClick={handleCloseCancelModal} style={saveButtonStyle}>Cancel</button>
                    </div>
                </div>
            )}
            {RenameModalOpen && (
                <div className="info-modal">
                    <div className="info-modal-content">
                        <div className="input-box">
                            <input ref={renameInputRef} type="text" defaultValue={selectedFile.name} required className="renaming-input-box" />

                        </div>

                        <button onClick={handleCloseRenameModal} style={saveButtonStyle}>Rename</button>
                    </div>
                </div>
            )}


        </div>
    );
}

export default DashBoard;
