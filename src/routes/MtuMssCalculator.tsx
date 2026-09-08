import { useState, useEffect } from 'react';
import { Copy, CheckCircle2, Info } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import './IPv4Calculator.css'; // Reusing grid and layout

const encapsulations = [
  { id: 'ethernet', name: 'Ethernet', overhead: 0 },
  { id: 'vlan', name: 'VLAN (802.1Q)', overhead: 4 },
  { id: 'pppoe', name: 'PPPoE', overhead: 8 },
  { id: 'pppoe-vlan', name: 'PPPoE + VLAN', overhead: 12 },
  { id: 'gre', name: 'GRE', overhead: 24 },
  { id: 'vxlan', name: 'VXLAN', overhead: 50 },
  { id: 'custom', name: 'Custom', overhead: 0 },
];

export default function MtuMssCalculator() {
  const [mtuInput, setMtuInput] = useState('1500');
  const [encapId, setEncapId] = useState('pppoe');
  const [customOverhead, setCustomOverhead] = useState('0');
  const [results, setResults] = useState<{label: string, value: string, desc?: string}[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const calculateMtuMss = () => {
    const mtu = parseInt(mtuInput, 10);
    if (isNaN(mtu) || mtu < 576) {
      alert("MTU base inválido. O mínimo recomendado é 576.");
      return;
    }

    let overhead = 0;
    if (encapId === 'custom') {
      overhead = parseInt(customOverhead, 10) || 0;
    } else {
      const encap = encapsulations.find(e => e.id === encapId);
      if (encap) overhead = encap.overhead;
    }

    const effectiveMtu = mtu - overhead;
    // IPv4 header = 20 bytes, TCP header = 20 bytes -> MSS = MTU - 40
    const mssIpv4 = effectiveMtu - 40;
    // IPv6 header = 40 bytes, TCP header = 20 bytes -> MSS = MTU - 60
    const mssIpv6 = effectiveMtu - 60;

    setResults([
      { label: 'MTU BASE (ETHERNET)', value: mtu.toString() },
      { label: 'OVERHEAD (BYTES)', value: overhead.toString() },
      { label: 'MTU EFETIVO', value: effectiveMtu.toString() },
      { label: 'TCP MSS IPv4', value: mssIpv4.toString(), desc: 'MTU - 40 bytes' },
      { label: 'TCP MSS IPv6', value: mssIpv6.toString(), desc: 'MTU - 60 bytes' },
    ]);
  };

  useEffect(() => {
    calculateMtuMss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encapId]); // Re-calculate on encap change automatically

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
        <h1>Calculadora de MTU / MSS</h1>
        <p>Calcule o MTU efetivo e o MSS recomendado com base no encapsulamento da rede.</p>
        <div className="info-box glass-panel" style={{ marginTop: '1rem', padding: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Info size={20} className="text-info" style={{ color: 'var(--info)' }} />
          <span style={{ fontSize: '0.875rem' }}>
            Em conexões PPPoE, o MTU normalmente precisa ser reduzido devido ao overhead adicional, prevenindo fragmentação de pacotes e problemas de lentidão.
          </span>
        </div>
      </div>

      <div className="calculator-form glass-panel">
        <div className="form-group">
          <label htmlFor="mtuInput">MTU Base</label>
          <input 
            id="mtuInput"
            type="number" 
            value={mtuInput} 
            onChange={(e) => setMtuInput(e.target.value)} 
            placeholder="Ex: 1500" 
            style={{ width: '150px' }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="encapSelect">Encapsulamento</label>
          <select 
            id="encapSelect" 
            value={encapId} 
            onChange={(e) => setEncapId(e.target.value)}
            style={{ width: '250px' }}
          >
            {encapsulations.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
        {encapId === 'custom' && (
          <div className="form-group">
            <label htmlFor="customOverhead">Overhead (bytes)</label>
            <input 
              id="customOverhead"
              type="number" 
              value={customOverhead} 
              onChange={(e) => setCustomOverhead(e.target.value)} 
              style={{ width: '150px' }}
            />
          </div>
        )}
        <button className="btn-primary" onClick={calculateMtuMss}>Calcular</button>
      </div>

      {results.length > 0 && (
        <div className="results-grid">
          {results.map((res, idx) => (
            <div key={idx} className="result-card glass-panel">
              <span className="result-label">{res.label}</span>
              <span className="result-value">
                {res.value} 
                {res.desc && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.5rem', fontWeight: 'normal' }}>({res.desc})</span>}
              </span>
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
