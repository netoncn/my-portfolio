# 🌐 Portfólio – Nelson Christovam Neto

Portfólio pessoal desenvolvido em **Next.js + Firebase** para apresentar meus projetos, stack e experiências como **Desenvolvedor Full Stack Sênior**.  
Além da parte pública, o projeto também funciona como um mini CMS, com **área administrativa**, **i18n**, **analytics** e **integração com IA** para gerar descrições de projetos.

> 💡 Este repositório é o código-fonte do site que uso como vitrine profissional.

---

## ✨ Visão geral

A aplicação foi construída do zero com foco em:

- **Experiência de usuário**: layout responsivo, animações sutis e navegação fluida.
- **Performance e escalabilidade**: uso de App Router, Server Components, ISR e Firebase.
- **Manutenibilidade**: tipagem forte com TypeScript, organização em módulos e uso de Biome para lint/format.
- **Autonomia**: painel administrativo para gerenciar projetos, tecnologias e textos sem mexer no código.

---

## 🧩 Funcionalidades

### Área pública

- 🧱 **Landing page** com:
  - Seção *hero* carregando **nome, bio e cargo** a partir do Firestore.
  - Chamada para ação: ver projetos e entrar em contato.
- 📂 **Listagem de projetos**:
  - Filtro por **categoria** (Web, Mobile, API, etc.).
  - Filtro por **tecnologias mais usadas**.
  - Destaque para **“Projetos em destaque”**.
  - Selo visual para projetos **com código fonte** e/ou **em produção**.
- 📄 **Página de detalhes do projeto** (`/projects/[slug]`):
  - Descrição curta e longa (multilíngue).
  - Links para **GitHub** e **deploy em produção**.
  - Lista de tecnologias usadas.
  - Suporte a **galeria de imagens** do projeto.
- 🌓 **Tema claro/escuro** com persistência via `next-themes`.
- 🌎 **Suporte a múltiplos idiomas**:
  - Atualmente: **Português (pt-BR)** e **Inglês (en-US)**.
  - Pronto para expansão (tipagem já contempla `es-ES`).
- 📱 **Design responsivo**:
  - Otimizado para desktop, tablet e mobile.

### Assistente com IA

- 💬 **Chat flutuante** no portfólio:
  - Implementado com `@ai-sdk/react` e API Route em `/api/chat`.
  - Assistente treinado para falar sobre **meus projetos e habilidades**.
  - Respostas em **português brasileiro**, com tom profissional e direto.
  - Faz streaming das mensagens (experiência de chat em tempo real).

### Área administrativa

> Acesso restrito a um e-mail configurado via variável de ambiente.

- 🔐 **Login com Google** (Firebase Auth) limitado a `NEXT_PUBLIC_ADMIN_EMAIL`.
- 📊 **Dashboard** com visão geral dos projetos.
- 🛠️ **Gestão de projetos**:
  - CRUD completo de projetos.
  - Definição de categoria, status (rascunho, publicado, arquivado), destaque, slug e ordem.
  - Associação de tecnologias e URLs (GitHub, deploy).
  - Upload/gestão de URLs de imagens (thumb + galeria).
- 🧠 **Geração de descrição com IA**:
  - Botão “Gerar descrição com IA” direto no formulário do projeto.
  - Gera versões **curta** e **longa** com base em:
    - Título
    - Categoria
    - Tecnologias
    - Opcionalmente, link do GitHub
- ⚙️ **Configurações do portfólio**:
  - Nome, foto de perfil, cargo em múltiplos idiomas.
  - Bio multilíngue.
  - Links de contato (e-mail, GitHub, LinkedIn).
  - Links customizados.

### Analytics & Observabilidade

-📈 Integração com **PostHog**:
  - Eventos de visualização de página.
  - Cliques em botões de contato.
  - Mudança de idioma.
  - Interações no admin (ex: geração de descrição por IA).

### SEO & Acessibilidade

- 🧭 `next-sitemap` configurado com:
  - `sitemap.xml`
  - `robots.txt` com regras específicas (não indexar `/admin` e rotas de API).
- 🧱 Meta tags e manifest para PWA básico.
- ✅ Componentes baseados em **Radix UI** + boas práticas de acessibilidade.

---

## 🛠️ Stack técnica

**Frontend / UI**

- [Next.js 15 (App Router)](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- Design system baseado em **shadcn/ui** + **Radix UI**
- [Framer Motion](https://www.framer.com/motion/) para animações
- [next-themes](https://github.com/pacocoursey/next-themes) para tema claro/escuro
- [sonner](https://sonner.emilkowal.ski/) para toasts

**Backend / Dados**

- Firebase:
  - Firestore (coleções `projects`, `technologies`, `settings`)
  - Auth (login com Google)
- API Routes do Next:
  - `/api/chat` – chat com IA
  - `/api/generate-description` – geração de descrição de projetos
- [Vercel AI SDK / @ai-sdk/openai](https://sdk.vercel.ai/) para integração com OpenAI

**Infra & Qualidade**

- [PostHog](https://posthog.com/) para analytics de produto
- [Biome](https://biomejs.dev/) para lint e formatação
- [next-sitemap](https://github.com/iamvishnusankar/next-sitemap) para SEO

---

## 📂 Estrutura de pastas (resumo)

```bash
src/
  app/
    (regular)/          # Layout e páginas públicas
      page.tsx          # Home
      projects/[slug]/  # Detalhe de projeto
    admin/              # Páginas do painel administrativo
      login/
      projects/
      settings/
    api/
      chat/route.ts                   # Chat com IA
      generate-description/route.ts   # IA p/ descrição de projetos
  components/
    portfolio/         # Hero, grid de projetos, cards, chat widget etc.
    admin/             # Dashboard, forms, tabelas
    auth/              # AuthGuard, botões de login
    ui/                # Componentes de UI (shadcn/ui)
  contexts/
    auth-context.tsx   # Contexto de autenticação Firebase
  i18n/
    client.ts
    request.ts
  messages/
    pt-BR.json
    en-US.json
  lib/
    firebase/          # Config, types, services para Firestore/Auth
    analytics.ts       # Wrapper de eventos do PostHog
    animations.ts      # Variantes do Framer Motion
  styles/
    globals.css
```

---

# ▶️ Como rodar o projeto localmente

## Pré-requisitos

- Node.js ≥ 18.17
- pnpm (recomendado) ou npm/yarn
- Conta no Firebase com Firestore e Auth habilitados
- Chave de API da OpenAI (para recursos de IA, opcional mas recomendado)
- Projeto criado no PostHog (opcional, para analytics)

1. Clonar o repositório

```bash
git clone https://github.com/netoncn/my-portfolio
cd my-portfolio
```

2. Instalar dependências

```bash
pnpm install
# ou
npm install
# ou
yarn install
```

3. Configurar variáveis de ambiente

Use o arquivo .env.example como base:

```bash
cp .env.example .env.local
```

Preencha com os dados do seu projeto:

- Firebase
    - NEXT_PUBLIC_FIREBASE_API_KEY
    - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    - NEXT_PUBLIC_FIREBASE_PROJECT_ID
    - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    - NEXT_PUBLIC_FIREBASE_APP_ID
- PostHog (opcional)
    - NEXT_PUBLIC_POSTHOG_KEY
    - NEXT_PUBLIC_POSTHOG_HOST
- Admin
    - NEXT_PUBLIC_ADMIN_EMAIL → e-mail autorizado a entrar no /admin
- OpenAI
    - OPENAI_API_KEY
- SEO
    - SITE_URL → URL pública do portfólio (ex: https://meu-portfolio.com)

4. Rodar em modo desenvolvimento

```bash
pnpm dev
# ou
npm run dev
# ou
yarn dev
```

Acesse em: http://localhost:3000

5. Build de produção

```bash
pnpm build
pnpm start
```

6. Lint & Formatação

```bash
pnpm lint          # biome check
pnpm format        # biome format --write
pnpm fix           # biome check --write .
```

---

## 🔐 Área administrativa

1. Garanta que NEXT_PUBLIC_ADMIN_EMAIL está definido no .env.local.
2. No navegador, acesse: http://localhost:3000/admin/login
3. Faça login com uma conta Google cujo e-mail bata com o que está na env.
4. Após logado:
    - Gerencie Configurações (nome, bio, links, foto).
    - Crie/edite Projetos e Tecnologias.
    - Use o botão “Gerar descrição com IA” no formulário de projeto.

---

## 🧠 Por que este projeto é relevante para o portfólio

Este portfólio demonstra, na prática:
- Uso moderno de Next.js App Router com Server Components, ISR e API Routes.
- Integração com Firebase (Auth + Firestore) em um fluxo real de produção.
- Implementação de i18n com next-intl e textos multilíngues.
- Criação de painel administrativo customizado com restrição de acesso.
- Integração com OpenAI via Vercel AI SDK, tanto para:
    - Chat com visitantes.
    - Geração de descrições de projetos no admin.
- Implementação de analytics de produto com PostHog, rastreando interações relevantes.

É um projeto fullstack completo, que cobre desde a camada de UI até integrações com serviços externos, pensado para ser usado como vitrine profissional e também como laboratório de boas práticas.
