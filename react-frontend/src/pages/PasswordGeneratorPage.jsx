import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Button, Form, ProgressBar, Row, Col, ListGroup, Tooltip, OverlayTrigger } from 'react-bootstrap';

// Character sets for password generation
const CHARS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?'
};

// Ambiguous characters to exclude
const AMBIGUOUS_CHARS = 'O0lI1';

function PasswordGeneratorPage() {
  // Password configuration state
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [ensureMinimum, setEnsureMinimum] = useState(true);
  const [generatePronounceable, setGeneratePronounceable] = useState(false);
  
  // Password and history state
  const [password, setPassword] = useState('');
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(Array(5).fill(false));
  
  // Password strength metrics
  const [strength, setStrength] = useState({ score: 0, label: '', color: '' });
  const [crackTime, setCrackTime] = useState('');
  
  // Generate password function (memoized to avoid recreating on every render)
  const generatePassword = useCallback(() => {
    // Ensure at least one character set is selected
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      return '';
    }

    if (generatePronounceable) {
      return generatePronounceablePassword();
    }
    
    // Build character pool based on selected options
    let charPool = '';
    if (includeUppercase) charPool += CHARS.uppercase;
    if (includeLowercase) charPool += CHARS.lowercase;
    if (includeNumbers) charPool += CHARS.numbers;
    if (includeSymbols) charPool += CHARS.symbols;
    
    // Remove ambiguous characters if option selected
    if (excludeAmbiguous) {
      for (const char of AMBIGUOUS_CHARS) {
        charPool = charPool.replace(new RegExp(char, 'g'), '');
      }
    }
    
    if (charPool.length === 0) return '';
    
    // Basic random password generation
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charPool.charAt(array[i] % charPool.length);
    }
    
    // Ensure minimum requirements if option is selected
    if (ensureMinimum) {
      let satisfied = true;
      
      if (includeUppercase && !/[A-Z]/.test(result)) satisfied = false;
      if (includeLowercase && !/[a-z]/.test(result)) satisfied = false;
      if (includeNumbers && !/[0-9]/.test(result)) satisfied = false;
      if (includeSymbols && !/[!@#$%^&*()-_=+[\]{}|;:,.<>?]/.test(result)) satisfied = false;
      
      // If requirements not met, generate again
      if (!satisfied) return generatePassword();
    }
    
    return result;
  }, [
    length, includeUppercase, includeLowercase, includeNumbers, includeSymbols,
    excludeAmbiguous, ensureMinimum, generatePronounceable
  ]);
  
  // Simple pronounceable password generator
  const generatePronounceablePassword = () => {
    const vowels = 'aeiouy';
    const consonants = 'bcdfghjklmnpqrstvwxz';
    const numbers = includeNumbers ? '0123456789' : '';
    const symbols = includeSymbols ? '!@#$%&*' : '';
    
    let result = '';
    let i = 0;
    
    while (result.length < length) {
      // Pattern: consonant + vowel + (optional number or symbol)
      if (i % 2 === 0) {
        const randomConsonant = consonants.charAt(Math.floor(Math.random() * consonants.length));
        result += includeUppercase && Math.random() > 0.7 ? randomConsonant.toUpperCase() : randomConsonant;
      } else {
        result += vowels.charAt(Math.floor(Math.random() * vowels.length));
        
        // Occasionally add a number or symbol
        if ((includeNumbers || includeSymbols) && Math.random() > 0.7 && result.length < length - 1) {
          const extraChars = (includeNumbers ? numbers : '') + (includeSymbols ? symbols : '');
          if (extraChars.length > 0) {
            result += extraChars.charAt(Math.floor(Math.random() * extraChars.length));
          }
        }
      }
      i++;
    }
    
    // Trim to exact length
    return result.substring(0, length);
  };
  
  // Calculate password strength
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'secondary' };
    
    // Count character types used
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[^A-Za-z0-9]/.test(pwd);
    const charTypesCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
    
    // Base score from length and character types
    let score = Math.min(pwd.length / 8, 1) * 100 * 0.5 + (charTypesCount / 4) * 100 * 0.5;
    score = Math.min(100, score);
    
    // Determine label and color
    let label, color;
    if (score < 40) {
      label = 'Weak';
      color = 'danger';
    } else if (score < 60) {
      label = 'Medium';
      color = 'warning';
    } else if (score < 80) {
      label = 'Strong';
      color = 'info';
    } else {
      label = 'Very Strong';
      color = 'success';
    }
    
    // Estimate crack time based on entropy
    const entropy = pwd.length * Math.log2(
      (hasLower ? 26 : 0) + 
      (hasUpper ? 26 : 0) + 
      (hasNumber ? 10 : 0) + 
      (hasSymbol ? 33 : 0)
    );
    
    let crackTimeText;
    if (entropy < 40) {
      crackTimeText = 'seconds to minutes';
    } else if (entropy < 60) {
      crackTimeText = 'hours to days';
    } else if (entropy < 80) {
      crackTimeText = 'months to years';
    } else if (entropy < 100) {
      crackTimeText = 'decades';
    } else {
      crackTimeText = 'centuries';
    }
    
    setCrackTime(`~${crackTimeText} using current technology`);
    
    return { score, label, color };
  };
    // Generate password effect
  useEffect(() => {
    const newPassword = generatePassword();
    setPassword(newPassword);
    
    // Calculate strength
    setStrength(calculateStrength(newPassword));
    
    // Don't add empty passwords to history
    if (newPassword) {
      setPasswordHistory(prev => {
        const updated = [newPassword, ...prev.slice(0, 4)]; // Keep only the last 5 passwords
        return updated;
      });
      setShowHistory(Array(5).fill(true)); // Make all history items visible by default
    }
  }, [
    length, includeUppercase, includeLowercase, includeNumbers, includeSymbols,
    excludeAmbiguous, ensureMinimum, generatePronounceable, generatePassword
  ]);
    // Copy password to clipboard
  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      // Add toast notification here in a real app
      alert('Password copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy password', err);
    }
  };
  
  // Initialize state
  useEffect(() => {
    // Set all history items as visible by default when component mounts
    setShowHistory(Array(5).fill(true));
  }, []);
    // Toggle password history visibility
  const togglePasswordVisibility = (index) => {
    setShowHistory(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  // Generate a new password (manual trigger)
  const handleGenerateClick = () => {
    const newPassword = generatePassword();
    setPassword(newPassword);
    setStrength(calculateStrength(newPassword));
    setPasswordHistory(prev => [newPassword, ...prev.slice(0, 4)]);
    // Initialize all history items as visible
    setShowHistory(Array(5).fill(true));
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">🔑 Password Generator</h1>
      
      {/* Generated Password Card */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>Generated Password</Card.Title>
          <div className="d-flex align-items-center mb-3">
            <code className="bg-light p-3 rounded border fs-4 flex-grow-1">
              {password}
            </code>
            <Button 
              variant="primary" 
              onClick={copyPassword}
              className="ms-3"
            >
              Copy
            </Button>
          </div>
          
          <div className="mb-2">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span>Password Strength:</span>
              <span className={`text-${strength.color}`}>{strength.label}</span>
            </div>
            <ProgressBar 
              variant={strength.color} 
              now={strength.score} 
              className="mb-2" 
              style={{ height: '0.5rem' }}
            />
            <small className="text-muted">Estimated crack time: {crackTime}</small>
          </div>
        </Card.Body>
      </Card>
      
      {/* Password Settings Card */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>Password Settings</Card.Title>
          
          <Form>
            {/* Length Slider */}
            <Form.Group className="mb-4" controlId="passwordLength">
              <Form.Label>Length: {length} characters</Form.Label>
              <div className="d-flex align-items-center">
                <span className="me-2">8</span>
                <Form.Range 
                  min={8}
                  max={64}
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="flex-grow-1"
                />
                <span className="ms-2">64</span>
              </div>
            </Form.Group>
            
            {/* Character Sets */}
            <Form.Group className="mb-4">
              <Form.Label>Include Characters:</Form.Label>
              <div className="ms-2">
                <Form.Check 
                  type="checkbox" 
                  id="uppercase"
                  label="Uppercase (A-Z)"
                  checked={includeUppercase}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    setIncludeUppercase(newValue);
                    // Ensure at least one option is selected
                    if (!newValue && !includeLowercase && !includeNumbers && !includeSymbols) {
                      setIncludeLowercase(true);
                    }
                  }}
                  className="mb-2"
                />
                <Form.Check 
                  type="checkbox" 
                  id="lowercase"
                  label="Lowercase (a-z)"
                  checked={includeLowercase}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    setIncludeLowercase(newValue);
                    if (!newValue && !includeUppercase && !includeNumbers && !includeSymbols) {
                      setIncludeUppercase(true);
                    }
                  }}
                  className="mb-2"
                />
                <Form.Check 
                  type="checkbox" 
                  id="numbers"
                  label="Numbers (0-9)"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="mb-2"
                />
                <Form.Check 
                  type="checkbox" 
                  id="symbols"
                  label="Symbols (!@#$%^&*)"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                />
              </div>
            </Form.Group>
            
            {/* Advanced Options */}
            <Form.Group className="mb-4">
              <Form.Label>Advanced Options:</Form.Label>
              <div className="ms-2">
                <Form.Check 
                  type="checkbox" 
                  id="excludeAmbiguous"
                  label="Exclude ambiguous characters (O, 0, l, I, 1)"
                  checked={excludeAmbiguous}
                  onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                  className="mb-2"
                />
                <Form.Check 
                  type="checkbox" 
                  id="ensureMinimum"
                  label="Ensure at least one character from each selected set"
                  checked={ensureMinimum}
                  onChange={(e) => setEnsureMinimum(e.target.checked)}
                  className="mb-2"
                />
                <Form.Check 
                  type="checkbox" 
                  id="pronounceable"
                  label="Generate pronounceable password (may be less secure)"
                  checked={generatePronounceable}
                  onChange={(e) => setGeneratePronounceable(e.target.checked)}
                />
              </div>
            </Form.Group>
            
            {/* Generate Button */}
            <div className="d-flex justify-content-end">
              <Button 
                variant="success" 
                onClick={handleGenerateClick}
                className="px-4"
              >
                Generate New Password
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      
      {/* Password History Card */}
      {passwordHistory.length > 0 && (
        <Card className="shadow-sm">
          <Card.Body>            <Card.Title>Recently Generated</Card.Title>
            <Card.Subtitle className="mb-3 text-muted">Recent passwords - click "Copy" to use any previous password</Card.Subtitle>
              <ListGroup variant="flush">
              {passwordHistory.map((pwd, index) => (
                pwd ? (
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    <code className="bg-light py-1 px-2 rounded flex-grow-1">
                      {pwd}
                    </code>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      className="ms-2"
                      onClick={() => {
                        navigator.clipboard.writeText(pwd);
                        alert('Password copied to clipboard!');
                      }}
                    >
                      Copy
                    </Button>
                  </ListGroup.Item>
                ) : null
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}
      
      {/* Security Note */}
      <div className="mt-4 border-top pt-4">
        <h5>Security Note</h5>
        <p className="text-muted small">
          All password generation occurs entirely within your browser. 
          No passwords are transmitted over the network or stored on our servers.
          We recommend using unique passwords for each service and considering 
          a password manager for secure storage.
        </p>
      </div>
    </Container>
  );
}

export default PasswordGeneratorPage;
