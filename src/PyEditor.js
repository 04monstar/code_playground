import React, { useState, useEffect } from 'react';
import './App.css';

const CodeBox = () => {
  const [pythonCode, setPythonCode] = useState('print("Hello, World!")');
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [outputs, setOutputs] = useState([]);
  const [error, setError] = useState('');
  const [pyodide, setPyodide] = useState(null);

  useEffect(() => {
    const loadPyodide = async () => {
      try {
        if (!window.loadPyodide) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.22.1/full/pyodide.js';
          script.async = true;
          document.body.appendChild(script);

          script.onload = async () => {
            try {
              const pyodideInstance = await window.loadPyodide();
              await pyodideInstance.loadPackage(['numpy', 'pandas']);
              setPyodide(pyodideInstance);
            } catch (err) {
              setError('Failed to load Python interpreter.');
            }
          };
        }
      } catch (err) {
        setError('Failed to load Python interpreter.');
      }
    };

    loadPyodide();
  }, []);

  const executePythonCode = async () => {
    setError('');
    if (!pyodide) return;
  
    try {
      // Override console.log to capture the output
      const originalConsoleLog = console.log;
      let output = '';
      console.log = (message) => {
        output += message + '\n';
      };
  
      setOutputs([]);
      await pyodide.runPythonAsync(pythonCode);
  
      if (output.trim() !== '') {
        const outputLines = output.split('\n').filter(line => line.trim() !== '');
        setOutputs(outputLines);
      } else {
        setOutputs(['No output returned.']);
      }
  
      // Restore the original console.log
      console.log = originalConsoleLog;
    } catch (err) {
      setError('Error during execution: ' + err.message);
    }
  };

  
  const handleCodeChange = (e) => {
    setPythonCode(e.target.value);
  };

  const handleExecuteClick = () => {
    if (pythonCode.trim()) {
      executePythonCode();
    }
  };

  const changeTheme = (event) => {
    setSelectedTheme(event.target.value);
  };

  const themes = ['light', 'dark', 'solarized-light', 'solarized-dark', 'monokai'];  

  return (
    <div className={`app-container ${selectedTheme}`}>
      <div className="editor-container">
        <div className="editor-controls">
          <h1>Python Code Editor</h1>
          <div className="theme-selector">
            <label htmlFor="themeSelect">Select Theme:</label>
            <select id="themeSelect" value={selectedTheme} onChange={changeTheme}>
              {themes.map((theme) => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>
          <button onClick={handleExecuteClick} className="execute-button">Execute</button>
        </div>
        <textarea
          value={pythonCode}
          className="code-editor"
          onChange={handleCodeChange}
          placeholder="Write your Python code here..."
        />
      </div>
      <div className="output-container">
        <h2>Output:</h2>
        {error && <div className="error-message">{error}</div>}
        <ul className="output-list">
          {outputs.map((output, index) => (
            <li key={index} className="output-item">{output}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CodeBox;
