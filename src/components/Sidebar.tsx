import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, Globe, Wifi, BadgeCheck, Cpu, Settings,
  Wrench, Lock, QrCode, FileJson, Binary, Regex,
  Network, Activity, X, Search, ShieldCheck, Mail, Key, Terminal, Calendar, Laptop, Bot,
  MapPin, Hash, Link as LinkIcon, BookOpen, ChevronRight
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuGroups = [
  {
    title: 'Geral',
    icon: Home,
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: Home },
      { to: '/about', label: 'Sobre', icon: Settings },
    ]
  },
  {
    title: 'Redes & IP',
    icon: Network,
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
    icon: ShieldCheck,
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
    icon: Key,
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
    icon: Terminal,
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
  const location = useLocation();

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {
      'Geral': true,
      'Redes & IP': false,
      'Segurança & DNS': false,
      'Utilitários & Criptografia': false,
      'Dev & Sysadmin': false
    };

    menuGroups.forEach(group => {
      if (group.items.some(item => item.to === location.pathname)) {
        initialState[group.title] = true;
      }
    });

    return initialState;
  });

  useEffect(() => {
    menuGroups.forEach(group => {
      if (group.items.some(item => item.to === location.pathname)) {
        setExpandedGroups(prev => ({
          ...prev,
          [group.title]: true
        }));
      }
    });
  }, [location.pathname]);

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

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
          {menuGroups.map((group) => {
            const GroupIcon = group.icon;
            const isExpanded = expandedGroups[group.title];
            
            return (
              <div key={group.title} className={`menu-group ${isExpanded ? 'expanded' : ''}`}>
                <button className="menu-group-title" onClick={() => toggleGroup(group.title)}>
                  <div className="group-title-content">
                    <GroupIcon size={16} />
                    <span>{group.title}</span>
                  </div>
                  <ChevronRight size={16} className={`group-chevron ${isExpanded ? 'open' : ''}`} />
                </button>
                
                <div className={`menu-group-items ${isExpanded ? 'open' : ''}`}>
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
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <span>ITKit</span>
          <span className="version-badge">v4.2</span>
        </div>
      </aside>
    </>
  );
}
