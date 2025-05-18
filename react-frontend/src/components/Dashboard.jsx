import React from 'react';
import ServiceToggle from './ServiceToggle';

function Dashboard() {
  return (
    <div className="container mt-4">
      <h1>Developers Garage Dashboard</h1>
      <ServiceToggle name="MailBin" />
      <ServiceToggle name="PostBin" />
    </div>
  );
}

export default Dashboard;
