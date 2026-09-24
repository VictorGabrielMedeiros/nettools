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
- [ ] V3.0 — Renomear para ITKit + AI/Device Fingerprint na rede

## Funcionalidade V3 — AI Network Fingerprint (pendente)
- Análise visual de padrões de tráfego HTTP/User-Agent
- Identificação de fingerprint de dispositivos suspeitos (UA incomum, comportamento de bot)
- Seção educativa sobre técnicas de detecção de IA e agentes automatizados na rede
- Login screen: **adiado para versão futura** (V4)
