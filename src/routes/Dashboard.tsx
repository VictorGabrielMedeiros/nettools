import { Globe, Wifi, Cpu, BadgeCheck, Wrench, Lock, QrCode, Network, Activity, Search, ShieldCheck, Mail, Key, Terminal, Calendar, Laptop, FileJson, Binary, Regex, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const tools = [
  { id: 'ipv4', name: 'Calculadora IPv4', description: 'Calculadora completa de sub-redes IPv4. Obtenha range, broadcast, máscara e mais.', icon: Globe, path: '/ipv4' },
  { id: 'subnet', name: 'Subnet Calculator', description: 'Divida sua rede em múltiplas sub-redes facilmente.', icon: Wifi, path: '/subnet' },
  { id: 'ip-analyzer', name: 'IP & Network', description: 'Informações detalhadas sobre endereçamento IP, classes e tipos.', icon: BadgeCheck, path: '/ip-analyzer' },
  { id: 'cidr-planner', name: 'CIDR Planner', description: 'Planejamento e organização de blocos CIDR.', icon: Network, path: '/cidr-planner' },
  { id: 'network-planner', name: 'Network Planner', description: 'Desenhe e planeje a divisão de sub-redes.', icon: Laptop, path: '/network-planner' },
  { id: 'mtu-mss', name: 'MTU / MSS', description: 'Calculadora de MTU e MSS para redes e PPPoE.', icon: Cpu, path: '/mtu-mss' },
  { id: 'bandwidth', name: 'Bandwidth Calculator', description: 'Conversão e cálculo de velocidade de transferência de arquivos.', icon: Activity, path: '/bandwidth' },
  { id: 'mikrotik', name: 'MikroTik Tools', description: 'Gerador rápido de comandos RouterOS (VLAN, Bridge, IP, NAT).', icon: Wrench, path: '/mikrotik' },
  { id: 'mac-analyzer', name: 'MAC/OUI Analyzer', description: 'Identificação de fabricante e conversão de formato de endereços MAC.', icon: Search, path: '/mac-analyzer' },
  { id: 'dns-lookup', name: 'DNS Lookup', description: 'Consulta de registros DNS (A, AAAA, MX, TXT, CNAME).', icon: Search, path: '/dns-lookup' },
  { id: 'port-checker', name: 'Teste de Portas', description: 'Verifique se uma porta TCP está aberta.', icon: Network, path: '/port-checker' },
  { id: 'ssl-checker', name: 'SSL/TLS Checker', description: 'Validação de validade e certificado SSL.', icon: ShieldCheck, path: '/ssl-checker' },
  { id: 'security-headers', name: 'Security Headers', description: 'Verificação de cabeçalhos HTTP de segurança.', icon: ShieldCheck, path: '/security-headers' },
  { id: 'spf-analyzer', name: 'SPF/DKIM Analyzer', description: 'Análise de segurança de e-mail (SPF/DKIM/DMARC).', icon: Mail, path: '/spf-analyzer' },
  { id: 'password', name: 'Password Generator', description: 'Gerador de senhas seguras local, sem envio de dados.', icon: Lock, path: '/password' },
  { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decodificador local seguro de tokens JWT.', icon: Key, path: '/jwt-decoder' },
  { id: 'qr', name: 'QR Code Generator', description: 'Gere QR Codes para Wi-Fi, contatos, textos ou URLs.', icon: QrCode, path: '/qr' },
  { id: 'json', name: 'Formatador JSON', description: 'Formate e valide código JSON.', icon: FileJson, path: '/json' },
  { id: 'base64', name: 'Base64 Encoder', description: 'Codifique textos em Base64 ou decodifique.', icon: Binary, path: '/base64' },
  { id: 'regex', name: 'Testador Regex', description: 'Teste expressões regulares (Regex).', icon: Regex, path: '/regex' },
  { id: 'chmod-calculator', name: 'Chmod Calculator', description: 'Calcule permissões de arquivos Linux.', icon: Terminal, path: '/chmod-calculator' },
  { id: 'cron-generator', name: 'Cron Generator', description: 'Gere e traduza expressões Cron.', icon: Calendar, path: '/cron-generator' },
  { id: 'ai-fingerprint', name: 'AI/Bot Fingerprint', description: 'Detecte IAs, bots e dispositivos suspeitos na rede. Inclui guia educativo.', icon: Bot, path: '/ai-fingerprint' },
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
