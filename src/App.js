import React, { useState, useEffect } from 'react';
import JsEditor from './JsEditor';
import PyEditor from './PyEditor';
import JavaEditor from './JavaEditor';

function App() {
  const [activeEditor, setActiveEditor] = useState('js'); 

  useEffect(() => {
    const savedEditor = localStorage.getItem('activeEditor');
    if (savedEditor) {
      setActiveEditor(savedEditor);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('activeEditor', activeEditor);
  }, [activeEditor]);

  const handleEditorChange = (e) => {
    setActiveEditor(e.target.value);
  };

  return (
    <div>
      <label htmlFor="editorSelect">Choose an editor:</label>
      <select id="editorSelect" value={activeEditor} onChange={handleEditorChange}>
        <option value="js">JavaScript</option>
        <option value="py">Python</option>
        {/* <option value="java">Java</option> */}
      </select>
      
      {activeEditor === 'js' && <JsEditor />}
      {activeEditor === 'py' && <PyEditor />}
      {/* {activeEditor === 'java' && <JavaEditor />} */}
    </div>
  );
}

export default App;
