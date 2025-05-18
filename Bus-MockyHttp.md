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

### Technical Implementation (future backend API concept)

* Backend generates unique endpoints upon request.
* Stores custom JSON responses and HTTP headers temporarily (24-hour TTL).
* API endpoints:

  * `GET /api/mocky/{id}`: Returns stored JSON payload and headers.
  * `POST /api/mocky/{id}`: Updates JSON payload and headers.
