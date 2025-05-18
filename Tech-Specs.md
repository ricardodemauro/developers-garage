# Developers Garage: Technical Specification

## Overview

This technical specification outlines the technologies, structure, and design principles for the Developers Garage platform, focusing initially on developing the frontend using ReactJS and Bootstrap. The frontend will be hosted as static pages on Cloudflare Pages. Backend implementation, using C# Minimal APIs, will follow in later stages.

## Tech Stack

| Area             | Technology                               |
| ---------------- | ---------------------------------------- |
| Frontend         | React (with Vite or CRA)                 |
| Styling          | Bootstrap CSS                            |
| Routing          | React Router v6+                         |
| Localization     | i18next with `react-i18next`             |
| State Management | React Context                            |
| Storage          | localStorage (user progress, bookmarks)  |
| Deployment       | Static (Cloudflare Pages / GitHub Pages) |

## Frontend Application Structure

```
/src
├── components/
│   ├── Dashboard.jsx
│   ├── ServiceToggle.jsx
│   └── Navbar.jsx
├── pages/
│   ├── DashboardPage.jsx
│   └── NotFoundPage.jsx
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
└── index.html
```

### Component Descriptions

* **Dashboard.jsx**: Main component displaying active/inactive service toggles and URLs.
* **ServiceToggle.jsx**: Individual service activation toggle, state management, URL display.
* **Navbar.jsx**: Navigation component linking to the dashboard and potentially future pages.

### React Routing

Use `react-router-dom` for routing. Initial routing setup:

* `/` → DashboardPage
* `*` → NotFoundPage

## Bootstrap Usage

* Leverage the default Bootstrap theme for simplicity and consistency.
* Utilize Bootstrap's responsive grid system for optimal layout across devices.
* Use standard components such as buttons, toggles, cards, modals, and tooltips for interactivity and clarity.

## UI Principles

* **Consistency**: Use uniform styling and layout patterns throughout the application.
* **Minimalism**: Simplify user interaction with clear actions and visual indicators.
* **Responsiveness**: Fully responsive design ensuring usability across various screen sizes.

## API Integration (planned for later phase)

Define a single service (`api.js`) for handling all HTTP interactions with backend APIs.

Example structure:

```javascript
export const createService = (serviceType) => fetch(`/api/${serviceType}`, { method: 'POST' });
export const disableService = (serviceId) => fetch(`/api/${serviceId}`, { method: 'DELETE' });
export const getServices = () => fetch('/api/services').then(response => response.json());
```

## Deployment Strategy

* Hosted via Cloudflare Pages:

  * GitLab or other supported Git providers integrated with Cloudflare Pages.
  * Automated deployments triggered by commits to the main branch.

## Priority

* Initial priority is the ReactJS frontend implementation.
* Backend integration and development using C# Minimal APIs will follow after the completion of the frontend.

## Future Considerations

* Authentication and session management
* Integration with MCP API for LLM agents
* Backend API development and integration
* Automated CI/CD pipeline enhancements

This specification ensures clarity and structured guidance for the frontend development phase of Developers Garage.
