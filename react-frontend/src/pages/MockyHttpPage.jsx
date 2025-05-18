import React, { useState } from 'react';
import { Container, Card, Button, Alert, Form, Row, Col, Table, Dropdown } from 'react-bootstrap';

// Default values
const defaultJson = {
  "status": "success",
  "message": "This is a mock response",
  "data": {
    "id": 12345,
    "name": "Test User"
  }
};

const defaultHeaders = [
  { name: 'Content-Type', value: 'application/json' },
  { name: 'Cache-Control', value: 'no-cache' }
];

// Common header names and values for autocomplete
const commonHeaders = [
  { name: 'Content-Type', values: ['application/json', 'text/plain', 'text/html', 'application/xml'] },
  { name: 'Cache-Control', values: ['no-cache', 'max-age=3600', 'no-store', 'public, max-age=31536000'] },
  { name: 'Access-Control-Allow-Origin', values: ['*', 'https://example.com'] },
  { name: 'Authorization', values: ['Bearer TOKEN', 'Basic AUTH'] },
  { name: 'X-Rate-Limit', values: ['60', '100', '1000'] },
  { name: 'X-API-Key', values: ['required'] }
];

function MockyHttpPage() {
  const [endpointUrl] = useState('https://devgarage.app/mocky/abc456');
  const [expiryTime] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [jsonResponse, setJsonResponse] = useState(JSON.stringify(defaultJson, null, 2));
  const [headers, setHeaders] = useState(defaultHeaders);
  const [jsonError, setJsonError] = useState(null);
  const [newHeader, setNewHeader] = useState({ name: '', value: '' });
  const [showHeaderSuggestions, setShowHeaderSuggestions] = useState(false);
  const [showValueSuggestions, setShowValueSuggestions] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(endpointUrl);
      // You might want to add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatTimeLeft = () => {
    const diff = expiryTime - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} hours ${minutes} minutes`;
  };

  const handleJsonChange = (e) => {
    const newJson = e.target.value;
    setJsonResponse(newJson);
    
    // Validate JSON
    try {
      JSON.parse(newJson);
      setJsonError(null);
    } catch (error) {
      setJsonError(`Invalid JSON: ${error.message}`);
    }
  };

  const handleHeaderChange = (index, field, value) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index][field] = value;
    setHeaders(updatedHeaders);
  };

  const handleAddHeader = () => {
    if (newHeader.name.trim() === '' || newHeader.value.trim() === '') {
      return;
    }
    
    // Check for duplicate header name
    if (headers.some(h => h.name.toLowerCase() === newHeader.name.toLowerCase())) {
      // Maybe show an error instead
      return;
    }
    
    setHeaders([...headers, { name: newHeader.name, value: newHeader.value }]);
    setNewHeader({ name: '', value: '' });
  };

  const handleRemoveHeader = (index) => {
    const updatedHeaders = [...headers];
    updatedHeaders.splice(index, 1);
    setHeaders(updatedHeaders);
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to the backend
    console.log('Saved changes');
    // Here you would make an API call to update the endpoint
  };

  const handleHeaderNameFocus = () => {
    setShowHeaderSuggestions(true);
  };

  const handleHeaderNameBlur = () => {
    // Small delay to allow dropdown click to work
    setTimeout(() => setShowHeaderSuggestions(false), 200);
  };

  const handleHeaderValueFocus = () => {
    setShowValueSuggestions(true);
  };

  const handleHeaderValueBlur = () => {
    // Small delay to allow dropdown click to work
    setTimeout(() => setShowValueSuggestions(false), 200);
  };

  const selectHeaderName = (headerName) => {
    setNewHeader({ ...newHeader, name: headerName });
    setShowHeaderSuggestions(false);
    
    // Find matching header to suggest values
    const headerSuggestions = commonHeaders.find(h => h.name === headerName);
    if (headerSuggestions && headerSuggestions.values.length > 0) {
      setShowValueSuggestions(true);
    }
  };

  const selectHeaderValue = (value) => {
    setNewHeader({ ...newHeader, value });
    setShowValueSuggestions(false);
  };

  const getHeaderSuggestions = () => {
    if (!newHeader.name.trim()) {
      return commonHeaders.map(h => h.name);
    }
    
    return commonHeaders
      .map(h => h.name)
      .filter(name => name.toLowerCase().includes(newHeader.name.toLowerCase()));
  };

  const getValueSuggestions = () => {
    const header = commonHeaders.find(h => 
      h.name.toLowerCase() === newHeader.name.toLowerCase()
    );
    
    if (!header) return [];
    
    if (!newHeader.value.trim()) {
      return header.values;
    }
    
    return header.values.filter(value => 
      value.toLowerCase().includes(newHeader.value.toLowerCase())
    );
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">🔄 Mocky HTTP</h1>
      
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Card.Title>Your Mock API URL</Card.Title>
              <code className="fs-5">{endpointUrl}</code>
            </div>
            <Button variant="primary" onClick={copyToClipboard}>
              Copy URL
            </Button>
          </div>
          <Alert variant="info" className="mt-3 mb-0">
            Endpoint expires in: {formatTimeLeft()}
          </Alert>
        </Card.Body>
      </Card>

      <h2 className="mb-3">JSON Response Editor</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={10}
              value={jsonResponse}
              onChange={handleJsonChange}
              className="font-monospace"
              style={{ fontSize: '0.9rem' }}
            />
          </Form.Group>
          {jsonError && (
            <Alert variant="danger" className="mt-3">
              {jsonError}
            </Alert>
          )}
        </Card.Body>
      </Card>

      <h2 className="mb-3">HTTP Headers</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>Header Name</th>
                <th>Header Value</th>
                <th width="80px"></th>
              </tr>
            </thead>
            <tbody>
              {headers.map((header, index) => (
                <tr key={index}>
                  <td>
                    <Form.Control
                      type="text"
                      value={header.name}
                      onChange={(e) => handleHeaderChange(index, 'name', e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      value={header.value}
                      onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                    />
                  </td>
                  <td>
                    <Button 
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveHeader(index)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Row className="mt-3">
            <Col>
              <div className="position-relative">
                <Form.Control
                  type="text"
                  placeholder="Header Name"
                  value={newHeader.name}
                  onChange={(e) => setNewHeader({ ...newHeader, name: e.target.value })}
                  onFocus={handleHeaderNameFocus}
                  onBlur={handleHeaderNameBlur}
                />
                {showHeaderSuggestions && getHeaderSuggestions().length > 0 && (
                  <div className="position-absolute start-0 w-100 shadow bg-white rounded z-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <div className="list-group">
                      {getHeaderSuggestions().map((headerName, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="list-group-item list-group-item-action"
                          onClick={() => selectHeaderName(headerName)}
                        >
                          {headerName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Col>
            <Col>
              <div className="position-relative">
                <Form.Control
                  type="text"
                  placeholder="Header Value"
                  value={newHeader.value}
                  onChange={(e) => setNewHeader({ ...newHeader, value: e.target.value })}
                  onFocus={handleHeaderValueFocus}
                  onBlur={handleHeaderValueBlur}
                />
                {showValueSuggestions && getValueSuggestions().length > 0 && (
                  <div className="position-absolute start-0 w-100 shadow bg-white rounded z-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <div className="list-group">
                      {getValueSuggestions().map((value, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="list-group-item list-group-item-action"
                          onClick={() => selectHeaderValue(value)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Col>
            <Col xs="auto">
              <Button onClick={handleAddHeader}>Add Header</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-end">
        <Button 
          variant="success" 
          size="lg" 
          onClick={handleSaveChanges}
          disabled={!!jsonError}
        >
          Save Changes
        </Button>
      </div>
    </Container>
  );
}

export default MockyHttpPage;
