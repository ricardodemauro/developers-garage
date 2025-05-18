## Feature Overview: PostBin

PostBin provides temporary HTTP endpoints designed to capture incoming HTTP requests. It helps developers test, inspect, and debug webhook or API integrations without setting up their own infrastructure.

### User Workflow

* **Creating a PostBin Endpoint**

  * The user navigates from the dashboard to the PostBin page.
  * Upon visiting the page, a unique temporary endpoint URL is automatically generated.
  * Example generated endpoint: `https://devgarage.app/postbin/xyz123`

* **Using the Endpoint**

  * Users copy the generated PostBin URL.
  * Users configure external services, APIs, or scripts to send HTTP requests (GET, POST, PUT, etc.) to this URL.

* **Inspecting Requests**

  * Incoming requests to the endpoint appear instantly on the PostBin page.
  * Each request shows essential details like method, timestamp, status, headers, and payload/body content.

* **Endpoint Lifetime**

  * Each PostBin endpoint automatically expires after **24 hours**.
  * Expiration time is clearly displayed.

---

### UI Structure

```
PostBin Page:

Your PostBin URL: [ https://devgarage.app/postbin/xyz123 ] [Copy Button]

Endpoint expires in: 23 hours 55 minutes

Captured Requests:
------------------------------------------------------------
| Method | Time       | Status | Body Content Size         |
------------------------------------------------------------
| POST   | 2 min ago  | 200 OK | JSON (2 KB) [View]        |
| GET    | 5 min ago  | 200 OK | No Content                |
------------------------------------------------------------

[Click request to inspect details]
```

---

### Request Details View (when clicked)

Shows detailed information about each request:

* HTTP Method (GET, POST, etc.)
* Timestamp of request received
* HTTP headers (key-value pairs)
* Request body content (raw text, JSON formatted)

Button to return to the main PostBin view.

---

### Technical Implementation (frontend perspective)

* React page (`PostBinPage.jsx`) fetching request logs periodically using native Fetch API.
* Request list component (`RequestList.jsx`) displaying received requests in a Bootstrap table.
* Request detail component (`RequestDetail.jsx`) for viewing individual request contents.

---

### Technical Implementation (future backend API concept)

* Backend generates unique temporary HTTP endpoints upon request.
* Captures incoming HTTP requests (method, headers, body).
* Stores requests temporarily (24-hour TTL).
* Exposes API endpoint (`GET /api/postbin/{id}/requests`) to fetch captured request data.
