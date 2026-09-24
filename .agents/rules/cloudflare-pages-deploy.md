# Cloudflare Pages — Deploy de SPA Vite/React

Ao fazer deploy de projetos Vite/React no Cloudflare Pages, sempre usar:

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: vazio (raiz do repositório, NÃO a pasta dist)
- **Deploy/Version commands**: deixar vazios (esses campos pertencem a Cloudflare Workers)

Se a URL terminar em `.workers.dev` ou o painel mostrar "Version command",
o projeto foi criado como Worker em vez de Pages. Recriar como Pages.

O "Diretório raiz" = de onde o npm roda (onde está o package.json),
NÃO é o output dir. Confundir os dois causa o "Hello World" padrão.
