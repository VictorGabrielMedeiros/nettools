import { useState } from 'react';
import { Search, AlertTriangle, ExternalLink, Lock } from 'lucide-react';
import './SslChecker.css';

export default function SslChecker() {
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'simulated'>('idle');

  const checkSsl = () => {
    if (!domain) return;
    setStatus('checking');
    
    // Simulate network delay for the UI
    setTimeout(() => {
      setStatus('simulated');
    }, 1500);
  };

  const getCleanDomain = () => {
    return domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>SSL/TLS Checker</h1>
        <p>Verifique o status do certificado SSL/TLS de um domínio.</p>
      </div>

      <div className="ssl-container glass-panel">
        <div className="form-group ssl-search">
          <label htmlFor="domain">Domínio / Hostname</label>
          <div className="search-wrapper">
            <input
              id="domain"
              type="text"
              placeholder="exemplo.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkSsl()}
            />
            <button 
              className="btn-primary" 
              onClick={checkSsl}
              disabled={status === 'checking' || !domain}
            >
              {status === 'checking' ? <span className="loading-spinner" /> : <Search size={18} />}
              Analisar
            </button>
          </div>
        </div>

        {status === 'simulated' && (
          <div className="ssl-results">
            <div className="browser-warning-box">
              <AlertTriangle size={24} className="text-warning" />
              <div className="warning-content">
                <h3>Limitação do Navegador (Segurança CORS)</h3>
                <p>
                  Como o NetTools é uma ferramenta executada 100% no seu navegador por motivos de privacidade,
                  o navegador bloqueia a inspeção direta de certificados SSL de terceiros via JavaScript (CORS e abstração de TLS).
                </p>
                <p>
                  Para obter uma análise profunda e real (Grade A-F, vulnerabilidades, chain), recomendamos o uso do <strong>Qualys SSL Labs</strong>.
                </p>
                <a 
                  href={`https://www.ssllabs.com/ssltest/analyze.html?d=${getCleanDomain()}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-ssllabs"
                >
                  Analisar {getCleanDomain()} no SSL Labs <ExternalLink size={16} />
                </a>
              </div>
            </div>

            <div className="ssl-simulated-info mt-4">
              <div className="info-header">
                <Lock size={20} className="text-success" />
                <h3>O que um verificador SSL avalia?</h3>
              </div>
              <ul className="ssl-checklist">
                <li><strong>Validade:</strong> O certificado está expirado?</li>
                <li><strong>Emissor (CA):</strong> É assinado por uma Autoridade Certificadora confiável (Let's Encrypt, DigiCert, etc)?</li>
                <li><strong>Hostname Match:</strong> O nome no certificado bate com o domínio acessado?</li>
                <li><strong>Cadeia de Confiança:</strong> Todos os certificados intermediários foram fornecidos?</li>
                <li><strong>Protocolos Seguros:</strong> O servidor suporta TLS 1.2 ou 1.3 e rejeita SSLv3/TLS 1.0?</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
