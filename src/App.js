import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Programs from './components/Programs.jsx';
import Announcements from './components/Announcements.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import Chatbot from './components/Chatbot.jsx';
import Modal from './components/Modal.jsx';
import SchoolsGallery from './components/SchoolsGallery.jsx';
import DownloadComponent from './components/DownloadComponent.jsx';
import Reviews from './components/Reviews.jsx';
import { apiService } from './apiService.js';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [serverStatus, setServerStatus] = useState('checking');

  
  const openModal = (program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProgram('');
  };

  return (
    <div className="App">
      {/* Server status indicator */}
      {serverStatus === 'error' && (
        <div className="server-status error">
          ⚠️ Server connection issue. Some features may not work.
        </div>
      )}
      
      <Header />
      <Hero />
      <SchoolsGallery />
      <Programs openModal={openModal} />
      <Announcements />
      <About />
      <DownloadComponent />
      <Reviews />
      <Contact />
      <Footer />
      <Chatbot />
      <Modal 
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedProgram={selectedProgram}
      />
    </div>
  );
}

export default App;