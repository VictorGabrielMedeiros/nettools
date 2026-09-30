# Guia Completo de Hospedagem e Deploy — ITKit

O **ITKit** é uma aplicação web moderna construída como **SPA (Single Page Application)** com React 19, TypeScript e Vite.
Por ser **100% estático (client-side)**, ele não depende de banco de dados ou backend próprio para executar suas funções principais, o que torna sua hospedagem extremamente rápida, segura e de baixíssimo custo.

---

## Índice
1. [Hospedagem no Cloudflare Pages (Recomendado)](#1-hospedagem-no-cloudflare-pages-recomendado)
   - [Opção A: Deploy Automático via GitHub (CI/CD)](#opção-a-deploy-automático-via-github-cicd)
   - [Opção B: Deploy Manual via Wrangler CLI](#opção-b-deploy-manual-via-wrangler-cli)
   - [Roteamento SPA e o arquivo `_redirects`](#roteamento-spa-e-o-arquivo-_redirects)
   - [Atenção: Pages vs Workers](#atenção-pages-vs-workers)
2. [Hospedagem Própria (Self-Hosted)](#2-hospedagem-própria-self-hosted)
   - [Opção A: Docker e Docker Compose (Mais Fácil)](#opção-a-docker-e-docker-compose-mais-fácil)
   - [Opção B: Nginx Standalone](#opção-b-nginx-standalone)
   - [Opção C: Caddy Server (HTTPS Automático)](#opção-c-caddy-server-https-automático)
   - [Opção D: Node.js com `serve` ou PM2](#opção-d-nodejs-com-serve-ou-pm2)
   - [Opção E: Apache (.htaccess)](#opção-e-apache-htaccess)
3. [Dicas de Segurança e Desempenho](#3-dicas-de-segurança-e-desempenho)

---

## 1. Hospedagem no Cloudflare Pages (Recomendado)

O Cloudflare Pages oferece rede global Anycast (Edge CDN), SSL automático e tráfego ilimitado gratuito.

### Opção A: Deploy Automático via GitHub (CI/CD)

1. Acesse o painel do [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. No menu lateral, navegue até **Workers & Pages** > **Create application** > aba **Pages** > selecione **Connect to Git**.
3. Conecte sua conta do GitHub e selecione o repositório `nettools` (ou `itkit`).
4. Preencha as configurações de build com exatidão:
   - **Project Name**: `itkit` (ou de sua preferência)
   - **Production branch**: `main`
   - **Framework preset**: `Vite` (ou deixe `None`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: *(deixe vazio — raiz do projeto)*
5. Clique em **Save and Deploy**.
6. A cada `git push` na branch `main`, a Cloudflare gerará automaticamente uma nova versão do site.

---

### Opção B: Deploy Manual via Wrangler CLI

Se preferir fazer deploy direto do seu terminal sem conectar o Git à Cloudflare:

1. Certifique-se de que compilou o projeto:
   ```bash
   npm run build
   ```
2. Realize o deploy com o Wrangler:
   ```bash
   npx wrangler pages deploy dist --project-name itkit
   ```
   *(Ou execute `npm run deploy` que já inclui o build + deploy)*

---

### Roteamento SPA e o arquivo `_redirects`

Como o ITKit utiliza `react-router-dom` com histórico HTML5 (BrowserRouter), ao recarregar a página diretamente em uma rota interna (ex: `/my-ip` ou `/subnet`), o servidor precisa entregar o `index.html` em vez de retornar erro 404.

O projeto já contém o arquivo [`public/_redirects`](public/_redirects) com a regra:
```text
/* /index.html 200
```
Durante o `npm run build`, o Vite copia esse arquivo automaticamente para `dist/_redirects`, garantindo funcionamento perfeito no Cloudflare Pages.

---

### Atenção: Pages vs Workers

> [!WARNING]
> **Cuidado para não criar o projeto como Cloudflare Worker!**
> - Se a URL gerada terminar em `.workers.dev` ou o painel exibir campos como *"Version command"*, você criou um Worker em vez de uma aplicação Pages.
> - Se isso ocorrer, exclua e crie novamente na aba **Pages**.
> - O campo **Diretório raiz** deve ser onde está o `package.json`, e **NÃO** a pasta `dist`.

---

## 2. Hospedagem Própria (Self-Hosted)

Em um ambiente self-hosted (VPS Linux, servidor local, homelab ou Proxmox), o ponto mais importante para qualquer SPA é configurar o **fallback para `index.html`**.

---

### Opção A: Docker e Docker Compose (Mais Fácil)

O projeto já possui os arquivos [`Dockerfile`](Dockerfile), [`nginx.conf`](nginx.conf) e [`docker-compose.yml`](docker-compose.yml) prontos para uso.

#### 1. Subindo com Docker Compose:
```bash
docker compose up -d --build
```
Acesse no navegador: `http://SEU_IP:8080`.

#### 2. Subindo com Docker puro:
```bash
# Construir imagem
docker build -t itkit:latest .

# Rodar container na porta 8080
docker run -d --name itkit-app -p 8080:80 --restart unless-stopped itkit:latest
```

---

### Opção B: Nginx Standalone

Caso você já possua um servidor Nginx rodando em Ubuntu/Debian/CentOS:

1. Compile o projeto localmente ou no servidor:
   ```bash
   npm ci
   npm run build
   ```
2. Copie o conteúdo da pasta `dist/` para a pasta web do servidor (ex: `/var/www/itkit`):
   ```bash
   sudo mkdir -p /var/www/itkit
   sudo cp -r dist/* /var/www/itkit/
   sudo chown -R www-data:www-data /var/www/itkit
   ```
3. Crie um arquivo de configuração no Nginx (ex: `/etc/nginx/sites-available/itkit.conf`):
   ```nginx
   server {
       listen 80;
       server_name itkit.suaempresa.com; # ou seu IP

       root /var/www/itkit;
       index index.html;

       # Compressão Gzip
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

       # Cache de longa duração para arquivos imutáveis (Vite hash)
       location /assets/ {
           expires 1y;
           add_header Cache-Control "public, no-transform, immutable";
       }

       # Roteamento SPA (Fallback para index.html)
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```
4. Ative a configuração e recarregue o Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/itkit.conf /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

### Opção C: Caddy Server (HTTPS Automático)

O [Caddy](https://caddyserver.com/) é conhecido por emitir certificados SSL/TLS automáticos com zero configuração.

Exemplo de `Caddyfile`:
```caddy
itkit.seudominio.com {
    root * /var/www/itkit
    file_server
    try_files {path} /index.html
    encode gzip zstd
}
```

---

### Opção D: Node.js com `serve` ou PM2

Se desejar servir rapidamente via Node:

```bash
# Instalar utilitário serve
npm install -g serve

# Compilar
npm run build

# Executar em modo SPA (-s redireciona rotas para index.html)
serve -s dist -l 3000
```

Para manter ativo em segundo plano com **PM2**:
```bash
pm2 start "serve -s dist -l 3000" --name "itkit"
pm2 save
pm2 startup
```

---

### Opção E: Apache (.htaccess)

Se hospedar em servidor Apache, crie um arquivo `.htaccess` dentro do diretório raiz onde os arquivos de `dist/` foram colocados:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 3. Dicas de Segurança e Desempenho

1. **HTTPS Obrigatório**:
   - Sempre utilize HTTPS para que a [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) funcione adequadamente (usada no Gerador de Hashes e Senhas do ITKit).
2. **Sem Backend / Zero Vazamento**:
   - Nenhuma ferramenta envia dados privados para servidores próprios. Ferramentas que fazem consultas de IP/DNS utilizam endpoints públicos com CORS habilitado diretamente do navegador do cliente.
3. **Cache de Assets**:
   - Os arquivos em `/assets/` contêm hash único gerado pelo Vite (ex: `index-BtlsJC_z.css`). Eles podem ser armazenados em cache por até 1 ano (`Cache-Control: immutable`).
