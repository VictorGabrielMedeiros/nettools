import { NavLink } from 'react-router-dom';
import { Home, Globe, Wifi, BadgeCheck, Cpu, Settings, Wrench } from 'lucide-react';
import './Sidebar.css';

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/ipv4', label: 'Calculadora IPv4', icon: Globe },
  { to: '/subnet', label: 'Calculadora de Sub-redes', icon: Wifi },
  { to: '/ip-analyzer', label: 'Analisador de IP', icon: BadgeCheck },
  { to: '/mtu-mss', label: 'MTU / MSS', icon: Cpu },
  { to: '/bandwidth', label: 'Largura de Banda', icon: Cpu },
  { to: '/mikrotik', label: 'MikroTik Tools', icon: Wrench },
  { to: '/password', label: 'Gerador de Senhas', icon: Wrench },
  { to: '/qr', label: 'Gerador de QR Code', icon: Wrench },
  { to: '/json', label: 'Formatador JSON', icon: Wrench },
  { to: '/base64', label: 'Base64 Encoder', icon: Wrench },
  { to: '/regex', label: 'Testador Regex', icon: Wrench },
  { to: '/port-checker', label: 'Teste de Portas', icon: Wrench },
  { to: '/about', label: 'Sobre', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="logo">NetTools</div>
      <nav className="menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
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
      <div className="footer">NetTools v1.0</div>
    </aside>
  );
}
