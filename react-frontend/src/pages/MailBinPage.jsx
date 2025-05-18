import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Card, Alert } from 'react-bootstrap';

// Mock data for development - will be replaced with actual API calls
const mockEmails = [
  {
    id: 1,
    sender: 'no-reply@test.com',
    subject: 'Verify your email',
    receivedAt: new Date(Date.now() - 60000),
    content: 'Please verify your email by clicking the link below...'
  },
  {
    id: 2,
    sender: 'support@example.com',
    subject: 'Your invoice',
    receivedAt: new Date(Date.now() - 300000),
    content: 'Your invoice for recent services is attached...'
  }
];

function MailBinPage() {
  const [emails, setEmails] = useState(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [inboxAddress] = useState('a1b2c3@devgarage.app');
  const [expiryTime] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inboxAddress);
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

  const formatReceivedTime = (date) => {
    const diff = Date.now() - date;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    return date.toLocaleTimeString();
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">📧 MailBin</h1>
      
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Card.Title>Your Temporary Inbox</Card.Title>
              <code className="fs-5">{inboxAddress}</code>
            </div>
            <Button variant="primary" onClick={copyToClipboard}>
              Copy Address
            </Button>
          </div>
          <Alert variant="info" className="mt-3 mb-0">
            Inbox expires in: {formatTimeLeft()}
          </Alert>
        </Card.Body>
      </Card>

      <h2 className="mb-3">Received Emails</h2>

      <Table hover responsive className="mb-4">
        <thead>
          <tr>
            <th>Sender</th>
            <th>Subject</th>
            <th>Received</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email) => (
            <tr
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              style={{ 
                cursor: 'pointer',
                backgroundColor: selectedEmail && selectedEmail.id === email.id ? 'rgba(0,123,255,0.1)' : 'transparent'
              }}
            >
              <td>{email.sender}</td>
              <td>{email.subject}</td>
              <td>{formatReceivedTime(email.receivedAt)}</td>
            </tr>
          ))}
          {emails.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center py-4 text-muted">
                No emails received yet. Emails will appear here automatically.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {selectedEmail && (
        <Card className="mt-4">
          <Card.Header>
            <h4 className="mb-0">{selectedEmail.subject}</h4>
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <strong>From:</strong> {selectedEmail.sender}<br />
              <strong>Received:</strong> {selectedEmail.receivedAt.toLocaleString()}
            </div>
            <hr />
            <div className="mt-3">
              {selectedEmail.content}
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default MailBinPage;
