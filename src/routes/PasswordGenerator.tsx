import { useState, useEffect } from 'react';
import { Copy, CheckCircle2, RefreshCw } from 'lucide-react';
import { generatePassword, calculatePasswordStrength } from '../utils/passwordUtils';
import type { PasswordOptions } from '../utils/passwordUtils';
import { copyToClipboard } from '../utils/clipboard';
import './PasswordGenerator.css';

export default function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('');
  const [copied, setCopied] = useState(false);

  const updatePassword = () => {
    const newPass = generatePassword(options);
    setPassword(newPass);
    setStrength(calculatePasswordStrength(newPass));
  };

  useEffect(() => {
    updatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const handleCopy = async () => {
    if (!password) return;
    const success = await copyToClipboard(password);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 'Fraca': return 'var(--error)';
      case 'Média': return 'var(--warning)';
      case 'Forte': return 'var(--info)';
      case 'Muito Forte': return 'var(--success)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Gerador de Senhas Seguras</h1>
        <p>Gere senhas fortes localmente no seu navegador. Nenhuma senha é enviada para servidores.</p>
      </div>

      <div className="password-container glass-panel">
        <div className="password-display">
          <input 
            type="text" 
            value={password} 
            readOnly 
            className="password-input"
          />
          <button className="btn-icon" onClick={updatePassword} aria-label="Gerar nova senha">
            <RefreshCw size={24} />
          </button>
          <button className="btn-icon" onClick={handleCopy} aria-label="Copiar senha">
            {copied ? <CheckCircle2 size={24} className="text-success" /> : <Copy size={24} />}
          </button>
        </div>

        <div className="strength-indicator">
          <span className="strength-label">Força: </span>
          <span className="strength-value" style={{ color: getStrengthColor() }}>
            {strength}
          </span>
        </div>

        <div className="options-grid">
          <div className="form-group length-group">
            <label htmlFor="passLength">Tamanho: {options.length}</label>
            <input 
              id="passLength"
              type="range" 
              min="8" max="64" 
              value={options.length} 
              onChange={e => setOptions({...options, length: parseInt(e.target.value)})}
            />
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={options.uppercase} 
                onChange={e => setOptions({...options, uppercase: e.target.checked})}
              />
              Letras Maiúsculas (A-Z)
            </label>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={options.lowercase} 
                onChange={e => setOptions({...options, lowercase: e.target.checked})}
              />
              Letras Minúsculas (a-z)
            </label>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={options.numbers} 
                onChange={e => setOptions({...options, numbers: e.target.checked})}
              />
              Números (0-9)
            </label>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={options.symbols} 
                onChange={e => setOptions({...options, symbols: e.target.checked})}
              />
              Símbolos (!@#$%)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
