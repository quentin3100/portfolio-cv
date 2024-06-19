
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PortfolioPage from './Pages/PortfolioPage';
import AllProjectsPage from './Pages/AllProjectsPage'; 
import ProjectsScene from './Components/ProjectsScene';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/"  element={<PortfolioPage/>} />
        <Route path="/all-projects"  element={<AllProjectsPage/>} />
        <Route path="/projects/3" element={<ProjectsScene />} />
      </Routes>
    </Router>
  );
};

export default App;
