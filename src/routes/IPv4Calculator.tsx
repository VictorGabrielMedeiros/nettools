import { useState, useEffect } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { calculateSubnet, parseIpAndCidr } from '../utils/ipUtils';
import { copyToClipboard } from '../utils/clipboard';
import './IPv4Calculator.css';

interface CalcResult {
  label: string;
  value: string | number;
}

export default function IPv4Calculator() {
  const [ipInput, setIpInput] = useState('192.168.10.0');
  const [cidrInput, setCidrInput] = useState('24');
  const [results, setResults] = useState<CalcResult[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCalculate = () => {
    // Check if user typed IP/CIDR in the IP field
    let ip = ipInput;
    let cidr = parseInt(cidrInput, 10);

    const parsed = parseIpAndCidr(ipInput);
    if (parsed) {
      ip = parsed.ip;
      if (ipInput.includes('/')) {
        cidr = parsed.cidr;
        setCidrInput(cidr.toString());
      }
    } else {
      alert("Endereço IP inválido.");
      return;
    }

    if (isNaN(cidr) || cidr < 0 || cidr > 32) {
      alert("CIDR inválido. Use um valor de 0 a 32.");
      return;
    }

    const data = calculateSubnet(ip, cidr);
    
    setResults([
      { label: 'NETWORK', value: data.network },
      { label: 'SUBNET MASK', value: data.mask },
      { label: 'CIDR', value: `/${data.cidr}` },
      { label: 'WILDCARD MASK', value: data.wildcard },
      { label: 'BROADCAST', value: data.broadcast },
      { label: 'FIRST HOST', value: data.firstHost },
      { label: 'LAST HOST', value: data.lastHost },
      { label: 'TOTAL ADDRESSES', value: data.numAddresses.toLocaleString() },
      { label: 'USABLE HOSTS', value: data.usableHosts.toLocaleString() },
      { label: 'IP CLASS', value: data.ipClass },
      { label: 'ADDRESS TYPE', value: data.isPrivate ? 'Private' : 'Public' },
      { label: 'BINARY NOTATION', value: data.binary }
    ]);
  };

  useEffect(() => {
    handleCalculate();
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
        <h1>Calculadora IPv4</h1>
        <p>Calcule sub-redes, faixas de IPs, máscaras e broadcasts.</p>
      </div>

      <div className="calculator-form glass-panel">
        <div className="form-group">
          <label htmlFor="ipInput">Endereço IPv4 (pode incluir /CIDR)</label>
          <input 
            id="ipInput"
            type="text" 
            value={ipInput} 
            onChange={(e) => setIpInput(e.target.value)} 
            placeholder="Ex: 192.168.10.0 ou 192.168.10.50/24" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="cidrInput">CIDR</label>
          <div className="cidr-input-wrapper">
            <span className="slash">/</span>
            <input 
              id="cidrInput"
              type="number" 
              min="0" max="32" 
              value={cidrInput} 
              onChange={(e) => setCidrInput(e.target.value)} 
            />
          </div>
        </div>
        <button className="btn-primary" onClick={handleCalculate}>Calcular</button>
      </div>

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
