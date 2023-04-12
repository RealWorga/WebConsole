import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    //const socket = io('http://localhost:3002');
    const socket = io('http://bigunbot.myftp.org:3001');
    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const clearConsole = () => {
    setMessages([]);
  };

  return (
    <div className="App">
      <div className="console-container">
        <h1 className="console-title">
          Web Console made by{' '}
          <a
            href="https://github.com/RealWorga"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            RealWorga
          </a>
        </h1>
        <div className="console">
          {messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
        <button onClick={clearConsole} className="refresh-button"> {/* Move the button here */}
          Clear Console
        </button>
      </div>
    </div>
  );
}


export default App;
