import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import servicesData from '../data/services.json';

const services = servicesData.services;

function ServiceWidget({ service }) {
  const navigate = useNavigate();

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <span className="fs-1" role="img" aria-label={service.title}>{service.emoji}</span>
        </div>
        <Card.Title className="h4">{service.title}</Card.Title>
        <Card.Text className="text-muted">{service.description}</Card.Text>
      </Card.Body>
      <Card.Footer className="bg-white border-top-0">
        <div className="d-flex gap-2">
          <Button 
            variant="primary" 
            onClick={() => navigate(`/service/${service.id}`)}
            className="flex-grow-1"
          >
            Open Service
          </Button>
          <Button 
            variant="outline-primary"
            href={`https://${service.id}.${service.baseUrl}${service.swaggerUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-center"
            title="View API Documentation"
          >
            <span role="img" aria-label="API">📘</span>
          </Button>
          <Button
            variant="outline-success"
            href={`https://${service.id}.${service.baseUrl}${service.mcpConnectorUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-center"
            title="Get MCP Connector"
          >
            <span role="img" aria-label="MCP">🔌</span>
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
}

function Dashboard() {
  return (
    <div className="container mt-4">
      <h1>Developers Garage Dashboard</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {services.map((service) => (
          <Col key={service.id}>
            <ServiceWidget service={service} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Dashboard;
