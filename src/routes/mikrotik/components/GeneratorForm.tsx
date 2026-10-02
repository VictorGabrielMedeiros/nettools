import { AlertTriangle, Info } from 'lucide-react';
import type { MikrotikGenerator, RouterOSVersion } from '../types';

interface GeneratorFormProps {
  generator: MikrotikGenerator;
  version: RouterOSVersion;
  values: Record<string, any>;
  onChange: (fieldId: string, value: any) => void;
}

export function GeneratorForm({ generator, version, values, onChange }: GeneratorFormProps) {
  const isVersionSupported = generator.supportedVersions.includes(version);
  const dynamicCheck = generator.checkCompatibility ? generator.checkCompatibility(values, version) : { isCompatible: true };
  const isCompatible = isVersionSupported && dynamicCheck.isCompatible;

  const incompatibilityNotice = generator.incompatibilityNotice && generator.incompatibilityNotice.unsupportedVersion === version
    ? generator.incompatibilityNotice
    : null;

  const versionNote = generator.versionNotes?.[version];

  return (
    <div className="generator-form-wrapper">
      {/* Aviso de Incompatibilidade de Versão */}
      {!isCompatible && (
        <div className="compatibility-warning-box">
          <div className="warning-icon-wrapper">
            <AlertTriangle size={24} />
          </div>
          <div className="warning-text-content">
            <h4>{incompatibilityNotice?.title || dynamicCheck.warningTitle || 'Recurso Incompatível com a Versão Selecionada'}</h4>
            <p>
              {incompatibilityNotice?.message || dynamicCheck.warningMessage || `Este recurso não está disponível no RouterOS ${version.toUpperCase()}. Alterne a versão do RouterOS acima para gerar comandos válidos.`}
            </p>
          </div>
        </div>
      )}

      {/* Dica / Nota de versão caso compatível */}
      {isCompatible && versionNote && (
        <div className="version-note-box">
          <Info size={18} className="note-icon" />
          <div className="note-text">
            <strong>Sintaxe RouterOS {version.toUpperCase()}:</strong> {versionNote}
          </div>
        </div>
      )}

      {/* Campos do Gerador */}
      <div className={`form-grid ${!isCompatible ? 'fields-disabled' : ''}`}>
        {generator.fields.map(field => {
          // Se o campo for exclusivo de uma versão e não for a versão atual, não exibe
          if (field.supportedVersions && !field.supportedVersions.includes(version)) {
            return null;
          }

          const value = values[field.id] !== undefined ? values[field.id] : field.defaultValue;

          if (field.type === 'boolean') {
            return (
              <div key={field.id} className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    disabled={!isCompatible}
                    onChange={e => onChange(field.id, e.target.checked)}
                  />
                  <span>{field.label}</span>
                </label>
                {field.helpText && <span className="field-help">{field.helpText}</span>}
              </div>
            );
          }

          if (field.type === 'select') {
            return (
              <div key={field.id} className="form-group">
                <label htmlFor={field.id}>{field.label}</label>
                <select
                  id={field.id}
                  value={value}
                  disabled={!isCompatible}
                  onChange={e => onChange(field.id, e.target.value)}
                  className="input-select"
                >
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {field.helpText && <span className="field-help">{field.helpText}</span>}
              </div>
            );
          }

          return (
            <div key={field.id} className="form-group">
              <label htmlFor={field.id}>{field.label}</label>
              <input
                id={field.id}
                type={field.type === 'number' ? 'number' : 'text'}
                value={value}
                disabled={!isCompatible}
                placeholder={field.placeholder}
                onChange={e => onChange(field.id, field.type === 'number' ? Number(e.target.value) : e.target.value)}
              />
              {field.helpText && <span className="field-help">{field.helpText}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
