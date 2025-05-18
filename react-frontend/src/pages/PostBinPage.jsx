import React, { useState } from 'react';
import { Container, Table, Button, Card, Alert, Badge } from 'react-bootstrap';

// Mock data for development - will be replaced with actual API calls
const mockRequests = [
  {
    id: 1,
    method: 'POST',
    timestamp: new Date(Date.now() - 120000),
    status: '200 OK',
    contentSize: '2 KB',
    contentType: 'application/json',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Accept': '*/*'
    },
    body: JSON.stringify({ name: 'John Doe', email: 'john@example.com' }, null, 2)
  },
  {
    id: 2,
    method: 'GET',
    timestamp: new Date(Date.now() - 300000),
    status: '200 OK',
    contentSize: 'No Content',
    contentType: null,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Accept': '*/*'
    },
    body: ''
  }
];

function PostBinPage() {
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [endpointUrl] = useState('https://devgarage.app/postbin/xyz123');
  const [expiryTime] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));

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

  const formatTimestamp = (date) => {
    const diff = Date.now() - date;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    return date.toLocaleTimeString();
  };

  const getMethodBadgeVariant = (method) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'primary';
      case 'POST': return 'success';
      case 'PUT': return 'warning';
      case 'DELETE': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">📬 PostBin</h1>
      
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Card.Title>Your PostBin URL</Card.Title>
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

      <h2 className="mb-3">Captured Requests</h2>

      <Table hover responsive className="mb-4">
        <thead>
          <tr>
            <th>Method</th>
            <th>Time</th>
            <th>Status</th>
            <th>Body Content</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr
              key={request.id}
              onClick={() => setSelectedRequest(request)}
              style={{ 
                cursor: 'pointer',
                backgroundColor: selectedRequest && selectedRequest.id === request.id ? 'rgba(0,123,255,0.1)' : 'transparent'
              }}
            >
              <td>
                <Badge bg={getMethodBadgeVariant(request.method)}>
                  {request.method}
                </Badge>
              </td>
              <td>{formatTimestamp(request.timestamp)}</td>
              <td>{request.status}</td>
              <td>{request.contentSize}</td>
            </tr>
          ))}
          {requests.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-muted">
                No requests captured yet. Send requests to your PostBin URL and they'll appear here automatically.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {selectedRequest && (
        <Card className="mt-4">
          <Card.Header>
            <div className="d-flex align-items-center">
              <Badge bg={getMethodBadgeVariant(selectedRequest.method)} className="me-2">
                {selectedRequest.method}
              </Badge>
              <span className="fs-5">{endpointUrl}</span>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <strong>Timestamp:</strong> {selectedRequest.timestamp.toLocaleString()}<br />
              <strong>Status:</strong> {selectedRequest.status}
            </div>
            
            <h5 className="mt-4 mb-3">Request Headers</h5>
            <div className="bg-light p-3 rounded mb-4">
              <pre className="mb-0">
                {JSON.stringify(selectedRequest.headers, null, 2)}
              </pre>
            </div>
            
            <h5 className="mb-3">Request Body</h5>
            <div className="bg-light p-3 rounded">
              <pre className="mb-0">
                {selectedRequest.body || 'No content'}
              </pre>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default PostBinPage;
