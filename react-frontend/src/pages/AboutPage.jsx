import React from 'react';
import { Container } from 'react-bootstrap';

function AboutPage() {
  return (
    <Container className="py-5">
      <h1 className="mb-4">About Developers Garage</h1>
      <p className="lead">
        Developers Garage is your one-stop platform for developer tools and utilities.
        We provide essential services to make development and testing easier.
      </p>
      <div className="mt-4">
        <h2>Our Mission</h2>
        <p>
          To provide developers with reliable, easy-to-use tools that streamline their
          development workflow and enhance productivity.
        </p>
      </div>
      <div className="mt-4">
        <h2>Our Services</h2>
        <p>
          From temporary email inboxes to webhook testing, our suite of tools is
          designed to solve common development challenges quickly and efficiently.
        </p>
      </div>
    </Container>
  );
}

export default AboutPage;
