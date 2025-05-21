import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import ServicePage from './pages/ServicePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import MailBinPage from './pages/MailBinPage';
import PostBinPage from './pages/PostBinPage';
import MockyHttpPage from './pages/MockyHttpPage';
import PasswordGeneratorPage from './pages/PasswordGeneratorPage';
import NotepadPage from './pages/NotepadPage';
import NotFoundPage from './pages/NotFoundPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/service/:serviceId" element={<ServicePage />} />        <Route path="/mailbin" element={<MailBinPage />} />
        <Route path="/postbin" element={<PostBinPage />} />
        <Route path="/mocky" element={<MockyHttpPage />} />
        <Route path="/password" element={<PasswordGeneratorPage />} />
        <Route path="/notepad" element={<NotepadPage />} />
        <Route path="/notepad/:noteId" element={<NotepadPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
