import { useState } from 'react';
import { Copy, CheckCircle2, ArrowRightLeft } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import './JsonFormatter.css'; // Reusing JSON Formatter layout since it's identical (input/output panes)

export default function Base64Encoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const processText = (text: string, currentMode: 'encode' | 'decode') => {
    setInput(text);
    setError('');
    
    if (!text) {
      setOutput('');
      return;
    }

    try {
      if (currentMode === 'encode') {
        // btoa doesn't support UTF-8 directly, need this workaround
        const encoded = btoa(unescape(encodeURIComponent(text)));
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(text)));
        setOutput(decoded);
      }
    } catch (e) {
      setOutput('');
      setError(currentMode === 'encode' ? 'Erro ao codificar texto' : 'String Base64 inválida');
    }
  };

  const handleModeToggle = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    // Swap input and output automatically for convenience
    processText(output, newMode);
  };

  const handleCopy = async () => {
    if (!output) return;
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Base64 Encoder / Decoder</h1>
        <p>Codifique textos em Base64 ou decodifique strings Base64 para texto legível.</p>
      </div>

      <div className="json-container glass-panel">
        <div className="json-toolbar">
          <button className="btn-action" onClick={handleModeToggle}>
            <ArrowRightLeft size={18} /> 
            Modo: <strong>{mode === 'encode' ? 'Codificar (Texto → Base64)' : 'Decodificar (Base64 → Texto)'}</strong>
          </button>
        </div>

        <div className="json-editors">
          <div className="editor-pane">
            <div className="pane-header">
              {mode === 'encode' ? 'Texto' : 'Base64'}
            </div>
            <textarea 
              className="json-textarea" 
              value={input} 
              onChange={e => processText(e.target.value, mode)}
              placeholder={`Cole seu ${mode === 'encode' ? 'texto' : 'Base64'} aqui...`}
              spellCheck={false}
            />
            {error && <div className="json-error-msg">{error}</div>}
          </div>
          
          <div className="editor-pane">
            <div className="pane-header">
              {mode === 'encode' ? 'Base64' : 'Texto'}
              <button className="btn-copy-sm" onClick={handleCopy} disabled={!output}>
                {copied ? <CheckCircle2 size={14} className="text-success" /> : <Copy size={14} />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <textarea 
              className="json-textarea output-area" 
              value={output} 
              readOnly
              placeholder="Resultado aparecerá aqui..."
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
