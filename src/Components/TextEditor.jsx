import React, { useEffect, useRef, useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import AppBar from './AppBar';
import { useLocation } from "react-router-dom";
const saveButtonStyle = {

    boxSizing: 'border-box',
    width: '30%',
    height: '50px',
    border: 'none',
    outline: 'none',
    borderRadius: '40px',
    boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#333',
    fontWeight: '700',
    background: '#fff',
    display: 'block',
    margin: 'auto',

};

const mockDatabase = [];
const TextEditor = () => {
    const location = useLocation();

    const file = location.state?.file;
    let page = location.state?.page;

    useEffect(() => {

        const editor = document.querySelector('.ql-editor');
        editor.innerHTML = file.content;
        if (page === "viewed" && editor) {
            editor.setAttribute('contenteditable', 'false');
            editor.style.backgroundColor = 'lightgrey';
        }

    }, [page, file])
    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return
        wrapper.innerHTML = ""

        const editor = document.createElement('div')
        wrapper.append(editor)
        new Quill(editor, { theme: 'snow' })
    }, [])
    const handleSubmit = (e) => {
        e.preventDefault();
        const editor = document.querySelector('.ql-editor');
        const content = editor.innerHTML;
        const fileName = prompt('Enter the file name', "untitled");
        mockDatabase.push({ name: fileName, content: content });
        console.log(mockDatabase);
        //TODO:http request to save the content 

    }
    return (

        <div>

            <AppBar
                name={file?.name ? file.name : null}
                page={page} />

            <div id="editorcontainer" ref={wrapperRef}></div>;
            <form id="form" onSubmit={handleSubmit} >
                <div style={{ textAlign: 'center', margin: '2rem' }}></div>
                {page != "viewed" ? <button type="submit" style={saveButtonStyle}>Save</button> : null}

            </form>

        </div>


    )
};

export default TextEditor;
