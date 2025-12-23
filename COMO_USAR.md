# 🚀 COMO EXECUTAR O TUNEBUDDY PRO

## ⚡ Método Rápido (Recomendado)

### Opção 1: Usar Servidor PowerShell
1. Clique com botão direito em `servidor.ps1`
2. Selecione "Executar com PowerShell"
3. O navegador abrirá automaticamente em http://localhost:8080

**Se der erro de permissão:**
- Abra PowerShell como Administrador
- Execute: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Tente novamente

### Opção 2: Comando Manual no PowerShell
```powershell
cd "c:\Users\TID-ERIC\Desktop\VisualCode\Karaoke"
.\servidor.ps1
```

---

## 🎵 Músicas Que Funcionam Bem

Atualizei a lista com músicas que permitem incorporação:
- ✅ Despacito - Luis Fonsi
- ✅ Love Yourself - Justin Bieber
- ✅ Shape of You - Ed Sheeran
- ✅ Roar - Katy Perry
- ✅ Shake It Off - Taylor Swift
- ✅ Thinking Out Loud - Ed Sheeran
- ✅ Waka Waka - Shakira
- ✅ Someone Like You - Adele

---

## 🔧 Se Ainda Der Erro

### Erro 150/101 (Incorporação bloqueada)
- Escolha outra música da lista
- Ou a aplicação oferecerá abrir no YouTube

### Erro de CORS
- Use o servidor PowerShell (método recomendado)
- NÃO abra o arquivo HTML diretamente

### Microfone não funciona
- Permita acesso quando solicitado
- Use HTTPS ou localhost (servidor local)

---

## 📝 Ordem de Uso

1. **Iniciar Servidor** → Execute servidor.ps1
2. **Permitir Microfone** → Clique no botão amarelo
3. **Escolher Música** → Clique em uma música da lista
4. **Começar Karaoke** → Clique no botão verde
5. **Cantar** → Divirta-se! 🎤
6. **Ver Pontuação** → Após parar, veja seu desempenho

---

## 💡 Dicas

- Use fones de ouvido para evitar feedback
- Ajuste o volume nas configurações
- Teste o microfone antes de começar
- Escolha a dificuldade adequada

---

## ❓ Problemas?

Veja: [SOLUCAO_ERROS.md](SOLUCAO_ERROS.md)
