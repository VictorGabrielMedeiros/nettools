# Contexto do Projeto — ITKit (ex-NetTools)

## Identidade
- **Nome do projeto**: ITKit (anteriormente chamado NetTools)
- O nome foi alterado para evitar conflito com outra ferramenta já existente chamada "Nettolls"
- O repositório GitHub pode continuar como `nettools` por compatibilidade, mas a UI e títulos devem usar **ITKit**

## Stack e Infraestrutura
- **Frontend**: Vite + React + TypeScript
- **Roteamento**: React Router (BrowserRouter)
- **Hospedagem**: Cloudflare Pages
- **Estilo**: CSS Vanilla com Glassmorphism, modo escuro, cor de acento teal (`hsl(174,60%,45%)`)
- **Versão atual**: V2.0 (V3 em desenvolvimento)

## Restrições Arquiteturais
- Aplicação 100% estática (client-side only, sem backend)
- Qualquer ferramenta que exija servidor deve ser claramente sinalizada como "simulada" ou redirecionar para serviços externos

## Público-alvo
- Profissionais de redes
- Profissionais de desenvolvimento/DevOps
- Estudantes de redes (contexto acadêmico — professor de redes envolvido no roadmap)

## Roadmap Aprovado
- [x] V1.0 — Ferramentas base de rede e utilitários
- [x] V1.1 — Base64, Port Checker, responsividade mobile
- [x] V2.0 — 10 novas ferramentas (DNS, CIDR, JWT, Chmod, Cron, MAC, etc.)
- [x] V3.0 — Renomeado para ITKit + AI/Device Fingerprint na rede
- [x] V3.0 — Renomeado para ITKit + AI/Device Fingerprint na rede
- [ ] V4.0 — Meu IP Público, WHOIS, Hash Generator e URL Encoder

## Funcionalidade V4 — Ferramentas Compatíveis (Client-Side)
- **Meu IP Público (IPv4/IPv6)**: Consulta a APIs públicas (ex: ipapi.co) para mostrar IP, provedor (ISP) e localização geográfica sem violar CORS.
- **Hash Generator**: SHA-1, SHA-256, SHA-512 (usando Web Crypto API nativa do navegador).
- **URL/URI Encoder/Decoder**: Conversão de strings para formato seguro de URL.
- **WHOIS Lookup (via API pública)**: Consulta de registro de domínios usando serviços gratuitos com CORS liberado.
- Login screen: **adiado para versão futura** (V5+)
