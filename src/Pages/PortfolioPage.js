import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './PortfolioPage.css';


const AboutMe = () => {
  return (
    <div className="about-me">
      <h2>À propos de moi</h2>
      <p>
        Je suis Quentin, un jeune développeur Suisse.
      </p>
      <hr />
    </div>
  );
};

const Help = () => {
  return (
    <div className="help-list">
      <h2>Aide</h2>
      <ul>
        <li><strong>help</strong>: Afficher toutes les commandes disponibles avec leur description</li>
        <li><strong>project</strong>: Afficher tous les projets</li>
        <li><strong>cv</strong>: Ouvrir mon CV au format PDF</li>
        <li><strong>clear</strong>: Effacer le contenu du terminal</li>
        
      </ul>
    </div>
  );
};

const PortfolioPage = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState([]);
  const navigate = useNavigate();

  const terminalEndRef = useRef(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [output]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      switch (command.trim().toLowerCase()) {
        case 'project':
          navigateToAllProjects();
          break;
        case 'help':
          setOutput([...output, <Help key={output.length} />]);
          break;
        case 'clear':
          setOutput([]);
          break;
        case 'cv':
          openCV();
          break;
        default:
          setOutput([
            ...output,
            <div key={output.length}>
              Commande inconnue: {command}, rentrez "help" pour voir toutes les commandes
            </div>,
          ]);
          break;
      }
      setCommand('');
    }
  };

  const navigateToAllProjects = () => {
    navigate('/all-projects');
  };

  const openCV = () => {
    window.open(process.env.PUBLIC_URL + '/File/Quentin_Fragniere_CV.pdf', '_blank');
  };

  return (
    <div className="app">
      <h1>Mon portfolio</h1>
      
      <div className="terminal">
        <AboutMe />
        <div className="terminal-content">
          {output.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
          <div ref={terminalEndRef} />
        </div>
        <input
          type="text"
          className="terminal-input"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyPress={handleCommand}
          placeholder="Tapez une commande..."
        />
      </div>
    </div>
  );
};

export default PortfolioPage;
