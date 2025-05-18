## Feature Overview: URL Shortener

The URL Shortener widget allows users to quickly shorten long URLs into manageable, easily-shareable links. Primarily useful for development purposes, sharing temporary links during tests, demos, or communication between developers.

### User Workflow

* **Navigating to the URL Shortener**

  * Users access the URL Shortener page from the dashboard.
  * Upon page load, users immediately see a simple input field for the URL they wish to shorten.

* **Generating Short URLs**

  * User enters or pastes a long URL into the provided input box.
  * Clicking the "Shorten" button immediately generates a shortened URL.
  * Shortened URL example: `https://devgarage.app/u/xyz789`
  * Users can copy the short URL directly to their clipboard with a single click.

* **Using Shortened URLs**

  * Accessing the short URL redirects users instantly to the original long URL.

* **Short URL Lifetime**

  * Generated URLs expire automatically after **24 hours**.
  * The expiration is clearly displayed on the page.

---

### UI Structure

```
URL Shortener Page:

Enter URL to shorten:
[ https://example.com/very/long/link/here ]   [Shorten Button]

Your Short URL:
[ https://devgarage.app/u/xyz789 ]   [Copy Button]

URL expires in: 23 hours 55 minutes
```

---

### Technical Implementation (frontend perspective)

* React page (`URLShortenerPage.jsx`) includes:

  * URL input component (`UrlInput.jsx`).
  * Display component (`ShortUrlDisplay.jsx`) showing generated short URLs and copy-to-clipboard functionality.
* Uses native Fetch API to interact with backend endpoint for generating and retrieving short URLs.
* Bootstrap components for responsiveness and consistent style.

---

### Technical Implementation (future backend API concept)

* Backend generates unique, short URLs and maps them temporarily to the original URL.
* URL mappings stored temporarily with a 24-hour TTL.
* Backend API endpoints:

  * `POST /api/urlshortener`: accepts original URL and returns shortened URL.
  * `GET /u/{id}`: resolves short URL and redirects to the original URL.

