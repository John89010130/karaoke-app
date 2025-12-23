# 🔧 Solucionando Erros do YouTube

## Erro 153 - "Erro de configuração do player de vídeo"

Este erro ocorre quando:
1. O vídeo não permite reprodução em outros sites (incorporação bloqueada)
2. Você está abrindo o arquivo localmente (file://)
3. Há restrições de CORS

### ✅ Soluções

#### Solução 1: Use um servidor local
O YouTube pode bloquear vídeos quando abertos diretamente pelo arquivo (file://). Use um servidor local:

**Opção A - Python (se instalado):**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Depois abra: http://localhost:8000

**Opção B - Node.js (se instalado):**
```bash
npx http-server
```

**Opção C - VS Code:**
1. Instale a extensão "Live Server"
2. Clique com botão direito no index.html
3. Selecione "Open with Live Server"

#### Solução 2: Escolha vídeos diferentes
Alguns vídeos do YouTube têm restrições de incorporação. As músicas que atualizei na lista devem funcionar melhor:
- Despacito - Luis Fonsi
- Love Yourself - Justin Bieber
- Shape of You - Ed Sheeran
- Roar - Katy Perry
- Shake It Off - Taylor Swift

#### Solução 3: Abrir no YouTube
Se um vídeo específico não funcionar, a aplicação agora oferece a opção de abrir diretamente no YouTube quando detectar erro de incorporação.

## Códigos de Erro do YouTube

| Código | Significado | Solução |
|--------|-------------|---------|
| 2 | ID do vídeo inválido | Verifique o link |
| 5 | Erro HTML5 | Atualize o navegador |
| 100 | Vídeo não encontrado | Vídeo removido/privado |
| 101 | Incorporação bloqueada | Use outro vídeo |
| 150 | Incorporação bloqueada | Use outro vídeo |

## Testando se está funcionando

1. Abra o Console do navegador (F12)
2. Verifique se não há erros de CORS
3. Teste com "Despacito" - geralmente funciona
4. Se houver erro, siga as soluções acima

## Alternativa: Versão Desktop

Para evitar problemas de incorporação, você pode criar uma versão Electron (desktop) que não terá essas restrições.

## Precisa de ajuda?

Se o problema persistir:
1. Verifique se está usando um navegador atualizado
2. Tente em modo anônimo/privado
3. Desative extensões do navegador
4. Use um servidor local (Solução 1)
