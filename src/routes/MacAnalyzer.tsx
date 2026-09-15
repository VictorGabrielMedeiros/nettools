import { useState, useEffect } from 'react';
import { Search, Monitor, Copy, Check } from 'lucide-react';
import './MacAnalyzer.css';

// A small hardcoded OUI database for common vendors
const OUI_DB: Record<string, string> = {
  '00:00:0C': 'Cisco Systems, Inc',
  '00:01:42': 'Cisco Systems, Inc',
  '00:0C:29': 'VMware, Inc.',
  '00:50:56': 'VMware, Inc.',
  '00:1A:11': 'Google, Inc.',
  '3C:5A:B4': 'Google, Inc.',
  '00:1A:A0': 'Dell Inc.',
  'F8:DB:88': 'Apple, Inc.',
  '00:1C:B3': 'Apple, Inc.',
  '00:25:9C': 'Cisco Meraki',
  '00:1E:67': 'Intel Corporate',
  '00:24:D7': 'Intel Corporate',
  '00:14:22': 'Dell Inc.',
  '00:04:20': 'Apple, Inc.',
  'FC:FB:FB': 'Cisco Systems, Inc',
  'B8:27:EB': 'Raspberry Pi Foundation',
  'DC:A6:32': 'Raspberry Pi (Trading) Ltd',
  '00:15:5D': 'Microsoft Corporation',
  '00:50:F2': 'Microsoft Corporation',
};

function formatMac(mac: string, format: 'colon' | 'dash' | 'dot' | 'cisco' | 'raw') {
  const raw = mac.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
  if (raw.length !== 12) return mac;

  switch (format) {
    case 'colon':
      return raw.match(/.{1,2}/g)?.join(':') || mac;
    case 'dash':
      return raw.match(/.{1,2}/g)?.join('-') || mac;
    case 'dot':
      return raw.match(/.{1,4}/g)?.join('.') || mac;
    case 'cisco':
      return raw.match(/.{1,4}/g)?.join('.').toLowerCase() || mac;
    case 'raw':
      return raw;
    default:
      return mac;
  }
}

export default function MacAnalyzer() {
  const [inputMac, setInputMac] = useState('');
  const [vendor, setVendor] = useState<string | null>(null);
  const [formats, setFormats] = useState({ colon: '', dash: '', dot: '', cisco: '', raw: '' });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const raw = inputMac.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
    if (raw.length >= 6) {
      const oui = raw.substring(0, 6).match(/.{1,2}/g)?.join(':');
      if (oui && OUI_DB[oui]) {
        setVendor(OUI_DB[oui]);
      } else if (raw.length === 12) {
        setVendor('Fabricante Desconhecido (Não está na base local)');
      } else {
        setVendor(null);
      }
    } else {
      setVendor(null);
    }

    if (raw.length === 12) {
      setFormats({
        colon: formatMac(raw, 'colon'),
        dash: formatMac(raw, 'dash'),
        dot: formatMac(raw, 'dot'),
        cisco: formatMac(raw, 'cisco'),
        raw: formatMac(raw, 'raw')
      });
    } else {
      setFormats({ colon: '', dash: '', dot: '', cisco: '', raw: '' });
    }
  }, [inputMac]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>MAC/OUI Analyzer</h1>
        <p>Identifique o fabricante (OUI) e converta o endereço MAC entre diferentes formatos.</p>
      </div>

      <div className="mac-layout">
        <div className="mac-input-section glass-panel">
          <div className="form-group">
            <label htmlFor="mac">Endereço MAC</label>
            <div className="search-wrapper">
              <input
                id="mac"
                type="text"
                placeholder="Ex: 00:1A:11:xx:xx:xx ou 001a.11xx.xxxx"
                value={inputMac}
                onChange={(e) => setInputMac(e.target.value)}
              />
              <div className="input-icon">
                <Search size={20} className="text-secondary" />
              </div>
            </div>
          </div>

          {vendor && (
            <div className="vendor-result">
              <Monitor size={24} className="text-accent" />
              <div className="vendor-info">
                <span className="vendor-label">Fabricante Identificado:</span>
                <strong className="vendor-name">{vendor}</strong>
              </div>
            </div>
          )}
        </div>

        {formats.raw && (
          <div className="mac-formats glass-panel">
            <h2>Formatos Convertidos</h2>
            <div className="format-list">
              
              <div className="format-item">
                <div className="format-label">Padrão IEEE (Dois pontos)</div>
                <div className="format-value-box">
                  <code>{formats.colon}</code>
                  <button onClick={() => copyToClipboard(formats.colon, 'colon')}>
                    {copiedId === 'colon' ? <Check size={16} className="text-success"/> : <Copy size={16}/>}
                  </button>
                </div>
              </div>

              <div className="format-item">
                <div className="format-label">Padrão Windows (Hífen)</div>
                <div className="format-value-box">
                  <code>{formats.dash}</code>
                  <button onClick={() => copyToClipboard(formats.dash, 'dash')}>
                    {copiedId === 'dash' ? <Check size={16} className="text-success"/> : <Copy size={16}/>}
                  </button>
                </div>
              </div>

              <div className="format-item">
                <div className="format-label">Padrão Cisco / Redes (Ponto)</div>
                <div className="format-value-box">
                  <code>{formats.cisco}</code>
                  <button onClick={() => copyToClipboard(formats.cisco, 'cisco')}>
                    {copiedId === 'cisco' ? <Check size={16} className="text-success"/> : <Copy size={16}/>}
                  </button>
                </div>
              </div>

              <div className="format-item">
                <div className="format-label">Sem formatação (Raw)</div>
                <div className="format-value-box">
                  <code>{formats.raw}</code>
                  <button onClick={() => copyToClipboard(formats.raw, 'raw')}>
                    {copiedId === 'raw' ? <Check size={16} className="text-success"/> : <Copy size={16}/>}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
