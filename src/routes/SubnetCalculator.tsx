import { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { parseIpAndCidr } from '../utils/ipUtils';
import { divideSubnet } from '../utils/subnetUtils';
import type { SubnetResult } from '../utils/subnetUtils';
import { copyToClipboard } from '../utils/clipboard';
import './SubnetCalculator.css';

export default function SubnetCalculator() {
  const [networkInput, setNetworkInput] = useState('10.0.0.0/24');
  const [partsInput, setPartsInput] = useState('4');
  const [results, setResults] = useState<SubnetResult[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    setError('');
    const parsed = parseIpAndCidr(networkInput);
    if (!parsed) {
      setError('Formato de rede inválido. Use IP/CIDR (ex: 10.0.0.0/24)');
      return;
    }

    const parts = parseInt(partsInput, 10);
    if (isNaN(parts) || parts < 2 || parts > 1024) {
      setError('Quantidade de sub-redes deve ser entre 2 e 1024.');
      return;
    }

    const data = divideSubnet(parsed.ip, parsed.cidr, parts);
    if (!data) {
      setError('Não foi possível dividir essa rede (CIDR muito alto ou quantidade inválida).');
      setResults([]);
    } else {
      setResults(data);
    }
  };

  const handleCopyTable = async () => {
    if (results.length === 0) return;
    
    const header = "Subnet\tNetwork\tFirst IP\tLast IP\tBroadcast\tHosts\n";
    const rows = results.map(r => `${r.subnet}\t${r.network}\t${r.firstIp}\t${r.lastIp}\t${r.broadcast}\t${r.hosts}`).join('\n');
    
    const success = await copyToClipboard(header + rows);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Calculadora de Sub-redes</h1>
        <p>Divida uma rede principal em múltiplas sub-redes menores.</p>
      </div>

      <div className="calculator-form glass-panel">
        <div className="form-group">
          <label htmlFor="networkInput">Rede / CIDR</label>
          <input 
            id="networkInput"
            type="text" 
            value={networkInput} 
            onChange={(e) => setNetworkInput(e.target.value)} 
            placeholder="Ex: 10.0.0.0/24" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="partsInput">Quantidade de sub-redes</label>
          <input 
            id="partsInput"
            type="number" 
            min="2" max="1024"
            value={partsInput} 
            onChange={(e) => setPartsInput(e.target.value)} 
          />
        </div>
        <button className="btn-primary" onClick={handleCalculate}>Calcular</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {results.length > 0 && (
        <div className="table-container glass-panel">
          <div className="table-header-actions">
            <h3>Resultado da Divisão</h3>
            <button className="btn-copy" onClick={handleCopyTable}>
              {copied ? <><CheckCircle2 size={16} className="text-success" /> Copiado</> : <><Copy size={16} /> Copiar Tabela</>}
            </button>
          </div>
          <div className="table-responsive">
            <table className="subnet-table">
              <thead>
                <tr>
                  <th>Subnet</th>
                  <th>Network</th>
                  <th>First IP</th>
                  <th>Last IP</th>
                  <th>Broadcast</th>
                  <th>Hosts</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.subnet}</td>
                    <td>{row.network}</td>
                    <td>{row.firstIp}</td>
                    <td>{row.lastIp}</td>
                    <td>{row.broadcast}</td>
                    <td>{row.hosts.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
