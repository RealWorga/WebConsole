import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css';

function App() {
  const consoleRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      return parsedMessages.map(({ message, timestamp }) => ({
        message,
        timestamp: new Date(timestamp),
      }));
    } else {
      return [];
    }
  });

  const clearConsole = () => {
    setMessages([]);
    localStorage.removeItem('messages');
  };
  
  /* Auto Scroller functionalities */
  const scrollToBottom = () => {
    if (consoleRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = consoleRef.current;
      const sensitivity = 20; // Adjust sensitivity pixel vale to fine-tune the auto-scroller
      const atBottom = scrollHeight - scrollTop - clientHeight <= sensitivity;
      if (atBottom) {
        setTimeout(() => {
          consoleRef.current.scrollTop = scrollHeight;
        }, 100);
      }
    }
  };

  useEffect(() => {
    const socket = io('http://bigunbot.myftp.org:3001');
    socket.on('newMessage', (message) => {
      const newMessage = { message, timestamp: new Date() };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
      scrollToBottom();
    });

    return () => {
      socket.disconnect();
    };
  }, []);


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
        <div className="console" ref={consoleRef}>
          {messages.map(({ message, timestamp }, index) => (
            <div key={index}>
              <span className="line-number">[{index + 1}] </span>
              <span className="timestamp">[{timestamp.toLocaleTimeString()}] </span>
              {message}
            </div>
          ))}
        </div>
        <button onClick={clearConsole} className="refresh-button">
          Clear Console
        </button>
        
      </div>
    </div>
  );
}
export default App;