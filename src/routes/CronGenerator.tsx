import { useState, useEffect } from 'react';
import { Calendar, Copy, Check } from 'lucide-react';
import './CronGenerator.css';

// Very basic cron-to-text converter for the most common patterns
function translateCron(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return 'Expressão inválida (precisa ter 5 partes)';

  const [min, hour, dom, mon, dow] = parts;
  
  if (cron === '* * * * *') return 'A cada minuto';
  if (min !== '*' && hour === '*' && dom === '*' && mon === '*' && dow === '*') {
    if (min.startsWith('*/')) return `A cada ${min.replace('*/', '')} minutos`;
    return `No minuto ${min} de cada hora`;
  }
  if (min === '0' && hour !== '*' && dom === '*' && mon === '*' && dow === '*') {
    if (hour.startsWith('*/')) return `A cada ${hour.replace('*/', '')} horas`;
    return `Todo dia às ${hour.padStart(2, '0')}:00`;
  }
  if (min !== '*' && hour !== '*' && dom === '*' && mon === '*' && dow === '*') {
    return `Todo dia às ${hour.padStart(2, '0')}:${min.padStart(2, '0')}`;
  }

  return 'Tradução customizada (expressão complexa)';
}

export default function CronGenerator() {
  const [min, setMin] = useState('*');
  const [hour, setHour] = useState('*');
  const [dom, setDom] = useState('*');
  const [mon, setMon] = useState('*');
  const [dow, setDow] = useState('*');

  const [cronExpr, setCronExpr] = useState('* * * * *');
  const [translation, setTranslation] = useState('A cada minuto');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const expr = `${min} ${hour} ${dom} ${mon} ${dow}`;
    setCronExpr(expr);
    setTranslation(translateCron(expr));
  }, [min, hour, dom, mon, dow]);

  const copyCommand = () => {
    navigator.clipboard.writeText(cronExpr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: 'A cada minuto', val: ['*', '*', '*', '*', '*'] },
    { label: 'A cada 5 minutos', val: ['*/5', '*', '*', '*', '*'] },
    { label: 'A cada hora', val: ['0', '*', '*', '*', '*'] },
    { label: 'Todo dia às 00:00', val: ['0', '0', '*', '*', '*'] },
    { label: 'Toda Segunda às 08:00', val: ['0', '8', '*', '*', '1'] },
  ];

  const applyPreset = (val: string[]) => {
    setMin(val[0]); setHour(val[1]); setDom(val[2]); setMon(val[3]); setDow(val[4]);
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Cron Generator</h1>
        <p>Gere e entenda expressões Cron para agendamento de tarefas.</p>
      </div>

      <div className="cron-layout">
        <div className="cron-builder glass-panel">
          <h2>Construtor de Expressão</h2>
          
          <div className="cron-inputs">
            <div className="form-group">
              <label>Minuto (0-59)</label>
              <input type="text" value={min} onChange={e => setMin(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Hora (0-23)</label>
              <input type="text" value={hour} onChange={e => setHour(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Dia do Mês (1-31)</label>
              <input type="text" value={dom} onChange={e => setDom(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Mês (1-12)</label>
              <input type="text" value={mon} onChange={e => setMon(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Dia da Semana (0-6)</label>
              <input type="text" value={dow} onChange={e => setDow(e.target.value)} />
              <small className="text-muted mt-1 d-block">0 = Domingo</small>
            </div>
          </div>

          <div className="cron-presets">
            <h3>Exemplos Comuns</h3>
            <div className="preset-buttons">
              {presets.map((p, idx) => (
                <button key={idx} className="btn-secondary btn-small" onClick={() => applyPreset(p.val)}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="cron-result">
          <div className="result-card glass-panel">
            <h2>Expressão Final</h2>
            
            <div className="terminal-box cron-display">
              <Calendar size={20} className="text-secondary" />
              <code className="cmd-text">{cronExpr}</code>
              <button className="copy-btn" onClick={copyCommand} title="Copiar Expressão">
                {copied ? <Check size={20} className="text-success" /> : <Copy size={20} />}
              </button>
            </div>
            
            <div className="cron-translation">
              <h3>Significado:</h3>
              <p>{translation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
