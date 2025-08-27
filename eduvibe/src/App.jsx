// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Recordings from './components/recordings';


function App() {
  return (
    <Router>
      <div className="App">
        <Recordings/>
      </div>
    </Router>
  );
}

export default App;