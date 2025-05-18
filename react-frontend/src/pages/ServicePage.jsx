import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import servicesData from '../data/services.json';

function ServicePage() {
  const { serviceId } = useParams();
  
  // Redirect to specific service pages
  if (serviceId === 'mailbin') {
    return <Navigate to="/mailbin" />;
  }
  if (serviceId === 'postbin') {
    return <Navigate to="/postbin" />;
  }
  if (serviceId === 'mocky') {
    return <Navigate to="/mocky" />;
  }
  if (serviceId === 'password') {
    return <Navigate to="/password" />;
  }

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
      <p className="lead mb-4">{service.description}</p>
      
      <Row className="mb-4">
        <Col>
          <div className="bg-light p-4 rounded border">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="mb-3">Service URL</h3>
                <code className="fs-5">{`https://${service.id}.${service.baseUrl}`}</code>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-primary"
                  href={`https://${service.id}.${service.baseUrl}${service.swaggerUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-flex align-items-center"
                >
                  <span role="img" aria-label="API" className="me-2">📘</span>
                  Swagger API
                </Button>
                <Button
                  variant="outline-success"
                  href={`https://${service.id}.${service.baseUrl}${service.mcpConnectorUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-flex align-items-center"
                >
                  <span role="img" aria-label="MCP" className="me-2">🔌</span>
                  MCP Connector
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {service.id === 'datagen' && service.generators && (
        <div className="mt-5">
          <h3 className="mb-4">Available Data Generators</h3>
          <Row xs={1} md={2} lg={3} className="g-4">
            {service.generators.map((generator) => (
              <Col key={generator.type}>
                <Card className="h-100">
                  <Card.Body>
                    <Card.Title>{generator.name}</Card.Title>
                    <Card.Text>{generator.description}</Card.Text>
                    <div className="mt-3">
                      <small className="text-muted">Endpoint:</small>
                      <code className="d-block mt-1">
                        {`/${generator.type}/generate`}
                      </code>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Container>
  );
}

export default ServicePage;
