## Feature Overview: Mocky HTTP (Mock API Generator)

Mocky HTTP provides users with the ability to quickly generate temporary API endpoints that return predefined JSON responses and custom HTTP headers. It's especially useful for developers needing a quick way to mock API responses, test frontend integrations, or simulate external APIs.

### User Workflow

* **Creating a Mock API Endpoint**

  * The user navigates from the dashboard to the Mocky HTTP page.
  * Upon page load, an endpoint is automatically generated with a default JSON response and default headers.
  * Example endpoint URL: `https://devgarage.app/mocky/abc456`

* **Configuring the Mock Response**

  * Initially provides a default JSON payload and default headers (`Content-Type: application/json`).
  * User can edit and customize both:

    * JSON payload directly on the page.
    * HTTP headers (key-value pairs) directly through a user-friendly interface.
  * Changes are instantly saved and immediately available through the endpoint.

* **Using the Endpoint**

  * Users copy the generated Mocky URL.
  * Requests made to this endpoint return the predefined JSON response and custom headers.

* **Endpoint Lifetime**

  * Each Mocky HTTP endpoint expires automatically after **24 hours**.
  * Expiration time is clearly displayed on the page.

---

### UI Structure

```
Mocky HTTP Page:

Your Mock API URL: [ https://devgarage.app/mocky/abc456 ] [Copy Button]

Endpoint expires in: 23 hours 50 minutes

JSON Response Editor:
--------------------------------------------
| {                                       |
|   "status": "success",                  |
|   "message": "This is a mock response", |
|   "data": {                             |
|     "id": 12345,                        |
|     "name": "Test User"                 |
|   }                                     |
| }                                       |
--------------------------------------------

HTTP Headers:
---------------------------------------------------
| Header Name             | Header Value          |
---------------------------------------------------
| Content-Type            | application/json      |
| Cache-Control           | no-cache              |
| [Add Header]                                    |
---------------------------------------------------

[Save Changes] (Auto-saves upon editing)
```

---

### Technical Implementation (frontend perspective)

* React page (`MockyPage.jsx`) includes two editable components:

  * JSON payload editor (`MockyEditor.jsx`).
  * Headers editor component (`HeadersEditor.jsx`) allowing key-value pair edits.
* Uses native Fetch API for backend communication.
* Frontend validation:

  * JSON format validation.
  * Basic header validation (e.g., no duplicate or empty headers).

---

### Technical Implementation (backend API concept)

* Backend generates unique endpoints upon request.
* Stores custom JSON responses and HTTP headers temporarily (24-hour TTL).
* API endpoints:

  **Configuration Endpoints:**
  * `POST /api/mocky-config`: Creates a new mock endpoint with a randomly generated ID and returns the endpoint ID and URL.
  * `PUT /api/mocky-config/{id}`: Updates an existing mock endpoint's JSON payload and headers.
  * `GET /api/mocky-config/{id}`: Returns the current configuration (JSON payload, headers, expiration time) for administration purposes.

  **Mock Response Endpoints:**
  * `GET /mocky/{id}`: Serves the mock response with the configured JSON and headers.
  * Other HTTP methods (`POST`, `PUT`, `DELETE`, etc.) to `/mocky/{id}`: Optionally support different HTTP methods to the same endpoint.

### API Payload Specifications

#### 1. Create Mock Endpoint - `POST /api/mocky-config`

**Request Payload:**
```json
{
  "responseBody": {
    "status": "success",
    "message": "This is a mock response",
    "data": {
      "id": 12345,
      "name": "Test User"
    }
  },
  "headers": [
    { "name": "Content-Type", "value": "application/json" },
    { "name": "Cache-Control", "value": "no-cache" }
  ],
  "statusCode": 200
}
```

**Response Payload:**
```json
{
  "success": true,
  "result": {
    "id": "abc456",
    "url": "https://devgarage.app/mocky/abc456",
    "expiresAt": "2025-05-22T10:30:45Z",
    "responseBody": {
      "status": "success",
      "message": "This is a mock response",
      "data": {
        "id": 12345,
        "name": "Test User"
      }
    },
    "headers": [
      { "name": "Content-Type", "value": "application/json" },
      { "name": "Cache-Control", "value": "no-cache" }
    ],
    "statusCode": 200
  }
}
```

#### 2. Update Mock Endpoint - `PUT /api/mocky-config/{id}`

**Request Payload:**
```json
{
  "responseBody": {
    "status": "success",
    "message": "Updated mock response",
    "data": {
      "id": 67890,
      "name": "Updated User"
    }
  },
  "headers": [
    { "name": "Content-Type", "value": "application/json" },
    { "name": "Cache-Control", "value": "no-cache" },
    { "name": "X-Custom-Header", "value": "custom-value" }
  ],
  "statusCode": 200
}
```

**Response Payload:**
```json
{
  "success": true,
  "result": {
    "id": "abc456",
    "url": "https://devgarage.app/mocky/abc456",
    "expiresAt": "2025-05-22T10:30:45Z",
    "responseBody": {
      "status": "success",
      "message": "Updated mock response",
      "data": {
        "id": 67890,
        "name": "Updated User"
      }
    },
    "headers": [
      { "name": "Content-Type", "value": "application/json" },
      { "name": "Cache-Control", "value": "no-cache" },
      { "name": "X-Custom-Header", "value": "custom-value" }
    ],
    "statusCode": 200
  }
}
```

#### 3. Get Mock Configuration - `GET /api/mocky-config/{id}`

**Response Payload:**
```json
{
  "success": true,
  "result": {
    "id": "abc456",
    "url": "https://devgarage.app/mocky/abc456",
    "expiresAt": "2025-05-22T10:30:45Z",
    "createdAt": "2025-05-21T10:30:45Z",
    "responseBody": {
      "status": "success",
      "message": "This is a mock response",
      "data": {
        "id": 12345,
        "name": "Test User"
      }
    },
    "headers": [
      { "name": "Content-Type", "value": "application/json" },
      { "name": "Cache-Control", "value": "no-cache" }
    ],
    "statusCode": 200,
    "timeRemaining": "23 hours 45 minutes"
  }
}
```

#### 4. Mock Response Endpoint - `GET /mocky/{id}` (and other HTTP methods)

This endpoint will directly return:
- The configured JSON payload as the response body
- The configured HTTP status code (default: 200)
- All configured custom headers

#### Data Model for Storage

Each mock endpoint configuration will be stored with the following structure:
```json
{
  "id": "abc456",
  "createdAt": "2025-05-21T10:30:45Z",
  "expiresAt": "2025-05-22T10:30:45Z",
  "responseBody": { ... },
  "headers": [ ... ],
  "statusCode": 200
}
```
