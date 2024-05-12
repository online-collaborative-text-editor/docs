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
    let crdt_client = new CRDT();
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    // useEffect(() => {
    //     const s = io("http://localhost:3001");//server port 
    //     setSocket(s);
    //     console.log("connected to server");
    //     return () => {
    //         s.disconnect();
    //     }
    // }, []);

    const location = useLocation();

    const file = location.state?.file;
    let page = location.state?.page;

    useEffect(() => {

        const editor = document.querySelector('.ql-editor');
        // editor.innerHTML = file.content;
        if (page === "viewed" && editor) {
            editor.setAttribute('contenteditable', 'false');
            editor.style.backgroundColor = 'lightgrey';
        }

    }, [page, file])

    useEffect(() => {
        if (quill == null) return;

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
                    console.log("yarab")
                    let node = new Node(text);
                    crdt_client.insertDisplayIndex(node, index);
                } else {
                    console.log("delete")
                    crdt_client.deleteDisplayIndex(index + 1);
                }
            }

            console.log("crdt client :")
            console.log(crdt_client)
        }
        quill?.on('text-change', handler);
        return () => {
            quill?.off('text-change', handler);
        }
    }, [quill]);

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
