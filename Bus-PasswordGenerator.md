## Feature Overview: Password Generator

The Password Generator allows developers and users to quickly generate secure, random passwords. It helps with creating strong passwords for testing authentication flows, user sign-ups, security validations, or other development scenarios.

### User Workflow

* **Navigating to the Password Generator**

  * User navigates from the dashboard to the Password Generator page.
  * Upon visiting the page, an initial secure password is automatically generated and displayed.

* **Generating and Configuring Passwords**

  * Users can adjust password settings directly on the page:

    * Password length (default 16 characters, range from 8 to 64).
    * Character sets to include:

      * Uppercase letters (A-Z)
      * Lowercase letters (a-z)
      * Numbers (0-9)
      * Symbols (e.g., !@#$%^&*)
    * Advanced options:
      * Exclude ambiguous characters (e.g., O, 0, l, I, 1)
      * Ensure minimum character set representation (e.g., at least one symbol)
      * Generate pronounceable passwords option
  
  * Password updates instantly as settings change.
  * Users click to copy the generated password directly to the clipboard.

### UI Structure

```
Password Generator Page:

Generated Password:
[ L3f9!sD#hZqJ6@wT ]   [Copy Button]

Password Strength: [████████████████] Very Strong
Estimated crack time: ~3 centuries using current technology

Password Settings:

Length: [ 16 ] (range slider or number input)

Include Characters:
[✔] Uppercase (A-Z)
[✔] Lowercase (a-z)
[✔] Numbers (0-9)
[✔] Symbols (!@#$%^&*)

Advanced Options:
[✔] Exclude ambiguous characters (O, 0, l, I, 1)
[✔] Ensure at least one character from each selected set
[ ] Generate pronounceable password

Recently Generated: (Last 5 passwords, session only)
• ••••••••••••••••   [Show]
• ••••••••••••••••   [Show]
```

### Password Strength Indicator

* Visual indicator shows password strength in real-time:
  * Weak (red): Less than 10 characters or limited character sets
  * Medium (orange): 10-15 characters with mixed character sets
  * Strong (light green): 16+ characters with at least 3 character sets
  * Very Strong (green): 16+ characters with all character sets

* Estimated time to crack calculation based on:
  * Password length and complexity
  * Current known computational capabilities
  * Updated heuristics for password security

### Technical Implementation (frontend perspective)

* React component (`PasswordGenerator.jsx`) handles generation logic.
* Password generation logic implemented client-side for instant performance.
* Utilizes the Web Crypto API (`window.crypto`) for secure randomness.
* Bootstrap UI components for clean, responsive design.
* Keyboard shortcuts support (e.g., Ctrl+G to generate new password, Ctrl+C to copy)

### Password Generation Logic (Client-side)

* Uses secure randomness (`crypto.getRandomValues`).
* Respects user-selected criteria (length and character sets).
* Auto-updates password instantly upon settings changes.
* Enforces minimum requirements when option selected.
* Alternative algorithms for pronounceable passwords.

### Endpoint Lifetime & Storage

* Stateless widget: no backend interaction required.
* No persistence or expiry logic necessary (generated passwords displayed only client-side).
* Recent passwords stored in session memory only (never persisted).
* All data cleared when user navigates away or closes browser tab.

### Security Notes

* All password generation occurs entirely client-side.
* No passwords are ever transmitted over the network or stored on servers.
* Follows OWASP guidelines for random password generation.
* Educational tips shown alongside the generator about password best practices.
