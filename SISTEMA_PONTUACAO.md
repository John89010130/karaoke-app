# 🎯 Sistema de Pontuação Avançado - TuneBuddy Pro

## 📊 Como Funciona a Pontuação?

O TuneBuddy Pro usa um **sistema de análise de áudio em tempo real** que avalia múltiplos aspectos da sua performance vocal. A pontuação é calculada com base em **4 componentes principais**:

---

## 🎼 Componentes da Pontuação

### 1. **Tom (Pitch) - 35% da pontuação**
**O que é medido:**
- Estabilidade das frequências vocais
- Variação entre as notas cantadas
- Precisão da frequência fundamental

**Como funciona:**
- Usa o algoritmo de **autocorrelação** para detectar a frequência exata da sua voz
- Analisa a variância entre as notas capturadas
- Menor variância = maior estabilidade = melhor pontuação

**Melhor forma de pontuar:**
- ✅ Mantenha as notas estáveis (não oscile demais)
- ✅ Cante dentro da sua faixa vocal confortável
- ✅ Evite mudanças bruscas de tom

**Faixa de frequência analisada:**
- Mínimo: 82 Hz (nota E2)
- Máximo: 1047 Hz (nota C6)

---

### 2. **Ritmo - 30% da pontuação**
**O que é medido:**
- Consistência temporal entre as notas
- Espaçamento regular das notas cantadas
- Fluência da performance

**Como funciona:**
- Mede o tempo entre cada nota detectada
- Calcula se você está cantando com ritmo constante
- Ideal: 200-500ms entre notas (depende da música)

**Melhor forma de pontuar:**
- ✅ Siga o ritmo da música
- ✅ Mantenha um fluxo constante
- ✅ Não cante muito rápido ou muito lento demais
- ✅ Evite pausas muito longas

---

### 3. **Consistência de Volume - 20% da pontuação**
**O que é medido:**
- Estabilidade do volume da sua voz
- Variação de intensidade sonora
- Qualidade da projeção vocal

**Como funciona:**
- Calcula o RMS (Root Mean Square) do sinal de áudio
- Analisa a variância do volume ao longo do tempo
- Menor variação = mais consistência = melhor pontuação

**Melhor forma de pontuar:**
- ✅ Mantenha um volume constante
- ✅ Cante próximo ao microfone (15-20cm)
- ✅ Evite gritar ou cantar muito baixo
- ✅ Use headphones para não pegar o som do vídeo

**Limiar de detecção:**
- Volume mínimo: 20 unidades (evita ruído de fundo)

---

### 4. **Performance Contínua - 15% da pontuação**
**O que é medido:**
- Quantidade de notas capturadas
- Duração total do canto
- Taxa de notas por segundo

**Como funciona:**
- Conta quantas notas válidas foram detectadas
- Avalia se você cantou consistentemente durante a música
- Mais notas + mais tempo = melhor performance

**Melhor forma de pontuar:**
- ✅ Cante a música inteira (não só trechos)
- ✅ Mantenha-se cantando continuamente
- ✅ Evite pausas desnecessárias

**Bônus:**
- +5 pontos: Cantar por mais de 60 segundos
- +10 pontos: Cantar por mais de 120 segundos
- +5 pontos: Capturar mais de 100 notas
- +10 pontos: Capturar mais de 200 notas

---

## 🔬 Tecnologia Utilizada

### **Web Audio API**
- `AudioContext`: Processamento de áudio em tempo real
- `AnalyserNode`: Análise de frequências (FFT 4096)
- `MediaStreamSource`: Captura do microfone

### **Algoritmo de Detecção de Pitch**
Usa **autocorrelação** (método YIN simplificado):

```javascript
1. Captura buffer de áudio do microfone
2. Calcula RMS para verificar se há volume suficiente
3. Aplica autocorrelação para encontrar periodicidade
4. Converte período em frequência (Hz)
5. Converte frequência em nome da nota musical
```

**Por que autocorrelação?**
- ✅ Mais preciso que FFT simples para voz humana
- ✅ Detecta frequência fundamental mesmo com harmônicos
- ✅ Funciona bem em tempo real
- ✅ Resistente a ruídos

### **Análise de Ritmo**
```javascript
1. Registra timestamp de cada nota detectada
2. Calcula diferença temporal entre notas consecutivas
3. Compara com intervalo ideal (200-500ms)
4. Atribui pontuação baseada na proximidade do ideal
```

### **Análise de Consistência**
```javascript
1. Calcula variância estatística do volume
2. Variância = sqrt(Σ(x - média)² / n)
3. Quanto menor a variância, maior a consistência
4. Normaliza para escala 0-100
```

---

## 🎯 Níveis de Dificuldade

### **Fácil (Multiplicador: 0.8x)**
- Ideal para iniciantes
- Pontuação final reduzida em 20%
- Mais tolerante a imperfeições

### **Médio (Multiplicador: 1.0x)**
- Padrão, sem ajustes
- Equilíbrio entre desafio e diversão

### **Difícil (Multiplicador: 1.3x)**
- Para cantores experientes
- Pontuação final aumentada em 30%
- Requer excelente controle vocal

---

## 📈 Métricas em Tempo Real

Durante o karaoke, você vê:

1. **Pontuação Atual** - Score calculado em tempo real
2. **Tom (Pitch)** - Última nota detectada (ex: C4, G5)
3. **Ritmo** - Percentual de consistência temporal
4. **Consistência** - Estabilidade do volume
5. **Volume** - Intensidade atual da voz
6. **Notas Capturadas** - Contador de notas válidas

### **Gráfico de Pitch**
- Visualização em tempo real das frequências
- Mostra últimas 100 notas
- Eixo Y: 82 Hz a 1047 Hz
- Linha amarela: Seu pitch atual

---

## 🏆 Interpretação da Pontuação Final

| Pontuação | Classificação | Feedback |
|-----------|---------------|----------|
| 90-100 | Extraordinário 🏆 | Performance perfeita! |
| 75-89 | Excelente ⭐ | Muito bom, quase perfeito! |
| 60-74 | Muito Bom 😊 | Boa performance! |
| 40-59 | Bom 👍 | Continue praticando! |
| 0-39 | Em desenvolvimento 💫 | Não desista! |

---

## 💡 Dicas para Melhorar sua Pontuação

### **Para Melhorar o Pitch (Tom)**
1. Cante dentro da sua zona de conforto vocal
2. Use headphones para ouvir melhor a música
3. Faça aquecimento vocal antes
4. Pratique escalas musicais

### **Para Melhorar o Ritmo**
1. Siga o ritmo original da música
2. Tente não adiantar ou atrasar
3. Use músicas que você conhece bem
4. Pratique com metrônomo

### **Para Melhorar a Consistência**
1. Mantenha distância fixa do microfone
2. Controle a respiração
3. Evite gritar ou forçar a voz
4. Use fones para não pegar eco

### **Para Melhorar a Performance**
1. Cante a música inteira
2. Não faça pausas longas
3. Mantenha energia constante
4. Escolha músicas que você domina

---

## 🔧 Configurações que Afetam a Pontuação

### **Sensibilidade do Microfone (1-10)**
- Menor = Só detecta voz alta
- Maior = Detecta até voz baixa
- **Recomendado: 5** (médio)

### **Volume do Vídeo (0-100)**
- Muito alto pode interferir no microfone
- **Recomendado: 30-50** com headphones

---

## ❓ FAQ - Perguntas Frequentes

**P: Por que minha pontuação está sempre baixa?**
R: Verifique se está cantando próximo ao microfone, com volume constante e seguindo o ritmo.

**P: O sistema detecta se estou cantando afinado?**
R: Sim! O componente de Pitch (35%) mede exatamente isso.

**P: Preciso cantar todas as notas perfeitamente?**
R: Não, o sistema avalia consistência e estabilidade, não perfeição absoluta.

**P: Vale a pena usar headphones?**
R: Sim! Evita que o microfone capte o som do vídeo, melhorando a análise.

**P: A pontuação é comparada com a música original?**
R: Atualmente não (precisaria de letras sincronizadas). A análise é baseada em consistência vocal.

---

## 🚀 Melhorias Futuras

- [ ] Comparação com pitch da música original
- [ ] Análise de vibrato
- [ ] Detecção de harmônicos
- [ ] Sistema de achievements
- [ ] Ranking online
- [ ] Análise de timbre vocal
- [ ] Sugestões personalizadas de melhoria
- [ ] Modo de treino com feedback visual

---

**Agora você sabe exatamente como funciona o sistema de pontuação!** 🎤🎵

Use essas informações para melhorar sua técnica e alcançar pontuações cada vez maiores! 🌟
