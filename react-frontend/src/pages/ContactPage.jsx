import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Contact Us</h1>
      <p className="lead mb-4">
        Have questions or suggestions? We'd love to hear from you.
      </p>
      <Form onSubmit={handleSubmit} className="max-w-lg">
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter your name" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter your email" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea" rows={5} placeholder="Your message" required />
        </Form.Group>

        <Button variant="primary" type="submit">
          Send Message
        </Button>
      </Form>
    </Container>
  );
}

export default ContactPage;
