import { NavLink } from 'react-router-dom';
import {
  Home, Globe, Wifi, BadgeCheck, Cpu, Settings,
  Wrench, Lock, QrCode, FileJson, Binary, Regex,
  Network, Activity, X, Search, ShieldCheck, Mail, Key, Terminal, Calendar, Laptop, Bot,
  MapPin, Hash, Link as LinkIcon, BookOpen
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuGroups = [
  {
    title: 'Geral',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: Home },
      { to: '/about', label: 'Sobre', icon: Settings },
    ]
  },
  {
    title: 'Redes & IP',
    items: [
      { to: '/my-ip', label: 'Meu IP Público', icon: MapPin },
      { to: '/ipv4', label: 'Calculadora IPv4', icon: Globe },
      { to: '/subnet', label: 'Sub-redes', icon: Wifi },
      { to: '/ip-analyzer', label: 'Analisador de IP', icon: BadgeCheck },
      { to: '/cidr-planner', label: 'CIDR Planner', icon: Network },
      { to: '/network-planner', label: 'Network Planner', icon: Laptop },
      { to: '/mtu-mss', label: 'MTU / MSS', icon: Cpu },
      { to: '/bandwidth', label: 'Largura de Banda', icon: Activity },
      { to: '/mac-analyzer', label: 'MAC/OUI Analyzer', icon: Search },
    ]
  },
  {
    title: 'Segurança & DNS',
    items: [
      { to: '/dns-lookup', label: 'DNS Lookup', icon: Search },
      { to: '/whois', label: 'WHOIS / RDAP', icon: BookOpen },
      { to: '/spf-analyzer', label: 'SPF/DKIM Analyzer', icon: Mail },
      { to: '/ssl-checker', label: 'SSL/TLS Checker', icon: ShieldCheck },
      { to: '/security-headers', label: 'Security Headers', icon: ShieldCheck },
      { to: '/ai-fingerprint', label: 'AI/Bot Fingerprint', icon: Bot },
      { to: '/port-checker', label: 'Teste de Portas', icon: Network },
    ]
  },
  {
    title: 'Utilitários & Criptografia',
    items: [
      { to: '/password', label: 'Gerador de Senhas', icon: Lock },
      { to: '/base64', label: 'Base64 Encoder', icon: Binary },
      { to: '/hash-generator', label: 'Hash Generator', icon: Hash },
      { to: '/url-encoder', label: 'URL Encoder', icon: LinkIcon },
      { to: '/jwt-decoder', label: 'JWT Decoder', icon: Key },
    ]
  },
  {
    title: 'Dev & Sysadmin',
    items: [
      { to: '/regex', label: 'Testador Regex', icon: Regex },
      { to: '/json', label: 'Formatador JSON', icon: FileJson },
      { to: '/chmod-calculator', label: 'Chmod Calculator', icon: Terminal },
      { to: '/cron-generator', label: 'Cron Generator', icon: Calendar },
      { to: '/qr', label: 'Gerador de QR Code', icon: QrCode },
      { to: '/mikrotik', label: 'MikroTik Tools', icon: Wrench },
    ]
  }
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Main navigation">
        <div className="logo">
          <span>ITKit</span>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>

        <nav className="menu">
          {menuGroups.map((group) => (
            <div key={group.title} className="menu-group">
              <div className="menu-group-title">{group.title}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      'menu-item' + (isActive ? ' active' : '')
                    }
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span>ITKit</span>
          <span className="version-badge">v4.0</span>
        </div>
      </aside>
    </>
  );
}
