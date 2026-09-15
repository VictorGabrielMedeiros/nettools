import { useState } from 'react';
import { Search, AlertTriangle, ExternalLink, Shield } from 'lucide-react';
import './SslChecker.css'; // Reusing layout styles from SSL checker

export default function SecurityHeaders() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'simulated'>('idle');

  const checkHeaders = () => {
    if (!url) return;
    setStatus('checking');
    
    setTimeout(() => {
      setStatus('simulated');
    }, 1500);
  };

  const getCleanUrl = () => {
    let clean = url;
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    return clean;
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Security Headers Analyzer</h1>
        <p>Verifique a presença e configuração dos cabeçalhos HTTP de segurança de um site.</p>
      </div>

      <div className="ssl-container glass-panel">
        <div className="form-group ssl-search">
          <label htmlFor="url">URL do Site</label>
          <div className="search-wrapper">
            <input
              id="url"
              type="text"
              placeholder="https://exemplo.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkHeaders()}
            />
            <button 
              className="btn-primary" 
              onClick={checkHeaders}
              disabled={status === 'checking' || !url}
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
                <h3>Limitação do Navegador (CORS)</h3>
                <p>
                  Por motivos de segurança, navegadores bloqueiam a leitura de cabeçalhos HTTP 
                  de outros sites via scripts (CORS). Como esta aplicação roda localmente, 
                  a verificação direta foi bloqueada pelo seu próprio navegador.
                </p>
                <p>
                  Para uma análise profunda e real dos cabeçalhos (HSTS, CSP, X-Frame-Options), 
                  recomendamos a ferramenta oficial <strong>SecurityHeaders.com</strong>.
                </p>
                <a 
                  href={`https://securityheaders.com/?q=${encodeURIComponent(getCleanUrl())}&hide=on`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-ssllabs"
                  style={{ backgroundColor: '#2d3748' }} // Darker color for SecurityHeaders
                >
                  Analisar no SecurityHeaders.com <ExternalLink size={16} />
                </a>
              </div>
            </div>

            <div className="ssl-simulated-info mt-4">
              <div className="info-header">
                <Shield size={20} className="text-info" />
                <h3>Principais Cabeçalhos de Segurança</h3>
              </div>
              <ul className="ssl-checklist">
                <li>
                  <strong>Strict-Transport-Security (HSTS):</strong> 
                  <span className="text-muted d-block text-small">Força o navegador a usar apenas HTTPS.</span>
                </li>
                <li>
                  <strong>Content-Security-Policy (CSP):</strong>
                  <span className="text-muted d-block text-small">Previne XSS controlando as fontes de conteúdo permitidas.</span>
                </li>
                <li>
                  <strong>X-Frame-Options:</strong>
                  <span className="text-muted d-block text-small">Previne ataques de Clickjacking (impede o site de ser carregado em iframes).</span>
                </li>
                <li>
                  <strong>X-Content-Type-Options:</strong>
                  <span className="text-muted d-block text-small">Evita "MIME-sniffing" (nosniff).</span>
                </li>
                <li>
                  <strong>Referrer-Policy:</strong>
                  <span className="text-muted d-block text-small">Controla quanta informação é enviada no cabeçalho Referer.</span>
                </li>
                <li>
                  <strong>Permissions-Policy:</strong>
                  <span className="text-muted d-block text-small">Controla acesso a recursos do dispositivo (câmera, microfone, etc).</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
