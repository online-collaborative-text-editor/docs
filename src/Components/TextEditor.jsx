import React, { useEffect, useRef, useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import AppBar from "./AppBar";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import io from "socket.io-client";
import { Node, CRDT } from "../CRDT.js";
const saveButtonStyle = {
  boxSizing: "border-box",
  width: "30%",
  height: "50px",
  border: "none",
  outline: "none",
  borderRadius: "40px",
  boxShadow: "0 0 10px rgba(0, 0, 0, .1)",
  cursor: "pointer",
  fontSize: "16px",
  color: "#333",
  fontWeight: "700",
  background: "#fff",
  display: "block",
  margin: "auto",
};

const mockDatabase = [];
const TextEditor = () => {
  const location = useLocation();

  const file = location.state?.file;
  let page = location.state?.page;
  const docId = location.state?.docId;
  const username = location.state?.username;

  let crdt_client = new CRDT();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  useEffect(() => {
    const s = io("http://localhost:5000/", {
      query: {
        username,
        docId: docId,
      },
    });
    setSocket(s);
    console.log("connected to server");
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    const editor = document.querySelector(".ql-editor");
    // editor.innerHTML = file.content;
    if (file.permission === "VIEWER" && editor) {
      editor.setAttribute("contenteditable", "false");
      editor.style.backgroundColor = "lightgrey";
    }
  }, [page, file]);

  useEffect(() => {
    if (quill == null || socket == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      console.log("inside useEffect");

      const index = delta.ops[0]?.retain ? delta.ops[0]?.retain : 0;
      const text =
        (delta.ops[1]?.insert ? delta.ops[1]?.insert : delta.ops[0]?.insert) ||
        null;
      let selection_flag = false;
      console.log("delta:", delta);
      if (delta.ops.length > 0) {
        ///////////////////////////////////////////NEW PART FOR SELECTION HANDLING///////////////////////////////////////////
        if (delta.ops.length == 2 && delta.ops[1]?.retain) {
          console.log("selection detected");
          selection_flag = true;
          const is_bold = delta.ops[1]?.attributes?.bold
            ? delta.ops[1]?.attributes?.bold
            : delta.ops[0]?.attributes?.bold;
          const is_italic = delta.ops[1]?.attributes?.italic
            ? delta.ops[1]?.attributes?.italic
            : delta.ops[0]?.attributes?.italic;
          const start_index = delta.ops[0].retain;
          const end_index = delta.ops[0].retain + delta.ops[1].retain;
          console.log("start index:", start_index);
          console.log("end index:", end_index);

          console.log("crdt client before loop:", crdt_client);

          for (let i = start_index ; i < end_index ; i++) {
            let position = crdt_client.get_DisplayIndexToPosition(i);
            console.log("position:", position);
            let array_index = crdt_client.positionToArrayIndex(position);
            console.log("array index:", array_index);
            console.log("crdt client", crdt_client);
            let node = crdt_client.nodes[array_index];
            console.log("node:", node);

            if (is_bold) {
              crdt_client.updateBold(node);
              socket.emit("bold", node);
            }
            if (is_italic) {
              crdt_client.updateItalic(node);
              socket.emit("italic", node);
            }
            //todo: unbold and unitalic
          }

          console.log("crdt client after loop:", crdt_client);
        }
        /////////////Handling formatting from index 0
        if (
          delta.ops.length == 1 &&
          !delta.ops[0]?.delete &&
          delta.ops[0]?.retain &&
          !delta.ops[0]?.insert
        ) {
          selection_flag = true;
          const is_bold = delta.ops[1]?.attributes?.bold
            ? delta.ops[1]?.attributes?.bold
            : delta.ops[0]?.attributes?.bold;
          const is_italic = delta.ops[1]?.attributes?.italic
            ? delta.ops[1]?.attributes?.italic
            : delta.ops[0]?.attributes?.italic;

          const end_index = delta.ops[0].retain;

          console.log("end index:", end_index);
          console.log("crdt client before the bottom loop:", crdt_client);
          let array_bold_nodes=[];
          let array_italic_nodes=[];
          for (let i = 0; i < end_index ; i++) {
            let position = crdt_client.get_DisplayIndexToPosition(i);
            console.log("position:", position);
            let array_index = crdt_client.positionToArrayIndex(position);
            console.log("array index:", array_index);
            console.log("crdt client", crdt_client);
            let node = crdt_client.nodes[array_index];
            console.log("node:", node);
           
            if (is_bold) {
              crdt_client.updateBold(node);
                array_bold_nodes.push(node);
              //socket.emit("bold", node);
            }
            if (is_italic) {
              crdt_client.updateItalic(node);
                array_italic_nodes.push(node);
             // socket.emit("italic", node);
              
            }
          }
            for (let i = 0; i < array_bold_nodes.length; i++) {
                socket.emit("bold", array_bold_nodes[i]);
                }
            for (let i = 0; i < array_italic_nodes.length; i++) {
                socket.emit("italic", array_italic_nodes[i]);
                }
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (!selection_flag) {
          console.log("normal insert or delete , i shouldnt be here");
          if (text) {
            const newNode = new Node(text);

            const is_bold = delta.ops[1]?.attributes?.bold
              ? delta.ops[1]?.attributes?.bold
              : delta.ops[0]?.attributes?.bold;
            const is_italic = delta.ops[1]?.attributes?.italic
              ? delta.ops[1]?.attributes?.italic
              : delta.ops[0]?.attributes?.italic;
            if (is_bold) {
              newNode.bold = true;
            }
            if (is_italic) {
              newNode.italic = true;
            }
            const node = crdt_client.insertDisplayIndex(newNode, index);
            console.log("client crdt after normal insert :", crdt_client);
            socket.emit("insert", node);
          } else {
            const node = crdt_client.deleteDisplayIndex(index);

            socket.emit("delete", node);
            console.log("client crdt after normal delete :", crdt_client);
          }
        }
      }

      //console.log(crdt_client)
    };
    //listen to bold events 
    socket.on("bold", (node) => {
        console.log("bold event from server:");
        console.log(node)
        crdt_client.updateBold(node);
        // i want to make a delta to delete the node from the quill editor before making it bold
        const opsDelete = [];
        const retainDelete = crdt_client.get_PositionToDisplayIndex(node);
        console.log("retainDelete:", retainDelete);
        if (retainDelete) {
            opsDelete.push({ retain: retainDelete });
        }
        opsDelete.push({ delete: 1 });
        const deltaDelete = { ops: opsDelete };
        console.log("delta to delete node before making it bold:", deltaDelete);
        quill.updateContents(deltaDelete);
        const ops = [];
        const retain =
            crdt_client.get_PositionToDisplayIndex(node) != 0
                ? crdt_client.get_PositionToDisplayIndex(node)
                : null;
        const text = node.letter;
        const bold = node.bold;
        const italic = node.italic;
        const attributes = {
            bold: bold || null,
            italic: italic || null,
        }
            ? { bold: bold, italic: italic }
            : null;
        //new delta
        if (retain) {
            ops.push({ retain: retain });
        }
        ops.push({ insert: text, attributes: attributes });
        const delta = { ops: ops };
        console.log("delta to update quill bold:", delta);
        quill.updateContents(delta);
    });

    // listen to italic events
    socket.on("italic", (node) => {
        console.log("italic event from server:");
        console.log(node)
        crdt_client.updateItalic(node);
        // i want to make a delta to delete the node from the quill editor before making it italic
        const opsDelete = [];
        const retainDelete = crdt_client.get_PositionToDisplayIndex(node);
        console.log("retainDelete:", retainDelete);
        if (retainDelete) {
            opsDelete.push({ retain: retainDelete });
        }
        opsDelete.push({ delete: 1 });
        const deltaDelete = { ops: opsDelete };
        console.log("delta to delete node before making it italic:", deltaDelete);
        quill.updateContents(deltaDelete);
        const ops = [];
        const retain =

            crdt_client.get_PositionToDisplayIndex(node) != 0
                ? crdt_client.get_PositionToDisplayIndex(node)
                : null;
        const text = node.letter;
        const bold = node.bold;
        const italic = node.italic;
        const attributes = {
            bold: bold || null,
            italic: italic || null,
        }
            ? { bold: bold, italic: italic }
            : null;
        //new delta
        if (retain) {
            ops.push({ retain: retain });
        }
        ops.push({ insert: text, attributes: attributes });
        const delta = { ops: ops };
        console.log("delta to update quill italic:", delta);
        quill.updateContents(delta);
    });


    //listen to the server insert and delete events
    socket.on("insert", (node) => {
      console.log("insert event from server:");
      //console.log(node)
      crdt_client.insertPosition(node);
      //insert the node in the quill editor
      const ops = [];
      const retain =
        crdt_client.get_PositionToDisplayIndex(node) != 0
          ? crdt_client.get_PositionToDisplayIndex(node)
          : null;
      const text = node.letter;
      const bold = node.bold;
      const italic = node.italic;
      const attributes = {
        bold: bold || null,
        italic: italic || null,
      }
        ? { bold: bold, italic: italic }
        : null;
      //new delta
      if (retain) {
        ops.push({ retain: retain });
      }
      ops.push({ insert: text, attributes: attributes });
      const delta = { ops: ops };
      console.log("delta to update quill:", delta);
      quill.updateContents(delta);
    });
    socket.on("delete", (node) => {
      console.log("delete event from server:");
      // console.log(node)
      crdt_client.deletePosition(node);
      const ops = [];
      const retain =
        crdt_client.get_PositionToDisplayIndex(node) != -1
          ? crdt_client.get_PositionToDisplayIndex(node)
          : null;
      if (retain) {
        ops.push({ retain: retain });
      }
      ops.push({ delete: 1 });
      const delta = { ops: ops };
      console.log("delta to update quill:", delta);
      quill.updateContents(delta);
    });
    // CURSOR UPDATE LOCATION
    quill.on("selection-change", (range, oldRange, source) => {
      console.log("selection change");
      if (range) {
        if (range.length == 0) {
          console.log("User cursor is at index", range.index);
        } else {
          const text = quill.getText(range.index, range.length);
          console.log("User has highlighted: ", text);
        }
      } else {
        console.log("User cursor is not in editor");
      }
    });

    console.log(
      "username:",
      localStorage.getItem("username"),
      "crdt after server events",
      crdt_client
    );
    quill?.on("text-change", handler);
    return () => {
      quill?.off("text-change", handler);
    };
  }, [quill, socket]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";

    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, { theme: "snow" });
    setQuill(q);
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    const editor = document.querySelector(".ql-editor");
    const content = editor.innerHTML;
    const fileName = prompt("Enter the file name", "untitled");
    mockDatabase.push({ name: fileName, content: content });
    console.log(mockDatabase);
    //TODO:http request to save the content
  };
  return (
    <div>
      <AppBar name={file?.name ? file.name : null} page={page} />
      <div id="editorcontainer" ref={wrapperRef}></div>;
      <form id="form" onSubmit={handleSubmit}>
        <div style={{ textAlign: "center", margin: "2rem" }}></div>
        {file.permission != "VIEWER" ? (
          <button type="submit" style={saveButtonStyle}>
            Save
          </button>
        ) : null}
      </form>
    </div>
  );
};

export default TextEditor;
