import { useState } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { calculateSubnet, parseIpAndCidr } from '../utils/ipUtils';
import './CidrPlanner.css';

// Simple util to convert IP string to 32-bit int
function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

// Simple util to convert 32-bit int to IP string
function intToIp(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255
  ].join('.');
}

interface SubnetRequirement {
  id: string;
  name: string;
  size: number; // needed hosts
}

interface PlannedSubnet {
  name: string;
  network: string;
  cidr: number;
  mask: string;
  firstHost: string;
  lastHost: string;
  broadcast: string;
  allocatedSize: number;
  neededHosts: number;
}

export default function CidrPlanner() {
  const [baseNetwork, setBaseNetwork] = useState('10.0.0.0/16');
  const [requirements, setRequirements] = useState<SubnetRequirement[]>([
    { id: '1', name: 'Matriz (RH)', size: 50 },
    { id: '2', name: 'Filial A', size: 120 }
  ]);
  const [planned, setPlanned] = useState<PlannedSubnet[]>([]);
  const [error, setError] = useState('');

  const addRequirement = () => {
    setRequirements([
      ...requirements,
      { id: Date.now().toString(), name: `Nova Sub-rede ${requirements.length + 1}`, size: 10 }
    ]);
  };

  const removeRequirement = (id: string) => {
    setRequirements(requirements.filter(r => r.id !== id));
  };

  const updateRequirement = (id: string, field: 'name' | 'size', value: string) => {
    setRequirements(requirements.map(r => {
      if (r.id === id) {
        return {
          ...r,
          [field]: field === 'size' ? (parseInt(value) || 0) : value
        };
      }
      return r;
    }));
  };

  const calculatePlan = () => {
    setError('');
    setPlanned([]);

    const parsed = parseIpAndCidr(baseNetwork);
    if (!parsed) {
      setError('Rede base inválida. Use formato IP/CIDR (ex: 10.0.0.0/16).');
      return;
    }

    // Sort requirements by size descending (VLSM best practice)
    const sortedReqs = [...requirements].sort((a, b) => b.size - a.size);
    
    let currentIpInt = ipToInt(parsed.ip);
    const baseEndIpInt = currentIpInt + Math.pow(2, 32 - parsed.cidr) - 1;

    const result: PlannedSubnet[] = [];

    for (const req of sortedReqs) {
      // Find required block size (hosts + 2 for net/broadcast)
      const requiredBlock = req.size + 2;
      // Find smallest power of 2 that fits
      let bitsForHosts = 0;
      while (Math.pow(2, bitsForHosts) < requiredBlock) {
        bitsForHosts++;
      }
      
      const newCidr = 32 - bitsForHosts;
      const blockSize = Math.pow(2, bitsForHosts);

      // Check if it fits in base network
      if (currentIpInt + blockSize - 1 > baseEndIpInt) {
        setError(`A rede base ${baseNetwork} é muito pequena para acomodar todas as sub-redes solicitadas.`);
        return;
      }

      // Calculate details
      const networkIp = intToIp(currentIpInt);
      const details = calculateSubnet(networkIp, newCidr);

      result.push({
        name: req.name,
        network: details.network,
        cidr: details.cidr,
        mask: details.mask,
        firstHost: details.firstHost,
        lastHost: details.lastHost,
        broadcast: details.broadcast,
        allocatedSize: details.usableHosts,
        neededHosts: req.size
      });

      // Move pointer
      currentIpInt += blockSize;
    }

    setPlanned(result);
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>CIDR & VLSM Planner</h1>
        <p>Planeje a divisão de uma rede maior em múltiplas sub-redes baseadas na necessidade de hosts (VLSM).</p>
      </div>

      <div className="planner-layout">
        <div className="planner-config glass-panel">
          <h2>Configuração</h2>
          
          <div className="form-group mb-4">
            <label htmlFor="baseNetwork">Rede Base (Bloco Maior)</label>
            <input
              id="baseNetwork"
              type="text"
              value={baseNetwork}
              onChange={(e) => setBaseNetwork(e.target.value)}
              placeholder="Ex: 10.0.0.0/16"
            />
          </div>

          <div className="requirements-section">
            <div className="req-header">
              <h3>Sub-redes Necessárias</h3>
              <button className="btn-icon-small" onClick={addRequirement}>
                <Plus size={16} /> Add
              </button>
            </div>

            <div className="req-list">
              {requirements.map((req) => (
                <div key={req.id} className="req-item">
                  <div className="form-group flex-2">
                    <input
                      type="text"
                      value={req.name}
                      onChange={(e) => updateRequirement(req.id, 'name', e.target.value)}
                      placeholder="Nome/Departamento"
                    />
                  </div>
                  <div className="form-group flex-1">
                    <input
                      type="number"
                      value={req.size || ''}
                      onChange={(e) => updateRequirement(req.id, 'size', e.target.value)}
                      placeholder="Hosts"
                      min="1"
                    />
                  </div>
                  <button className="btn-icon-danger" onClick={() => removeRequirement(req.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary calculate-btn" onClick={calculatePlan}>
            <Calculator size={18} />
            Gerar Plano VLSM
          </button>
          
          {error && <div className="error-text mt-3">{error}</div>}
        </div>

        <div className="planner-results glass-panel">
          <h2>Plano Gerado</h2>
          {planned.length === 0 ? (
            <p className="no-data">Clique em "Gerar Plano VLSM" para visualizar a divisão.</p>
          ) : (
            <div className="table-responsive">
              <table className="results-table vlsm-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Rede</th>
                    <th>Range Útil</th>
                    <th>Hosts (Alocado/Req)</th>
                  </tr>
                </thead>
                <tbody>
                  {planned.map((p, idx) => (
                    <tr key={idx}>
                      <td><strong>{p.name}</strong></td>
                      <td>
                        <span className="text-accent">{p.network}/{p.cidr}</span>
                        <div className="text-small text-muted">{p.mask}</div>
                      </td>
                      <td>
                        <span className="mono">{p.firstHost}</span><br/>
                        <span className="mono">- {p.lastHost}</span>
                      </td>
                      <td>
                        <span className={p.allocatedSize < p.neededHosts ? 'text-error' : 'text-success'}>
                          {p.allocatedSize}
                        </span> / {p.neededHosts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
