import { useState, useEffect } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';
import './ChmodCalculator.css';

type Permission = 'read' | 'write' | 'execute';
type Role = 'owner' | 'group' | 'public';

export default function ChmodCalculator() {
  const [perms, setPerms] = useState<Record<Role, Record<Permission, boolean>>>({
    owner: { read: true, write: true, execute: false },
    group: { read: true, write: false, execute: false },
    public: { read: true, write: false, execute: false }
  });

  const [octalStr, setOctalStr] = useState('644');
  const [symbolicStr, setSymbolicStr] = useState('-rw-r--r--');
  const [copied, setCopied] = useState(false);

  // Update strings when checkboxes change
  useEffect(() => {
    let newOctal = '';
    let newSym = '-';
    
    ['owner', 'group', 'public'].forEach((roleType) => {
      const r = roleType as Role;
      let val = 0;
      let symPart = '';
      
      if (perms[r].read) { val += 4; symPart += 'r'; } else { symPart += '-'; }
      if (perms[r].write) { val += 2; symPart += 'w'; } else { symPart += '-'; }
      if (perms[r].execute) { val += 1; symPart += 'x'; } else { symPart += '-'; }
      
      newOctal += val.toString();
      newSym += symPart;
    });

    setOctalStr(newOctal);
    setSymbolicStr(newSym);
  }, [perms]);

  const handleToggle = (role: Role, perm: Permission) => {
    setPerms(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [perm]: !prev[role][perm]
      }
    }));
  };

  // Allow manual entry of octal
  const handleOctalChange = (val: string) => {
    const clean = val.replace(/[^0-7]/g, '').slice(0, 3);
    if (clean.length === 3) {
      const p1 = parseInt(clean[0]);
      const p2 = parseInt(clean[1]);
      const p3 = parseInt(clean[2]);
      
      setPerms({
        owner: { read: (p1 & 4) > 0, write: (p1 & 2) > 0, execute: (p1 & 1) > 0 },
        group: { read: (p2 & 4) > 0, write: (p2 & 2) > 0, execute: (p2 & 1) > 0 },
        public: { read: (p3 & 4) > 0, write: (p3 & 2) > 0, execute: (p3 & 1) > 0 }
      });
    } else {
      setOctalStr(clean); // temporarily invalid state while typing
    }
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(`chmod ${octalStr} <arquivo>`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Chmod Calculator</h1>
        <p>Calcule permissões de arquivos Linux rapidamente visualizando o valor octal e simbólico.</p>
      </div>

      <div className="chmod-layout">
        <div className="chmod-matrix glass-panel">
          <table className="perms-table">
            <thead>
              <tr>
                <th></th>
                <th>Ler (Read / 4)</th>
                <th>Gravar (Write / 2)</th>
                <th>Executar (Execute / 1)</th>
              </tr>
            </thead>
            <tbody>
              {(['owner', 'group', 'public'] as Role[]).map(role => (
                <tr key={role}>
                  <td className="role-name">{role === 'owner' ? 'Proprietário' : role === 'group' ? 'Grupo' : 'Público'}</td>
                  <td>
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={perms[role].read}
                        onChange={() => handleToggle(role, 'read')}
                      />
                      <span className="checkbox-custom"></span>
                    </label>
                  </td>
                  <td>
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={perms[role].write}
                        onChange={() => handleToggle(role, 'write')}
                      />
                      <span className="checkbox-custom"></span>
                    </label>
                  </td>
                  <td>
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={perms[role].execute}
                        onChange={() => handleToggle(role, 'execute')}
                      />
                      <span className="checkbox-custom"></span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="chmod-results">
          <div className="result-card glass-panel">
            <h3>Valor Octal</h3>
            <input 
              type="text" 
              className="octal-input" 
              value={octalStr} 
              onChange={(e) => handleOctalChange(e.target.value)}
              maxLength={3}
            />
          </div>

          <div className="result-card glass-panel">
            <h3>Notação Simbólica</h3>
            <div className="symbolic-display">{symbolicStr}</div>
          </div>

          <div className="command-card glass-panel">
            <h3>Comando Linux</h3>
            <div className="terminal-box">
              <Terminal size={18} className="text-secondary" />
              <code className="cmd-text">chmod {octalStr} arquivo</code>
              <button className="copy-btn" onClick={copyCommand} title="Copiar Comando">
                {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
