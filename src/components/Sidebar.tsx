import { NavLink } from 'react-router-dom';
import {
  Home, Globe, Wifi, BadgeCheck, Cpu, Settings,
  Wrench, Lock, QrCode, FileJson, Binary, Regex,
  Network, Activity, X
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { to: '/dashboard',   label: 'Dashboard',              icon: Home },
  { to: '/ipv4',        label: 'Calculadora IPv4',        icon: Globe },
  { to: '/subnet',      label: 'Sub-redes',               icon: Wifi },
  { to: '/ip-analyzer', label: 'Analisador de IP',        icon: BadgeCheck },
  { to: '/mtu-mss',     label: 'MTU / MSS',               icon: Cpu },
  { to: '/bandwidth',   label: 'Largura de Banda',        icon: Activity },
  { to: '/mikrotik',    label: 'MikroTik Tools',          icon: Wrench },
  { to: '/password',    label: 'Gerador de Senhas',       icon: Lock },
  { to: '/qr',          label: 'Gerador de QR Code',      icon: QrCode },
  { to: '/json',        label: 'Formatador JSON',         icon: FileJson },
  { to: '/base64',      label: 'Base64 Encoder',          icon: Binary },
  { to: '/regex',       label: 'Testador Regex',          icon: Regex },
  { to: '/port-checker',label: 'Teste de Portas',         icon: Network },
  { to: '/about',       label: 'Sobre',                   icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Main navigation">
        <div className="logo">
          <span>NetTools</span>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>

        <nav className="menu">
          {menuItems.map((item) => {
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
        </nav>

        <div className="sidebar-footer">
          <span>NetTools</span>
          <span className="version-badge">v1.1</span>
        </div>
      </aside>
    </>
  );
}
