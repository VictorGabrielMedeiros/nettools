import { useState, useMemo } from 'react';
import './RegexTester.css';

export default function RegexTester() {
  const [regex, setRegex] = useState('[A-Z]\\w+');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('Hello World, this is a Test String with Some Capitalized Words.');
  const [error, setError] = useState('');

  const renderHighlightedText = useMemo(() => {
    setError('');
    if (!regex) return testString;

    try {
      const re = new RegExp(regex, flags);
      const parts = [];
      let lastIndex = 0;
      let match;

      // Handle non-global regex to avoid infinite loop
      const isGlobal = flags.includes('g');

      if (isGlobal) {
        while ((match = re.exec(testString)) !== null) {
          if (match.index === re.lastIndex) {
            re.lastIndex++; // avoid infinite loops with zero-width matches
          }
          parts.push(testString.substring(lastIndex, match.index));
          parts.push(<mark key={match.index} className="regex-match">{match[0]}</mark>);
          lastIndex = match.index + match[0].length;
        }
      } else {
        match = re.exec(testString);
        if (match) {
          parts.push(testString.substring(0, match.index));
          parts.push(<mark key={match.index} className="regex-match">{match[0]}</mark>);
          lastIndex = match.index + match[0].length;
        }
      }

      parts.push(testString.substring(lastIndex));
      return parts.length > 0 ? parts : testString;
    } catch (e: any) {
      setError(e.message || 'Expressão regular inválida');
      return testString;
    }
  }, [regex, flags, testString]);

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Testador Regex</h1>
        <p>Escreva e teste suas expressões regulares em tempo real.</p>
      </div>

      <div className="regex-container glass-panel">
        
        <div className="regex-input-section">
          <div className="regex-wrapper">
            <span className="regex-slash">/</span>
            <input 
              type="text" 
              className="regex-input"
              value={regex} 
              onChange={e => setRegex(e.target.value)}
              placeholder="Expressão Regular"
            />
            <span className="regex-slash">/</span>
            <input 
              type="text" 
              className="regex-flags-input"
              value={flags} 
              onChange={e => setFlags(e.target.value)}
            />
          </div>
          {error && <div className="regex-error">{error}</div>}

          <div className="flags-toggles">
            <label className="checkbox-label">
              <input type="checkbox" checked={flags.includes('g')} onChange={() => toggleFlag('g')} />
              <span>Global (g)</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={flags.includes('i')} onChange={() => toggleFlag('i')} />
              <span>Case Insensitive (i)</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={flags.includes('m')} onChange={() => toggleFlag('m')} />
              <span>Multiline (m)</span>
            </label>
          </div>
        </div>

        <div className="regex-test-section">
          <div className="pane-header">String de Teste</div>
          <div className="regex-test-area">
            <div className="regex-highlighted-bg">
              {renderHighlightedText}
            </div>
            <textarea
              className="regex-test-textarea"
              value={testString}
              onChange={e => setTestString(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
