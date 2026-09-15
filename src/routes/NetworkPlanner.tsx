import { useState } from 'react';
import { Calculator, Laptop, Printer, Server, Smartphone, Info } from 'lucide-react';
import './CidrPlanner.css'; // Reusing some base styles

interface DeviceCategory {
  id: string;
  name: string;
  icon: any;
  count: number;
  multiplier: number; // For future growth (e.g., 1.2 = 20% growth margin)
}

export default function NetworkPlanner() {
  const [categories, setCategories] = useState<DeviceCategory[]>([
    { id: 'pcs', name: 'Desktops & Laptops', icon: Laptop, count: 50, multiplier: 1.2 },
    { id: 'mobile', name: 'Smartphones/Wi-Fi', icon: Smartphone, count: 100, multiplier: 1.5 },
    { id: 'servers', name: 'Servidores & Infra', icon: Server, count: 5, multiplier: 2.0 },
    { id: 'printers', name: 'Impressoras & IoT', icon: Printer, count: 10, multiplier: 1.2 },
  ]);

  const [recommendedCidr, setRecommendedCidr] = useState<{ cidr: number, maxHosts: number, required: number } | null>(null);

  const updateCount = (id: string, val: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, count: parseInt(val) || 0 } : c));
  };

  const calculateRequirement = () => {
    let totalNeeded = 0;
    categories.forEach(c => {
      totalNeeded += Math.ceil(c.count * c.multiplier);
    });

    // Add 2 for Network and Broadcast addresses, plus maybe a gateway
    const requiredBlock = totalNeeded + 3;

    let bitsForHosts = 0;
    while (Math.pow(2, bitsForHosts) < requiredBlock) {
      bitsForHosts++;
    }

    const cidr = 32 - bitsForHosts;
    const maxHosts = Math.pow(2, bitsForHosts) - 2;

    setRecommendedCidr({
      cidr,
      maxHosts,
      required: totalNeeded
    });
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Network / IP Planner</h1>
        <p>Calcule o tamanho da sub-rede ideal baseado na quantidade e tipo de dispositivos da sua rede, já prevendo margem de crescimento.</p>
      </div>

      <div className="planner-layout">
        <div className="planner-config glass-panel">
          <h2>Dispositivos da Rede</h2>
          
          <div className="req-list">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} className="device-item">
                  <div className="device-info">
                    <Icon size={20} className="text-accent" />
                    <span>{cat.name}</span>
                  </div>
                  <div className="device-input">
                    <input
                      type="number"
                      value={cat.count || ''}
                      onChange={(e) => updateCount(cat.id, e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="info-box glass-panel mb-4">
            <Info size={16} />
            <p>O cálculo adiciona margens de segurança (crescimento) de 20% a 100% dependendo do tipo de dispositivo (ex: Wi-Fi cresce mais rápido que Servidores físicos).</p>
          </div>

          <button className="btn-primary calculate-btn" onClick={calculateRequirement}>
            <Calculator size={18} />
            Calcular Tamanho da Rede
          </button>
        </div>

        <div className="planner-results glass-panel">
          <h2>Recomendação de Sub-rede</h2>
          {!recommendedCidr ? (
            <p className="no-data">Preencha a quantidade de dispositivos e clique em Calcular.</p>
          ) : (
            <div className="recommendation-card">
              <div className="stat-circle">
                <span className="stat-value">/{recommendedCidr.cidr}</span>
                <span className="stat-label">CIDR Recomendado</span>
              </div>
              
              <div className="stat-details">
                <div className="stat-row">
                  <span>Dispositivos Previstos (com margem):</span>
                  <strong>{recommendedCidr.required} hosts</strong>
                </div>
                <div className="stat-row">
                  <span>Capacidade da Sub-rede (/{recommendedCidr.cidr}):</span>
                  <strong className="text-success">{recommendedCidr.maxHosts} hosts úteis</strong>
                </div>
                <div className="stat-row">
                  <span>IPs Livres (Sobrando):</span>
                  <strong className="text-accent">{recommendedCidr.maxHosts - recommendedCidr.required} IPs</strong>
                </div>
              </div>

              <div className="next-steps">
                <h3>Próximos Passos</h3>
                <p>Use a <strong>Calculadora IPv4</strong> para pegar a máscara de rede exata deste CIDR, ou o <strong>CIDR Planner</strong> se precisar dividir essa rede em pedaços menores.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
