// Estado do jogo
const gameState = {
    score: 0,
    lives: 3,
    time: 60,
    combo: 0,
    comboMultiplier: 1,
    lightCount: 0,
    darkCount: 0,
    totalTaps: 0,
    isPlaying: false,
    spawnInterval: 1500,
    darkSpawnInterval: 2500,
    timer: null,
    spawnTimer: null,
    darkSpawnTimer: null,
    playerName: ''
};

// Sistema de Ranking
const rankingState = {
    currentPage: 1,
    itemsPerPage: 10,
    scores: []
};

// Mensagens de reflexão
const reflections = [
    "Mesmo quando erramos, a Luz ainda nos encontra.",
    "Não deixes que as trevas te distraiam do propósito.",
    "Olha para a Luz. É lá que está o teu alvo."
];

// Elementos DOM
const startScreen = document.getElementById('startScreen');
const nameScreen = document.getElementById('nameScreen');
const gameScreen = document.getElementById('gameScreen');
const reflectionScreen = document.getElementById('reflectionScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const messageScreen = document.getElementById('messageScreen');
const rankingScreen = document.getElementById('rankingScreen');
const gameArea = document.getElementById('gameArea');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const livesEl = document.getElementById('lives');
const comboIndicator = document.getElementById('comboIndicator');
const comboMultiplierEl = document.getElementById('comboMultiplier');
const flashEffect = document.getElementById('flashEffect');
const glowEffect = document.getElementById('glowEffect');
const playerNameInput = document.getElementById('playerName');
const rankingList = document.getElementById('rankingList');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageInfo = document.getElementById('pageInfo');

// Event listeners
document.getElementById('startBtn').addEventListener('click', () => showScreen(nameScreen));
document.getElementById('rankingBtn').addEventListener('click', () => {
    loadRanking();
    showScreen(rankingScreen);
});
document.getElementById('confirmNameBtn').addEventListener('click', confirmName);
document.getElementById('backToStartBtn').addEventListener('click', () => showScreen(startScreen));
document.getElementById('backToStartFromRankingBtn').addEventListener('click', () => showScreen(startScreen));
document.getElementById('playAgainBtn').addEventListener('click', () => showScreen(nameScreen));
document.getElementById('viewRankingBtn').addEventListener('click', () => {
    loadRanking();
    showScreen(rankingScreen);
});
document.getElementById('readMessageBtn').addEventListener('click', showMessage);
document.getElementById('backToGameBtn').addEventListener('click', () => showScreen(nameScreen));
prevPageBtn.addEventListener('click', () => {
    if (rankingState.currentPage > 1) {
        rankingState.currentPage--;
        displayRanking();
    }
});
nextPageBtn.addEventListener('click', () => {
    const maxPage = Math.ceil(rankingState.scores.length / rankingState.itemsPerPage);
    if (rankingState.currentPage < maxPage) {
        rankingState.currentPage++;
        displayRanking();
    }
});

// Permitir Enter no input de nome
playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        confirmName();
    }
});

// Sons (usando Web Audio API para criar sons simples)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playLightSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playDarkSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'triangle';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Funções de tela
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

function startGame() {
    // Parar todos os timers anteriores se existirem
    stopTimers();
    
    // Reset do estado
    gameState.score = 0;
    gameState.lives = 3;
    gameState.time = 60;
    gameState.combo = 0;
    gameState.comboMultiplier = 1;
    gameState.lightCount = 0;
    gameState.darkCount = 0;
    gameState.totalTaps = 0;
    gameState.isPlaying = true;
    gameState.spawnInterval = 1500;
    gameState.darkSpawnInterval = 2500;
    
    // Limpar área de jogo
    gameArea.innerHTML = '';
    
    // Atualizar UI
    updateUI();
    
    // Mostrar tela de jogo
    showScreen(gameScreen);
    
    // Iniciar timers
    startTimers();
    
    // Spawn inicial
    spawnLight();
    setTimeout(() => spawnDark(), 1000);
}

// Variáveis para controlar os loops de spawn
let spawnLightLoopTimeout = null;
let spawnDarkLoopTimeout = null;

// Funções de loop que podem ser acessadas externamente
function spawnLightLoop() {
    if (!gameState.isPlaying) {
        spawnLightLoopTimeout = setTimeout(spawnLightLoop, 100); // Verificar novamente em 100ms
        return;
    }
    spawnLight();
    spawnLightLoopTimeout = setTimeout(spawnLightLoop, gameState.spawnInterval);
}

function spawnDarkLoop() {
    if (!gameState.isPlaying) {
        spawnDarkLoopTimeout = setTimeout(spawnDarkLoop, 100); // Verificar novamente em 100ms
        return;
    }
    spawnDark();
    spawnDarkLoopTimeout = setTimeout(spawnDarkLoop, gameState.darkSpawnInterval);
}

function startTimers() {
    // Timer principal
    gameState.timer = setInterval(() => {
        if (!gameState.isPlaying) return;
        
        gameState.time--;
        timerEl.textContent = gameState.time;
        
        // Aumentar velocidade gradualmente
        if (gameState.time % 10 === 0 && gameState.spawnInterval > 800) {
            gameState.spawnInterval -= 100;
            gameState.darkSpawnInterval -= 150;
        }
        
        if (gameState.time <= 0) {
            endGame();
        }
    }, 1000);
    
    // Iniciar loops de spawn
    spawnLightLoopTimeout = setTimeout(spawnLightLoop, gameState.spawnInterval);
    spawnDarkLoopTimeout = setTimeout(spawnDarkLoop, gameState.darkSpawnInterval);
}

function stopTimers() {
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
    if (spawnLightLoopTimeout) {
        clearTimeout(spawnLightLoopTimeout);
        spawnLightLoopTimeout = null;
    }
    if (spawnDarkLoopTimeout) {
        clearTimeout(spawnDarkLoopTimeout);
        spawnDarkLoopTimeout = null;
    }
}

function spawnLight() {
    if (!gameState.isPlaying) return;
    
    const sphere = document.createElement('div');
    sphere.className = 'sphere light';
    
    const size = Math.random() * 40 + 40; // 40-80px
    sphere.style.width = size + 'px';
    sphere.style.height = size + 'px';
    
    // Posição aleatória (evitando bordas)
    const margin = size / 2;
    const x = Math.random() * (window.innerWidth - size - margin * 2) + margin;
    const y = Math.random() * (window.innerHeight - size - margin * 2) + 100; // Evitar UI superior
    
    sphere.style.left = x + 'px';
    sphere.style.top = y + 'px';
    
    // Adicionar movimento às esferas de luz
    const speed = 1 + Math.random() * 1.5; // Velocidade entre 1 e 2.5
    const angle = Math.random() * Math.PI * 2; // Direção aleatória
    sphere.vx = Math.cos(angle) * speed;
    sphere.vy = Math.sin(angle) * speed;
    sphere.startX = x;
    sphere.startY = y;
    sphere.size = size; // Armazenar tamanho para uso na animação
    
    // Animação de movimento
    function moveLight() {
        if (!sphere.parentNode || !gameState.isPlaying) return;
        
        let currentX = parseFloat(sphere.style.left) || sphere.startX;
        let currentY = parseFloat(sphere.style.top) || sphere.startY;
        
        // Atualizar posição
        currentX += sphere.vx;
        currentY += sphere.vy;
        
        // Quicar nas bordas
        const margin = sphere.size / 2;
        if (currentX <= margin || currentX >= window.innerWidth - sphere.size - margin) {
            sphere.vx = -sphere.vx;
        }
        if (currentY <= 100 + margin || currentY >= window.innerHeight - sphere.size - margin) {
            sphere.vy = -sphere.vy;
        }
        
        // Garantir que fique dentro dos limites
        currentX = Math.max(margin, Math.min(window.innerWidth - sphere.size - margin, currentX));
        currentY = Math.max(100 + margin, Math.min(window.innerHeight - sphere.size - margin, currentY));
        
        sphere.style.left = currentX + 'px';
        sphere.style.top = currentY + 'px';
        
        requestAnimationFrame(moveLight);
    }
    
    requestAnimationFrame(moveLight);
    
    // Event listener para toque
    sphere.addEventListener('click', handleLightClick);
    sphere.addEventListener('touchstart', handleLightClick, { passive: true });
    
    // Remover após 1.5 segundos se não for tocado (mais rápido)
    setTimeout(() => {
        if (sphere.parentNode) {
            sphere.remove();
        }
    }, 1500);
    
    gameArea.appendChild(sphere);
}

function spawnDark() {
    if (!gameState.isPlaying) return;
    
    const sphere = document.createElement('div');
    sphere.className = 'sphere dark';
    
    const size = Math.random() * 40 + 40; // 40-80px
    sphere.style.width = size + 'px';
    sphere.style.height = size + 'px';
    
    // Posição aleatória
    const margin = size / 2;
    const x = Math.random() * (window.innerWidth - size - margin * 2) + margin;
    const y = Math.random() * (window.innerHeight - size - margin * 2) + 100;
    
    sphere.style.left = x + 'px';
    sphere.style.top = y + 'px';
    
    // Event listener para toque
    sphere.addEventListener('click', handleDarkClick);
    sphere.addEventListener('touchstart', handleDarkClick, { passive: true });
    
    // Remover após 1.5 segundos se não for tocado (mais rápido)
    setTimeout(() => {
        if (sphere.parentNode) {
            sphere.remove();
        }
    }, 1500);
    
    gameArea.appendChild(sphere);
}

function handleLightClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!gameState.isPlaying) return;
    
    const sphere = e.target;
    
    // Remover esfera
    sphere.remove();
    
    // Atualizar combo
    gameState.combo++;
    gameState.lightCount++;
    gameState.totalTaps++;
    
    // Calcular multiplicador
    if (gameState.combo >= 5) {
        gameState.comboMultiplier = 1.5;
        showCombo();
    } else {
        gameState.comboMultiplier = 1;
    }
    
    // Pontuação
    const points = Math.floor(10 * gameState.comboMultiplier);
    gameState.score += points;
    
    // Feedback visual e sonoro
    playLightSound();
    showGlow();
    
    // Atualizar UI
    updateUI();
}

function handleDarkClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!gameState.isPlaying) return;
    
    const sphere = e.target;
    
    // Remover esfera
    sphere.remove();
    
    // Perder vida
    gameState.lives--;
    gameState.combo = 0;
    gameState.comboMultiplier = 1;
    gameState.darkCount++;
    gameState.totalTaps++;
    
    // Feedback visual e sonoro
    playDarkSound();
    showFlash();
    
    // Mostrar reflexão
    if (gameState.lives > 0) {
        showReflection();
    }
    
    // Atualizar UI
    updateUI();
    
    // Verificar game over
    if (gameState.lives <= 0) {
        endGame();
    }
}

function showCombo() {
    comboMultiplierEl.textContent = gameState.comboMultiplier.toFixed(1);
    comboIndicator.classList.add('active');
    
    setTimeout(() => {
        comboIndicator.classList.remove('active');
    }, 1000);
}

function showGlow() {
    glowEffect.classList.add('active');
    
    setTimeout(() => {
        glowEffect.classList.remove('active');
    }, 300);
}

function showFlash() {
    flashEffect.classList.add('active');
    
    setTimeout(() => {
        flashEffect.classList.remove('active');
    }, 200);
}

function showReflection() {
    gameState.isPlaying = false;
    
    const reflectionText = document.getElementById('reflectionText');
    reflectionText.textContent = reflections[Math.floor(Math.random() * reflections.length)];
    
    showScreen(reflectionScreen);
    
    setTimeout(() => {
        if (gameState.lives > 0 && gameState.time > 0) {
            gameState.isPlaying = true;
            showScreen(gameScreen);
            // Garantir que os loops de spawn continuem
            // Se os timeouts foram limpos, reiniciar
            if (!spawnLightLoopTimeout) {
                spawnLightLoopTimeout = setTimeout(spawnLightLoop, gameState.spawnInterval);
            }
            if (!spawnDarkLoopTimeout) {
                spawnDarkLoopTimeout = setTimeout(spawnDarkLoop, gameState.darkSpawnInterval);
            }
        }
    }, 2000);
}

function endGame() {
    gameState.isPlaying = false;
    
    // Limpar todos os timers
    stopTimers();
    
    // Limpar área de jogo
    gameArea.innerHTML = '';
    
    // Salvar pontuação no ranking
    if (gameState.playerName.trim()) {
        saveScore(gameState.playerName.trim(), gameState.score, gameState.lightCount);
    }
    
    // Calcular estatísticas
    const accuracy = gameState.totalTaps > 0 
        ? Math.round((gameState.lightCount / gameState.totalTaps) * 100) 
        : 0;
    const percentage = gameState.totalTaps > 0
        ? Math.round((gameState.lightCount / gameState.totalTaps) * 100)
        : 0;
    
    // Atualizar tela de fim de jogo
    const title = document.getElementById('gameOverTitle');
    const verse = document.getElementById('gameOverVerse');
    const finalScoreEl = document.getElementById('finalScore');
    const lightCountEl = document.getElementById('lightCount');
    const accuracyEl = document.getElementById('accuracy');
    
    finalScoreEl.textContent = gameState.score;
    lightCountEl.textContent = gameState.lightCount;
    accuracyEl.textContent = accuracy + '%';
    
    if (percentage >= 70) {
        title.textContent = '✨ A luz brilhou nas tuas ações.';
        verse.textContent = 'João 1:5 – A luz brilha nas trevas, e as trevas não a derrotaram.';
    } else {
        title.textContent = '💡 A luz nunca se apaga — continua a tentar.';
        verse.textContent = 'Salmo 119:105 – A tua palavra é lâmpada para os meus pés.';
    }
    
    showScreen(gameOverScreen);
}

function showMessage() {
    showScreen(messageScreen);
}

function updateUI() {
    scoreEl.textContent = gameState.score;
    timerEl.textContent = gameState.time;
    livesEl.textContent = gameState.lives;
}

// Prevenir zoom no mobile
document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Sistema de Ranking - Funções

function confirmName() {
    const name = playerNameInput.value.trim();
    if (name) {
        gameState.playerName = name;
        // Salvar nome para próxima vez
        localStorage.setItem('lastPlayerName', name);
        startGame();
    } else {
        alert('Por favor, digita o teu nome!');
        playerNameInput.focus();
    }
}

function saveScore(name, score, lightCount) {
    const scores = getScores();
    
    const newScore = {
        name: name,
        score: score,
        lightCount: lightCount,
        date: new Date().toISOString(),
        timestamp: Date.now()
    };
    
    scores.push(newScore);
    
    // Ordenar por pontuação (maior primeiro) e depois por data (mais recente primeiro em caso de empate)
    scores.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return b.timestamp - a.timestamp;
    });
    
    // Manter apenas os top 1000 scores para não encher muito o localStorage
    if (scores.length > 1000) {
        scores.splice(1000);
    }
    
    localStorage.setItem('luzVsTrevasScores', JSON.stringify(scores));
}

function getScores() {
    const scoresJson = localStorage.getItem('luzVsTrevasScores');
    if (scoresJson) {
        try {
            return JSON.parse(scoresJson);
        } catch (e) {
            console.error('Erro ao carregar scores:', e);
            return [];
        }
    }
    return [];
}

function loadRanking() {
    rankingState.scores = getScores();
    rankingState.currentPage = 1;
    displayRanking();
}

function displayRanking() {
    if (rankingState.scores.length === 0) {
        rankingList.innerHTML = '<div class="empty-ranking">Ainda não há pontuações registadas. Sê o primeiro!</div>';
        prevPageBtn.disabled = true;
        nextPageBtn.disabled = true;
        pageInfo.textContent = 'Sem registos';
        return;
    }
    
    const startIndex = (rankingState.currentPage - 1) * rankingState.itemsPerPage;
    const endIndex = startIndex + rankingState.itemsPerPage;
    const pageScores = rankingState.scores.slice(startIndex, endIndex);
    
    rankingList.innerHTML = '';
    
    pageScores.forEach((scoreData, index) => {
        const globalIndex = startIndex + index;
        const position = globalIndex + 1;
        
        const item = document.createElement('div');
        item.className = 'ranking-item';
        
        // Adicionar classe especial para top 3
        if (position === 1) item.classList.add('top-1');
        else if (position === 2) item.classList.add('top-2');
        else if (position === 3) item.classList.add('top-3');
        
        const date = new Date(scoreData.date);
        const dateStr = date.toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        item.innerHTML = `
            <div class="ranking-position">${position}</div>
            <div class="ranking-info">
                <div class="ranking-name">${escapeHtml(scoreData.name)}</div>
                <div class="ranking-date">${dateStr}</div>
            </div>
            <div class="ranking-score">${scoreData.score.toLocaleString('pt-PT')}</div>
        `;
        
        rankingList.appendChild(item);
    });
    
    // Atualizar paginação
    const maxPage = Math.ceil(rankingState.scores.length / rankingState.itemsPerPage);
    pageInfo.textContent = `Página ${rankingState.currentPage} de ${maxPage}`;
    
    prevPageBtn.disabled = rankingState.currentPage === 1;
    nextPageBtn.disabled = rankingState.currentPage >= maxPage;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Carregar último nome usado ao iniciar
window.addEventListener('DOMContentLoaded', () => {
    const lastName = localStorage.getItem('lastPlayerName');
    if (lastName) {
        playerNameInput.value = lastName;
    }
});

// Inicializar audio context no primeiro clique (requisito do navegador)
document.addEventListener('click', () => {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}, { once: true });

