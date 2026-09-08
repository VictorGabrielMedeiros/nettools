import { Moon, Sun, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import './Header.css';

export default function Header() {
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
        <button className="mobile-menu-btn" aria-label="Toggle Menu">
          <Menu size={24} />
        </button>
        <div className="header-title">
          <h2>Network & IT Toolkit</h2>
          <p className="subtitle">Ferramentas rápidas para diagnóstico, cálculo e administração de redes.</p>
        </div>
      </div>
      
      <div className="header-right">
        <div className="search-bar">
          <input type="text" placeholder="Pesquisar ferramenta..." />
        </div>
        <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
