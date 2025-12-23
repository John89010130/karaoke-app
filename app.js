// Variáveis globais
let player;
let audioContext;
let analyser;
let microphone;
let dataArray;
let frequencyData;
let isRecording = false;
let pitchDetector;
let score = 0;
let notes = [];
let pitchHistory = [];
let volumeHistory = [];
let rhythmScores = [];
let startTime;
let lastNoteTime = 0;
let pitchCanvas;
let pitchCtx;
let lastPitch = null;
let pitchSustainTime = 0;
let voiceDetectionCount = 0;
let noiseRejectionCount = 0;
let lastVoiceTime = 0;
let currentStreak = 0;
let maxStreak = 0;
let silencePenalty = 0;
let coverageTime = 0; // Tempo total cantando
let availableDevices = [];
let selectedDeviceId = null;
let currentScenario = 'direct'; // 'direct' ou 'external'

// Constantes para análise de áudio
const SAMPLE_RATE = 44100;
const MIN_FREQUENCY = 82; // E2 (nota mais baixa comum)
const MAX_FREQUENCY = 1047; // C6 (nota mais alta comum)
const VOLUME_THRESHOLD = 5; // Limiar mínimo de volume (reduzido)
const VOICE_MIN_FREQ = 80; // Frequência mínima de voz humana
const VOICE_MAX_FREQ = 1200; // Frequência máxima de voz humana (aumentado)
const HARMONIC_THRESHOLD = 0.2; // Limiar para detecção de harmônicos (reduzido)
const SUSTAIN_MIN_MS = 50; // Tempo mínimo de sustentação de nota (reduzido)
const SILENCE_WARNING_MS = 3000; // Aviso após 3s sem cantar
const SILENCE_PENALTY_MS = 5000; // Penalização após 5s sem cantar
const MAX_SILENCE_PENALTY = 15; // Máximo de dedução por pausas
const STREAK_BONUS_THRESHOLD = 20; // Bônus a cada 20 notas seguidas

// Músicas populares com IDs do YouTube (vídeos que permitem incorporação)
const popularSongs = [
    {
        id: 'kJQP7kiw5Fk',
        title: 'Despacito',
        artist: 'Luis Fonsi ft. Daddy Yankee',
        thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/mqdefault.jpg'
    },
    {
        id: '2Vv-BfVoq4g',
        title: 'Love Yourself',
        artist: 'Justin Bieber',
        thumbnail: 'https://img.youtube.com/vi/2Vv-BfVoq4g/mqdefault.jpg'
    },
    {
        id: 'RgKAFK5djSk',
        title: 'Waka Waka',
        artist: 'Shakira',
        thumbnail: 'https://img.youtube.com/vi/RgKAFK5djSk/mqdefault.jpg'
    },
    {
        id: 'CevxZvSJLk8',
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        thumbnail: 'https://img.youtube.com/vi/CevxZvSJLk8/mqdefault.jpg'
    },
    {
        id: 'hLQl3WQQoQ0',
        title: 'Someone Like You',
        artist: 'Adele',
        thumbnail: 'https://img.youtube.com/vi/hLQl3WQQoQ0/mqdefault.jpg'
    },
    {
        id: '09R8_2nJtjg',
        title: 'Roar',
        artist: 'Katy Perry',
        thumbnail: 'https://img.youtube.com/vi/09R8_2nJtjg/mqdefault.jpg'
    },
    {
        id: 'nfWlot6h_JM',
        title: 'Shake It Off',
        artist: 'Taylor Swift',
        thumbnail: 'https://img.youtube.com/vi/nfWlot6h_JM/mqdefault.jpg'
    },
    {
        id: 'lp-EO5I60KA',
        title: 'Thinking Out Loud',
        artist: 'Ed Sheeran',
        thumbnail: 'https://img.youtube.com/vi/lp-EO5I60KA/mqdefault.jpg'
    }
];

// Inicialização quando a API do YouTube estiver pronta
function onYouTubeIframeAPIReady() {
    console.log('YouTube API pronta!');
}

// Declarar funções globais no início para evitar erros
window.searchVideo = null; // Será definida depois
window.closeYoutubeModal = null; // Será definida depois  
window.loadFromURL = null; // Será definida depois
window.closeCustomModal = null; // Será definida depois

// ====== FUNÇÕES DE MODAL (definidas antes de tudo) ======
function showCustomModal(options) {
    const modal = document.getElementById('customModal');
    const emoji = document.getElementById('modalEmoji');
    const title = document.getElementById('modalTitle');
    const message = document.getElementById('modalMessage');
    const details = document.getElementById('modalDetails');
    const actions = document.getElementById('modalActions');
    
    emoji.textContent = options.emoji || '🎵';
    title.textContent = options.title || 'Aviso';
    message.innerHTML = options.message || '';
    
    // Detalhes opcionais
    if (options.details) {
        details.innerHTML = options.details;
        details.style.display = 'block';
    } else {
        details.style.display = 'none';
    }
    
    // Limpar ações anteriores
    actions.innerHTML = '';
    
    // Botão primário
    const primaryBtn = document.createElement('button');
    primaryBtn.className = 'modal-btn modal-btn-primary';
    primaryBtn.textContent = options.primaryText || 'OK';
    primaryBtn.onclick = () => {
        closeCustomModal();
        if (options.onPrimary) options.onPrimary();
    };
    actions.appendChild(primaryBtn);
    
    // Botão secundário (opcional)
    if (options.secondaryText) {
        const secondaryBtn = document.createElement('button');
        secondaryBtn.className = 'modal-btn modal-btn-secondary';
        secondaryBtn.textContent = options.secondaryText;
        secondaryBtn.onclick = () => {
            closeCustomModal();
            if (options.onSecondary) options.onSecondary();
        };
        actions.appendChild(secondaryBtn);
    }
    
    modal.classList.add('active');
}

function closeCustomModal() {
    const modal = document.getElementById('customModal');
    modal.classList.remove('active');
    // Limpar input se existir
    const inputWrapper = document.getElementById('modalInputWrapper');
    const input = document.getElementById('modalInput');
    if (inputWrapper) inputWrapper.style.display = 'none';
    if (input) input.value = '';
}

// Modal com input (para substituir prompt)
function showInputModal(options) {
    const {
        emoji = '📝',
        title = 'Digite',
        message = '',
        placeholder = 'Digite aqui...',
        defaultValue = '',
        primaryText = 'OK',
        secondaryText = 'Cancelar',
        onConfirm = null,
        onCancel = null
    } = options;

    const modal = document.getElementById('customModal');
    const inputWrapper = document.getElementById('modalInputWrapper');
    const input = document.getElementById('modalInput');
    
    document.getElementById('modalEmoji').textContent = emoji;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('modalDetails').style.display = 'none';
    
    // Mostrar input
    inputWrapper.style.display = 'block';
    input.placeholder = placeholder;
    input.value = defaultValue;
    
    const actions = document.getElementById('modalActions');
    actions.innerHTML = `
        <button class="modal-btn modal-btn-secondary" id="modalCancelBtn">${secondaryText}</button>
        <button class="modal-btn modal-btn-primary" id="modalConfirmBtn">${primaryText}</button>
    `;
    
    document.getElementById('modalConfirmBtn').onclick = () => {
        const value = input.value.trim();
        closeCustomModal();
        if (onConfirm) onConfirm(value);
    };
    
    document.getElementById('modalCancelBtn').onclick = () => {
        closeCustomModal();
        if (onCancel) onCancel();
    };
    
    modal.classList.add('active');
    
    // Focar no input após abrir
    setTimeout(() => input.focus(), 100);
    
    // Enter para confirmar
    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            document.getElementById('modalConfirmBtn').click();
        }
    };
}

window.closeCustomModal = closeCustomModal;
// ====== FIM DAS FUNÇÕES DE MODAL ======

// Renderizar músicas populares
function renderPopularSongs() {
    const container = document.getElementById('popularSongs');
    container.innerHTML = popularSongs.map(song => `
        <div class="song-card" onclick="loadVideo('${song.id}')">
            <img src="${song.thumbnail}" alt="${song.title}" class="song-thumbnail">
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
        </div>
    `).join('');
}

// Criar visualizador de áudio
function createVisualizer() {
    const visualizer = document.getElementById('visualizer');
    visualizer.innerHTML = '';
    for (let i = 0; i < 32; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = '10px';
        visualizer.appendChild(bar);
    }
}

// Listar dispositivos de áudio disponíveis
async function listAudioDevices() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        availableDevices = devices.filter(device => device.kind === 'audioinput');
        
        const select = document.getElementById('microphoneSelect');
        select.innerHTML = '';
        
        if (availableDevices.length === 0) {
            select.innerHTML = '<option>Nenhum microfone detectado</option>';
            return;
        }
        
        availableDevices.forEach((device, index) => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.textContent = device.label || `Microfone ${index + 1}`;
            
            // Selecionar o primeiro dispositivo por padrão
            if (index === 0) {
                option.selected = true;
                selectedDeviceId = device.deviceId;
            }
            
            select.appendChild(option);
        });
        
        console.log('🎤 Dispositivos de áudio detectados:', availableDevices.map(d => d.label || 'Sem nome'));
        
    } catch (error) {
        console.error('❌ Erro ao listar dispositivos:', error);
    }
}

// Trocar microfone
async function changeMicrophone() {
    const select = document.getElementById('microphoneSelect');
    selectedDeviceId = select.value;
    
    console.log('🔄 Trocando para:', select.options[select.selectedIndex].text);
    
    // Reinicializar contexto de áudio com novo dispositivo
    if (audioContext) {
        await audioContext.close();
    }
    
    await initAudioContext();
}

// Mudar cenário de uso
function changeScenario() {
    const select = document.getElementById('scenarioSelect');
    currentScenario = select.value;
    
    const warningBox = document.getElementById('feedbackWarning');
    const tipElement = document.getElementById('scenarioTip');
    
    if (currentScenario === 'external') {
        // Caixa de som externa - mostrar avisos
        warningBox.style.display = 'block';
        tipElement.innerHTML = '🔊 <strong>Caixa Externa Detectada:</strong> IMPORTANTE - Use fones de ouvido para evitar que o sistema detecte a música. O volume do vídeo deve estar baixo ou use fones!';
        tipElement.style.color = '#FF9800';
        
        console.log('⚠️ Cenário: Caixa de som externa - Recomenda-se fones de ouvido');
    } else {
        // Microfone direto no PC
        warningBox.style.display = 'none';
        tipElement.innerHTML = '💡 <strong>Dica:</strong> Para melhor resultado, use fones de ouvido para evitar que o áudio da música seja captado pelo microfone.';
        tipElement.style.color = 'inherit';
        
        console.log('✅ Cenário: Microfone direto no computador');
    }
}

// Solicitar permissão do microfone
async function requestMicPermission() {
    try {
        // Primeiro, obter permissão
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: false
            } 
        });
        
        // Parar o stream temporário
        stream.getTracks().forEach(track => track.stop());
        
        // Listar dispositivos disponíveis
        await listAudioDevices();
        
        // Agora inicializar com o dispositivo selecionado
        await initAudioContext();
        
        document.getElementById('micPermission').classList.remove('active');
        document.getElementById('deviceInfo').style.display = 'block';
        
        // Criar visualizador e canvas
        createVisualizer();
        initPitchCanvas();
        
        console.log('✅ Microfone permitido! Dispositivos detectados:', availableDevices.length);
        
    } catch (error) {
        console.error('❌ Erro ao acessar microfone:', error);
        showCustomModal({
            emoji: '🎤',
            title: 'Microfone Não Acessível',
            message: 'Não foi possível acessar o microfone.',
            details: '<p><strong>Verifique se:</strong></p><ul style="text-align: left; margin: 10px 0; padding-left: 20px;"><li>Você tem um microfone conectado</li><li>Permitiu o acesso nas configurações do navegador</li><li>Nenhum outro aplicativo está usando o microfone</li></ul>',
            primaryText: 'Entendi'
        });
    }
}

// Inicializar contexto de áudio
async function initAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 4096; // Maior resolução para pitch mais preciso
    analyser.smoothingTimeConstant = 0.8;
    
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    frequencyData = new Uint8Array(bufferLength);
    
    // Configurar constraints baseado no cenário
    const constraints = {
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: false
        }
    };
    
    // Se um dispositivo específico foi selecionado, usar ele
    if (selectedDeviceId) {
        constraints.audio.deviceId = { exact: selectedDeviceId };
    }
    
    // Ajustar configurações baseado no cenário
    if (currentScenario === 'external') {
        // Caixa externa - aumentar cancelamento de eco
        constraints.audio.echoCancellation = true;
        constraints.audio.noiseSuppression = true;
        console.log('🔊 Usando configurações otimizadas para caixa de som externa');
    }
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    
    console.log('✅ Contexto de áudio inicializado');
    console.log('🎤 Dispositivo:', selectedDeviceId ? 'Selecionado' : 'Padrão do sistema');
    console.log('🎵 Cenário:', currentScenario === 'direct' ? 'Microfone Direto' : 'Caixa Externa');
    console.log('📊 FFT Size:', analyser.fftSize);
    console.log('📊 Sample Rate:', audioContext.sampleRate);
}

// Testar captura do microfone
function testMicrophone() {
    if (!analyser) return;
    
    const testData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(testData);
    
    let sum = 0;
    for (let i = 0; i < testData.length; i++) {
        const normalized = (testData[i] - 128) / 128;
        sum += normalized * normalized;
    }
    const volume = Math.sqrt(sum / testData.length) * 100;
    
    console.log('🎤 Teste de Microfone:');
    console.log('   Volume detectado:', Math.round(volume));
    console.log('   Limiar mínimo:', VOLUME_THRESHOLD);
    
    if (volume < 1) {
        console.warn('⚠️ Volume muito baixo! Fale algo perto do microfone.');
    } else {
        console.log('✅ Microfone funcionando! Volume:', Math.round(volume));
    }
}

// Iniciar teste contínuo do microfone
let micTestInterval;
function startMicTest() {
    if (!analyser) {
        showCustomModal({
            emoji: '⚠️',
            title: 'Microfone Necessário',
            message: 'Por favor, permita o acesso ao microfone primeiro!',
            primaryText: 'OK'
        });
        return;
    }
    
    // Parar teste anterior se houver
    if (micTestInterval) {
        clearInterval(micTestInterval);
        document.getElementById('micTestBar').style.width = '0%';
        micTestInterval = null;
        return;
    }
    
    console.log('🎤 Iniciando teste de microfone... Fale algo!');
    
    micTestInterval = setInterval(() => {
        const testData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteTimeDomainData(testData);
        
        let sum = 0;
        for (let i = 0; i < testData.length; i++) {
            const normalized = (testData[i] - 128) / 128;
            sum += normalized * normalized;
        }
        const volume = Math.sqrt(sum / testData.length) * 100;
        
        // Atualizar barra visual
        const barWidth = Math.min(100, volume * 2);
        document.getElementById('micTestBar').style.width = barWidth + '%';
        
        // Log a cada segundo
        if (Math.random() < 0.1) {
            console.log('📊 Volume:', Math.round(volume), '| Limiar:', VOLUME_THRESHOLD);
        }
    }, 100);
    
    // Parar após 10 segundos
    setTimeout(() => {
        if (micTestInterval) {
            clearInterval(micTestInterval);
            micTestInterval = null;
            document.getElementById('micTestBar').style.width = '0%';
            console.log('✓ Teste de microfone finalizado');
        }
    }, 10000);
}

// Inicializar canvas para histórico de pitch
function initPitchCanvas() {
    pitchCanvas = document.getElementById('pitchCanvas');
    if (pitchCanvas) {
        pitchCtx = pitchCanvas.getContext('2d');
        pitchCanvas.width = 600;
        pitchCanvas.height = 100;
    }
}

// Carregar vídeo de URL
function loadFromURL() {
    console.log('🔗 Botão Carregar URL clicado');
    
    // Verificar se API do YouTube está carregada
    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
        console.error('❌ API do YouTube não está carregada');
        showCustomModal({
            emoji: '⏳',
            title: 'Aguarde um Momento',
            message: 'A API do YouTube ainda está carregando...',
            details: '<p>Tente novamente em alguns segundos.</p>',
            primaryText: 'OK'
        });
        return;
    }
    
    console.log('✅ API do YouTube carregada, solicitando URL...');
    
    showInputModal({
        emoji: '🔗',
        title: 'Cole o Link do YouTube',
        message: 'Cole o link da música do YouTube aqui:',
        placeholder: 'https://www.youtube.com/watch?v=...',
        primaryText: '🎵 Carregar',
        secondaryText: 'Cancelar',
        onConfirm: (url) => {
            if (!url) {
                console.log('❌ URL vazia');
                return;
            }
            processYoutubeUrl(url);
        },
        onCancel: () => {
            console.log('❌ Usuário cancelou');
        }
    });
}

function processYoutubeUrl(url) {
    console.log('📝 URL digitada:', url);
    
    // Extrair ID do vídeo
    let videoId = '';
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /youtube\.com\/embed\/([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            videoId = match[1];
            console.log('✅ ID do vídeo extraído:', videoId);
            break;
        }
    }
    
    if (videoId) {
        console.log('🎵 Carregando vídeo:', videoId);
        loadVideo(videoId);
    } else {
        console.error('❌ Não foi possível extrair ID do vídeo da URL');
        showCustomModal({
            emoji: '❌',
            title: 'URL Inválida',
            message: 'Por favor, use um link válido do YouTube.',
            details: '<p><strong>Exemplos de URLs válidas:</strong></p><ul style="text-align: left; margin: 10px 0; padding-left: 20px;"><li>https://www.youtube.com/watch?v=VIDEO_ID</li><li>https://youtu.be/VIDEO_ID</li></ul>',
            primaryText: 'Entendi'
        });
    }
}

// Carregar vídeo do YouTube
function loadVideo(videoId) {
    console.log('🎵 Carregando vídeo:', videoId);
    
    // Mostrar permissão do microfone se necessário
    if (!audioContext) {
        document.getElementById('micPermission').classList.add('active');
    }
    
    const container = document.getElementById('videoContainer');
    container.classList.add('active');
    
    // Destruir player existente se houver
    if (player && player.destroy) {
        player.destroy();
    }
    
    // Criar novo player com configurações otimizadas
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            enablejsapi: 1,
            origin: window.location.origin,
            widget_referrer: window.location.href
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onPlayerError
        }
    });
}

// Quando o player estiver pronto
function onPlayerReady(event) {
    console.log('Player pronto!');
    document.getElementById('startBtn').classList.remove('hidden');
    
    // Definir volume inicial
    const volume = document.getElementById('videoVolume').value;
    player.setVolume(volume);
}

// Quando o estado do player mudar
function onPlayerStateChange(event) {
    // YT.PlayerState.PLAYING = 1
    if (event.data === 1 && isRecording) {
        animateVisualizer();
    }
}

// Quando houver erro no player
function onPlayerError(event) {
    console.error('Erro no player do YouTube:', event.data);
    
    let errorMessage = '';
    
    switch (event.data) {
        case 2:
            errorMessage = '❌ Erro: ID do vídeo inválido.';
            break;
        case 5:
            errorMessage = '❌ Erro: Problema ao reproduzir o vídeo HTML5.';
            break;
        case 100:
            errorMessage = '❌ Erro: Vídeo não encontrado ou foi removido.';
            break;
        case 101:
        case 150:
            errorMessage = '⚠️ Este vídeo não permite reprodução incorporada.\n\nTente:\n1. Outro vídeo da lista\n2. Abrir diretamente no YouTube';
            break;
        default:
            errorMessage = '❌ Erro ao carregar o vídeo. Tente outro.';
    }
    
    showCustomModal({
        emoji: '❌',
        title: 'Erro no Player',
        message: errorMessage,
        primaryText: 'OK'
    });
    
    // Se for erro de incorporação, oferecer abrir no YouTube
    if (event.data === 101 || event.data === 150) {
        const videoId = player.getVideoData().video_id;
        showCustomModal({
            emoji: '❌',
            title: 'Vídeo Não Disponível',
            message: 'Este vídeo não permite reprodução incorporada.',
            details: '<p>Deseja abrir este vídeo diretamente no YouTube?</p>',
            primaryText: '🔗 Abrir YouTube',
            secondaryText: 'Cancelar',
            onPrimary: () => {
                window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
            }
        });
    }
}

// Mudar volume do vídeo
function changeVolume(value) {
    if (player && player.setVolume) {
        player.setVolume(value);
    }
}

// Iniciar karaoke
async function startKaraoke() {
    // Se microfone não foi permitido, solicitar permissão automaticamente
    if (!audioContext) {
        console.log('🎤 Solicitando permissão do microfone automaticamente...');
        await requestMicPermission();
        
        // Se ainda não tiver permissão após a tentativa, mostrar erro
        if (!audioContext) {
            showCustomModal({
                emoji: '🎤',
                title: 'Microfone Necessário',
                message: 'Não foi possível acessar o microfone.',
                details: '<p>Clique no botão "Permitir Microfone" no painel direito e tente novamente.</p>',
                primaryText: 'Entendi'
            });
            document.getElementById('micPermission').style.display = 'block';
            return;
        }
    }
    
    isRecording = true;
    score = 0;
    notes = [];
    pitchHistory = [];
    volumeHistory = [];
    rhythmScores = [];
    startTime = Date.now();
    lastNoteTime = Date.now();
    lastPitch = null;
    pitchSustainTime = 0;
    voiceDetectionCount = 0;
    noiseRejectionCount = 0;
    lastVoiceTime = Date.now();
    currentStreak = 0;
    maxStreak = 0;
    silencePenalty = 0;
    coverageTime = 0;
    
    // Mostrar elementos
    document.getElementById('visualizer').classList.add('active');
    document.getElementById('lyricsContainer').classList.add('active');
    document.getElementById('scoreDisplay').classList.remove('active');
    document.getElementById('realtimeMetrics').classList.add('active');
    
    // Mostrar letras
    document.getElementById('lyricsContainer').style.display = 'block';
    
    // Atualizar botões
    document.getElementById('startBtn').classList.add('hidden');
    document.getElementById('stopBtn').classList.remove('hidden');
    document.getElementById('pauseBtn').classList.remove('hidden');
    
    // Tocar vídeo
    if (player && player.playVideo) {
        player.playVideo();
    }
    
    // Iniciar análise de áudio e métricas
    analyzeAudioLoop();
    updateLyrics();
}

// Parar karaoke
function stopKaraoke() {
    isRecording = false;
    
    // Parar vídeo
    if (player && player.pauseVideo) {
        player.pauseVideo();
    }
    
    // Calcular pontuação final
    const finalScore = calculateFinalScore();
    
    // Atualizar UI
    document.getElementById('visualizer').classList.remove('active');
    document.getElementById('lyricsContainer').style.display = 'none';
    document.getElementById('realtimeMetrics').classList.remove('active');
    document.getElementById('scoreDisplay').classList.add('active');
    document.getElementById('stopBtn').classList.add('hidden');
    document.getElementById('pauseBtn').classList.add('hidden');
    document.getElementById('startBtn').classList.remove('hidden');
    
    // Não chamar showFinalScoreOptions aqui - será chamado pelo callback do primeiro modal
}

// Mostrar opções após finalizar karaoke
function showFinalScoreOptions(score) {
    let emoji = '🎤';
    let message = 'Boa performance!';
    
    if (score >= 90) {
        emoji = '🌟';
        message = 'INCRÍVEL! Você arrasou!';
    } else if (score >= 75) {
        emoji = '🎉';
        message = 'Muito bom!';
    } else if (score >= 60) {
        emoji = '👍';
        message = 'Bom trabalho!';
    } else if (score >= 40) {
        emoji = '💪';
        message = 'Continue praticando!';
    }
    
    showCustomModal({
        emoji: emoji,
        title: message,
        message: `Sua pontuação: ${score}/100`,
        details: '<p style="margin-top: 1rem;">O que deseja fazer?</p>',
        primaryText: '🔄 Cantar Novamente',
        secondaryText: '🎵 Escolher Outra',
        onPrimary: () => {
            // CANTAR NOVAMENTE: resetar tudo mas manter vídeo carregado
            resetKaraokeState();
            
            // Voltar o vídeo para o início e pausar
            if (player && player.seekTo) {
                player.seekTo(0);
                player.pauseVideo();
            }
            
            // Voltar UI ao estado inicial com vídeo carregado
            document.getElementById('visualizer').classList.remove('active');
            document.getElementById('lyricsContainer').style.display = 'none';
            document.getElementById('realtimeMetrics').classList.remove('active');
            document.getElementById('scoreDisplay').classList.remove('active');
            document.getElementById('stopBtn').classList.add('hidden');
            document.getElementById('pauseBtn').classList.add('hidden');
            document.getElementById('startBtn').classList.remove('hidden');
            
            // Resetar displays
            document.getElementById('scoreNumber').textContent = '0';
            document.getElementById('notesCount').textContent = '0';
        },
        onSecondary: () => {
            // ESCOLHER OUTRA: resetar tudo e voltar à tela inicial
            resetKaraokeState();
            
            // Destruir player e limpar vídeo
            if (player) {
                player.destroy();
                player = null;
            }
            
            // Esconder container de vídeo
            document.getElementById('videoContainer').classList.remove('active');
            
            // Resetar UI completa
            document.getElementById('visualizer').classList.remove('active');
            document.getElementById('lyricsContainer').style.display = 'none';
            document.getElementById('realtimeMetrics').classList.remove('active');
            document.getElementById('scoreDisplay').classList.remove('active');
            document.getElementById('stopBtn').classList.add('hidden');
            document.getElementById('pauseBtn').classList.add('hidden');
            document.getElementById('startBtn').classList.add('hidden');
            
            // Resetar displays
            document.getElementById('scoreNumber').textContent = '0';
            document.getElementById('notesCount').textContent = '0';
            
            // Recriar placeholder do player
            document.getElementById('player').innerHTML = '';
        }
    });
}

// Resetar estado do karaoke para nova sessão
function resetKaraokeState() {
    notes = [];
    pitchHistory = [];
    volumeHistory = [];
    rhythmScores = [];
    startTime = 0;
    lastNoteTime = 0;
    lastVoiceTime = 0;
    currentStreak = 0;
    maxStreak = 0;
    coverageTime = 0;
    silencePenalty = 0;
    voiceDetectionCount = 0;
    noiseRejectionCount = 0;
    
    // Limpar display
    document.getElementById('scoreNumber').textContent = '0';
    document.getElementById('pitchValue').textContent = '--';
    document.getElementById('rhythmValue').textContent = '0%';
    document.getElementById('volumeValue').textContent = '0%';
    document.getElementById('notesCount').textContent = '0';
}

// Pausar/retomar
function togglePause() {
    const btn = document.getElementById('pauseBtn');
    
    if (player.getPlayerState() === 1) {
        player.pauseVideo();
        btn.textContent = '▶️ Continuar';
    } else {
        player.playVideo();
        btn.textContent = '⏸️ Pausar';
    }
}

// Loop principal de análise de áudio
function analyzeAudioLoop() {
    if (!isRecording || !analyser) return;
    
    // Análise de pitch e volume
    analyser.getByteTimeDomainData(dataArray);
    analyser.getByteFrequencyData(frequencyData);
    
    // Calcular volume (RMS)
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        const normalized = (dataArray[i] - 128) / 128;
        sum += normalized * normalized;
    }
    const volume = Math.sqrt(sum / dataArray.length) * 100;
    volumeHistory.push(volume);
    
    // Debug: Log volume a cada 30 frames (~0.5 segundos)
    if (volumeHistory.length % 30 === 0) {
        console.log('Volume atual:', Math.round(volume), '| Notas capturadas:', notes.length);
    }
    
    // Limitar histórico
    if (volumeHistory.length > 100) {
        volumeHistory.shift();
    }
    
    // Detectar pitch usando autocorrelação
    if (volume > VOLUME_THRESHOLD) {
        const pitch = autoCorrelate(dataArray, audioContext.sampleRate);
        
        if (pitch > MIN_FREQUENCY && pitch < MAX_FREQUENCY) {
            // NOVO: Verificar se é voz humana (não percussão/instrumentos)
            const isVoice = isHumanVoice(pitch, frequencyData, dataArray, volume);
            
            if (isVoice) {
                voiceDetectionCount++;
                const noteName = frequencyToNote(pitch);
                const currentTime = Date.now();
                
                // Atualizar tempo de última voz
                const silenceDuration = currentTime - lastVoiceTime;
                lastVoiceTime = currentTime;
                
                // Gerenciar streak (sequência contínua)
                if (silenceDuration < 1000) { // Se pausa < 1s, mantém streak
                    currentStreak++;
                    coverageTime += silenceDuration;
                } else {
                    // Pausa longa quebrou o streak
                    if (currentStreak > maxStreak) {
                        maxStreak = currentStreak;
                    }
                    currentStreak = 1;
                }
                
                // Calcular score de ritmo
                const timeDiff = currentTime - lastNoteTime;
                const rhythmScore = calculateRhythmScore(timeDiff);
                rhythmScores.push(rhythmScore);
                lastNoteTime = currentTime;
                
                // Adicionar nota
                const noteData = {
                    pitch: pitch,
                    note: noteName,
                    volume: volume,
                    timestamp: currentTime - startTime,
                    rhythmScore: rhythmScore
                };
                
                notes.push(noteData);
                pitchHistory.push(pitch);
                
                // Debug: Log nota detectada
                if (notes.length % 10 === 0) {
                    console.log('🎤 Voz detectada:', noteName, '| Pitch:', Math.round(pitch), 'Hz | Voz/Ruído:', voiceDetectionCount + '/' + noiseRejectionCount);
                }
                
                // Limitar histórico
                if (pitchHistory.length > 100) {
                    pitchHistory.shift();
                }
            } else {
                noiseRejectionCount++;
                // Debug: Log ruído filtrado
                if (noiseRejectionCount % 20 === 0) {
                    console.log('🔇 Ruído filtrado (percussão/instrumento) | Pitch:', Math.round(pitch), 'Hz');
                }
            }
        }
    } else if (volumeHistory.length % 60 === 0) {
        console.log('⚠️ Volume muito baixo:', Math.round(volume), '| Limiar:', VOLUME_THRESHOLD);
    }
    
    // SISTEMA DE PENALIZAÇÃO POR PAUSAS
    if (isRecording && lastVoiceTime > 0) {
        const silenceDuration = Date.now() - lastVoiceTime;
        
        // Penalizar pausas muito longas (progressivo)
        if (silenceDuration > SILENCE_PENALTY_MS) {
            const extraSilence = (silenceDuration - SILENCE_PENALTY_MS) / 1000; // segundos extras
            const penalty = Math.min(MAX_SILENCE_PENALTY, extraSilence * 0.5); // 0.5 pontos por segundo
            silencePenalty = penalty;
            
            // Alerta visual a cada 2s de silêncio
            if (silenceDuration % 2000 < 50) {
                console.log('⏸️ PAUSA LONGA detectada! Penalização:', Math.round(penalty), 'pts | Silêncio:', Math.round(silenceDuration/1000) + 's');
            }
        } else if (silenceDuration > SILENCE_WARNING_MS) {
            // Aviso (sem penalização ainda)
            if (silenceDuration % 1000 < 50) {
                console.log('⚠️ Aviso: Cante! Silêncio:', Math.round(silenceDuration/1000) + 's');
            }
        }
    }
    
    // Atualizar métricas em tempo real
    updateRealtimeMetrics();
    
    // Animar visualizador
    animateVisualizer();
    
    requestAnimationFrame(analyzeAudioLoop);
}

// Analisar pitch (tom) do microfone usando autocorrelação - FUNÇÃO ANTIGA REMOVIDA
// Esta função foi substituída por analyzeAudioLoop() acima

// Autocorrelação para detectar frequência fundamental
function autoCorrelate(buffer, sampleRate) {
    const SIZE = buffer.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);
    let best_offset = -1;
    let best_correlation = 0;
    let rms = 0;
    
    // Calcular RMS
    for (let i = 0; i < SIZE; i++) {
        const val = (buffer[i] - 128) / 128;
        rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    
    if (rms < 0.01) return -1; // Sinal muito fraco
    
    // Autocorrelação
    let lastCorrelation = 1;
    for (let offset = 1; offset < MAX_SAMPLES; offset++) {
        let correlation = 0;
        
        for (let i = 0; i < MAX_SAMPLES; i++) {
            correlation += Math.abs(((buffer[i] - 128) / 128) - ((buffer[i + offset] - 128) / 128));
        }
        
        correlation = 1 - (correlation / MAX_SAMPLES);
        
        if (correlation > 0.9 && correlation > lastCorrelation) {
            const freq = sampleRate / offset;
            if (freq >= MIN_FREQUENCY && freq <= MAX_FREQUENCY) {
                if (correlation > best_correlation) {
                    best_correlation = correlation;
                    best_offset = offset;
                }
            }
        }
        
        lastCorrelation = correlation;
    }
    
    if (best_offset === -1) return -1;
    
    return sampleRate / best_offset;
}

// Detectar se é voz humana (não percussão/instrumentos)
function isHumanVoice(pitch, frequencyData, timeDomainData, volume) {
    let score = 0;
    const reasons = [];
    
    // 1. VERIFICAR FAIXA DE FREQUÊNCIA VOCAL (teste obrigatório)
    // Voz humana típica: 80-1000 Hz (falando/cantando)
    if (pitch < VOICE_MIN_FREQ || pitch > VOICE_MAX_FREQ) {
        if (Math.random() < 0.05) {
            console.log('❌ Fora da faixa vocal:', Math.round(pitch), 'Hz');
        }
        return false; // Fora da faixa vocal comum
    }
    score++;
    reasons.push('faixa OK');
    
    // 2. VERIFICAR VOLUME MÍNIMO
    if (volume < VOLUME_THRESHOLD * 1.5) {
        if (Math.random() < 0.05) {
            console.log('❌ Volume muito baixo:', Math.round(volume));
        }
        return false;
    }
    score++;
    reasons.push('volume OK');
    
    // 3. DETECTAR HARMÔNICOS (teste suave)
    const hasHarmonics = detectHarmonics(pitch, frequencyData);
    if (hasHarmonics) {
        score++;
        reasons.push('harmônicos OK');
    }
    
    // 4. VERIFICAR SUSTENTAÇÃO (teste suave)
    const isSustained = checkSustain(pitch, volume);
    if (isSustained) {
        score++;
        reasons.push('sustentação OK');
    }
    
    // Precisa passar em pelo menos 2 testes (faixa + volume são obrigatórios)
    const passed = score >= 2;
    
    if (!passed && Math.random() < 0.1) {
        console.log('⚠️ Rejeitado - Score:', score, '| Testes:', reasons.join(', '));
    }
    
    return passed;
}

// Detectar harmônicos (múltiplos da frequência fundamental)
function detectHarmonics(fundamentalFreq, frequencyData) {
    const sampleRate = audioContext.sampleRate;
    const binSize = sampleRate / analyser.fftSize;
    
    // Verificar se há energia nos harmônicos (2x, 3x da frequência fundamental)
    const harmonics = [2, 3];
    let harmonicCount = 0;
    
    for (const harmonic of harmonics) {
        const harmonicFreq = fundamentalFreq * harmonic;
        const bin = Math.round(harmonicFreq / binSize);
        
        if (bin < frequencyData.length) {
            const energy = frequencyData[bin];
            // Limiar mais baixo para detecção
            if (energy > 30) {
                harmonicCount++;
            }
        }
    }
    
    // Voz tem pelo menos 1 harmônico detectável (mais permissivo)
    return harmonicCount >= 1;
}

// Verificar sustentação da nota (voz sustenta, percussão não)
function checkSustain(currentPitch, volume) {
    const now = Date.now();
    
    // Se é a mesma nota (±10% de tolerância - mais permissivo)
    if (lastPitch && Math.abs(currentPitch - lastPitch) / lastPitch < 0.10) {
        pitchSustainTime = now;
        return true; // Está sustentando a mesma nota
    } else {
        // Nota mudou
        const sustainDuration = now - pitchSustainTime;
        lastPitch = currentPitch;
        pitchSustainTime = now;
        
        // Mais permissivo - aceita notas rápidas também
        return sustainDuration > 50 || sustainDuration === 0;
    }
}

// Analisar balanço espectral (voz vs percussão)
function analyzeSpectralBalance(frequencyData) {
    // Dividir espectro em 3 bandas
    const lowBand = frequencyData.slice(0, frequencyData.length / 3);
    const midBand = frequencyData.slice(frequencyData.length / 3, 2 * frequencyData.length / 3);
    const highBand = frequencyData.slice(2 * frequencyData.length / 3);
    
    // Calcular energia média de cada banda
    const lowEnergy = lowBand.reduce((a, b) => a + b, 0) / lowBand.length;
    const midEnergy = midBand.reduce((a, b) => a + b, 0) / midBand.length;
    const highEnergy = highBand.reduce((a, b) => a + b, 0) / highBand.length;
    
    // Voz tem energia mais equilibrada entre as bandas
    // Percussão tem muita energia nas baixas frequências
    const totalEnergy = lowEnergy + midEnergy + highEnergy;
    if (totalEnergy === 0) return 0;
    
    // Calcular desvio padrão (quanto mais equilibrado, melhor)
    const mean = totalEnergy / 3;
    const variance = (
        Math.pow(lowEnergy - mean, 2) +
        Math.pow(midEnergy - mean, 2) +
        Math.pow(highEnergy - mean, 2)
    ) / 3;
    
    const stdDev = Math.sqrt(variance);
    
    // Normalizar: quanto menor o desvio, mais equilibrado (mais provável ser voz)
    // Invertemos para que maior = melhor
    return Math.max(0, 1 - (stdDev / mean));
}

// Converter frequência para nome da nota
function frequencyToNote(frequency) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const A4 = 440;
    const C0 = A4 * Math.pow(2, -4.75);
    
    if (frequency <= 0) return '--';
    
    const halfSteps = 12 * (Math.log(frequency / C0) / Math.log(2));
    const octave = Math.floor(halfSteps / 12);
    const note = Math.round(halfSteps % 12);
    
    return noteNames[note] + octave;
}

// Calcular score de ritmo baseado em consistência temporal
function calculateRhythmScore(timeDiff) {
    // Ideal: notas com espaçamento consistente (200-500ms)
    const idealMin = 200;
    const idealMax = 500;
    
    if (timeDiff >= idealMin && timeDiff <= idealMax) {
        return 100;
    } else if (timeDiff < idealMin) {
        // Muito rápido
        return Math.max(50, 100 - ((idealMin - timeDiff) / idealMin) * 50);
    } else {
        // Muito lento
        return Math.max(30, 100 - ((timeDiff - idealMax) / idealMax) * 70);
    }
}

// Atualizar métricas em tempo real
// Throttle para atualização de métricas (evitar travamento)
let lastMetricsUpdate = 0;
const METRICS_UPDATE_INTERVAL = 100; // Atualizar a cada 100ms

function updateRealtimeMetrics() {
    if (!isRecording) return;
    
    // Throttle: só atualizar a cada 100ms
    const now = Date.now();
    if (now - lastMetricsUpdate < METRICS_UPDATE_INTERVAL) {
        return;
    }
    lastMetricsUpdate = now;
    
    // Verificar se temos dados suficientes
    if (notes.length === 0) {
        // Mostrar zeros se não houver dados ainda
        document.getElementById('currentScore').textContent = '0';
        document.getElementById('pitchValue').textContent = '--';
        document.getElementById('rhythmValue').textContent = '0%';
        document.getElementById('consistencyValue').textContent = '0%';
        document.getElementById('volumeValue').textContent = '0%';
        document.getElementById('notesCount').textContent = '0';
        return;
    }
    
    // Calcular pontuação atual
    let currentScore = 0;
    let pitchComponent = 0;
    let rhythmComponent = 0;
    let consistencyComponent = 0;
    let performanceComponent = 0;
    
    // 1. Score de pitch (40% do total) - MÁXIMO 40 pontos
    const recentPitches = pitchHistory.slice(-20);
    if (recentPitches.length > 1) {
        const pitchVariance = calculateVariance(recentPitches);
        const pitchStability = Math.max(0, 100 - (pitchVariance / 100)); // 0-100%
        pitchComponent = (pitchStability / 100) * 40; // Converter para 0-40 pontos
        currentScore += pitchComponent;
        
        // Atualizar display de pitch stability
        document.getElementById('consistencyValue').textContent = Math.round(pitchStability) + '%';
        document.getElementById('consistencyFill').style.width = Math.min(100, pitchStability) + '%';
    }
    
    // 2. Score de ritmo (30% do total) - MÁXIMO 30 pontos
    if (rhythmScores.length > 0) {
        const recentRhythm = rhythmScores.slice(-10);
        const avgRhythm = recentRhythm.reduce((a, b) => a + b, 0) / recentRhythm.length; // 0-100%
        rhythmComponent = (avgRhythm / 100) * 30; // Converter para 0-30 pontos
        currentScore += rhythmComponent;
        
        // Atualizar display de ritmo
        document.getElementById('rhythmValue').textContent = Math.round(avgRhythm) + '%';
        document.getElementById('rhythmFill').style.width = Math.min(100, avgRhythm) + '%';
    }
    
    // 3. Score de volume/consistência (20% do total) - MÁXIMO 20 pontos
    if (volumeHistory.length > 1) {
        const recentVolume = volumeHistory.slice(-20);
        const volumeVariance = calculateVariance(recentVolume);
        const volumeConsistency = Math.max(0, 100 - (volumeVariance / 10)); // 0-100%
        consistencyComponent = (volumeConsistency / 100) * 20; // Converter para 0-20 pontos
        currentScore += consistencyComponent;
    }
    
    // 4. Score de performance contínua (10% do total) - MÁXIMO 10 pontos
    const duration = (Date.now() - startTime) / 1000;
    if (duration > 0) {
        const notesPerSecond = notes.length / duration;
        const sustainedNoteQuality = Math.min(100, notesPerSecond * 10); // 0-100%
        performanceComponent = (sustainedNoteQuality / 100) * 10; // Converter para 0-10 pontos
        currentScore += performanceComponent;
    }
    
    // BÔNUS DE STREAK (sequência contínua cantando)
    const streakBonus = Math.floor(currentStreak / STREAK_BONUS_THRESHOLD) * 2; // +2 pts a cada 20 notas
    currentScore += Math.min(10, streakBonus); // Máximo +10 pts de bônus
    
    // PENALIZAÇÃO POR PAUSAS LONGAS
    currentScore -= silencePenalty;
    
    // CÁLCULO DE COBERTURA (% do tempo cantando)
    const coverage = duration > 0 ? (coverageTime / (duration * 1000)) * 100 : 0;
    
    // Ajustar por dificuldade
    const difficulty = document.getElementById('difficulty').value;
    const multiplier = {easy: 0.8, medium: 1.0, hard: 1.3}[difficulty];
    currentScore = Math.min(100, Math.round(currentScore * multiplier));
    
    // Atualizar display de pontuação (novo layout)
    document.getElementById('scoreNumber').textContent = currentScore;
    document.getElementById('currentScore').textContent = currentScore;
    document.getElementById('scoreFill').style.width = currentScore + '%';
    
    // Feedback em tempo real
    updatePerformanceFeedback(currentScore);
    
    // Pitch atual
    if (pitchHistory.length > 0) {
        const lastPitch = pitchHistory[pitchHistory.length - 1];
        const lastNote = notes[notes.length - 1]?.note || '--';
        document.getElementById('pitchValue').textContent = lastNote;
        const pitchPercent = ((lastPitch - MIN_FREQUENCY) / (MAX_FREQUENCY - MIN_FREQUENCY)) * 100;
        document.getElementById('pitchFill').style.width = Math.min(100, Math.max(0, pitchPercent)) + '%';
    } else {
        document.getElementById('pitchValue').textContent = '--';
    }
    
    // Volume atual
    if (volumeHistory.length > 0) {
        const currentVolume = volumeHistory[volumeHistory.length - 1];
        const volumePercent = Math.min(100, currentVolume);
        document.getElementById('volumeValue').textContent = Math.round(volumePercent) + '%';
        document.getElementById('volumeFill').style.width = volumePercent + '%';
    }
    
    // Notas capturadas
    document.getElementById('notesCount').textContent = notes.length;
    const notesPercent = Math.min(100, (notes.length / 100) * 100);
    document.getElementById('notesFill').style.width = notesPercent + '%';
    
    // Desenhar gráfico de pitch
    drawPitchHistory();
}

// Feedback de performance em tempo real
function updatePerformanceFeedback(score) {
    const lyricsText = document.getElementById('lyricsText');
    let feedback = '';
    let emoji = '';
    
    if (score >= 90) {
        emoji = '🌟';
        feedback = 'INCRÍVEL! Você está arrasando!';
    } else if (score >= 75) {
        emoji = '🎉';
        feedback = 'Muito bom! Continue assim!';
    } else if (score >= 60) {
        emoji = '👍';
        feedback = 'Bom trabalho! Está melhorando!';
    } else if (score >= 40) {
        emoji = '💪';
        feedback = 'Continue tentando! Você consegue!';
    } else {
        emoji = '🎤';
        feedback = 'Solte a voz! Não tenha vergonha!';
    }
    
    // Mostrar feedback temporariamente
    if (notes.length % 10 === 0 && notes.length > 0) {
        const originalText = lyricsText.textContent;
        lyricsText.textContent = `${emoji} ${feedback}`;
        setTimeout(() => {
            lyricsText.textContent = originalText;
        }, 2000);
    }
}

// Calcular variância para medir consistência
function calculateVariance(arr) {
    if (arr.length === 0) return 0;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
}

// Desenhar histórico de pitch no canvas
function drawPitchHistory() {
    if (!pitchCtx || pitchHistory.length === 0) return;
    
    const canvas = pitchCanvas;
    const ctx = pitchCtx;
    const width = canvas.width;
    const height = canvas.height;
    
    // Limpar canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, width, height);
    
    // Desenhar grade
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        const y = (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Desenhar linha de pitch
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const step = width / pitchHistory.length;
    pitchHistory.forEach((pitch, i) => {
        const x = i * step;
        const normalized = (pitch - MIN_FREQUENCY) / (MAX_FREQUENCY - MIN_FREQUENCY);
        const y = height - (normalized * height);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Adicionar labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '10px Arial';
    ctx.fillText(`${MAX_FREQUENCY}Hz`, 5, 15);
    ctx.fillText(`${MIN_FREQUENCY}Hz`, 5, height - 5);
}

// Animar visualizador
function animateVisualizer() {
    if (!isRecording || !analyser) return;
    
    analyser.getByteFrequencyData(dataArray);
    
    const bars = document.querySelectorAll('.bar');
    const step = Math.floor(dataArray.length / bars.length);
    
    bars.forEach((bar, index) => {
        const value = dataArray[index * step];
        const height = (value / 255) * 100;
        bar.style.height = `${Math.max(10, height)}px`;
    });
    
    if (isRecording) {
        requestAnimationFrame(animateVisualizer);
    }
}

// Atualizar letras (simulação)
function updateLyrics() {
    if (!isRecording) return;
    
    const lyricsExamples = [
        '♪ Cante junto com a música ♪',
        '🎵 Você está indo muito bem! 🎵',
        '⭐ Continue assim! ⭐',
        '🎤 Solte sua voz! 🎤',
        '✨ Incrível! ✨',
        '🌟 Maravilhoso! 🌟'
    ];
    
    const lyricsElement = document.getElementById('lyricsText');
    let index = 0;
    
    const interval = setInterval(() => {
        if (!isRecording) {
            clearInterval(interval);
            return;
        }
        
        lyricsElement.textContent = lyricsExamples[index % lyricsExamples.length];
        index++;
    }, 3000);
}

// Calcular pontuação final
function calculateFinalScore() {
    const difficulty = document.getElementById('difficulty').value;
    const duration = (Date.now() - startTime) / 1000;
    
    let finalScore = 0;
    let breakdown = {};
    
    if (notes.length > 0) {
        // 1. PITCH SCORE (35%) - Estabilidade das notas
        const pitchVariance = calculateVariance(pitchHistory);
        const pitchStability = Math.max(0, 100 - (pitchVariance / 100));
        breakdown.pitchScore = Math.round(pitchStability * 0.35);
        
        // 2. RHYTHM SCORE (30%) - Consistência temporal
        const avgRhythm = rhythmScores.reduce((a, b) => a + b, 0) / rhythmScores.length || 0;
        breakdown.rhythmScore = Math.round(avgRhythm * 0.30);
        
        // 3. VOLUME/CONSISTENCY SCORE (20%) - Consistência de volume
        const volumeVariance = calculateVariance(volumeHistory);
        const volumeConsistency = Math.max(0, 100 - (volumeVariance / 10));
        breakdown.volumeScore = Math.round(volumeConsistency * 0.20);
        
        // 4. PERFORMANCE SCORE (15%) - Duração e quantidade de notas
        const notesPerSecond = notes.length / duration;
        const performanceQuality = Math.min(100, notesPerSecond * 20);
        breakdown.performanceScore = Math.round(performanceQuality * 0.15);
        
        // Score base
        finalScore = breakdown.pitchScore + breakdown.rhythmScore + 
                    breakdown.volumeScore + breakdown.performanceScore;
        
        // Multiplicador de dificuldade
        const difficultyMultiplier = {
            easy: 0.8,
            medium: 1.0,
            hard: 1.3
        };
        
        finalScore *= difficultyMultiplier[difficulty];
        
        // Bônus por tempo cantado
        if (duration > 60) finalScore += 5;
        if (duration > 120) finalScore += 10;
        
        // Bônus por muitas notas capturadas
        if (notes.length > 100) finalScore += 5;
        if (notes.length > 200) finalScore += 10;
        
        // BÔNUS DE STREAK (continuidade excepcional)
        const streakBonus = Math.min(15, Math.floor(maxStreak / 10) * 2); // +2 pts a cada 10 notas de streak
        finalScore += streakBonus;
        breakdown.streakBonus = streakBonus;
        
        // COBERTURA (% do tempo cantando)
        const totalDuration = duration * 1000;
        const coverage = (coverageTime / totalDuration) * 100;
        breakdown.coverage = Math.round(coverage);
        
        // PENALIZAÇÃO POR PAUSAS EXCESSIVAS
        if (coverage < 50) {
            // Se cantou menos de 50% do tempo, penaliza
            const coveragePenalty = Math.round((50 - coverage) * 0.3); // 0.3 pts por % faltante
            finalScore -= coveragePenalty;
            breakdown.coveragePenalty = coveragePenalty;
        }
        
        // DEDUÇÃO ACUMULADA POR PAUSAS LONGAS
        finalScore -= Math.round(silencePenalty);
        breakdown.silencePenalty = Math.round(silencePenalty);
        
        finalScore = Math.min(100, Math.round(Math.max(0, finalScore)));
    } else {
        finalScore = 0;
        breakdown = {
            pitchScore: 0,
            rhythmScore: 0,
            volumeScore: 0,
            performanceScore: 0
        };
    }
    
    // Exibir pontuação
    document.getElementById('scoreNumber').textContent = finalScore;
    
    // Feedback baseado na pontuação com SONS
    let feedback = '';
    let emoji = '';
    let tips = '';
    let soundEffect = null;
    
    if (finalScore >= 90) {
        feedback = 'Extraordinário! Você é uma estrela! 🌟';
        emoji = '🏆';
        tips = 'Performance perfeita! Continue assim!';
        soundEffect = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'; // Som de vitória
    } else if (finalScore >= 75) {
        feedback = 'Excelente! Desempenho incrível! 🎉';
        emoji = '⭐';
        tips = 'Muito bom! Tente manter ainda mais consistência.';
        soundEffect = 'https://www.soundjay.com/misc/sounds/bell-ringing-01.mp3'; // Som de sucesso
    } else if (finalScore >= 60) {
        feedback = 'Bom trabalho! Continue praticando! 👍';
        emoji = '😊';
        tips = 'Pratique manter as notas mais estáveis no tom correto.';
        soundEffect = 'https://www.soundjay.com/button/sounds/button-09.mp3'; // Som médio
    } else if (finalScore >= 40) {
        feedback = 'Continue tentando! Você vai melhorar! 💪';
        emoji = '😐';
        tips = 'Cante mais próximo ao microfone e tente acompanhar o ritmo da música.';
        soundEffect = 'https://www.soundjay.com/button/sounds/button-16.mp3'; // Som fraco
    } else {
        feedback = 'Precisa praticar mais... Não desista! 😔';
        emoji = '😞';
        tips = 'Tente cantar mais alto, mantenha o ritmo e não pare no meio da música!';
        soundEffect = 'https://www.soundjay.com/misc/sounds/fail-buzzer-01.mp3'; // Som de falha
    }
    
    // Tocar som de feedback
    if (soundEffect) {
        try {
            const audio = new Audio(soundEffect);
            audio.volume = 0.5;
            audio.play().catch(err => console.log('Não foi possível tocar som:', err));
        } catch (err) {
            console.log('Erro ao carregar som:', err);
        }
    }
    
    // Calcular média de pitch
    const avgPitch = pitchHistory.length > 0 
        ? Math.round(pitchHistory.reduce((a, b) => a + b, 0) / pitchHistory.length) 
        : 0;
    
    // Calcular taxa de detecção de voz
    const totalDetections = voiceDetectionCount + noiseRejectionCount;
    const voiceAccuracy = totalDetections > 0 
        ? Math.round((voiceDetectionCount / totalDetections) * 100) 
        : 0;
    
    // Feedback sobre cobertura
    let coverageFeedback = '';
    let coverageColor = '';
    if (breakdown.coverage >= 80) {
        coverageFeedback = '🔥 Excelente cobertura!';
        coverageColor = '#4CAF50';
    } else if (breakdown.coverage >= 60) {
        coverageFeedback = '👍 Boa cobertura';
        coverageColor = '#8BC34A';
    } else if (breakdown.coverage >= 40) {
        coverageFeedback = '⚠️ Tente cantar mais';
        coverageColor = '#FFC107';
    } else {
        coverageFeedback = '❌ Muitas pausas';
        coverageColor = '#ff6b6b';
    }
    
    document.getElementById('scoreFeedback').innerHTML = `
        <h3 style="font-size: 2em; margin: 20px 0;">${emoji}</h3>
        <p style="font-size: 1.3em;">${feedback}</p>
        <div style="margin: 30px 0; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 10px;">
            <h4 style="margin-bottom: 15px;">📊 Análise Detalhada:</h4>
            <div style="text-align: left; max-width: 400px; margin: 0 auto;">
                <p>🎵 <strong>Tom (Pitch):</strong> ${breakdown.pitchScore}/35 pts</p>
                <p>⏱️ <strong>Ritmo:</strong> ${breakdown.rhythmScore}/30 pts</p>
                <p>🔊 <strong>Consistência:</strong> ${breakdown.volumeScore}/20 pts</p>
                <p>⭐ <strong>Performance:</strong> ${breakdown.performanceScore}/15 pts</p>
                <hr style="margin: 15px 0; opacity: 0.3;">
                ${breakdown.streakBonus > 0 ? `<p style="color: #4CAF50;">🔥 <strong>Streak máximo:</strong> ${maxStreak} notas (+${breakdown.streakBonus} pts bônus)</p>` : `<p>🔥 <strong>Streak máximo:</strong> ${maxStreak} notas</p>`}
                <p style="color: ${coverageColor};"><strong>📊 Cobertura:</strong> ${breakdown.coverage}% ${coverageFeedback}</p>
                ${breakdown.coveragePenalty > 0 ? `<p style="color: #ff6b6b;">⏸️ <strong>Penalização por baixa cobertura:</strong> -${breakdown.coveragePenalty} pts</p>` : ''}
                ${breakdown.silencePenalty > 0 ? `<p style="color: #ff6b6b;">⏸️ <strong>Pausas longas (>5s):</strong> -${breakdown.silencePenalty} pts</p>` : ''}
                <hr style="margin: 15px 0; opacity: 0.3;">
                <p>📈 <strong>Notas capturadas:</strong> ${notes.length}</p>
                <p>🎼 <strong>Pitch médio:</strong> ${avgPitch} Hz</p>
                <p>⏰ <strong>Tempo:</strong> ${Math.round(duration)}s</p>
                <p>🎯 <strong>Dificuldade:</strong> ${difficulty}</p>
                <hr style="margin: 15px 0; opacity: 0.3;">
                <p style="color: #4CAF50;">🎤 <strong>Detecção de voz:</strong> ${voiceAccuracy}% precisão</p>
                <p style="font-size: 0.85em; opacity: 0.7;">   Voz: ${voiceDetectionCount} | Ruído filtrado: ${noiseRejectionCount}</p>
            </div>
        </div>
        <p style="margin-top: 20px; opacity: 0.9; font-style: italic;">${tips}</p>
    `;
    
    // Mostrar modal com resultado
    setTimeout(() => {
        showCustomModal({
            emoji: emoji,
            title: `Pontuação: ${finalScore}/100`,
            message: feedback,
            details: `
                <h4 style="margin-bottom: 15px;">📊 Análise Detalhada:</h4>
                <p>🎵 <strong>Tom (Pitch):</strong> ${breakdown.pitchScore}/35 pts</p>
                <p>⏱️ <strong>Ritmo:</strong> ${breakdown.rhythmScore}/30 pts</p>
                <p>🔊 <strong>Consistência:</strong> ${breakdown.volumeScore}/20 pts</p>
                <p>⭐ <strong>Performance:</strong> ${breakdown.performanceScore}/15 pts</p>
                <hr style="margin: 15px 0; opacity: 0.3;">
                <p style="font-style: italic; opacity: 0.9;">${tips}</p>
            `,
            primaryText: 'Legal!',
            onPrimary: () => {
                // Após fechar o modal de análise, mostrar opções
                setTimeout(() => {
                    showFinalScoreOptions(finalScore);
                }, 300);
            }
        });
    }, 500);
    
    return finalScore;
}

// Resetar estado do karaoke para nova sessão
function resetKaraokeState() {
    notes = [];
    pitchHistory = [];
    volumeHistory = [];
    rhythmScores = [];
    startTime = 0;
    lastNoteTime = 0;
    lastVoiceTime = 0;
    currentStreak = 0;
    maxStreak = 0;
    coverageTime = 0;
    silencePenalty = 0;
    voiceDetectionCount = 0;
    noiseRejectionCount = 0;
    
    // Limpar display
    document.getElementById('scoreNumber').textContent = '0';
    document.getElementById('pitchValue').textContent = '--';
    document.getElementById('rhythmValue').textContent = '0%';
    document.getElementById('volumeValue').textContent = '0%';
    document.getElementById('notesCount').textContent = '0';
    document.getElementById('lyricsText').textContent = '♪ As letras aparecerão aqui ♪';
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderPopularSongs();
    createVisualizer();
    
    // Tentar listar dispositivos sem pedir permissão ainda
    listAudioDevicesWithoutPermission();
    
    // Exibir aviso de microfone
    setTimeout(() => {
        if (!audioContext) {
            document.getElementById('micPermission').style.display = 'block';
        }
    }, 2000);
});

// Listar dispositivos sem pedir permissão (labels vazios até permitir)
async function listAudioDevicesWithoutPermission() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        
        const select = document.getElementById('microphoneSelect');
        
        if (audioInputs.length === 0) {
            select.innerHTML = '<option>Nenhum microfone detectado</option>';
            return;
        }
        
        select.innerHTML = '';
        audioInputs.forEach((device, index) => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            // Sem permissão, labels ficam vazios
            option.textContent = device.label || `Microfone ${index + 1}`;
            if (index === 0) option.selected = true;
            select.appendChild(option);
        });
        
        console.log('📋 Dispositivos listados (permissão necessária para nomes):', audioInputs.length);
        
    } catch (error) {
        console.error('❌ Erro ao listar dispositivos:', error);
        document.getElementById('microphoneSelect').innerHTML = '<option>Erro ao detectar</option>';
    }
}

// Teclas de atalho
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && player) {
        e.preventDefault();
        togglePause();
    }
    if (e.code === 'Escape' && isRecording) {
        stopKaraoke();
    }
});

// Fechar modal do YouTube
window.closeYoutubeModal = function() {
    document.getElementById('youtubeModal').style.display = 'none';
    document.getElementById('searchInput').value = '';
};

// YouTube Data API Key
const YOUTUBE_API_KEY = 'AIzaSyACz9UUEmgQYlrgsjLYhePW3RqWC2a87V4';

window.searchVideo = async function() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
        showCustomModal({
            emoji: '🔍',
            title: 'Busca Vazia',
            message: 'Digite o nome da música ou artista!',
            primaryText: 'OK'
        });
        return;
    }

    // Mostrar loading
    document.getElementById('youtubeResults').innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #667eea;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">🔍</div>
            <div>Buscando vídeos...</div>
        </div>
    `;
    document.getElementById('youtubeModal').style.display = 'flex';

    try {
        // Buscar vídeos na API do YouTube
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query + ' karaoke')}&type=video&key=${YOUTUBE_API_KEY}`
        );

        const data = await response.json();

        // Verificar se houve erro na API
        if (data.error) {
            console.error('Erro da API YouTube:', data.error);
            throw new Error(data.error.message || 'Erro na API do YouTube');
        }

        if (!response.ok) {
            console.error('Response não OK:', response.status, data);
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        if (!data.items || data.items.length === 0) {
            document.getElementById('youtubeResults').innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #888;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">😕</div>
                    <div>Nenhum resultado encontrado</div>
                </div>
            `;
            return;
        }

        // Mostrar resultados
        let html = '';
        data.items.forEach(item => {
            const videoId = item.id.videoId;
            const title = item.snippet.title;
            const channel = item.snippet.channelTitle;
            const thumbnail = item.snippet.thumbnails.medium.url;

            html += `
                <div style="margin-bottom: 18px; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.05); display: flex; align-items: center; border: 1px solid rgba(255,255,255,0.1);">
                    <img src="${thumbnail}" style="width: 120px; height: 90px; border-radius: 8px; margin-right: 15px; object-fit: cover;">
                    <div style="flex: 1; color: #fff;">
                        <div style="font-weight: bold; margin-bottom: 5px;">${title}</div>
                        <div style="font-size: 0.85em; color: rgba(255,255,255,0.6);">${channel}</div>
                    </div>
                    <button onclick="loadVideo('${videoId}'); closeYoutubeModal();" style="margin-left: 15px; padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">▶️ Selecionar</button>
                </div>
            `;
        });

        document.getElementById('youtubeResults').innerHTML = html;

    } catch (error) {
        console.error('Erro ao buscar vídeos:', error);
        
        let errorMsg = 'Erro ao buscar vídeos';
        let errorDetails = 'Tente novamente';
        
        // Mensagens específicas para diferentes tipos de erro
        if (error.message.includes('blocked') || error.message.includes('PERMISSION_DENIED')) {
            errorMsg = 'API Key Bloqueada';
            errorDetails = 'A chave da API precisa ser configurada corretamente no Google Cloud Console.';
        } else if (error.message.includes('quota')) {
            errorMsg = 'Limite de busca atingido';
            errorDetails = 'A API do YouTube tem limite diário. Tente mais tarde ou use "Colar Link".';
        } else if (error.message.includes('API key')) {
            errorMsg = 'Erro de configuração';
            errorDetails = 'Problema com a chave da API. Use "Colar Link do YouTube".';
        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
            errorMsg = 'Sem conexão com a internet';
            errorDetails = 'Verifique sua conexão e tente novamente.';
        }
        
        document.getElementById('youtubeResults').innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ff6b6b;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">❌</div>
                <div style="font-weight: bold; margin-bottom: 0.5rem;">${errorMsg}</div>
                <div style="font-size: 0.9em; opacity: 0.8; margin-bottom: 1rem;">${errorDetails}</div>
                
                <div style="margin-top: 1.5rem; padding: 1.2rem; background: rgba(102, 126, 234, 0.1); border-radius: 12px; border: 1px solid rgba(102, 126, 234, 0.3);">
                    <div style="font-size: 1.1em; margin-bottom: 1rem; color: #667eea;">💡 <strong>Como Resolver:</strong></div>
                    <div style="text-align: left; font-size: 0.9em; line-height: 1.6; color: rgba(255,255,255,0.9);">
                        <p style="margin: 0.5rem 0;"><strong>1.</strong> Acesse <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" style="color: #667eea; text-decoration: underline;">Google Cloud Console</a></p>
                        <p style="margin: 0.5rem 0;"><strong>2.</strong> Ative a "YouTube Data API v3"</p>
                        <p style="margin: 0.5rem 0;"><strong>3.</strong> Aguarde alguns minutos e tente novamente</p>
                    </div>
                </div>
                
                <div style="margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; font-size: 0.85em;">
                    <div style="margin-bottom: 0.5rem;">🎵 <strong>Alternativa Imediata:</strong></div>
                    <div>Use o botão <strong>"🔗 Colar Link do YouTube"</strong> na barra de busca</div>
                </div>
            </div>
        `;
    }
};

// ====== EXPORTAR FUNÇÕES GLOBAIS PARA OS BOTÕES ======
window.loadFromURL = loadFromURL;

// ====== EVENT LISTENERS ======
document.addEventListener('DOMContentLoaded', function() {
    // Botão de busca
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            if (window.searchVideo) {
                window.searchVideo();
            }
        });
    }
    
    // Botão de URL
    const loadUrlBtn = document.getElementById('loadUrlBtn');
    if (loadUrlBtn) {
        loadUrlBtn.addEventListener('click', function() {
            console.log('🔗 Botão URL clicado via addEventListener');
            loadFromURL();
        });
    }
    
    // Enter na barra de busca
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && window.searchVideo) {
                window.searchVideo();
            }
        });
    }
});
