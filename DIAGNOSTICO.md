# 🔧 Guia de Diagnóstico - Campos Zerados

## Se as métricas não aparecem (ficam zeradas):

### 1️⃣ **Primeiro: Testar o Microfone**

1. Permita acesso ao microfone quando solicitado
2. Abra o **Console** (pressione F12)
3. Clique no botão **"Testar"** nas Configurações
4. Fale algo perto do microfone
5. Observe:
   - A barra verde deve se mover
   - No console deve aparecer: `Volume: XX | Limiar: 5`

**Se a barra NÃO se mover:**
- ❌ Microfone não está capturando
- Verifique se o microfone está conectado
- Vá em Configurações do Windows > Som > Entrada
- Teste o microfone lá primeiro

### 2️⃣ **Verificar no Console**

Quando você clicar em "Começar Karaoke", deve aparecer:

```
Volume atual: 15 | Notas capturadas: 0
Volume atual: 8 | Notas capturadas: 0
✓ Nota detectada: C4 | Pitch: 262 Hz
Volume atual: 45 | Notas capturadas: 10
```

**Se aparecer:**
- `⚠️ Volume muito baixo: 2 | Limiar: 5` → Cante mais alto ou próximo ao microfone
- Nada aparece → Microfone não está funcionando

### 3️⃣ **Checklist Rápido**

- [ ] Permitiu acesso ao microfone no navegador?
- [ ] O microfone está conectado e funcionando?
- [ ] O volume do microfone no Windows está alto?
- [ ] Está cantando ou falando durante o teste?
- [ ] O navegador está com permissão de áudio?

### 4️⃣ **Ajustes Recomendados**

**Volume do Microfone:**
- Windows: Configure entre 70-100%
- Não use "Boost" do microfone

**Posição:**
- 15-20cm do microfone
- Não cubra o microfone
- Evite ruídos de fundo

**Navegador:**
- Use Chrome ou Edge (melhor suporte)
- Atualize para versão mais recente
- Recarregue a página (Ctrl+F5)

### 5️⃣ **Debug Avançado**

No Console, digite:

```javascript
// Ver se o microfone está conectado
console.log(audioContext);
console.log(analyser);

// Ver se está gravando
console.log('Gravando:', isRecording);

// Ver quantas notas foram capturadas
console.log('Notas:', notes.length);
console.log('Volume histórico:', volumeHistory.slice(-5));
```

### 6️⃣ **Problemas Comuns**

| Problema | Solução |
|----------|---------|
| Barra de teste não se move | Microfone desconectado ou sem permissão |
| Volume detectado mas notas = 0 | Volume muito baixo, cante mais alto |
| "Limiar: 5" no console | Volume precisa ser > 5 |
| Nada aparece no console | Pressione F12 para abrir o Console |

### 7️⃣ **Teste Manual**

1. Abra Console (F12)
2. Digite: `startMicTest()`
3. Fale: "AAAAAAAA" (som contínuo)
4. A barra deve se mover
5. No console deve mostrar o volume

### 8️⃣ **Último Recurso**

Se nada funcionar:

1. Feche todas as abas do navegador
2. Reinicie o navegador
3. Execute `servidor.ps1` novamente
4. Acesse http://localhost:8080
5. Permita microfone novamente
6. Teste novamente

### 9️⃣ **Informações para Suporte**

Se ainda não funcionar, verifique no Console:

```javascript
console.log('Navegador:', navigator.userAgent);
console.log('Audio Context:', audioContext?.state);
console.log('Sample Rate:', audioContext?.sampleRate);
console.log('FFT Size:', analyser?.fftSize);
```

Cole essas informações para análise.

---

## ✅ Como Saber se Está Funcionando

**Durante o karaoke você deve ver:**
- Pontuação Atual: subindo conforme você canta
- Tom (Pitch): mostrando notas como C4, G5, etc
- Ritmo: porcentagem aumentando
- Consistência: porcentagem variando
- Volume: mudando quando você fala
- Notas Capturadas: número aumentando

**No Console deve aparecer:**
```
Volume atual: 45 | Notas capturadas: 23
✓ Nota detectada: E4 | Pitch: 330 Hz
Volume atual: 52 | Notas capturadas: 24
```

Se tudo isso estiver funcionando, está tudo certo! 🎉
