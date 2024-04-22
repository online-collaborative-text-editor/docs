import React, { useCallback ,useRef} from 'react';
import Quill from 'quill';
import "quill/dist/quill.snow.css";

const TextEditor = () => {
    const wrapperRef=useCallback((wrapper) => {
        if(wrapper==null) return
        wrapper.innerHTML=""
   
        const editor =document.createElement('div')
        wrapper.append(editor)
        new Quill(editor, {theme: 'snow'})
  
    
    },[])
    return (

        <div id ="editorcontainer" ref={wrapperRef}>


         </div>
    )
}

export default TextEditor