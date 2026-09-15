import { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import './JwtDecoder.css';

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<any>(null);
  const [payload, setPayload] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token.trim()) {
      setHeader(null);
      setPayload(null);
      setError('');
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Um JWT válido deve conter 3 partes separadas por ponto (Header, Payload, Signature).');
      }

      // Fix base64url encoding
      const decodeBase64Url = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        // Pad with '='
        const padLength = (4 - (base64.length % 4)) % 4;
        base64 += '='.repeat(padLength);
        
        const decoded = atob(base64);
        try {
          return JSON.parse(decodeURIComponent(escape(decoded)));
        } catch (e) {
          return JSON.parse(decoded);
        }
      };

      const decodedHeader = decodeBase64Url(parts[0]);
      const decodedPayload = decodeBase64Url(parts[1]);

      setHeader(decodedHeader);
      setPayload(decodedPayload);
      setError('');
    } catch (err) {
      setHeader(null);
      setPayload(null);
      setError(err instanceof Error ? err.message : 'Token inválido.');
    }
  }, [token]);

  const renderJson = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  const getExpirationStatus = () => {
    if (!payload || !payload.exp) return null;
    
    const expDate = new Date(payload.exp * 1000);
    const isExpired = expDate.getTime() < Date.now();
    
    return {
      date: expDate.toLocaleString(),
      isExpired
    };
  };

  const expStatus = getExpirationStatus();

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>JWT Decoder</h1>
        <p>Decodifique JSON Web Tokens de forma segura, 100% no seu navegador.</p>
      </div>

      <div className="jwt-layout">
        <div className="jwt-input-section glass-panel">
          <h2>Token JWT</h2>
          <textarea
            className="jwt-textarea"
            placeholder="Cole seu token eyJ... aqui"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          {error && (
            <div className="error-text mt-3">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}
        </div>

        <div className="jwt-output-section">
          <div className="jwt-card header-card glass-panel">
            <h2>Header (Cabeçalho)</h2>
            {header ? (
              <pre className="json-block">{renderJson(header)}</pre>
            ) : (
              <div className="empty-state">Aguardando token válido...</div>
            )}
          </div>

          <div className="jwt-card payload-card glass-panel">
            <div className="payload-header">
              <h2>Payload (Dados)</h2>
              {expStatus && (
                <div className={`exp-badge ${expStatus.isExpired ? 'expired' : 'valid'}`}>
                  {expStatus.isExpired ? <AlertTriangle size={14}/> : <ShieldCheck size={14}/>}
                  {expStatus.isExpired ? 'Expirado em ' : 'Expira em '}
                  {expStatus.date}
                </div>
              )}
            </div>
            {payload ? (
              <pre className="json-block">{renderJson(payload)}</pre>
            ) : (
              <div className="empty-state">Aguardando token válido...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
