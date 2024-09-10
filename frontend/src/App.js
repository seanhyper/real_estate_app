import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegisterPage from './LoginRegisterPage';
import MainApp from './MainApp';
import SimulationForm from './SimulationForm';
import SimulationResult from './SimulationResult';
import DutchAuctionForm from "./DutchAuctionForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRegisterPage />} />
        <Route path="/main" element={<MainApp />} />
        <Route path="/simulation-form" element={<SimulationForm />} />
        <Route path="/simulation-result" element={<SimulationResult />} />
        <Route path="/run-auction" element={<DutchAuctionForm />} />
      </Routes>
    </Router>
  );
}

export default App;
