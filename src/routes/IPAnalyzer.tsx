import { useState, useEffect } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { calculateSubnet } from '../utils/ipUtils';
import { copyToClipboard } from '../utils/clipboard';
import './IPv4Calculator.css'; // Reusing the same grid layout

export default function IPAnalyzer() {
  const [ipInput, setIpInput] = useState('192.168.1.1');
  const [results, setResults] = useState<{label: string, value: string}[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  const analyzeIp = () => {
    setError('');
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ipInput.trim())) {
      setError('Endereço IP inválido.');
      setResults([]);
      return;
    }

    const data = calculateSubnet(ipInput.trim(), 32); // Using /32 to just get the IP properties
    
    // Additional properties
    const octets = ipInput.trim().split('.').map(n => parseInt(n, 10));
    const firstOctet = octets[0];
    
    let isLoopback = firstOctet === 127;
    let isLinkLocal = firstOctet === 169 && octets[1] === 254;
    let isMulticast = firstOctet >= 224 && firstOctet <= 239;
    let isBroadcast = ipInput.trim() === '255.255.255.255';
    
    let type = 'Public';
    if (data.isPrivate) type = 'Private';
    if (isLoopback) type = 'Loopback';
    if (isLinkLocal) type = 'Link-Local';
    if (isMulticast) type = 'Multicast';
    if (isBroadcast) type = 'Broadcast';

    const hex = octets.map(o => o.toString(16).padStart(2, '0')).join('.');
    const reverse = [...octets].reverse().join('.').concat('.in-addr.arpa');

    const decimalLong = (octets[0] * 16777216) + (octets[1] * 65536) + (octets[2] * 256) + octets[3];

    setResults([
      { label: 'STATUS', value: 'Válido' },
      { label: 'TIPO DE ENDEREÇO', value: type },
      { label: 'CLASSE HISTÓRICA', value: data.ipClass },
      { label: 'NOTAÇÃO DECIMAL', value: decimalLong.toString() },
      { label: 'BINÁRIO', value: data.binary },
      { label: 'HEXADECIMAL', value: hex },
      { label: 'REVERSE DNS NOTATION', value: reverse },
    ]);
  };

  useEffect(() => {
    analyzeIp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = async (text: string, index: number) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Analisador de IP</h1>
        <p>Obtenha informações detalhadas sobre um endereço IPv4.</p>
      </div>

      <div className="calculator-form glass-panel">
        <div className="form-group">
          <label htmlFor="ipInput">Endereço IPv4</label>
          <input 
            id="ipInput"
            type="text" 
            value={ipInput} 
            onChange={(e) => setIpInput(e.target.value)} 
            placeholder="Ex: 192.168.1.1" 
          />
        </div>
        <button className="btn-primary" onClick={analyzeIp}>Analisar</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {results.length > 0 && (
        <div className="results-grid">
          {results.map((res, idx) => (
            <div key={idx} className="result-card glass-panel">
              <span className="result-label">{res.label}</span>
              <span className="result-value">{res.value}</span>
              <button 
                className="btn-copy" 
                onClick={() => handleCopy(res.value.toString(), idx)}
                aria-label={`Copiar ${res.label}`}
              >
                {copiedIndex === idx ? (
                  <><CheckCircle2 size={16} className="text-success" /> Copiado!</>
                ) : (
                  <><Copy size={16} /> Copiar</>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
