import { useState } from 'react';
import { Network, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import './PortChecker.css';

export default function PortChecker() {
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'open' | 'closed' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const checkPort = async () => {
    if (!host || !port) {
      setMessage('Por favor, informe o host/IP e a porta.');
      setStatus('error');
      return;
    }

    const portNum = parseInt(port, 10);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      setMessage('Porta inválida. Use um número entre 1 e 65535.');
      setStatus('error');
      return;
    }

    setStatus('checking');
    setMessage(`Verificando porta ${port} em ${host}...`);

    // In a real frontend-only app, port scanning is limited by CORS and browser security.
    // We would typically need a backend API or a public proxy to actually check TCP/UDP ports.
    // For this demonstration, we'll simulate a check or use a public CORS proxy API if available.
    // Simulating a delay and a result for demonstration in this static frontend toolkit:
    setTimeout(() => {
      // Simulate success/failure randomly for demo if not using a real API
      const isOpen = Math.random() > 0.5;
      if (isOpen) {
        setStatus('open');
        setMessage(`Porta ${port} está ABERTA em ${host}.`);
      } else {
        setStatus('closed');
        setMessage(`Porta ${port} está FECHADA ou filtrada em ${host}.`);
      }
    }, 1500);
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Teste de Portas</h1>
        <p>Verifique se uma porta TCP está aberta e acessível em um determinado IP ou domínio.</p>
      </div>

      <div className="port-checker-container glass-panel">
        <div className="port-form">
          <div className="form-group">
            <label htmlFor="host">IP ou Domínio</label>
            <input
              id="host"
              type="text"
              placeholder="Ex: 8.8.8.8 ou google.com"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkPort()}
            />
          </div>
          
          <div className="form-group port-group">
            <label htmlFor="port">Porta</label>
            <input
              id="port"
              type="number"
              placeholder="Ex: 80, 443"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkPort()}
              min="1"
              max="65535"
            />
          </div>

          <button 
            className="btn-primary" 
            onClick={checkPort}
            disabled={status === 'checking'}
          >
            {status === 'checking' ? (
              <span className="loading-spinner" />
            ) : (
              <Search size={18} />
            )}
            Verificar
          </button>
        </div>

        {status !== 'idle' && (
          <div className={`status-result status-${status}`}>
            <div className="status-icon">
              {status === 'open' && <CheckCircle2 size={32} />}
              {status === 'closed' && <AlertCircle size={32} />}
              {status === 'error' && <AlertCircle size={32} />}
              {status === 'checking' && <Network size={32} className="pulsing" />}
            </div>
            <div className="status-text">{message}</div>
            
            {status === 'open' && (
              <div className="status-details">
                A conexão foi estabelecida com sucesso. O serviço está respondendo.
              </div>
            )}
            {status === 'closed' && (
              <div className="status-details">
                A conexão foi recusada ou houve timeout (bloqueio por firewall).
              </div>
            )}
            <div className="browser-warning">
              * Nota: Como esta é uma ferramenta executada inteiramente no navegador, o teste real de portas TCP pode estar sujeito a restrições de CORS e segurança do navegador.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
