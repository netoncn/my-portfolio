# 🌐 Portfólio – Nelson Christovam Neto

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.5-orange?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Portfólio pessoal desenvolvido em **Next.js + Firebase + Supabase** para apresentar meus projetos, stack e experiências como **Desenvolvedor Full Stack Sênior**.

Além da parte pública, o projeto funciona como um **CMS completo**, com **área administrativa**, **i18n (3 idiomas)**, **analytics**, **SEO otimizado** e **integração com IA** para gerar descrições multilíngues de projetos.

> 💡 Este repositório é o código-fonte do site que uso como vitrine profissional.
> 🌐 **Acesse:** [netoncn.com.br](https://netoncn.com.br)

---

## ✨ Destaques

- ✅ **SEO Completo**: Open Graph, Twitter Cards, JSON-LD, Sitemap Dinâmico
- ✅ **IA Integrada**: Gera descrições de projetos em 3 idiomas simultaneamente
- ✅ **CMS Administrável**: Painel completo para gerenciar projetos sem tocar no código
- ✅ **Multilíngue**: Suporte total para pt-BR, en-US e es-ES
- ✅ **Performance**: ISR, Server Components, Compressão Brotli/Gzip
- ✅ **Modern Stack**: Next.js 16, React 19, TypeScript 5, Tailwind 4

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Stack Técnica](#️-stack-técnica)
- [SEO & Performance](#-seo--performance)
- [Como Rodar](#️-como-rodar-o-projeto)
- [Área Administrativa](#-área-administrativa)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Deploy](#-deploy)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🧩 Funcionalidades

### 🌍 Área Pública

#### Landing Page
- **Hero Section** dinâmica carregando dados do Firestore (nome, bio, cargo)
- **Foto de perfil** com upload e gestão via Supabase Storage
- Chamadas para ação: ver projetos e entrar em contato
- Design responsivo e acessível

#### Listagem de Projetos
- 🔍 Filtro por **categoria** (Web, Mobile, Desktop, API, Library, Other)
- 🏷️ Filtro por **tecnologias** mais usadas
- ⭐ Destaque para **projetos em evidência**
- 🔓 Selos visuais para projetos **com código fonte** e/ou **em produção**
- 📱 Grid responsivo (1/2/3 colunas conforme viewport)

#### Página de Detalhes do Projeto
- **Multilíngue**: título, descrições curta e longa em 3 idiomas
- Links para **GitHub** e **deploy em produção**
- Lista de **tecnologias** utilizadas
- **Galeria de imagens** do projeto (Lightbox)
- **Breadcrumbs** para navegação
- **SEO otimizado** com metadata específica

#### Recursos Gerais
- 🌓 **Tema claro/escuro** com persistência (`next-themes`)
- 🌎 **Suporte a 3 idiomas**: pt-BR, en-US, es-ES
- 📱 **Design responsivo** (mobile-first)
- ♿ **Acessibilidade** (componentes Radix UI)

### 🤖 Assistente com IA

#### Chat Público
- 💬 **Chat widget flutuante** no portfólio
- Implementado com `@ai-sdk/react` e API Route
- Assistente treinado para responder sobre **projetos e habilidades**
- Respostas em **português brasileiro**
- **Streaming** de mensagens em tempo real
- Contexto sobre todos os projetos publicados

### 🛠️ Área Administrativa

> Acesso restrito via `NEXT_PUBLIC_ADMIN_EMAIL`

#### Autenticação
- 🔐 **Login com Google** (Firebase Auth)
- Restrição por e-mail autorizado
- Session management com contexto React
- Proteção de rotas com AuthGuard

#### Dashboard
- 📊 Visão geral dos projetos
- Estatísticas rápidas
- Acesso rápido às funcionalidades

#### Gestão de Projetos
- **CRUD completo** de projetos
- **Upload de imagens** para Supabase Storage (thumbnail + galeria)
- Campos multilíngues (título, descrições curta e longa)
- Definição de:
  - Categoria e status (draft, published, archived)
  - Projeto em destaque
  - Slug personalizado (auto-gerado)
  - Ordem de exibição
  - URLs (GitHub, produção)
  - Disponibilidade de código fonte
- **Validação com Zod** em todos os formulários

#### 🧠 Geração de Descrição com IA (NOVO!)
- **Botão "Gerar Descrição com IA"** nos formulários
- Gera descrições em **3 idiomas simultaneamente** (pt-BR, en-US, es-ES)
- Duas modalidades:
  - **Descrição curta**: 2-3 frases, máx 150 caracteres
  - **Descrição longa**: 3-4 parágrafos detalhados
- Baseado em:
  - Título do projeto
  - Categoria
  - Tecnologias utilizadas
  - Opcionalmente: link do GitHub para análise
  - Descrições anteriores (para melhorar/refinar)
- **Preenche automaticamente** os 3 campos de idioma
- Powered by GPT-4 via OpenAI SDK

#### Gestão de Tecnologias
- CRUD de tecnologias
- Contador de uso em projetos
- Auto-incremento/decremento ao associar/desassociar

#### Configurações do Portfólio
- Nome e foto de perfil
- **Cargo** em 3 idiomas
- **Bio** multilíngue
- Links de contato (email, GitHub, LinkedIn)
- Links customizados (label + URL multilíngue)
- **Meta tags personalizadas** para SEO

### 📈 Analytics & Observabilidade

- **PostHog** integrado para:
  - Page views automáticos
  - Eventos customizados:
    - Cliques em botões de contato
    - Mudança de idioma
    - Uso de IA para descrições
    - Criação/edição de projetos
- **Vercel Analytics** (opcional)
- **Vercel Speed Insights** (opcional)

### 🔍 SEO & Performance (NOVO!)

#### Metadata Dinâmica
- **Homepage**: Metadata gerada a partir das configurações do Firebase
- **Projetos**: Metadata única por projeto com:
  - Open Graph tags
  - Twitter Cards (summary_large_image)
  - Canonical URLs
  - Datas de publicação/modificação
  - Keywords baseadas em tecnologias

#### Open Graph Images Dinâmicas
- Endpoint `/api/og` gera imagens OG personalizadas
- Tamanho otimizado: 1200x630px
- Design responsivo com gradientes
- Suporte a temas claro/escuro
- Título e descrição customizáveis

#### JSON-LD / Structured Data
- **Person Schema**: Informações do desenvolvedor
- **WebSite Schema**: Dados do portfólio
- **SoftwareSourceCode Schema**: Cada projeto
- **BreadcrumbList Schema**: Navegação estruturada
- Totalmente compatível com Google Rich Results

#### Sitemap & Robots
- **Sitemap.xml dinâmico**: Atualiza automaticamente com novos projetos
- Prioridades inteligentes:
  - Homepage: 1.0
  - Projetos em destaque: 0.9
  - Projetos normais: 0.7
- **Robots.txt dinâmico**: Bloqueia indexação de `/admin` e `/api`
- Change frequency otimizada por tipo de conteúdo

#### Performance
- **ISR (Incremental Static Regeneration)**: Revalidação a cada 1 hora
- **Server Components**: Renderização no servidor
- **Compressão Brotli + Gzip**: Assets comprimidos automaticamente
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Geist Sans e Geist Mono com preload
- **DNS Prefetch**: Firebase, PostHog
- **Code Splitting**: Componentes lazy-loaded

#### Acessibilidade
- Componentes baseados em **Radix UI**
- Navegação por teclado
- Aria labels e roles
- Contraste adequado (WCAG AA)
- Landmarks semânticos

---

## 🛠️ Stack Técnica

### Frontend / UI

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| [Next.js](https://nextjs.org/) | 16.0 | React framework com App Router |
| [React](https://react.dev/) | 19.2 | Biblioteca UI |
| [TypeScript](https://www.typescriptlang.org/) | 5.0 | Tipagem estática |
| [Tailwind CSS](https://tailwindcss.com/) | 4.0 | Utility-first CSS |
| [shadcn/ui](https://ui.shadcn.com/) | - | Design system components |
| [Radix UI](https://www.radix-ui.com/) | - | Primitivos acessíveis |
| [Framer Motion](https://www.framer.com/motion/) | 12.23 | Animações |
| [next-themes](https://github.com/pacocoursey/next-themes) | 0.4 | Tema claro/escuro |
| [sonner](https://sonner.emilkowal.ski/) | 1.7 | Toast notifications |
| [next-intl](https://next-intl.dev/) | 4.4 | Internacionalização |
| [Lucide Icons](https://lucide.dev/) | 0.454 | Ícones |

### Backend / Dados

| Tecnologia | Descrição |
|------------|-----------|
| **Firebase** | Backend as a Service |
| ├─ Firestore | NoSQL database (projetos, tecnologias, settings) |
| └─ Auth | Autenticação com Google |
| **Supabase** | Storage para imagens |
| **API Routes** | Next.js serverless functions |
| ├─ `/api/chat` | Chat com IA |
| ├─ `/api/generate-description` | Gera descrições multilíngues |
| ├─ `/api/og` | Gera imagens Open Graph |
| └─ `/api/admin/*` | CRUD de projetos e settings |

### IA & Analytics

| Tecnologia | Descrição |
|------------|-----------|
| [Vercel AI SDK](https://sdk.vercel.ai/) | SDK para integração com LLMs |
| [OpenAI](https://openai.com/) | GPT-4 para chat e descrições |
| [PostHog](https://posthog.com/) | Product analytics |
| [Vercel Analytics](https://vercel.com/analytics) | Web analytics |

### Infraestrutura & Qualidade

| Tecnologia | Descrição |
|------------|-----------|
| [Biome](https://biomejs.dev/) | Linter e formatador |
| [Zod](https://zod.dev/) | Validação de schemas |
| [Vitest](https://vitest.dev/) | Test runner |
| [Testing Library](https://testing-library.com/) | Testes de componentes |

---

## 🚀 SEO & Performance

### Otimizações Implementadas

#### Core Web Vitals
- ✅ **LCP** < 2.5s: Lazy loading de imagens
- ✅ **FID** < 100ms: Code splitting automático
- ✅ **CLS** < 0.1: Aspect ratios definidos

#### Técnicas de SEO
- ✅ Metadata dinâmica por página
- ✅ Canonical URLs
- ✅ Hreflang tags (3 idiomas)
- ✅ Structured data (JSON-LD)
- ✅ Sitemap XML dinâmico
- ✅ Robots.txt otimizado
- ✅ Open Graph completo
- ✅ Twitter Cards
- ✅ Imagens OG dinâmicas

#### Performance
- ✅ Server-Side Rendering (SSR)
- ✅ Static Site Generation (SSG)
- ✅ Incremental Static Regeneration (ISR)
- ✅ Edge Functions
- ✅ Compressão Brotli + Gzip
- ✅ Image Optimization
- ✅ Font Optimization
- ✅ DNS Prefetch
- ✅ Preconnect a recursos críticos

---

## 📂 Estrutura de Pastas

```bash
my-portfolio/
├── public/                     # Assets estáticos
│   ├── logo.png
│   └── site.webmanifest
├── scripts/                    # Scripts de build
│   └── compress-static.js      # Compressão Brotli/Gzip
├── src/
│   ├── app/
│   │   ├── (regular)/          # Layout e páginas públicas
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── projects/
│   │   │   │   └── [slug]/     # Detalhes de projeto
│   │   │   └── layout.tsx
│   │   ├── admin/              # Painel administrativo
│   │   │   ├── login/
│   │   │   ├── projects/
│   │   │   │   ├── new/
│   │   │   │   └── edit/[id]/
│   │   │   ├── settings/
│   │   │   └── page.tsx        # Dashboard
│   │   ├── api/
│   │   │   ├── chat/route.ts                   # Chat com IA
│   │   │   ├── generate-description/route.ts   # IA multilíngue
│   │   │   ├── og/route.tsx                    # Imagens OG
│   │   │   └── admin/
│   │   │       ├── projects/route.ts
│   │   │       ├── projects/[id]/route.ts
│   │   │       └── settings/route.ts
│   │   ├── layout.tsx          # Root layout
│   │   ├── sitemap.ts          # Sitemap dinâmico
│   │   └── robots.ts           # Robots.txt dinâmico
│   ├── components/
│   │   ├── portfolio/          # Componentes públicos
│   │   │   ├── hero-section.tsx
│   │   │   ├── projects-grid.tsx
│   │   │   ├── project-card.tsx
│   │   │   ├── project-info.tsx
│   │   │   ├── contact-section.tsx
│   │   │   ├── chat-widget.tsx
│   │   │   ├── language-switcher.tsx
│   │   │   └── footer.tsx
│   │   ├── admin/              # Componentes admin
│   │   │   ├── project-form.tsx
│   │   │   ├── ai-description-generator.tsx
│   │   │   ├── dashboard.tsx
│   │   │   └── settings-form.tsx
│   │   ├── auth/               # Autenticação
│   │   │   ├── auth-guard.tsx
│   │   │   └── login-button.tsx
│   │   └── ui/                 # shadcn/ui components
│   ├── contexts/
│   │   └── auth-context.tsx    # Contexto Firebase Auth
│   ├── i18n/
│   │   ├── client.ts           # Client-side i18n
│   │   └── request.ts          # Server-side i18n
│   ├── messages/               # Traduções
│   │   ├── pt-BR.json
│   │   ├── en-US.json
│   │   └── es-ES.json
│   ├── lib/
│   │   ├── firebase/           # Firebase config & services
│   │   │   ├── config.ts
│   │   │   ├── admin.ts
│   │   │   ├── types.ts
│   │   │   ├── validators.ts
│   │   │   └── services/
│   │   │       ├── projects.ts
│   │   │       ├── admin-projects.ts
│   │   │       ├── technologies.ts
│   │   │       └── settings.ts
│   │   ├── supabase/
│   │   │   └── storage.ts      # Upload de imagens
│   │   ├── seo/                # SEO utilities
│   │   │   ├── metadata.ts
│   │   │   ├── json-ld.tsx
│   │   │   └── index.ts
│   │   ├── analytics.ts        # PostHog wrapper
│   │   ├── animations.ts       # Framer Motion variants
│   │   └── utils.ts            # Utilidades gerais
│   └── styles/
│       └── globals.css
├── .env.example                # Template de variáveis
├── .env.local                  # Variáveis de ambiente (local)
├── next.config.ts              # Config Next.js
├── tailwind.config.ts          # Config Tailwind
├── tsconfig.json               # Config TypeScript
├── biome.json                  # Config Biome
├── package.json
└── README.md
```

---

## ▶️ Como Rodar o Projeto

### Pré-requisitos

- **Node.js** ≥ 18.17
- **pnpm** (recomendado), npm ou yarn
- Conta no **Firebase** (Firestore + Auth habilitados)
- Conta no **Supabase** (para storage de imagens)
- **Chave de API da OpenAI** (para IA, recomendado)
- Projeto **PostHog** (opcional, para analytics)

### 1. Clonar o repositório

```bash
git clone https://github.com/netoncn/my-portfolio
cd my-portfolio
```

### 2. Instalar dependências

```bash
pnpm install
# ou
npm install
# ou
yarn install
```

### 3. Configurar variáveis de ambiente

Use o arquivo `.env.example` como base:

```bash
cp .env.example .env.local
```

Preencha com os dados dos seus projetos:

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Admin
NEXT_PUBLIC_ADMIN_EMAIL=seu-email@gmail.com

# OpenAI
OPENAI_API_KEY=sk-...

# PostHog (opcional)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# SEO
SITE_URL=https://netoncn.com.br

# Google Search Console (opcional)
GOOGLE_SITE_VERIFICATION=
```

### 4. Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Habilite **Firestore Database**
4. Habilite **Authentication** → Google
5. Copie as credenciais para `.env.local`

**Regras do Firestore (exemplo):**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{document=**} {
      allow read: if request.auth != null || resource.data.status == 'published';
      allow write: if request.auth != null && request.auth.token.email == 'seu-email@gmail.com';
    }

    match /technologies/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'seu-email@gmail.com';
    }

    match /settings/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'seu-email@gmail.com';
    }
  }
}
```

### 5. Configurar Supabase Storage

1. Acesse [Supabase Dashboard](https://app.supabase.com/)
2. Crie um novo projeto
3. Vá em **Storage** → Crie um bucket `portfolio-images`
4. Configure as políticas (RLS):

```sql
-- Permitir upload autenticado
CREATE POLICY "Usuários podem fazer upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'portfolio-images');

-- Permitir leitura pública
CREATE POLICY "Leitura pública"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio-images');

-- Permitir delete autenticado
CREATE POLICY "Usuários podem deletar"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'portfolio-images');
```

### 6. Rodar em modo desenvolvimento

```bash
pnpm dev
# ou
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### 7. Build de produção

```bash
pnpm build
pnpm start
```

### 8. Lint & Formatação

```bash
# Verificar código
pnpm lint

# Formatar código
pnpm format

# Fix automático
pnpm fix

# Type check
pnpm type-check
```

### 9. Testes

```bash
# Rodar testes
pnpm test

# Rodar testes com UI
pnpm test:ui

# Coverage
pnpm test:coverage
```

---

## 🔐 Área Administrativa

### Acesso

1. Defina `NEXT_PUBLIC_ADMIN_EMAIL` no `.env.local`
2. Acesse: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
3. Faça login com uma conta Google cujo e-mail corresponda à variável
4. Será redirecionado para o dashboard

### Funcionalidades Disponíveis

#### Dashboard (`/admin`)
- Visão geral dos projetos
- Links rápidos para criar/editar
- Estatísticas básicas

#### Projetos (`/admin/projects`)
- **Listar**: Tabela com todos os projetos
- **Criar** (`/admin/projects/new`):
  - Formulário completo multilíngue
  - Upload de thumbnail via Supabase
  - Upload de galeria de imagens
  - Botão "Gerar Descrição com IA" (curta e longa)
  - Seleção de tecnologias (combobox)
  - Preview em tempo real
- **Editar** (`/admin/projects/edit/[id]`):
  - Mesmas funcionalidades do criar
  - Pré-carrega dados existentes
  - Permite deletar imagens da galeria
- **Deletar**: Confirmação com dialog

#### Configurações (`/admin/settings`)
- Nome e foto de perfil
- Cargo multilíngue (pt-BR, en-US, es-ES)
- Bio multilíngue
- Email de contato
- Links de redes sociais (GitHub, LinkedIn)
- Meta tags customizadas (opcional)

### Uso do Gerador de IA

1. No formulário de projeto, preencha:
   - **Título** (pelo menos em português)
   - **Categoria**
   - **Tecnologias** (pelo menos uma)
   - **URL do GitHub** (opcional, mas recomendado)
2. Clique em **"Gerar Descrição com IA"** ao lado do campo desejado
3. Aguarde alguns segundos
4. Os **3 campos** (pt-BR, en-US, es-ES) serão preenchidos automaticamente
5. Revise e ajuste se necessário
6. Salve o projeto

---

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Acesse [Vercel](https://vercel.com/)
3. Importe o repositório
4. Configure as variáveis de ambiente
5. Deploy automático!

**Configurações importantes:**
- Build Command: `pnpm build`
- Output Directory: `.next`
- Install Command: `pnpm install`

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- Render
- AWS Amplify
- Cloudflare Pages

---

## 📊 Estrutura do Banco de Dados

### Firestore Collections

#### `projects`
```typescript
{
  id: string
  title: {
    "pt-BR": string
    "en-US": string
    "es-ES": string
  }
  slug: string
  shortDescription: MultilingualText
  longDescription: MultilingualText
  category: "web" | "mobile" | "desktop" | "api" | "library" | "other"
  status: "draft" | "published" | "archived"
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  hasSourceCode: boolean
  thumbnailUrl?: string
  images?: string[]
  featured: boolean
  order: number
  createdAt: Timestamp
  updatedAt: Timestamp
  metaTitle?: MultilingualText
  metaDescription?: MultilingualText
}
```

#### `technologies`
```typescript
{
  id: string
  name: string
  slug: string
  category?: string
  icon?: string
  usageCount: number
  createdAt: Timestamp
}
```

#### `settings`
```typescript
{
  id: "main"
  name: string
  photo?: string
  bio: MultilingualText
  role: MultilingualText
  email: string
  github: string
  linkedin: string
  customLinks?: Array<{
    url: string
    label: MultilingualText
  }>
  metaTitle?: MultilingualText
  metaDescription?: MultilingualText
  createdAt?: string
  updatedAt?: string
}
```

---

## 🧪 Testes

O projeto utiliza **Vitest** + **Testing Library** para testes.

```bash
# Rodar todos os testes
pnpm test

# Watch mode
pnpm test --watch

# Coverage
pnpm test:coverage
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Guidelines

- Siga o estilo de código do projeto (Biome)
- Adicione testes para novas funcionalidades
- Atualize a documentação conforme necessário
- Mantenha os commits descritivos

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Contato

**Nelson Christovam Neto**

- 🌐 Website: [netoncn.com.br](https://netoncn.com.br)
- 💼 LinkedIn: [linkedin.com/in/netoncn](https://linkedin.com/in/netoncn)
- 🐙 GitHub: [@netoncn](https://github.com/netoncn)
- 📧 Email: contato@netoncn.com.br

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) pela framework incrível
- [Vercel](https://vercel.com/) pelo hosting gratuito
- [Firebase](https://firebase.google.com/) pelo backend simplificado
- [Supabase](https://supabase.com/) pelo storage de imagens
- [shadcn/ui](https://ui.shadcn.com/) pelos componentes lindos
- [OpenAI](https://openai.com/) pela integração de IA
- [PostHog](https://posthog.com/) pelo analytics gratuito

---

<div align="center">

**Desenvolvido com ❤️ por [Nelson Christovam Neto](https://netoncn.com.br)**

⭐ Se este projeto te ajudou, considere dar uma estrela!

</div>
