import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import servicesData from '../data/services.json';

function ServicePage() {
  const { serviceId } = useParams();
  const service = servicesData.services.find(s => s.id === serviceId);

  if (!service) {
    return <Navigate to="/404" />;
  }

  return (
    <Container className="py-5">
      <div className="d-flex align-items-center mb-4">
        <span className="fs-1 me-3">{service.emoji}</span>
        <h1>{service.title}</h1>
      </div>
      <p className="lead">{service.description}</p>
      <div className="mt-4">
        <h3>Service URL</h3>
        <div className="p-3 bg-light rounded border">
          <code className="fs-5">{`https://${service.id}.${service.baseUrl}`}</code>
        </div>
      </div>
    </Container>
  );
}

export default ServicePage;
