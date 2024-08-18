import React, { useState, useEffect } from 'react';
import './App.css';

function useJsCodeExecutor() {
  const [outputs, setOutputs] = useState([]);
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState(''); 

  const executeJsCode = (jsCode) => {
    setError('');
    try {
      const originalConsoleLog = console.log;
      const consoleMessages = [];
      console.log = (message) => {
        consoleMessages.push(message);
      };

      // Mock user input by replacing a placeholder in the code
      const modifiedCode = jsCode.replace(/__USER_INPUT__/g, JSON.stringify(inputValue));

      const execute = new Function(modifiedCode);
      execute();

      setOutputs(consoleMessages);

      console.log = originalConsoleLog;
    } catch (error) {
      setError('Error during execution: ' + error.message);
    }
  };

  return { outputs, error, executeJsCode, inputValue, setInputValue };
}

function JsEditor() {
  const [jsCode, setJsCode] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', selectedTheme);
  }, [selectedTheme]);

  const themes = ['light', 'dark', 'solarized-light', 'solarized-dark', 'monokai'];

  const { outputs, error, executeJsCode, inputValue, setInputValue } = useJsCodeExecutor();

  const handleExecute = () => {
    executeJsCode(jsCode); 
  };

  const changeTheme = (event) => {
    setSelectedTheme(event.target.value);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className={`app-container ${selectedTheme}`}>
      <div className="editor-container">
        <h1>JavaScript Editor</h1>
        <div className="editor-controls">
          <div className="theme-selector">
            <label htmlFor="themeSelect">Select Theme:</label>
            <select id="themeSelect" value={selectedTheme} onChange={changeTheme}>
              {themes.map((theme) => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>
          <button onClick={handleExecute} className="execute-button">Execute</button>
        </div>
        <textarea
          value={jsCode}
          className="code-editor"
          onChange={(e) => setJsCode(e.target.value)}
          placeholder="Write your JavaScript code here..."
        />
      </div>
      <div className="output-container">
        <h2 >Output</h2>
        <div className="outputs-display">
          {error && <div className="error-message">{error}</div>}
          <ul className="output-list">
            {outputs.map((output, index) => (
              <li key={index} className="output-item">{output}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default JsEditor;
