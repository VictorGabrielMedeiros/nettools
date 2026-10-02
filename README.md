# 🛠️ ITKit — Network & IT Toolkit (v4.5)

O **ITKit** é uma suíte completa de ferramentas web para profissionais de redes, infraestrutura, cibersegurança e desenvolvedores. Projetado com visual moderno em *Glassmorphism*, modo escuro e interface responsiva.

> 🔒 **100% Client-Side & Seguro**: Todas as operações rodam diretamente no navegador do usuário. Nenhum dado sensível (senhas, hashes, chaves JWT, configurações de roteadores) é enviado para servidores externos.

---

## 🧰 Ferramentas Disponíveis

### 🌐 Redes & IP
- **Meu IP Público**: Detecção de IPv4 e IPv6, provedor (ISP) e geolocalização.
- **Calculadora IPv4**: Cálculo completo de máscaras, faixas de rede, broadcast e classes.
- **Subnet Calculator**: Divisão e planejamento de sub-redes.
- **IP Analyzer**: Informações detalhadas sobre endereçamento IP e formatos binários.
- **CIDR Planner**: Planejamento e organização de blocos CIDR.
- **Network Planner**: Desenho e visualização de topologias de sub-redes.
- **MTU / MSS**: Cálculo de MTU, MSS e overhead para túneis e PPPoE.
- **Largura de Banda**: Conversor e estimador de tempo de transferência de dados.
- **MAC/OUI Analyzer**: Identificação de fabricante e conversão de formato MAC.

### 🛡️ Segurança & DNS
- **DNS Lookup**: Consultas completas de registros DNS (A, AAAA, MX, TXT, CNAME, etc.).
- **WHOIS / RDAP**: Consulta de informações públicas de domínios e nameservers.
- **SPF/DKIM Analyzer**: Verificação de segurança de entrega de e-mail (SPF, DKIM, DMARC).
- **SSL/TLS Checker**: Verificação de certificado e expiração SSL.
- **Security Headers**: Auditoria de cabeçalhos HTTP recomendados.
- **AI/Bot Fingerprint**: Detecção de inteligências artificiais e bots na rede com guia educativo.
- **Teste de Portas**: Verificação de status de portas de rede comuns.

### 🔑 Utilitários & Criptografia
- **Gerador de Senhas**: Criação de senhas criptograficamente seguras via Web Crypto API.
- **Base64 Encoder/Decoder**: Conversão de texto para Base64 e vice-versa.
- **Hash Generator**: Geração de hashes SHA-1, SHA-256 e SHA-512 nativos.
- **URL Encoder/Decoder**: Codificação de URLs com suporte a caracteres especiais.
- **JWT Decoder**: Análise e decodificação local de tokens JWT.

### 💻 Dev & Sysadmin
- **MikroTik Tools (v4.5)**: Gerador modular de scripts com **prevenção ativa de incompatibilidade entre RouterOS v6 e v7**:
  - VLAN (Sub-interface e Bridge VLAN Filtering)
  - Bridge com Hardware Offloading
  - IP Address & DHCP Server
  - NAT Masquerade & Port Forward
  - PPPoE Client
  - **Failover Dual WAN** (Recursivo com DNS público 1.1.1.1/8.8.8.8 e Check-Gateway)
  - **Load Balance PCC** (2 Links WAN com tolerância a falhas)
  - WireGuard Server (Exclusivo v7 com alerta para v6)
  - NTP Client (adaptação automática de `servers=` no v7 vs `primary-ntp` legado no v6)
  - Rotas Estáticas & Policy Routing (`routing-table` + FIB no v7 vs `routing-mark` no v6)
  - DNS Cache & DNS over HTTPS (DoH)
- **Testador Regex**: Teste e validação de expressões regulares em tempo real.
- **Formatador JSON**: Validação, formatação e minificação de JSON.
- **Calculadora Chmod**: Conversor numérico e simbólico de permissões Linux.
- **Cron Generator**: Criação e tradução amigável de expressões Cron.
- **Gerador de QR Code**: Geração de QR Code para Wi-Fi, textos e URLs.

---

## 🚀 Começando

### Pré-requisitos
- Node.js 18+ (recomendado Node 20+)
- npm ou yarn

### Instalação e Execução Local

```bash
# Clonar o repositório
git clone https://github.com/VictorGabrielMedeiros/nettools.git
cd nettools

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Abra no navegador em `http://localhost:5173`.

### Compilar para Produção

```bash
npm run build
```
Os arquivos otimizados serão gerados na pasta `dist/`.

---

## 📦 Hospedagem e Deploy

O ITKit pode ser hospedado tanto em plataformas serverless como **Cloudflare Pages**, quanto em servidores próprios (**Self-Hosted** via Docker, Nginx, Caddy ou Apache).

Consulte o guia detalhado:
👉 **[Guia Completo de Deploy (DEPLOY.md)](DEPLOY.md)**

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vite.dev/)
- **Roteamento**: [React Router](https://reactrouter.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 📄 Licença

Distribuído sob a licença MIT. Feito para a comunidade de TI e redes!
