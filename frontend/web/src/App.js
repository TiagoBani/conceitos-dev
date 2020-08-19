import React, { useEffect, useState } from 'react';

import Header from './components/Header';

// import backgroundImage from './assets/images/background.jpeg';
import './App.css';
import api from './services/api';

const App = () => {
  const [projects, setProjects] = useState([]);

  async function handleAddProject() {
    const response = await api.post('projects', {
      tittle: `Novo projeto ${Date.now()}`,
      owner: 'Tiago',
    });

    setProjects([...projects, response.data]);
  }

  useEffect(() => {
    api.get('projects').then((response) => {
      setProjects(response.data);
    });
  }, []);

  return (
    <>
      <Header tittle="Projects" />

      {/* <img src={backgroundImage} /> */}

      <ul>
        {projects && projects.map((project) => (
          <li key={project.id}>{project.tittle}</li>
        ))}
      </ul>

      <button type="button" onClick={handleAddProject}>Adicionar projeto</button>
    </>
  );
};

export default App;
