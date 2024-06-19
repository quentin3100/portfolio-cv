import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllProjectsPage.css';
import NavBar from '../Components/NavBar';
import Menu from '../Components/Menu'; // Assurez-vous du chemin correct

const AllProjects = () => {
  const navigate = useNavigate();

  const projects = [
    { id: 1, name: 'Hexagone Maui', description: 'Projet permettant de gérer une LED en bluetooth grâce à une spirale d\'hexagones RGB' },
    { id: 2, name: 'Site Photo', description: 'Site galerie pour restituer mon travail en tant que photographe amateur' },
    { id: 3, name: 'Rubick\'s cube', description: 'Modélisation d\'un rubick\'s cube en 3D avec Three js' },
  ];

  const handleNavigation = (id) => {
    navigate(`/projects/${id}`);
  };

  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="all-projects">
      <NavBar toggleMenu={toggleMenu} />
      <Menu showMenu={showMenu} toggleMenu={toggleMenu} />

      <h1 className="title">Tous les projets</h1>
      <div className="projects-list">
        {projects.map((project) => (
          <div key={project.id} className="project-card" onClick={() => handleNavigation(project.id)}>
            <h2 className="project-name">{project.name}</h2>
            <p className="project-description">{project.description}</p>
            <button className="view-project-button" onClick={() => handleNavigation(project.id)}>Voir le projet</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProjects;
