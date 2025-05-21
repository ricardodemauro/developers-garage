import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert, Spinner, Badge, Dropdown } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import './Notepad.css';

// Component for markdown editor
const TextEditor = ({ value, onChange, theme }) => {
  // Count words and characters
  const stats = useMemo(() => {
    if (!value) return { words: 0, chars: 0 };
    
    const text = value.replace(/```[\s\S]*?```/g, '') // Remove code blocks
                      .replace(/#{1,6}\s+/g, '')      // Remove headings
                      .replace(/\*\*|__|\*|_|~~|`/g, ''); // Remove formatting
    
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.replace(/\s/g, '').length;
    
    return { words, chars };
  }, [value]);
  
  return (
    <div className="mb-4" data-color-mode={theme}>
      <MDEditor
        value={value}
        onChange={onChange}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize], [rehypeHighlight, { detect: true }]],
        }}
        height={400}
        preview="live"
        highlightColor={theme === 'light' ? '#f8f9fa' : '#343a40'}
      />
      <div className="d-flex justify-content-between mt-2 text-muted small">
        <div>
          <Form.Check
            type="switch"
            id="theme-toggle"
            label={theme === 'light' ? '☀️ Light mode' : '🌙 Dark mode'}
            checked={theme === 'dark'}
            onChange={(e) => onChange(value, e.target.checked ? 'dark' : 'light')}
            className="d-inline-block"
          />
        </div>
        <div>
          <Badge bg="secondary" className="me-2">{stats.words} words</Badge>
          <Badge bg="secondary">{stats.chars} characters</Badge>
        </div>
      </div>
    </div>
  );
};

// Component for password protection options
const PasswordProtect = ({ isProtected, setIsProtected, password, setPassword }) => {
  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">Privacy Options</h5>
      </Card.Header>
      <Card.Body>
        <Form.Check
          type="checkbox"
          id="password-protect"
          label="Password protect this note (optional)"
          checked={isProtected}
          onChange={(e) => setIsProtected(e.target.checked)}
          className="mb-3"
        />
        
        {isProtected && (
          <Form.Group>
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password for protection"
            />
          </Form.Group>
        )}
      </Card.Body>
    </Card>
  );
};

// Component for expiration options
const ExpirationSelector = ({ expiration, setExpiration, customDays, setCustomDays }) => {
  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">Expiration</h5>
      </Card.Header>
      <Card.Body>
        <Form.Check
          type="radio"
          name="expiration"
          id="no-expiration"
          label="No expiration (default)"
          checked={expiration === "none"}
          onChange={() => setExpiration("none")}
          className="mb-2"
        />
        <Form.Check
          type="radio"
          name="expiration"
          id="expiration-1day"
          label="Expire after 1 day"
          checked={expiration === "1day"}
          onChange={() => setExpiration("1day")}
          className="mb-2"
        />
        <Form.Check
          type="radio"
          name="expiration"
          id="expiration-7days"
          label="Expire after 7 days"
          checked={expiration === "7days"}
          onChange={() => setExpiration("7days")}
          className="mb-2"
        />
        <Form.Check
          type="radio"
          name="expiration"
          id="expiration-30days"
          label="Expire after 30 days"
          checked={expiration === "30days"}
          onChange={() => setExpiration("30days")}
          className="mb-2"
        />
        <Form.Check
          type="radio"
          name="expiration"
          id="expiration-custom"
          label="Custom expiration"
          checked={expiration === "custom"}
          onChange={() => setExpiration("custom")}
          className="mb-2"
        />
        
        {expiration === "custom" && (
          <InputGroup className="mt-2">
            <Form.Control
              type="number"
              min="1"
              max="365"
              value={customDays}
              onChange={(e) => setCustomDays(e.target.value)}
            />
            <InputGroup.Text>days</InputGroup.Text>
          </InputGroup>
        )}
      </Card.Body>
    </Card>
  );
};

// Component for password prompt when accessing protected notes
const PasswordPrompt = ({ onSubmit }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Password cannot be empty");
      return;
    }
    setError(null);
    onSubmit(password);
  };
  
  return (
    <Card className="mx-auto" style={{ maxWidth: '500px' }}>
      <Card.Header>
        <h4 className="mb-0">Password Protected Note</h4>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <p>This note is password-protected. Enter the password to view its contents.</p>
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </InputGroup>
        </Form>
      </Card.Body>
    </Card>
  );
};

const NotepadPage = () => {  const { noteId } = useParams();
  const navigate = useNavigate();
  // State for the notepad
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isProtected, setIsProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [expiration, setExpiration] = useState('none');
  const [customDays, setCustomDays] = useState(7);
  const [noteUrl, setNoteUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isPasswordPrompt, setIsPasswordPrompt] = useState(false);
  const [savedStatus, setSavedStatus] = useState('');
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    // Create a new note or load existing note
    if (!noteId) {
      // Generate a new note ID and redirect
      const newNoteId = uuidv4().substring(0, 8);
      navigate(`/notepad/${newNoteId}`, { replace: true });
      return;
    }

    setNoteUrl(`${window.location.origin}/notepad/${noteId}`);
      // For demonstration, we'll simulate loading a note
    // In a real app, we would load the note from an API
    const loadNote = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Mock API call - would be replaced with actual fetch
        // Check if note exists and if it requires a password
        const mockResponse = {
          exists: true, 
          isProtected: false,
          // We'd only have content if not password protected or password already verified
          content: "# Welcome to Developers Garage Notepad!\n\nThis is a **Markdown** editor where you can:\n\n- Create notes\n- Use _formatting_\n- Share with others\n- Protect with password\n\n```javascript\n// You can even add code blocks\nconst hello = 'world';\nconsole.log(hello);\n```\n\n## Code Highlighting\n\nTry some Python code:\n\n```python\ndef hello_world():\n    print('Hello, Developers Garage!')\n    return 42\n\nif __name__ == '__main__':\n    result = hello_world()\n    print(f'The answer is {result}')\n```"
        };
        
        // If note does not exist, create a new one
        if (!mockResponse.exists) {
          setContent('');
        } 
        // If note is password protected and we haven't verified password yet
        else if (mockResponse.isProtected && !sessionStorage.getItem(`notepad_auth_${noteId}`)) {
          setIsPasswordPrompt(true);
        } 
        // Either note is not protected or we've already verified password
        else {
          setContent(mockResponse.content);
        }
      } catch (error) {
        console.error('Error loading note:', error);
        setError("Failed to load note. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNote();
  }, [noteId, navigate]);
    // Auto-save functionality
  useEffect(() => {
    if (!noteId || isLoading || content === '' || isPasswordPrompt) return;
    
    const saveNote = async () => {
      try {
        // Mock API call for saving the note
        // In a real app, this would be a fetch request
        setIsSaving(true);
        setSavedStatus('Saving...');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For demo purposes, also save to sessionStorage so we can persist content during page refresh
        sessionStorage.setItem(`notepad_content_${noteId}`, content);
        
        // Update privacy and expiration settings
        if (isProtected) {
          sessionStorage.setItem(`notepad_protected_${noteId}`, 'true');
          sessionStorage.setItem(`notepad_password_${noteId}`, password); // In real app, send only hash!
        } else {
          sessionStorage.removeItem(`notepad_protected_${noteId}`);
          sessionStorage.removeItem(`notepad_password_${noteId}`);
        }
        
        setSavedStatus('Saved');
        
        setTimeout(() => {
          setSavedStatus('');
        }, 2000);
      } catch (error) {
        console.error('Error saving note:', error);
        setSavedStatus('Error saving');
        setError("Failed to save note. Please try again.");
      } finally {
        setIsSaving(false);
      }
    };
    
    // Debounce save function
    const debounce = setTimeout(saveNote, 1000);
    
    return () => clearTimeout(debounce);
  }, [content, noteId, isLoading, isPasswordPrompt, isProtected, password]);
    // Handle password verification
  const verifyPassword = async (submittedPassword) => {
    setIsLoading(true);
    try {
      // Mock password verification - would be API request in real app
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo, check if password matches what's in sessionStorage
      // In a real app, this would be a server-side validation
      const storedPassword = sessionStorage.getItem(`notepad_password_${noteId}`);
      
      if (storedPassword && storedPassword !== submittedPassword) {
        return false; // Incorrect password
      }
      
      // Password correct or note doesn't actually require a password
      sessionStorage.setItem(`notepad_auth_${noteId}`, 'true');
      setIsPasswordPrompt(false);
      
      // Reload the note content now that we're authenticated
      const savedContent = sessionStorage.getItem(`notepad_content_${noteId}`);
      setContent(savedContent || "# Welcome to Developers Garage Notepad!\n\nThis is a **Markdown** editor where you can:\n\n- Create notes\n- Use _formatting_\n- Share with others\n- Protect with password\n\n```javascript\n// You can even add code blocks\nconst hello = 'world';\nconsole.log(hello);\n```\n\n## Code Highlighting\n\nTry some Python code:\n\n```python\ndef hello_world():\n    print('Hello, Developers Garage!')\n    return 42\n\nif __name__ == '__main__':\n    result = hello_world()\n    print(f'The answer is {result}')\n```");
      
      return true;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
    // Copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(noteUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
    // Export note as file
  const exportNote = (format) => {
    let fileContent, fileName, mimeType;
    
    switch(format) {
      case 'md':
        fileContent = content;
        fileName = `note-${noteId}.md`;
        mimeType = 'text/markdown';
        break;
      case 'html':
        // Simple HTML conversion (in a real app, use a proper MD->HTML converter)
        fileContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Note ${noteId}</title>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.6; padding: 2rem; max-width: 800px; margin: 0 auto; }
    pre { background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow-x: auto; }
    code { background: #f5f5f5; padding: 0.2rem 0.4rem; border-radius: 3px; }
    blockquote { border-left: 4px solid #ddd; padding-left: 1rem; margin-left: 0; }
  </style>
</head>
<body>
  <div id="content">
    <!-- Content would be properly converted to HTML in a real implementation -->
    <pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  </div>
  <footer>
    <p><small>Exported from Developers Garage Notepad</small></p>
  </footer>
</body>
</html>`;
        fileName = `note-${noteId}.html`;
        mimeType = 'text/html';
        break;
      case 'txt':
        fileContent = content;
        fileName = `note-${noteId}.txt`;
        mimeType = 'text/plain';
        break;
      default:
        return;
    }
    
    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Share note to social media or via email
  const shareNote = (platform) => {
    const title = "Check out my note on Developers Garage";
    const url = noteUrl;
    let shareUrl;
    
    switch(platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this note I created: ${url}`)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };
  if (isLoading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col className="text-center">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading notepad...</p>
          </Col>
        </Row>
      </Container>
    );
  }
  
  if (isPasswordPrompt) {
    return (
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col>
            <PasswordPrompt onSubmit={verifyPassword} />
          </Col>
        </Row>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col>
            <Alert variant="danger">
              <Alert.Heading>Error</Alert.Heading>
              <p>{error}</p>
              <div className="d-flex justify-content-end">
                <Button 
                  variant="outline-danger" 
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">
            <span role="img" aria-label="notepad">📝</span> Notepad
          </h2>
          
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Your Note URL</h5>
            </Card.Header>
            <Card.Body>              <InputGroup className="mb-3">
                <Form.Control
                  value={noteUrl}
                  readOnly
                />
                <Button 
                  variant="primary" 
                  onClick={copyToClipboard}
                >
                  {isCopied ? 'Copied!' : 'Copy'}
                </Button>
                <Dropdown>                <Dropdown.Toggle variant="secondary" id="dropdown-export">
                    Export
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => exportNote('md')}>Markdown (.md)</Dropdown.Item>
                    <Dropdown.Item onClick={() => exportNote('html')}>HTML (.html)</Dropdown.Item>
                    <Dropdown.Item onClick={() => exportNote('txt')}>Plain Text (.txt)</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                  <Dropdown.Toggle variant="info" id="dropdown-share">
                    Share
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => shareNote('twitter')}>
                      <i className="bi bi-twitter"></i> Twitter
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => shareNote('facebook')}>
                      <i className="bi bi-facebook"></i> Facebook
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => shareNote('linkedin')}>
                      <i className="bi bi-linkedin"></i> LinkedIn
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => shareNote('email')}>
                      <i className="bi bi-envelope"></i> Email
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </InputGroup>
              <div className="d-flex align-items-center">
                {isSaving && (
                  <Spinner 
                    animation="border" 
                    size="sm" 
                    className="me-2" 
                    role="status" 
                    aria-hidden="true"
                  />
                )}
                {savedStatus && (
                  <small className="text-muted">
                    {savedStatus}
                  </small>
                )}
              </div>
            </Card.Body>
          </Card>
          
          <Row>
            <Col lg={4}>
              <PasswordProtect 
                isProtected={isProtected}
                setIsProtected={setIsProtected}
                password={password}
                setPassword={setPassword}
              />
              
              <ExpirationSelector
                expiration={expiration}
                setExpiration={setExpiration}
                customDays={customDays}
                setCustomDays={setCustomDays}
              />
                <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">API Access</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <Button variant="outline-primary" size="sm">
                      API Documentation
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      MCP Connector
                    </Button>
                  </div>
                </Card.Body>
              </Card>
              
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Keyboard Shortcuts</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <table className="table table-sm m-0">
                    <tbody>
                      <tr>
                        <td><code>Ctrl+B</code></td>
                        <td>Bold</td>
                      </tr>
                      <tr>
                        <td><code>Ctrl+I</code></td>
                        <td>Italic</td>
                      </tr>
                      <tr>
                        <td><code>Ctrl+K</code></td>
                        <td>Link</td>
                      </tr>
                      <tr>
                        <td><code>Ctrl+Shift+C</code></td>
                        <td>Code block</td>
                      </tr>
                      <tr>
                        <td><code>Ctrl+Alt+1-6</code></td>
                        <td>Headings</td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={8}>              <Card>
                <Card.Header>
                  <h5 className="mb-0">Markdown Editor</h5>
                </Card.Header>
                <Card.Body>
                  <TextEditor 
                    value={content}
                    onChange={(newContent, newTheme) => {
                      if (newTheme) {
                        setTheme(newTheme);
                      } else {
                        setContent(newContent);
                      }
                    }}
                    theme={theme}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default NotepadPage;
