import React, { useState } from 'react';

function ServiceToggle({ name }) {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="form-check form-switch my-3">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={`toggle-${name}`}
        checked={enabled}
        onChange={() => setEnabled(!enabled)}
      />
      <label className="form-check-label" htmlFor={`toggle-${name}`}>
        {name} {enabled ? 'enabled' : 'disabled'}
      </label>
    </div>
  );
}

export default ServiceToggle;
