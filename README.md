# 🎤 TuneBuddy Pro - Karaoke Web Application

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://localhost:8080)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Made with Love](https://img.shields.io/badge/made%20with-❤-ff69b4?style=for-the-badge)]()

Uma aplicação web de karaoke moderna e completa com análise de áudio em tempo real, sistema de pontuação avançado e integração com YouTube. Cante suas músicas favoritas e receba feedback instantâneo sobre sua performance!

![TuneBuddy Screenshot](https://via.placeholder.com/800x400/667eea/ffffff?text=TuneBuddy+Karaoke)

## ✨ Recursos

### Principais Funcionalidades
- 🎵 **Integração com YouTube**: Carregue vídeos diretamente do YouTube
- 🎤 **Captura de Áudio em Tempo Real**: Analisa sua voz enquanto você canta
- ⭐ **Sistema de Pontuação Avançado**: Algoritmo que avalia tom, consistência e duração
- 📊 **Visualizador de Áudio**: Visualização em tempo real das frequências de áudio
- 🎼 **Letras Animadas**: Exibição de letras sincronizadas (simulado)
- 🎚️ **Controles Personalizáveis**: Ajuste volume, sensibilidade e dificuldade

### Melhorias em Relação ao Original
1. **Design Moderno**: Interface com gradientes, animações e glassmorphism
2. **Análise de Áudio Avançada**: Usa Web Audio API para análise real do pitch
3. **Sistema de Pontuação Inteligente**:
   - Avalia média de notas
   - Calcula consistência vocal
   - Ajusta por dificuldade
   - Bônus por tempo de canto
4. **Visualizador de Frequências**: 32 barras animadas em tempo real
5. **Controles Completos**: Play, pause, stop com atalhos de teclado
6. **Configurações Ajustáveis**: Volume, sensibilidade do microfone, níveis de dificuldade
7. **Feedback Detalhado**: Mensagens personalizadas baseadas no desempenho
8. **Responsivo**: Design adaptável para mobile e desktop
9. **Biblioteca de Músicas**: 8 músicas populares pré-configuradas

## 🚀 Como Usar

### Instalação
1. Clone ou baixe os arquivos do projeto
2. Abra o arquivo `index.html` em um navegador moderno (Chrome, Firefox, Edge)

### Passo a Passo
1. **Permitir Microfone**: Clique no botão para permitir acesso ao microfone
2. **Escolher Música**: 
   - Selecione uma música popular, ou
   - Cole um link do YouTube, ou
   - Busque por nome (requer API key do YouTube)
3. **Começar**: Clique em "Começar Karaoke"
4. **Cantar**: Cante junto com a música
5. **Ver Pontuação**: Ao finalizar, veja sua pontuação e feedback

### Atalhos de Teclado
- `Espaço`: Pausar/Retomar
- `Esc`: Parar karaoke

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura da aplicação
- **CSS3**: Estilização com animações e efeitos modernos
- **JavaScript (Vanilla)**: Lógica da aplicação
- **YouTube IFrame API**: Integração com vídeos do YouTube
- **Web Audio API**: Captura e análise de áudio do microfone
- **Canvas API**: Visualizador de áudio

## 📐 Arquitetura

### Componentes Principais

1. **Interface do Usuário**
   - Header com branding
   - Cards de passos (Escolha, Cante, Pontue)
   - Área de busca e controles
   - Player de vídeo do YouTube
   - Visualizador de áudio
   - Display de letras
   - Painel de pontuação
   - Configurações

2. **Sistema de Áudio**
   - `AudioContext`: Contexto de processamento de áudio
   - `AnalyserNode`: Análise de frequências
   - `MediaStreamSource`: Captura do microfone

3. **Sistema de Pontuação**
   - Detecção de pitch
   - Cálculo de média de notas
   - Análise de consistência
   - Multiplicadores de dificuldade
   - Bônus de tempo

## 🎨 Personalização

### Adicionar Mais Músicas
Edite o array `popularSongs` em `app.js`:

```javascript
const popularSongs = [
    {
        id: 'VIDEO_ID_DO_YOUTUBE',

## 🚀 Demo Rápido

```bash
# Clone o repositório
git clone https://github.com/SEU-USERNAME/karaoke-app.git

# Entre na pasta
cd karaoke-app

# Inicie o servidor local
# Windows (PowerShell):
.\servidor.ps1

# Ou simplesmente abra o index.html no navegador
```

Acesse: `http://localhost:8080`

## ✨ Recursos

### 🎯 Funcionalidades Principais

- 🎵 **YouTube Integration** - Busque e carregue músicas diretamente do YouTube
- 🎤 **Real-time Audio Analysis** - Análise de pitch e tom usando Web Audio API
- ⭐ **Advanced Scoring System** - Sistema de pontuação com 4 componentes:
  - 🎯 Pitch Accuracy (40%)
  - 🥁 Rhythm Timing (30%)
  - 🔄 Consistency (20%)
  - 🎭 Performance (10%)
- 📊 **Live Audio Visualizer** - Visualização de frequências em tempo real
- 🎨 **Modern UI/UX** - Design minimalista com animações suaves
- 🔊 **Performance Feedback** - Sons e emojis baseados na pontuação
- ⚙️ **Customizable Settings** - Ajuste sensibilidade, cenário e controles

### 🎮 Como Usar

1. **Permita o acesso ao microfone** quando solicitado
2. **Escolha uma música**:
   - 🔗 Cole um link do YouTube
   - 🔍 Busque por nome/artista
   - 📚 Selecione uma música popular
3. **Clique em "▶️ Iniciar Karaoke"**
4. **Cante e divirta-se!** 🎤
5. **Veja sua pontuação** ao finalizar

### ⌨️ Atalhos

| Tecla | Ação |
|-------|------|
| `Espaço` | Pausar/Retomar |
| `Esc` | Parar karaoke |
| `Enter` | Buscar (quando no campo de busca) |

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **APIs**: 
  - YouTube IFrame Player API
  - YouTube Data API v3
  - Web Audio API
  - MediaStream API
- **Design**: CSS Grid, Flexbox, Gradients, Animations

## 📐 Estrutura do Projeto

```
karaoke-app/
├── index.html          # Estrutura principal
├── app.js              # Lógica da aplicação
├── favicon.svg         # Ícone do site
├── servidor.ps1        # Servidor local (Windows)
├── iniciar-servidor.bat # Atalho para iniciar servidor
├── README.md           # Documentação
└── .gitignore          # Arquivos ignorados pelo Git
```

## 🎨 Personalização

### Adicionar Músicas

Edite o array `popularSongs` em [app.js](app.js):

```javascript
const popularSongs = [
    {
        id: 'dQw4w9WgXcQ',
        title: 'Never Gonna Give You Up',
        artist: 'Rick Astley',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg'
    }
];
```

### Configurar YouTube API

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Ative a **YouTube Data API v3**
4. Gere uma **API Key**
5. Substitua em [app.js](app.js#L1930):

```javascript
const YOUTUBE_API_KEY = 'SUA_API_KEY_AQUI';
```

### Alterar Tema

Modifique as cores em [index.html](index.html):

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --bg-dark: #0a0e27;
    --text-light: #ffffff;
}
```

## 📱 Compatibilidade

| Navegador | Versão Mínima | Status |
|-----------|---------------|--------|
| Chrome | 60+ | ✅ Suportado |
| Firefox | 55+ | ✅ Suportado |
| Edge | 79+ | ✅ Suportado |
| Safari | 14+ | ✅ Suportado |
| Opera | 47+ | ✅ Suportado |

**Requisitos:**
- Web Audio API
- MediaStream API
- YouTube IFrame API
- Microfone funcional
- Conexão com internet

## 🔒 Privacidade & Segurança

- ✅ **Processamento Local** - Todo áudio é processado no navegador
- ✅ **Sem Armazenamento** - Nenhum dado de áudio é salvo ou enviado
- ✅ **Sem Coleta de Dados** - Não coletamos informações pessoais
- ✅ **Open Source** - Código totalmente transparente

## 🐛 Troubleshooting

<details>
<summary><b>Microfone não funciona</b></summary>

- Verifique permissões do navegador (ícone de cadeado na URL)
- Certifique-se que o microfone está conectado
- Teste o microfone em outras aplicações
- Recarregue a página (Ctrl+Shift+R)
</details>

<details>
<summary><b>Vídeo não carrega</b></summary>

- Verifique sua conexão com internet
- Alguns vídeos têm restrições de incorporação
- Tente outro vídeo do YouTube
- Limpe o cache do navegador
</details>

<details>
<summary><b>Pontuação sempre baixa</b></summary>

- Ajuste a sensibilidade nas configurações
- Cante mais próximo ao microfone
- Escolha um cenário mais fácil (ex: "Chuveiro")
- Verifique se o volume do microfone está adequado
</details>

<details>
<summary><b>Busca do YouTube não funciona</b></summary>

- Verifique se configurou a API Key
- Confirme que a YouTube Data API v3 está ativada
- Aguarde alguns minutos após ativar a API
- Use o botão "🔗 URL" como alternativa
</details>

## 🚧 Roadmap

- [x] Sistema de pontuação em tempo real
- [x] Modais customizados
- [x] Feedback com sons e emojis
- [x] Integração com YouTube API
- [ ] Sistema de ranking com Supabase
- [ ] Letras sincronizadas (LRC files)
- [ ] Gravação de performances
- [ ] Modo multiplayer/dueto
- [ ] Efeitos vocais (reverb, echo)
- [ ] Exportar vídeo da performance
- [ ] PWA (Progressive Web App)
- [ ] Modo offline

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para:

1. Fazer fork do projeto
2. Criar uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ e 🎵

---

<div align="center">

**[⬆ Voltar ao topo](#-tunebuddy-pro---karaoke-web-application)**

Se este projeto te ajudou, considere dar uma ⭐!

</div>
````Desenvolvido com ❤️ para melhorar a experiência de karaoke

---

**Divirta-se cantando! 🎤🎵⭐**
