
import React, { useEffect } from 'react';
import docIcon2 from '../icons/docIcon2.png';
import AppBar from './AppBar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef } from 'react';
import delete_Icon from '../icons/delete_Icon.png';
import info_Icon from '../icons/info_Icon.png';
import rename_Icon from '../icons/rename_Icon.png';
import Footer from './Footer';
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
//////////////////////////Mock Data//////////////////////////////////////// 

let mockFiles = [
    {
        name: 'Doc1', content: 'Content of file 1', owner: 'heba'
    },
    { name: 'Doc2', content: 'You cannot edit this content', owner: 'heba', contributers: ['heba', 'fatema', 'mohsen', 'hanzada'], created_at: '2021-09-01', isEditable: false },
    { name: 'Doc3', content: 'Content of file 3', owner: 'heba', contributers: ['heba', 'fatema', 'mohsen', 'hanzada'], created_at: '2021-09-01', isEditable: true },
    { name: 'Doc4', content: 'Content of file 4', owner: 'heba', contributers: ['heba', 'fatema', 'mohsen', 'hanzada'], created_at: '2021-09-01', isEditable: true },
    { name: 'Doc5', content: 'Content of file 5', owner: 'owner5', contributers: ['heba', 'fatema', 'mohsen', 'hanzada'], created_at: '2021-09-01', isEditable: true },
    { name: 'Doc6', content: 'Content of file 6', owner: 'owner6', contributers: ['heba', 'fatema', 'mohsen', 'hanzada'], created_at: '2021-09-01', isEditable: true },
    { name: 'Doc7', content: 'Content of file 7', owner: 'heba', contributers: ['heba', 'fatema', 'mohsen', 'hanzada'], created_at: '2021-09-01', isEditable: true },
    { name: 'Doc8', content: 'Content of file 8', owner: 'owner8', contributers: ['heba', 'fatema', 'mohsen', 'hanzada'], created_at: '2021-09-01', isEditable: true },
    { name: 'Doc9', content: 'Content of file 9', owner: 'owner9', contributers: ['heba', 'fatema', 'mohsen', 'hanzada'], created_at: '2021-09-01', isEditable: true },
    { name: 'Doc10', content: 'Content of file 10', owner: 'owner10', contributers: ['heba', 'fatema', 'mohsen', 'hanzada'], created_at: '2021-09-01', isEditable: false },

];
const mockUser = "heba";
let infoModalOpen = true;

const DashBoard = () => {

    const [currentDashboardPage, setCurrentDashboardPage] = useState('all')
    const location = useLocation();
    const AppbarSelectedPage = location.state?.AppbarSelectedPage ? location.state.AppbarSelectedPage : currentDashboardPage;
    console.log("inside dashboard now , AppbarSelectedPage passed from the appBar is :");
    console.log(AppbarSelectedPage);
    ///////////////////////////// STATES ///////////////////////////////////////
    const [infoModalOpen, setInfoModalOpen] = useState(false); // State variable for info modal
    const [DeleteModalOpen, setDeleteModalOpen] = useState(false); // State variable for info modal
    const [RenameModalOpen, setRenameModalOpen] = useState(false); // State variable for info modal
    const [selectedFile, setSelectedFile] = useState(null); // State variable to store selected file
    const renameInputRef = useRef(null); // Create a ref for the input field
    const [renderKey, setRenderKey] = useState(0); // State variable to force re-render


    useEffect(() => { setCurrentDashboardPage(AppbarSelectedPage) }, [AppbarSelectedPage]);
    const navigate = useNavigate();
    const handleFileClick = (file) => {
        if (currentDashboardPage == 'created')
            file = { name: "untitled", content: "", owner: mockUser };
        navigate('/editor', { state: { file, page: currentDashboardPage } });
    }
    ///////////////////////////// HANDLE DELETE ///////////////////////////////////////
    const handleDelete = (file) => {
        setDeleteModalOpen(true);
        setSelectedFile(file);
        mockFiles = mockFiles.filter((f) => f.name !== file.name);
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
    ///////////////////////////// HANDLE INFO ///////////////////////////////////////
    const handleInfo = (file) => {

        setSelectedFile(file); // Set the selected file
        setInfoModalOpen(true); // Open the info modal
    }
    const handleCloseInfoModal = () => {
        setSelectedFile(null); // Clear the selected file
        setInfoModalOpen(false); // Close the info modal
        setRenderKey(prevKey => prevKey + 1); // Update renderKey to force re-render
    }
    ///////////////////////////// HANDLE RENAME ///////////////////////////////////////
    const handleRename = (file) => {
        setSelectedFile(file); // Set the selected file
        setRenameModalOpen(true); // Open the info modal
    }
    const handleCloseRenameModal = () => {
        setRenameModalOpen(false);
        const newName = renameInputRef.current.value;
        setSelectedFile(prevFile => ({ ...prevFile, name: newName })); // Update selectedFile with the new name
        setRenderKey(prevKey => prevKey + 1); // Update renderKey to force re-render
    }
    const filteredFiles = mockFiles.filter(file => {
        if (AppbarSelectedPage === 'owned') {
            return file.owner === mockUser;
        } else if (AppbarSelectedPage === 'edited') {
            return file.isEditable === true;
        } else if (AppbarSelectedPage === 'viewed') {
            return file.isEditable === false;
        } else {
            return true; // 'all' page, render all files
        }
    });
    ///////////////////////////// RENDER ////////////////////////////////////////////
    return (
        <div>
            <AppBar
                currentDashboardPage={currentDashboardPage}

            />
            <div className="docs-container">
                {filteredFiles.map((file, index) => (
                    <div key={index} className="card">
                        <div className="file-info" onClick={() => handleFileClick(file)}>
                            <img src={docIcon2} alt="Doc icon" />
                            <h2>{file.name}</h2>
                        </div>
                        <div className="icon-container">
                            <img src={info_Icon} alt="Info icon" onClick={() => handleInfo(file)} />
                            {file.isEditable ? <img src={rename_Icon} alt="Rename icon" onClick={() => handleRename(file)} /> : null}

                            {file.isEditable ? < img src={delete_Icon} alt="Delete icon" onClick={() => handleDelete(file)} /> : null}
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

            <Footer></Footer>
        </div>
    );
}

export default DashBoard;
