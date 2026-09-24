import { Moon, Sun, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import './Header.css';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="header glass-panel">
      <div className="header-left">
        <button
          className="mobile-menu-btn"
          onClick={onMenuToggle}
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
        <div className="header-brand">
          <span className="brand-name">ITKit</span>
          <span className="brand-sub">Network &amp; IT Toolkit</span>
        </div>
      </div>

      <div className="header-right">
        <button onClick={toggleTheme} className="theme-toggle" aria-label="Alternar tema">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
