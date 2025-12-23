# 🎤 Sistema de Detecção de Voz Humana

## Por que precisa de filtro?

Quando você canta junto com uma música, o microfone captura:
- ✅ Sua voz (queremos capturar)
- ❌ Percussão da música (não queremos)
- ❌ Instrumentos (não queremos)
- ❌ Ruídos de fundo (não queremos)

O sistema agora **filtra automaticamente** tudo que não é voz humana!

---

## 🔬 Como Funciona a Detecção

O sistema usa **4 testes** para determinar se um som é voz humana:

### 1️⃣ **Teste de Faixa de Frequência**
- **Voz humana:** 80-1000 Hz (cantando/falando)
- **Percussão:** Muitas frequências fora dessa faixa
- **Resultado:** Se está fora de 80-1000 Hz = NÃO É VOZ ❌

### 2️⃣ **Teste de Harmônicos**
- **Voz humana:** Tem harmônicos bem definidos (múltiplos da frequência base)
  - Ex: Se você canta C4 (262 Hz), há energia em 524 Hz, 786 Hz, etc.
- **Percussão:** Não tem harmônicos consistentes
- **Resultado:** Sem harmônicos = NÃO É VOZ ❌

### 3️⃣ **Teste de Sustentação**
- **Voz humana:** Sustenta notas por tempo (>80ms)
- **Percussão:** Picos rápidos e transientes
- **Resultado:** Transiente rápido = NÃO É VOZ ❌

### 4️⃣ **Teste de Balanço Espectral**
- **Voz humana:** Energia distribuída entre frequências baixas, médias e altas
- **Percussão:** Muita energia concentrada nas baixas frequências
- **Resultado:** Energia muito desbalanceada = NÃO É VOZ ❌

---

## ✅ Exemplo de Detecção

```
🎤 Som detectado: 262 Hz
┌─ Teste 1: Frequência (80-1000 Hz) ✓
├─ Teste 2: Harmônicos detectados ✓
├─ Teste 3: Sustentação >80ms ✓
└─ Teste 4: Balanço espectral OK ✓

RESULTADO: VOZ HUMANA! 🎤
Nota registrada: C4
```

```
🥁 Som detectado: 120 Hz
┌─ Teste 1: Frequência (80-1000 Hz) ✓
├─ Teste 2: Harmônicos detectados ✗
├─ Teste 3: Sustentação <80ms ✗
└─ Teste 4: Muita energia nas baixas ✗

RESULTADO: PERCUSSÃO/RUÍDO 🔇
Som filtrado!
```

---

## 📊 Estatísticas no Console

Quando você canta, o console mostra:

```
🎤 Voz detectada: E4 | Pitch: 330 Hz | Voz/Ruído: 25/15
```

Isso significa:
- **25** sons foram identificados como voz
- **15** sons foram filtrados (percussão/instrumentos)

---

## 🎯 Como Melhorar a Detecção

### ✅ Faça:
1. **Use headphones/fones** - Evita que o microfone capte a música
2. **Cante próximo ao microfone** - 15-20cm de distância
3. **Volume da música baixo** - 30-40% se não usar fones
4. **Sustente as notas** - Voz sustentada é mais fácil de detectar
5. **Cante claramente** - Pronunciação clara ajuda

### ❌ Evite:
1. **Música muito alta** - Microfone captura e confunde
2. **Cantar muito longe** - Voz fraca, ruído forte
3. **Gritar** - Distorce o sinal de áudio
4. **Ambientes barulhentos** - Ruídos de fundo atrapalham

---

## 🔧 Parâmetros Ajustados

### Limiar de Volume
- **Valor:** 8 (em escala 0-100)
- **Motivo:** Volume mínimo para considerar que há som

### Faixa Vocal
- **Mínimo:** 80 Hz (nota E2)
- **Máximo:** 1000 Hz (voz típica)
- **Motivo:** Voz humana cantando está nessa faixa

### Sustentação Mínima
- **Valor:** 80 milissegundos
- **Motivo:** Voz sustenta notas, percussão não

### Limiar de Harmônicos
- **Valor:** Pelo menos 1 harmônico detectado
- **Motivo:** Voz sempre tem harmônicos

---

## 📈 Precisão da Detecção

A precisão é calculada como:

```
Precisão = (Voz Detectada / Total de Detecções) × 100%
```

**Exemplo:**
- Voz detectada: 80 vezes
- Ruído filtrado: 20 vezes
- **Precisão: 80%** (80/100)

**O que é boa precisão?**
- 90-100%: Excelente! Quase só voz
- 70-89%: Bom, algum ruído ainda passa
- 50-69%: Razoável, ajuste o ambiente
- <50%: Ruim, muito ruído/música alta

---

## 🎼 Diferenças Técnicas

| Característica | Voz Humana | Percussão | Instrumento |
|----------------|------------|-----------|-------------|
| Pitch | Estável | Variável | Estável |
| Harmônicos | Sim (claros) | Não | Variável |
| Sustentação | >80ms | <50ms | Variável |
| Frequência | 80-1000 Hz | 20-200 Hz | Amplo |
| Energia | Distribuída | Concentrada baixas | Variável |

---

## 🧪 Testando o Filtro

### Teste 1: Só Percussão
1. Escolha uma música
2. Deixe tocar só a parte de percussão
3. **Resultado esperado:** Console mostra "Ruído filtrado"

### Teste 2: Cantando
1. Escolha uma música
2. Cante junto (com fones!)
3. **Resultado esperado:** Console mostra "Voz detectada"

### Teste 3: Música + Voz
1. Música tocando em volume baixo
2. Você cantando
3. **Resultado esperado:** Mais "Voz detectada" que "Ruído filtrado"

---

## 🎯 Exemplo Real no Console

```
Volume atual: 35 | Notas capturadas: 0
Volume atual: 42 | Notas capturadas: 0
🔇 Ruído filtrado (percussão/instrumento) | Pitch: 95 Hz
🔇 Ruído filtrado (percussão/instrumento) | Pitch: 110 Hz
Volume atual: 55 | Notas capturadas: 2
🎤 Voz detectada: C4 | Pitch: 262 Hz | Voz/Ruído: 1/2
🎤 Voz detectada: D4 | Pitch: 294 Hz | Voz/Ruído: 2/2
🎤 Voz detectada: E4 | Pitch: 330 Hz | Voz/Ruído: 3/2
```

**Interpretação:**
- Primeiros sons (95 Hz, 110 Hz) = percussão → filtrados ✓
- Depois você começou a cantar
- 3 notas de voz detectadas
- 2 ruídos filtrados
- **Precisão: 60%** (3/5)

---

## 💡 Dicas Avançadas

### Para Máxima Precisão:
1. **Use fones de ouvido** (essencial!)
2. **Microfone direcional** se tiver
3. **Grave em ambiente silencioso**
4. **Volume da música: 30-40%**
5. **Cante com boa técnica** (sustentação, clareza)

### Configurações Ideais:
- Volume do Vídeo: 40%
- Sensibilidade: 5-6
- Dificuldade: Medium
- Ambiente: Silencioso
- Fones: Sempre!

---

## 🚀 Resultado Final

Com o filtro ativo:
- ✅ **Apenas sua voz é analisada**
- ✅ **Percussão é ignorada**
- ✅ **Instrumentos são filtrados**
- ✅ **Pontuação mais precisa**
- ✅ **Feedback mais relevante**

**Agora você pode cantar sem se preocupar com a bateria ou instrumentos interferindo na análise!** 🎤🎵
