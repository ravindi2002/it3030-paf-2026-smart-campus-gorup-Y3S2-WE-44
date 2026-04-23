import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <div className="container">
          <header className="App-header">
            <h1>Smart Campus Operations Hub</h1>
            <p>University Resource Management System</p>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<div>Welcome to Smart Campus Hub</div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
}

export default App;
