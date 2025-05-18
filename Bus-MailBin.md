## Feature Overview: MailBin

MailBin provides users with temporary, disposable email inboxes to receive emails. It is primarily designed for testing, development, and debugging purposes, especially useful for workflows that require email confirmation or verification without using personal emails.

### User Workflow

* **Creating a MailBin Inbox**

  * The user navigates to the MailBin page from the dashboard.
  * Upon visiting the MailBin page, a disposable inbox is automatically generated, no additional input required.
  * The generated inbox has a unique email address (e.g., `a1b2c3@devgarage.app`).

* **Using the Inbox**

  * Users copy the provided disposable email address.
  * Users send emails to this address (from apps, services, testing tools, etc.).

* **Viewing Emails**

  * Emails received by the disposable inbox appear in real-time on the MailBin page.
  * Each email includes sender details, subject, date/time, and email content (plain text or HTML).

* **Inbox Lifetime**

  * Each inbox automatically expires after **24 hours**.
  * The expiration time is clearly shown.

### UI Structure

```
MailBin Page:

Disposable Inbox: [ a1b2c3@devgarage.app ]  [Copy Button]

Inbox expires in: 23 hours 45 minutes

Received Emails:
---------------------------------------------------------
| Sender                | Subject            | Received |
---------------------------------------------------------
| no-reply@test.com     | Verify your email  | 1 min ago|
| support@example.com   | Your invoice       | 5 min ago|
---------------------------------------------------------

[Click email to preview]
```

### Email Preview (when clicked)

* Shows the full content of the email (text, links, images).
* Button to go back to the inbox view.

### Technical Implementation (frontend perspective)

* React page (`MailBinPage.jsx`) fetching emails periodically using native Fetch API.
* Email list component (`MailBinInbox.jsx`) displaying emails in a structured Bootstrap table.
* Email preview component (`MailBinPreview.jsx`) displaying detailed content when selected.

### Technical Implementation (future backend API concept)

* Backend generates unique email inboxes upon request.
* Receives emails via SMTP server implementation.
* Stores emails temporarily (24 hours TTL).
* Provides API endpoint (`GET /api/mailbin/{id}/emails`) to fetch inbox content.
