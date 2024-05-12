import React, { useEffect, useRef, useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import AppBar from './AppBar';
import { useLocation } from "react-router-dom";
import { useState } from 'react';
import io from 'socket.io-client';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
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
    const docId = location.state?.id;

    console.log("file is", file);
    console.log("page is", page);
    console.log("docId is", docId);

    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    useEffect(() => {
        const s = io('http://localhost:5000', {
            query: {
                username: localStorage.getItem('username'),
                docId: docId
            }
        });
        setSocket(s);
        console.log("connected to server");
            return() => {
    s.disconnect();
}
    }, []);


useEffect(() => {

    const editor = document.querySelector('.ql-editor');
    editor.innerHTML = file.content;
    if (page === "viewed" && editor) {
        editor.setAttribute('contenteditable', 'false');
        editor.style.backgroundColor = 'lightgrey';
    }

}, [page, file])
//send changes to server
useEffect(() => {
    if (quill == null || socket == null) return
    const handler = (delta, oldDelta, source) => {
        if (source !== 'user') return
        socket.emit('send-changes', delta)
    }
    quill?.on('text-change', handler)//event listener 
    return () => {//cleanup 
        quill?.off('text-change', handler)
    }

}, [quill, socket])
//recieve changes from server 
useEffect(() => {
    if (quill == null || socket == null) return
    const handler = (delta, oldDelta, source) => {
        quill.updateContents(delta)
    }
    socket?.on('receive-changes', handler)//event listener 
    return () => {//cleanup 
        socket?.off('receive-changes', handler)
    }

}, [quill, socket])
const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return
    wrapper.innerHTML = ""

    const editor = document.createElement('div')
    wrapper.append(editor)
    const q = new Quill(editor, { theme: 'snow' })
    setQuill(q);
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
