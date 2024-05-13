import React, { useEffect, useRef, useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import AppBar from './AppBar';
import { useLocation } from "react-router-dom";
import { useState } from 'react';
import io from 'socket.io-client';
import { Node, CRDT } from '../CRDT.js';
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
    const docId = location.state?.docId;

    console.log("file is", file);
    console.log("page is", page);
    console.log("docId is", docId);

    let crdt_client = new CRDT();
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
        return () => {
            s.disconnect();
        }
    }, []);


    useEffect(() => {

        const editor = document.querySelector('.ql-editor');
        // editor.innerHTML = file.content;
        if (page === "viewed" && editor) {
            editor.setAttribute('contenteditable', 'false');
            editor.style.backgroundColor = 'lightgrey';
        }

    }, [page, file])

    useEffect(() => {
        if (quill == null || socket == null) return;

        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return;
            console.log("delta")
            console.log(delta)
            const index = delta.ops[0]?.retain ? delta.ops[0]?.retain : 0;
            const text = (delta.ops[1]?.insert ? delta.ops[1]?.insert : delta.ops[0]?.insert) || null;
            console.log(index)
            console.log(text)

            if (delta.ops.length > 0) {
                if (text) {



                    const node = crdt_client.insertDisplayIndex(new Node(text), index);
                    //emit socket event to the server to insert the node 
                    console.log("before emmit")
                    socket.emit('insert', node)
                    console.log("passed emmit")
                } else {
                    console.log("delete")
                    const node = crdt_client.deleteDisplayIndex(index + 1);
                    //emit socket event to the server to delete the node
                    socket.emit('delete', node);
                    console.log("passed emmit")
                }
            }

            console.log("crdt client :")
            console.log(crdt_client)
        }
        quill?.on('text-change', handler);
        return () => {
            quill?.off('text-change', handler);
        }
    }, [quill, socket]);


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
