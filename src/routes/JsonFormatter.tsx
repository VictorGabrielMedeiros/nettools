import { useState } from 'react';
import { Copy, CheckCircle2, FileJson, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import './JsonFormatter.css';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setStatus('valid');
      setErrorMessage('');
    } catch (e: any) {
      setStatus('invalid');
      setErrorMessage(e.message || 'JSON inválido');
    }
  };

  const minifyJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setStatus('valid');
      setErrorMessage('');
    } catch (e: any) {
      setStatus('invalid');
      setErrorMessage(e.message || 'JSON inválido');
    }
  };

  const validateJson = () => {
    if (!input.trim()) {
      setStatus('idle');
      return;
    }
    try {
      JSON.parse(input);
      setStatus('valid');
      setErrorMessage('JSON válido!');
    } catch (e: any) {
      setStatus('invalid');
      setErrorMessage(e.message || 'JSON inválido');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setStatus('idle');
    setErrorMessage('');
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
        <h1>Formatador e Validador JSON</h1>
        <p>Formate, minifique e valide strings JSON localmente.</p>
      </div>

      <div className="json-container glass-panel">
        <div className="json-toolbar">
          <button className="btn-action" onClick={formatJson}><FileJson size={18} /> Formatar</button>
          <button className="btn-action" onClick={minifyJson}><FileJson size={18} /> Minificar</button>
          <button className="btn-action" onClick={validateJson}><CheckCircle size={18} /> Validar</button>
          <button className="btn-action text-error" onClick={clearAll}><Trash2 size={18} /> Limpar</button>
          
          <div className="spacer"></div>
          
          {status === 'valid' && (
            <div className="status-badge success">
              <CheckCircle size={16} /> Válido
            </div>
          )}
          {status === 'invalid' && (
            <div className="status-badge error" title={errorMessage}>
              <AlertTriangle size={16} /> Inválido
            </div>
          )}
        </div>

        <div className="json-editors">
          <div className="editor-pane">
            <div className="pane-header">Entrada</div>
            <textarea 
              className="json-textarea" 
              value={input} 
              onChange={e => {
                setInput(e.target.value);
                setStatus('idle');
              }}
              placeholder="Cole seu JSON aqui..."
              spellCheck={false}
            />
            {status === 'invalid' && errorMessage && (
              <div className="json-error-msg">{errorMessage}</div>
            )}
          </div>
          
          <div className="editor-pane">
            <div className="pane-header">
              Saída
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
