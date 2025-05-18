## Feature Overview: Notepad Widget (Persistent Shared Notes with Optional Password)

The Notepad widget allows users to quickly create, edit, and securely share plaintext notes or code snippets. It's designed for seamless collaboration, idea sharing, or temporary document storage. Users have the flexibility of making notes public or password-protected, as well as optionally setting expiration dates.

### User Workflow

* **Navigating to the Notepad**

  * Users access the Notepad widget from the dashboard (`/notepad`).
  * Upon opening, a new notepad session is automatically created.

* **Creating and Editing Notes**

  * Users type or paste plaintext or code into a provided editor.
  * Notes automatically save in real-time.

* **Sharing Notes**

  * Each note receives a unique shareable URL (e.g., `https://yourdomain.com/notepad/abc123`).
  * Users can copy this URL to easily share their notes.
  * Shared notes can be public or optionally password-protected.

* **Note Privacy (Optional Password Protection)**

  * Notes are publicly accessible by default.
  * Users may optionally set a password for note access.
  * When password-protected, accessing the note requires entering the correct password.

* **Note Expiration (Optional)**

  * By default, notes do **not** expire.
  * Users can optionally choose an expiration period:

    * 1 day, 7 days, 30 days, or custom.

---

### UI Structure

```
Notepad Page (/notepad):

Your Note URL:
[ https://yourdomain.com/notepad/abc123 ]   [Copy Button]

Privacy Options:
[ ] Password protect this note (optional)
    Password: [__________]

Expiration:
(•) No expiration (default)
( ) Expire after: [ 1 day | 7 days | 30 days | Custom ]

Text Editor:
-------------------------------------------------------
| Enter or paste your notes here...                   |
|                                                     |
|                                                     |
-------------------------------------------------------
(auto-saves instantly)
```

---

### Accessing a Password-Protected Note

When someone accesses a password-protected note, the user sees:

```
Note Access Page (/notepad/abc123):

This note is password-protected.

Enter Password: [________]  [Submit]
```

* Upon entering the correct password, the note contents are displayed.
* Incorrect passwords display an error message.

---

### Technical Implementation (frontend perspective)

* React page (`NotepadPage.jsx`) includes:

  * Text editor component (`TextEditor.jsx`).
  * Password input component (`PasswordProtect.jsx`).
  * Expiration options (`ExpirationSelector.jsx`).
* Auto-save via native Fetch API.
* Password prompt page (`PasswordPrompt.jsx`) to handle secure note access.

---

### Technical Implementation (future backend API concept)

* Generates unique note identifiers automatically.
* Stores plaintext notes along with hashed passwords (if provided).
* API endpoints:

  * `GET /api/notepad/{id}`: Retrieve note (requires password if protected).
  * `POST /api/notepad/{id}`: Update note content, password, or expiration.
