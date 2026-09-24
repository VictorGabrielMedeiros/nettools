import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import './HashGenerator.css';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const calculateHash = async (text: string, algo: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512') => {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest(algo, msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  useEffect(() => {
    const updateHashes = async () => {
      if (!input) {
        setHashes({});
        return;
      }
      try {
        const [sha1, sha256, sha384, sha512] = await Promise.all([
          calculateHash(input, 'SHA-1'),
          calculateHash(input, 'SHA-256'),
          calculateHash(input, 'SHA-384'),
          calculateHash(input, 'SHA-512'),
        ]);
        setHashes({
          'SHA-1': sha1,
          'SHA-256': sha256,
          'SHA-384': sha384,
          'SHA-512': sha512,
        });
      } catch (e) {
        console.error('Error calculating hash', e);
      }
    };
    updateHashes();
  }, [input]);

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(hash);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Hash Generator</h1>
        <p>Gere hashes seguros nativamente no navegador usando a Web Crypto API (SHA family).</p>
      </div>

      <div className="hash-content">
        <div className="glass-panel input-section">
          <label className="input-label">Texto de Entrada</label>
          <textarea
            className="hash-input"
            placeholder="Digite ou cole o texto aqui para gerar os hashes em tempo real..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="hashes-grid">
          {['SHA-256', 'SHA-512', 'SHA-1', 'SHA-384'].map((algo) => (
            <div key={algo} className="hash-card glass-panel">
              <div className="hash-card-header">
                <span className="hash-algo">{algo}</span>
                <span className="hash-length">{algo === 'SHA-1' ? '40 chars' : algo === 'SHA-256' ? '64 chars' : algo === 'SHA-384' ? '96 chars' : '128 chars'}</span>
              </div>
              <div className="hash-output-wrapper">
                <div className="hash-output">
                  {input ? hashes[algo] : <span className="text-secondary italic">Aguardando entrada...</span>}
                </div>
                <button
                  className="btn-icon copy-hash-btn"
                  onClick={() => input && hashes[algo] && copyToClipboard(hashes[algo])}
                  disabled={!input}
                  title="Copiar Hash"
                >
                  {copied === hashes[algo] ? <Check size={18} className="text-success" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
