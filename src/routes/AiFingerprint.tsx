import { useState } from 'react';
import { Bot, Monitor, ShieldAlert, ShieldCheck, Info, Cpu, Globe, Eye, BookOpen } from 'lucide-react';
import './AiFingerprint.css';

// Known AI/Bot User-Agent patterns
const AI_BOT_PATTERNS: { pattern: RegExp; name: string; type: 'ai-crawler' | 'bot' | 'automation' }[] = [
  { pattern: /GPTBot/i, name: 'OpenAI GPTBot', type: 'ai-crawler' },
  { pattern: /ChatGPT-User/i, name: 'ChatGPT Browsing', type: 'ai-crawler' },
  { pattern: /Google-Extended/i, name: 'Google Gemini Crawler', type: 'ai-crawler' },
  { pattern: /anthropic-ai/i, name: 'Anthropic Claude Crawler', type: 'ai-crawler' },
  { pattern: /ClaudeBot/i, name: 'Anthropic ClaudeBot', type: 'ai-crawler' },
  { pattern: /PerplexityBot/i, name: 'Perplexity AI', type: 'ai-crawler' },
  { pattern: /Meta-ExternalAgent/i, name: 'Meta AI Crawler', type: 'ai-crawler' },
  { pattern: /CCBot/i, name: 'Common Crawl (treino de IA)', type: 'ai-crawler' },
  { pattern: /DataForSeoBot/i, name: 'DataForSEO Bot', type: 'bot' },
  { pattern: /Googlebot/i, name: 'Googlebot (Search Crawler)', type: 'bot' },
  { pattern: /Bingbot/i, name: 'Bingbot (Microsoft Search)', type: 'bot' },
  { pattern: /DuckDuckBot/i, name: 'DuckDuckGo Bot', type: 'bot' },
  { pattern: /Slurp/i, name: 'Yahoo! Slurp', type: 'bot' },
  { pattern: /facebookexternalhit/i, name: 'Facebook Link Preview Bot', type: 'bot' },
  { pattern: /Twitterbot/i, name: 'Twitter/X Card Bot', type: 'bot' },
  { pattern: /python-requests/i, name: 'Python Requests (Script)', type: 'automation' },
  { pattern: /curl/i, name: 'cURL (Terminal/Script)', type: 'automation' },
  { pattern: /axios/i, name: 'Axios HTTP Client (Node.js)', type: 'automation' },
  { pattern: /Go-http-client/i, name: 'Go HTTP Client', type: 'automation' },
  { pattern: /Java/i, name: 'Java HTTP Client', type: 'automation' },
  { pattern: /HeadlessChrome/i, name: 'Chrome Headless (Automação)', type: 'automation' },
  { pattern: /PhantomJS/i, name: 'PhantomJS (Browser headless)', type: 'automation' },
  { pattern: /Puppeteer/i, name: 'Puppeteer (Automação Node.js)', type: 'automation' },
];

// Fingerprint signals based on browser APIs
function collectBrowserFingerprint() {
  const ua = navigator.userAgent;
  const signals: { key: string; value: string; suspicious: boolean }[] = [];

  signals.push({
    key: 'User-Agent',
    value: ua,
    suspicious: !ua.includes('Mozilla') || ua.length < 30
  });

  signals.push({
    key: 'Plataforma',
    value: navigator.platform || 'Não detectado',
    suspicious: !navigator.platform
  });

  signals.push({
    key: 'Idioma',
    value: navigator.language || 'Não detectado',
    suspicious: !navigator.language
  });

  signals.push({
    key: 'Fuso Horário',
    value: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Não detectado',
    suspicious: false
  });

  signals.push({
    key: 'Número de CPUs (lógicas)',
    value: (navigator.hardwareConcurrency ?? 'Não disponível').toString(),
    suspicious: navigator.hardwareConcurrency === 1 // bots often single-threaded
  });

  signals.push({
    key: 'Memória RAM (aprox.)',
    value: ((navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'Não disponível'),
    suspicious: (navigator as any).deviceMemory === undefined
  });

  signals.push({
    key: 'Toque disponível',
    value: navigator.maxTouchPoints > 0 ? `Sim (${navigator.maxTouchPoints} pontos)` : 'Não',
    suspicious: false
  });

  signals.push({
    key: 'WebGL Renderer',
    value: (() => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        const ext = gl?.getExtension('WEBGL_debug_renderer_info');
        return ext ? (gl?.getParameter(ext.UNMASKED_RENDERER_WEBGL) || 'Indisponível') : 'Ext. não suportada';
      } catch {
        return 'Bloqueado';
      }
    })(),
    suspicious: false
  });

  signals.push({
    key: 'Cookies habilitados',
    value: navigator.cookieEnabled ? 'Sim' : 'Não',
    suspicious: !navigator.cookieEnabled
  });

  signals.push({
    key: 'Do Not Track',
    value: navigator.doNotTrack === '1' ? 'Ativado' : 'Desativado',
    suspicious: false
  });

  return signals;
}

function classifyUserAgent(ua: string) {
  for (const { pattern, name, type } of AI_BOT_PATTERNS) {
    if (pattern.test(ua)) {
      return { name, type };
    }
  }
  // Generic detection
  if (/bot|crawl|spider|scraper|fetch|httpclient/i.test(ua)) {
    return { name: 'Bot genérico detectado', type: 'bot' as const };
  }
  return null;
}

type TabType = 'scanner' | 'checker' | 'guide';

export default function AiFingerprint() {
  const [activeTab, setActiveTab] = useState<TabType>('scanner');
  const [fingerprint, setFingerprint] = useState<ReturnType<typeof collectBrowserFingerprint> | null>(null);
  const [botCheck, setBotCheck] = useState<string>('');
  const [botResult, setBotResult] = useState<ReturnType<typeof classifyUserAgent> | 'clean' | null>(null);

  const runFingerprint = () => {
    setFingerprint(collectBrowserFingerprint());
  };

  const checkUserAgent = () => {
    const ua = botCheck.trim() || navigator.userAgent;
    const result = classifyUserAgent(ua);
    setBotResult(result ?? 'clean');
  };

  const suspiciousCount = fingerprint?.filter(s => s.suspicious).length ?? 0;

  const TYPE_COLORS: Record<string, string> = {
    'ai-crawler': '#f59e0b',
    'bot': '#3b82f6',
    'automation': '#8b5cf6',
    'clean': '#10b981',
  };

  const TYPE_LABELS: Record<string, string> = {
    'ai-crawler': 'AI Crawler',
    'bot': 'Web Bot',
    'automation': 'Automação',
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>AI & Device Fingerprint</h1>
        <p>Detecte presença de IAs, bots e scripts automatizados na rede. Analise fingerprints de dispositivos para identificar acessos suspeitos.</p>
      </div>

      <div className="fp-tabs">
        <button className={`fp-tab ${activeTab === 'scanner' ? 'active' : ''}`} onClick={() => setActiveTab('scanner')}>
          <Eye size={18} /> Fingerprint Scanner
        </button>
        <button className={`fp-tab ${activeTab === 'checker' ? 'active' : ''}`} onClick={() => setActiveTab('checker')}>
          <Bot size={18} /> Verificador de Bot/UA
        </button>
        <button className={`fp-tab ${activeTab === 'guide' ? 'active' : ''}`} onClick={() => setActiveTab('guide')}>
          <BookOpen size={18} /> Guia de Detecção
        </button>
      </div>

      {/* === TAB 1: SCANNER === */}
      {activeTab === 'scanner' && (
        <div className="fp-content">
          <div className="fp-intro glass-panel">
            <Monitor size={24} className="text-accent" />
            <div>
              <h3>Browser Fingerprint do Dispositivo Atual</h3>
              <p>Coleta sinais passivos do seu dispositivo para identificar padrões incomuns que podem indicar uso de bots, headless browsers ou ambientes automatizados.</p>
            </div>
          </div>

          <button className="btn-primary scan-btn" onClick={runFingerprint}>
            <Cpu size={18} />
            Executar Análise de Fingerprint
          </button>

          {fingerprint && (
            <div className="fp-results">
              <div className={`risk-banner ${suspiciousCount === 0 ? 'safe' : suspiciousCount <= 2 ? 'moderate' : 'high'}`}>
                {suspiciousCount === 0
                  ? <><ShieldCheck size={24} /> Dispositivo parece legítimo — nenhum sinal suspeito encontrado</>
                  : <><ShieldAlert size={24} /> {suspiciousCount} sinal(is) suspeito(s) detectado(s)</>
                }
              </div>

              <div className="signals-grid">
                {fingerprint.map((signal, idx) => (
                  <div key={idx} className={`signal-card glass-panel ${signal.suspicious ? 'suspicious' : ''}`}>
                    <div className="signal-key">{signal.key}</div>
                    <div className="signal-value">{signal.value}</div>
                    {signal.suspicious && (
                      <div className="signal-flag">
                        <ShieldAlert size={14} /> Sinal suspeito
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* === TAB 2: UA CHECKER === */}
      {activeTab === 'checker' && (
        <div className="fp-content">
          <div className="glass-panel checker-box">
            <h2>Verificador de User-Agent</h2>
            <p>Cole um User-Agent capturado em logs de rede ou proxy para identificar se pertence a uma IA, crawler, bot ou script automatizado.</p>

            <div className="form-group">
              <label htmlFor="ua-input">User-Agent para analisar</label>
              <textarea
                id="ua-input"
                className="ua-textarea"
                placeholder={`Exemplo:\nMozilla/5.0 (compatible; GPTBot/1.0; +https://openai.com/gptbot)\n\nOu deixe em branco para usar o UA do seu navegador atual.`}
                value={botCheck}
                onChange={(e) => setBotCheck(e.target.value)}
              />
            </div>

            <button className="btn-primary" onClick={checkUserAgent}>
              <Bot size={18} />
              Analisar User-Agent
            </button>

            {botResult && (
              <div className="ua-result" style={{ '--result-color': botResult === 'clean' ? TYPE_COLORS.clean : TYPE_COLORS[(botResult as any).type] } as any}>
                {botResult === 'clean' ? (
                  <>
                    <ShieldCheck size={28} />
                    <div>
                      <strong>Nenhuma ameaça detectada</strong>
                      <p>Este User-Agent não corresponde a nenhum padrão conhecido de IA, bot ou automação.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Bot size={28} />
                    <div>
                      <span className="ua-type-badge">{TYPE_LABELS[(botResult as any).type]}</span>
                      <strong>{(botResult as any).name}</strong>
                      <p>Este User-Agent corresponde a um agente automatizado ou rastreador de IA conhecido.</p>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="known-bots-list">
              <h3>Agentes Monitorados ({AI_BOT_PATTERNS.length})</h3>
              <div className="bots-grid">
                {AI_BOT_PATTERNS.map((p, i) => (
                  <div key={i} className="bot-tag" style={{ borderColor: TYPE_COLORS[p.type] }}>
                    <span className="bot-dot" style={{ background: TYPE_COLORS[p.type] }} />
                    {p.name}
                  </div>
                ))}
              </div>
              <div className="legend">
                <span><span className="dot" style={{ background: TYPE_COLORS['ai-crawler'] }} />AI Crawler</span>
                <span><span className="dot" style={{ background: TYPE_COLORS['bot'] }} />Web Bot</span>
                <span><span className="dot" style={{ background: TYPE_COLORS['automation'] }} />Automação</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === TAB 3: GUIDE === */}
      {activeTab === 'guide' && (
        <div className="fp-content guide-content">
          <div className="guide-section glass-panel">
            <div className="guide-icon"><Globe size={28} /></div>
            <h2>Como Detectar IAs e Bots na Sua Rede?</h2>
            <p>Guia prático para administradores de rede e sysadmins identificarem acessos não-autorizados por agentes automatizados.</p>
          </div>

          {[
            {
              title: '1. Análise de User-Agent nos Logs',
              icon: <Bot size={20} />,
              color: '#f59e0b',
              content: [
                'Inspecione os logs do seu servidor web (Apache/Nginx) ou proxy (Squid/pfSense) em busca de strings como GPTBot, ClaudeBot, Python-requests, curl, Puppeteer.',
                'Ferramentas: grep nos access.log, Graylog, ELK Stack (Elasticsearch + Kibana), ou Cloudflare Analytics.',
                'Ação: crie regras de bloqueio no WAF (Web Application Firewall) ou no seu nginx.conf para UAs suspeitos.',
              ]
            },
            {
              title: '2. Padrões de Tráfego Anômalos',
              icon: <Eye size={20} />,
              color: '#3b82f6',
              content: [
                'Bots e AIs tendem a gerar rajadas de requisições em horários incomuns (madrugada) ou com intervalo de tempo muito regular (ex: a cada 100ms exato).',
                'O volume por IP costuma ser 10-100x maior que um usuário humano normal.',
                'Ferramentas de análise: ntopng, Zeek (Bro), Grafana + Prometheus, Cloudflare Bot Management.',
              ]
            },
            {
              title: '3. Fingerprint de TLS/JA3',
              icon: <Cpu size={20} />,
              color: '#8b5cf6',
              content: [
                'Cada client TLS tem uma "assinatura" chamada JA3 Hash, baseada nos parâmetros do handshake SSL (ciphersuites, extensões, etc).',
                'Bots e scripts em Python/Go/Java possuem JA3 hashes distintos de browsers reais (Chrome, Firefox, Safari).',
                'O Cloudflare e soluções como Suricata/Zeek podem extrair e comparar JA3 hashes com bancos de dados de ameaças conhecidos.',
              ]
            },
            {
              title: '4. Honeypots e Links Armadilha',
              icon: <ShieldAlert size={20} />,
              color: '#ef4444',
              content: [
                'Insira links "invisíveis" para humanos (display:none no CSS) mas visíveis para crawlers no HTML da sua aplicação.',
                'Qualquer acesso a esses links é garantidamente um bot ou AI crawler, pois humanos não os veriam.',
                'Registre o IP e o UA do acesso, adicione à lista de bloqueio automaticamente.',
              ]
            },
            {
              title: '5. Rate Limiting e CAPTCHAs',
              icon: <ShieldCheck size={20} />,
              color: '#10b981',
              content: [
                'Configure rate limiting no seu WAF/proxy: ex., máx. 60 req/min por IP. Bots excedem isso facilmente.',
                'Desafios JavaScript (como o Cloudflare Turnstile) são muito eficazes pois requerem execução de JS com comportamento humano.',
                'O robots.txt declara quais bots estão autorizados — embora AIs desonestas possam ignorar.',
              ]
            },
          ].map((section, idx) => (
            <div key={idx} className="guide-card glass-panel">
              <div className="guide-card-header" style={{ borderLeftColor: section.color }}>
                <span style={{ color: section.color }}>{section.icon}</span>
                <h3>{section.title}</h3>
              </div>
              <ul className="guide-list">
                {section.content.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div className="guide-footer glass-panel">
            <Info size={20} className="text-secondary" />
            <p>Este guia foi desenvolvido com o apoio de profissionais de segurança de redes e tem caráter educativo. Sempre consulte um especialista em segurança antes de implementar bloqueios em redes de produção.</p>
          </div>
        </div>
      )}
    </div>
  );
}
