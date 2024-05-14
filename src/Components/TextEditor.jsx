import React, { useEffect, useRef, useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import AppBar from "./AppBar";
import { useLinkClickHandler, useLocation } from "react-router-dom";
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
    const s = io("http://localhost:3000/", {
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
    if (quill == null || socket == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;

      delta.ops.forEach((op) => {
        if (op.attributes) {
          console.log("format change", op.attributes);
          const isBold = op.attributes.bold;
          const isItalic = op.attributes.italic;
          const range = quill.getSelection();
          if (range && range.length > 0) {
            const text = quill.getText(range.index, range.length);

            // Delete the selected text character by character from the CRDT
            for (let i = 0; i < text.length; i++) {
              const node = crdt_client.deleteDisplayIndex(range.index);
              socket.emit("delete", node);
            }

            // Add the text back with bold formatting
            for (let i = 0; i < text.length; i++) {
              const newNode = new Node(text[i]);
              newNode.bold = isBold || false;
              newNode.italic = isItalic || false;
              const node = crdt_client.insertDisplayIndex(
                newNode,
                range.index + i
              );
              console.log("client crdt:", crdt_client);
              console.log("node to insert:", node);
              socket.emit("insert", node);
            }
          }
        }
      });
    };



    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [quill, socket]);

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

      const index = delta.ops[0]?.retain ? delta.ops[0]?.retain : 0;
      const text =
        (delta.ops[1]?.insert ? delta.ops[1]?.insert : delta.ops[0]?.insert) ||
        null;
      //console.log("delta in my page", delta)
      //dummy change
      if (delta.ops.length > 0) {
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
          //console.log("client crdt:", crdt_client)
          socket.emit("insert", node);
        } else {
          const node = crdt_client.deleteDisplayIndex(index);

          socket.emit("delete", node);
        }
      }

      //console.log(crdt_client)
    };

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

    //CURSOR UPDATE LOCATION
    // quill.on("selection-change", (range, oldRange, source) => {
    //   console.log("selection change");
    //   if (range) {
    //     if (range.length == 0) {
    //       console.log("User cursor is at index", range.index);
    //     } else {
    //       const text = quill.getText(range.index, range.length);
    //       console.log("User has highlighted: ", text);
    //     }
    //   } else {
    //     console.log("User cursor is not in editor");
    //   }
    // });

    // quill.on("text-change", (delta, oldDelta, source) => {
    //   if (source === "user") {
    //     const range = quill.getSelection();
    //     if (range && range.length > 0) {
    //       const format = quill.getFormat(range);
    //       if (format.bold) {
    //         const text = quill.getText(range.index, range.length);
    //         const newNode = new Node(text);
    //         newNode.bold = format.bold || false;

    //         const node = crdt_client.insertDisplayIndex(newNode, range.index);
    //         socket.emit("format-change", node);
    //       }
    //     }
    //   }
    // });

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
