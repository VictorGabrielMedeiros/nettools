import { ShieldAlert, CheckCircle } from 'lucide-react';
import type { RouterOSVersion } from '../types';

interface VersionSelectorProps {
  version: RouterOSVersion;
  onVersionChange: (version: RouterOSVersion) => void;
}

export function VersionSelector({ version, onVersionChange }: VersionSelectorProps) {
  return (
    <div className="version-selector-container">
      <div className="version-selector-label">
        <span className="version-title">Versão do RouterOS:</span>
        <span className="version-hint">Garante sintaxe 100% compatível com seu equipamento</span>
      </div>

      <div className="version-options">
        <button
          type="button"
          className={`version-chip ${version === 'v7' ? 'active' : ''}`}
          onClick={() => onVersionChange('v7')}
        >
          <div className="chip-content">
            <span className="chip-name">RouterOS v7</span>
            <span className="chip-badge recommend">Atual / Recomendado</span>
          </div>
          {version === 'v7' && <CheckCircle size={16} className="chip-icon" />}
        </button>

        <button
          type="button"
          className={`version-chip ${version === 'v6' ? 'active' : ''}`}
          onClick={() => onVersionChange('v6')}
        >
          <div className="chip-content">
            <span className="chip-name">RouterOS v6</span>
            <span className="chip-badge legacy">Legado / LTS</span>
          </div>
          {version === 'v6' && <ShieldAlert size={16} className="chip-icon" />}
        </button>
      </div>
    </div>
  );
}
