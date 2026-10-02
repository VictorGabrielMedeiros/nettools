import { useState } from 'react';
import { Copy, CheckCircle2, Terminal } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import type { RouterOSVersion } from './mikrotik/types';
import { mikrotikGenerators } from './mikrotik/generators';
import { VersionSelector } from './mikrotik/components/VersionSelector';
import { GeneratorForm } from './mikrotik/components/GeneratorForm';
import './MikrotikTools.css';

export default function MikrotikTools() {
  const [selectedVersion, setSelectedVersion] = useState<RouterOSVersion>('v7');
  const [activeGeneratorId, setActiveGeneratorId] = useState<string>(mikrotikGenerators[0].id);
  const [copied, setCopied] = useState(false);

  // Armazena valores de formulário de cada gerador independentemente
  const [formValues, setFormValues] = useState<Record<string, Record<string, any>>>(() => {
    const initial: Record<string, Record<string, any>> = {};
    mikrotikGenerators.forEach(gen => {
      initial[gen.id] = {};
      gen.fields.forEach(f => {
        initial[gen.id][f.id] = f.defaultValue;
      });
    });
    return initial;
  });

  const activeGenerator = mikrotikGenerators.find(g => g.id === activeGeneratorId) || mikrotikGenerators[0];
  const currentValues = formValues[activeGenerator.id] || {};

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [activeGenerator.id]: {
        ...prev[activeGenerator.id],
        [fieldId]: value
      }
    }));
  };

  const commandOutput = activeGenerator.generateCommand(currentValues, selectedVersion);

  const handleCopy = async () => {
    const success = await copyToClipboard(commandOutput);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="tool-page mikrotik-page">
      <div className="tool-header">
        <div className="tool-header-title">
          <Terminal className="tool-header-icon" size={32} />
          <div>
            <h1>Gerador de Comandos MikroTik</h1>
            <p>Gere configurações prontas para CLI do RouterOS com prevenção ativa de incompatibilidade entre versões.</p>
          </div>
        </div>
      </div>

      <div className="mikrotik-container glass-panel">
        {/* Seletor de versão do RouterOS (v7 vs v6) */}
        <VersionSelector
          version={selectedVersion}
          onVersionChange={setSelectedVersion}
        />

        {/* Abas dinâmicas modulares */}
        <div className="tabs mikrotik-tabs">
          {mikrotikGenerators.map(gen => {
            const isSupported = gen.supportedVersions.includes(selectedVersion);
            const isV7Only = gen.supportedVersions.length === 1 && gen.supportedVersions[0] === 'v7';

            return (
              <button
                key={gen.id}
                type="button"
                className={`tab-btn ${activeGeneratorId === gen.id ? 'active' : ''} ${!isSupported ? 'tab-incompatible' : ''}`}
                onClick={() => setActiveGeneratorId(gen.id)}
              >
                <span>{gen.name}</span>
                {isV7Only && <span className="tab-pill v7-only">v7+</span>}
                {!isSupported && <span className="tab-pill alert">Incompatível</span>}
              </button>
            );
          })}
        </div>

        {/* Formulário Modular do Gerador Ativo */}
        <div className="tab-content">
          <GeneratorForm
            generator={activeGenerator}
            version={selectedVersion}
            values={currentValues}
            onChange={handleFieldChange}
          />
        </div>

        {/* Bloco de Código CLI com Prevenção de Erros */}
        <div className="code-preview-container">
          <div className="code-header">
            <div className="code-header-info">
              <span>RouterOS CLI ({selectedVersion.toUpperCase()})</span>
              <span className="code-hint">Comandos validados para a versão selecionada</span>
            </div>
            <button className="btn-copy-code" onClick={handleCopy}>
              {copied ? <CheckCircle2 size={16} className="text-success" /> : <Copy size={16} />}
              {copied ? 'Copiado' : 'Copiar Comandos'}
            </button>
          </div>
          <pre className="code-block">
            <code>{commandOutput}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
