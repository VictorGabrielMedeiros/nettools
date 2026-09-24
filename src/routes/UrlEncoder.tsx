import { useState } from 'react';
import { Check, Copy, ArrowDownUp } from 'lucide-react';
import './UrlEncoder.css';

export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const handleProcess = (text: string, currentMode: 'encode' | 'decode') => {
    setInput(text);
    try {
      if (currentMode === 'encode') {
        setOutput(encodeURIComponent(text));
      } else {
        setOutput(decodeURIComponent(text));
      }
    } catch (e) {
      setOutput('Erro: String mal formatada para decodificação.');
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    // Swap input and output
    handleProcess(output, newMode);
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>URL Encoder / Decoder</h1>
        <p>Codifique ou decodifique strings com caracteres especiais para uso seguro em URLs e requisições HTTP.</p>
      </div>

      <div className="url-content">
        <div className="glass-panel url-box">
          <div className="url-box-header">
            <h3>Entrada ({mode === 'encode' ? 'Texto Puro' : 'URL Encoded'})</h3>
            <div className="mode-switch">
              <span className={mode === 'encode' ? 'active' : ''}>Encode</span>
              <button className="btn-icon swap-btn" onClick={toggleMode} title="Inverter Modo">
                <ArrowDownUp size={18} />
              </button>
              <span className={mode === 'decode' ? 'active' : ''}>Decode</span>
            </div>
          </div>
          <textarea
            className="url-textarea"
            placeholder={mode === 'encode' ? 'Digite o texto puro aqui...' : 'Digite a string %encoded aqui...'}
            value={input}
            onChange={(e) => handleProcess(e.target.value, mode)}
          />
        </div>

        <div className="glass-panel url-box">
          <div className="url-box-header">
            <h3>Saída ({mode === 'encode' ? 'URL Encoded' : 'Texto Puro'})</h3>
            <button className="btn-icon copy-btn" onClick={copyToClipboard} disabled={!output || output.startsWith('Erro')}>
              {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <textarea
            className={`url-textarea output-area ${output.startsWith('Erro') ? 'text-error' : ''}`}
            readOnly
            value={output}
            placeholder="O resultado aparecerá aqui..."
          />
        </div>
      </div>
    </div>
  );
}
