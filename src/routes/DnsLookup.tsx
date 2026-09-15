import { useState } from 'react';
import { Search, ShieldAlert, Globe } from 'lucide-react';
import './DnsLookup.css';

interface DnsAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

interface DnsResponse {
  Status: number;
  TC: boolean;
  RD: boolean;
  RA: boolean;
  AD: boolean;
  CD: boolean;
  Question: { name: string; type: number }[];
  Answer?: DnsAnswer[];
  Authority?: DnsAnswer[];
}

const RECORD_TYPES = [
  { value: 'A', label: 'A (IPv4)' },
  { value: 'AAAA', label: 'AAAA (IPv6)' },
  { value: 'MX', label: 'MX (Mail)' },
  { value: 'TXT', label: 'TXT (Text)' },
  { value: 'CNAME', label: 'CNAME (Alias)' },
  { value: 'NS', label: 'NS (Name Server)' },
  { value: 'SOA', label: 'SOA (Start of Authority)' }
];

export default function DnsLookup() {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DnsResponse | null>(null);
  const [error, setError] = useState('');

  const lookupDns = async () => {
    if (!domain) {
      setError('Por favor, informe um domínio.');
      return;
    }
    
    // Clean domain
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Usando Google DNS-over-HTTPS API (suporta CORS)
      const response = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=${recordType}`);
      
      if (!response.ok) {
        throw new Error('Falha ao consultar DNS.');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>DNS Lookup</h1>
        <p>Consulte registros DNS públicos utilizando DNS-over-HTTPS (DoH).</p>
      </div>

      <div className="dns-form glass-panel">
        <div className="form-group domain-group">
          <label htmlFor="domain">Domínio</label>
          <input
            id="domain"
            type="text"
            placeholder="exemplo.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && lookupDns()}
          />
        </div>
        
        <div className="form-group type-group">
          <label htmlFor="recordType">Tipo de Registro</label>
          <select
            id="recordType"
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
          >
            {RECORD_TYPES.map(rt => (
              <option key={rt.value} value={rt.value}>{rt.label}</option>
            ))}
          </select>
        </div>

        <button 
          className="btn-primary" 
          onClick={lookupDns}
          disabled={loading}
        >
          {loading ? <span className="loading-spinner" /> : <Search size={18} />}
          Consultar
        </button>
      </div>

      {error && (
        <div className="error-alert glass-panel">
          <ShieldAlert size={20} />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="dns-results">
          {result.Status !== 0 ? (
            <div className="error-alert glass-panel">
              <ShieldAlert size={20} />
              <span>Domínio não encontrado ou erro de resolução (Status: {result.Status}).</span>
            </div>
          ) : (
            <div className="results-card glass-panel">
              <div className="results-header">
                <h2>Resultados para {domain}</h2>
                <Globe size={20} className="text-secondary" />
              </div>
              
              {!result.Answer || result.Answer.length === 0 ? (
                <p className="no-records">Nenhum registro do tipo {recordType} encontrado para este domínio.</p>
              ) : (
                <div className="table-responsive">
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>TTL</th>
                        <th>Dados</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.Answer.map((ans, idx) => (
                        <tr key={idx}>
                          <td>{ans.name}</td>
                          <td>{ans.TTL}s</td>
                          <td className="record-data">{ans.data}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
