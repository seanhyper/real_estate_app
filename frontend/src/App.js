import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegisterPage from './LoginRegisterPage';
import MainApp from './MainApp'; // Import your main app component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegisterPage />} />
        <Route path="/main" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;
