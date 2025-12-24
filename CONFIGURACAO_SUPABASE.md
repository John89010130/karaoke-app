# 🔧 Configuração do Supabase

## Passo 1: Criar Projeto no Supabase

1. Acesse: https://supabase.com
2. Clique em **"New Project"**
3. Preencha:
   - **Name:** TuneBuddy Karaoke
   - **Database Password:** (crie uma senha forte)
   - **Region:** escolha a mais próxima
4. Aguarde a criação do projeto (1-2 minutos)

## Passo 2: Configurar Database

1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**
3. Cole todo o conteúdo do arquivo `supabase-setup.sql`
4. Clique em **"Run"** (ou F5)
5. Verifique se apareceu: "Success. No rows returned"

## Passo 3: Configurar Autenticação

### Email/Senha

1. No menu lateral, vá em **"Authentication" → "Providers"**
2. Certifique-se que **"Email"** está habilitado
3. Em **"Email Auth"**, configure:
   - ✅ Enable email confirmations (opcional - desmarque para testar mais rápido)

### Google OAuth (Opcional)

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione existente
3. Vá em **"APIs & Services" → "Credentials"**
4. Clique em **"Create Credentials" → "OAuth 2.0 Client ID"**
5. Configure:
   - **Application type:** Web application
   - **Authorized redirect URIs:** 
     - Cole a URL que aparece no Supabase (Authentication → Providers → Google)
     - Exemplo: `https://SEU-PROJETO.supabase.co/auth/v1/callback`
6. Copie **Client ID** e **Client Secret**
7. Volte ao Supabase:
   - Authentication → Providers → Google
   - Cole Client ID e Client Secret
   - Clique em **Save**

## Passo 4: Obter Credenciais do Projeto

1. No menu lateral, vá em **"Settings" → "API"**
2. Copie os valores:
   - **Project URL** (ex: https://abc123.supabase.co)
   - **anon public** key (uma chave longa)

## Passo 5: Configurar no Código

1. Abra o arquivo `app.js`
2. Nas primeiras linhas, substitua:

```javascript
const SUPABASE_URL = 'SUA_URL_AQUI';
const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI';
```

Por:

```javascript
const SUPABASE_URL = 'https://abc123.supabase.co'; // Sua URL real
const SUPABASE_ANON_KEY = 'eyJhbGc...'; // Sua anon key real
```

## Passo 6: Testar

1. Abra o karaoke no navegador
2. Clique em **"🔐 Login"**
3. Crie uma conta de teste
4. Cante uma música
5. Ao finalizar, selecione/cadastre um cantor
6. Verifique se a pontuação foi salva
7. Clique em **"Ver Ranking"**

## Verificar Dados no Supabase

1. No Supabase, vá em **"Table Editor"**
2. Veja as tabelas:
   - **cantores:** lista de cantores cadastrados
   - **pontuacoes:** todas as pontuações salvas
3. Ou execute SQL:

```sql
-- Ver todos os cantores
SELECT * FROM cantores;

-- Ver ranking geral
SELECT * FROM ranking_geral;

-- Ver últimas 10 pontuações
SELECT 
    c.nome as cantor,
    p.musica_titulo,
    p.pontuacao_total,
    p.created_at
FROM pontuacoes p
JOIN cantores c ON p.cantor_id = c.id
ORDER BY p.created_at DESC
LIMIT 10;
```

## Troubleshooting

### Erro: "Invalid API key"
- Verifique se copiou a **anon public** key (não a service_role)
- Certifique-se de não ter espaços extras ao colar

### Erro: "relation does not exist"
- Execute novamente o SQL do arquivo `supabase-setup.sql`
- Verifique se todas as queries executaram com sucesso

### Login do Google não funciona
- Verifique se adicionou a URL de callback correta no Google Console
- Certifique-se que o OAuth está habilitado no Supabase

### Pontuação não salva
- Abra o console do navegador (F12)
- Verifique se há erros em vermelho
- Confirme que está logado (botão deve mostrar seu email)

## Recursos Adicionais

- **Documentação Supabase:** https://supabase.com/docs
- **Supabase Auth Docs:** https://supabase.com/docs/guides/auth
- **Row Level Security:** https://supabase.com/docs/guides/auth/row-level-security

## Segurança

✅ **Row Level Security (RLS) está habilitado** - usuários só podem:
- Ler todos os cantores e pontuações (para ranking)
- Criar cantores
- Inserir apenas suas próprias pontuações
- Deletar apenas suas próprias pontuações

⚠️ **NÃO compartilhe:**
- Database Password
- service_role key (use apenas anon public)
- Client Secret do Google OAuth

## Próximos Passos (Opcional)

- [ ] Adicionar avatar para cantores
- [ ] Implementar edição de nome de cantor
- [ ] Criar ranking por música específica
- [ ] Adicionar gráficos de evolução
- [ ] Implementar compartilhamento de pontuação
- [ ] Adicionar conquistas/badges
