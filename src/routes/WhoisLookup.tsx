import { useState } from 'react';
import { Search, Globe, Calendar, User, ShieldAlert, Server } from 'lucide-react';
import './WhoisLookup.css';

interface RdapResponse {
  handle?: string;
  ldhName?: string;
  events?: { eventAction: string; eventDate: string }[];
  entities?: any[];
  nameservers?: { ldhName: string }[];
  status?: string[];
}

export default function WhoisLookup() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<RdapResponse | null>(null);

  const fetchWhois = async () => {
    if (!domain) return;
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
    if (!cleanDomain) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      // Usando RDAP (Registration Data Access Protocol) - o sucessor do WHOIS com suporte a JSON e CORS
      const res = await fetch(`https://rdap.org/domain/${cleanDomain}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('Domínio não encontrado ou não registrado.');
        throw new Error('Falha ao consultar o domínio no servidor RDAP.');
      }
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const getEventDate = (action: string) => {
    const ev = data?.events?.find(e => e.eventAction === action);
    return ev ? new Date(ev.eventDate).toLocaleDateString('pt-BR', { dateStyle: 'long' }) : 'Não disponível';
  };

  const getRegistrar = () => {
    const registrar = data?.entities?.find(e => e.roles?.includes('registrar'));
    if (!registrar) return 'Não disponível';
    const name = registrar.vcardArray?.[1]?.find((v: any) => v[0] === 'fn')?.[3];
    return name || registrar.handle || 'Desconhecido';
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>WHOIS / RDAP Lookup</h1>
        <p>Consulte informações públicas de registro de domínios, datas de expiração e nameservers usando o protocolo RDAP.</p>
      </div>

      <div className="whois-content">
        <div className="glass-panel search-box">
          <div className="search-input-wrapper">
            <Globe size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Digite o domínio (ex: google.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchWhois()}
              className="whois-input"
            />
          </div>
          <button className="btn-primary" onClick={fetchWhois} disabled={loading || !domain}>
            <Search size={18} />
            {loading ? 'Buscando...' : 'Consultar'}
          </button>
        </div>

        {error && (
          <div className="error-message glass-panel">
            <ShieldAlert size={20} /> {error}
          </div>
        )}

        {data && (
          <div className="whois-results">
            <div className="whois-header glass-panel">
              <h2>{data.ldhName || domain}</h2>
              <div className="status-tags">
                {data.status?.map(s => (
                  <span key={s} className="status-tag">{s}</span>
                ))}
              </div>
            </div>

            <div className="whois-grid">
              <div className="whois-card glass-panel">
                <div className="card-icon"><Calendar size={24} /></div>
                <div className="card-info">
                  <span className="card-label">Data de Registro</span>
                  <span className="card-value">{getEventDate('registration')}</span>
                </div>
              </div>

              <div className="whois-card glass-panel">
                <div className="card-icon"><Calendar size={24} /></div>
                <div className="card-info">
                  <span className="card-label">Data de Expiração</span>
                  <span className="card-value">{getEventDate('expiration')}</span>
                </div>
              </div>

              <div className="whois-card glass-panel">
                <div className="card-icon"><Calendar size={24} /></div>
                <div className="card-info">
                  <span className="card-label">Última Atualização</span>
                  <span className="card-value">{getEventDate('last changed')}</span>
                </div>
              </div>

              <div className="whois-card glass-panel">
                <div className="card-icon"><User size={24} /></div>
                <div className="card-info">
                  <span className="card-label">Registrar</span>
                  <span className="card-value">{getRegistrar()}</span>
                </div>
              </div>
            </div>

            {data.nameservers && data.nameservers.length > 0 && (
              <div className="whois-ns glass-panel">
                <div className="ns-header">
                  <Server size={20} className="text-accent" />
                  <h3>Nameservers (DNS)</h3>
                </div>
                <ul className="ns-list">
                  {data.nameservers.map((ns, idx) => (
                    <li key={idx}>{ns.ldhName}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="raw-data-hint">
              Os dados são obtidos diretamente via RDAP (Registration Data Access Protocol). Alguns ccTLDs podem não suportar o formato padrão.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
