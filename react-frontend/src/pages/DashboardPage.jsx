import React from 'react';
import { Container } from 'react-bootstrap';
import Dashboard from '../components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

function DashboardPage() {
  return (
    <Container className="py-5">
      <Dashboard />
    </Container>
  );
}

export default DashboardPage;
