import { ShieldCheck, Heart, Code } from 'lucide-react';
import './About.css';

export default function About() {
  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Sobre o NetTools</h1>
        <p>A ferramenta canivete suíço para profissionais de redes e infraestrutura.</p>
      </div>

      <div className="about-container">
        <div className="about-card glass-panel">
          <div className="about-icon-wrapper">
            <ShieldCheck size={40} className="about-icon" />
          </div>
          <h2>100% Local e Seguro</h2>
          <p>
            O NetTools foi projetado como uma <strong>aplicação frontend estática (SPA)</strong>. 
            Isso significa que todas as ferramentas, geradores de senha, conversores e calculadoras rodam 
            diretamente no seu navegador. <strong>Nenhum dado sensível é enviado para servidores externos.</strong>
          </p>
        </div>

        <div className="about-grid">
          <div className="about-box glass-panel">
            <h3>Tecnologias</h3>
            <ul className="tech-list">
              <li>React 19 + TypeScript</li>
              <li>Vite (Bundler ultra rápido)</li>
              <li>Lucide Icons (Ícones modernos)</li>
              <li>Cloudflare Pages (Hospedagem Edge)</li>
            </ul>
          </div>
          
          <div className="about-box glass-panel">
            <h3>Versão Atual</h3>
            <div className="version-info">
              <span className="version-number">V2.0</span>
              <span className="version-date">Atualizado recentemente</span>
            </div>
            <p className="version-notes">
              Maior atualização até agora: 10 novos módulos incluindo DNS Lookup, SSL Checker, JWT Decoder, CIDR Planner, Cron Generator, e mais!
            </p>
          </div>
        </div>

        <div className="about-footer glass-panel">
          <p className="made-with">
            Feito com <Heart size={16} className="heart-icon" /> para a comunidade de TI.
          </p>
          <div className="social-links">
            <a href="https://github.com/VictorGabrielMedeiros/nettools" target="_blank" rel="noreferrer" className="social-link">
              <Code size={20} />
              <span>GitHub</span>
            </a>
            {/* Add more links if needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
