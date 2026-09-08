import { Globe, Wifi, Cpu, BadgeCheck, Tool, Lock, QrCode, FileJson, Braces, Search, Network } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const tools = [
  {
    id: 'ipv4',
    name: 'Calculadora IPv4',
    description: 'Calculadora completa de sub-redes IPv4. Obtenha range, broadcast, máscara e mais.',
    icon: Globe,
    path: '/ipv4'
  },
  {
    id: 'subnet',
    name: 'Subnet Calculator',
    description: 'Divida sua rede em múltiplas sub-redes facilmente.',
    icon: Wifi,
    path: '/subnet'
  },
  {
    id: 'ip-analyzer',
    name: 'IP & Network',
    description: 'Informações detalhadas sobre endereçamento IP, classes e tipos.',
    icon: BadgeCheck,
    path: '/ip-analyzer'
  },
  {
    id: 'mtu-mss',
    name: 'MTU / MSS',
    description: 'Calculadora de MTU e MSS para redes e PPPoE.',
    icon: Cpu,
    path: '/mtu-mss'
  },
  {
    id: 'bandwidth',
    name: 'Bandwidth Calculator',
    description: 'Conversão e cálculo de velocidade de transferência de arquivos.',
    icon: Network,
    path: '/bandwidth'
  },
  {
    id: 'mikrotik',
    name: 'MikroTik Tools',
    description: 'Gerador rápido de comandos RouterOS (VLAN, Bridge, IP, NAT).',
    icon: Tool,
    path: '/mikrotik'
  },
  {
    id: 'password',
    name: 'Password Generator',
    description: 'Gerador de senhas seguras local, sem envio de dados.',
    icon: Lock,
    path: '/password'
  },
  {
    id: 'qr',
    name: 'QR Code Generator',
    description: 'Gere QR Codes para Wi-Fi, contatos, textos ou URLs.',
    icon: QrCode,
    path: '/qr'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Selecione uma ferramenta abaixo para começar.</p>
      </div>

      <div className="tools-grid">
        {tools.map(tool => {
          const Icon = tool.icon;
          return (
            <div key={tool.id} className="tool-card glass-panel" onClick={() => navigate(tool.path)}>
              <div className="tool-icon-wrapper">
                <Icon size={32} className="tool-icon" />
              </div>
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
              <button className="btn-open">Abrir</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
