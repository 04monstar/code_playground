import React, { useState, useEffect } from 'react';
import './App.css';

function JavaEditor() {
  const [javaCode, setJavaCode] = useState(
    'public class Main { public static void main(String[] args) { System.out.println("Hello, World!"); } }'
  );
  const [userInput, setUserInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [javapoly, setJavapoly] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    const loadJavapoly = async () => {
      if (window.javapoly) {
        setJavapoly(window.javapoly);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/javapoly@0.0.20160507094946/javapoly-browser.min.js';
      script.async = true;
      script.onload = () => {
        if (window.javapoly) {
          setJavapoly(window.javapoly);
        } else {
          setError('Javapoly script loaded but not found in window.');
        }
      };
      script.onerror = () => {
        setError('Error loading Javapoly script.');
      };
      document.body.appendChild(script);

      // Cleanup script if component unmounts
      return () => {
        document.body.removeChild(script);
      };
    };

    loadJavapoly();
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', selectedTheme);
  }, [selectedTheme]);

  const executeJavaCode = () => {
    if (!javapoly) {
      setError('Javapoly is not loaded.');
      return;
    }

    setError('');
    try {
      const compiler = new javapoly.Compiler();
      compiler.compile(javaCode, 'Main.java', (compileError, compileResult) => {
        if (compileError) {
          setError('Compilation Error: ' + compileError);
          return;
        }

        const classLoader = new javapoly.ClassLoader();
        classLoader.load(compileResult.classBytes, 'Main', (loadError, loadResult) => {
          if (loadError) {
            setError('Runtime Error: ' + loadError);
            return;
          }
          setOutput(loadResult.output);
        });
      });
    } catch (err) {
      setError('Error during execution: ' + err.message);
    }
  };

  const changeTheme = (event) => {
    setSelectedTheme(event.target.value);
  };

  const themes = ['light', 'dark', 'solarized-light', 'solarized-dark', 'monokai'];

  return (
    <div className={`app-container ${selectedTheme}`}>
      <div className="editor-container">
        <h1>Java Editor</h1>
        <div className="editor-controls">
          <div className="theme-selector">
            <label htmlFor="themeSelect">Select Theme:</label>
            <select id="themeSelect" value={selectedTheme} onChange={changeTheme}>
              {themes.map((theme) => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>
          <button onClick={executeJavaCode} className="execute-button">Execute</button>
        </div>
        <textarea
          value={javaCode}
          className="code-editor"
          onChange={(e) => setJavaCode(e.target.value)}
          placeholder="Write your Java code here..."
        />
        <div className="user-input-container">
          <h2>Input</h2>
          <textarea
            value={userInput}
            className="user-input"
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Provide input for the code here..."
          />
        </div>
      </div>
      <div className="output-container">
        <h2>Output</h2>
        {error && <div className="error-message">{error}</div>}
        {output && (
          <ul className="output-list">
            <li className="output-item">{output}</li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default JavaEditor;
