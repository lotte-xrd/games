// Estado do jogo
const gameState = {
    currentLevel: null,
    grid: [],
    foundWords: new Set(),
    selectedCells: [],
    isSelecting: false,
    score: 0,
    startTime: null,
    elapsedTime: 0,
    timerInterval: null,
    hintsUsed: 0,
    playerName: '',
    isPaused: false,
    settings: {
        sound: true,
        vibration: true,
        highContrast: false
    }
};

// Sistema de Ranking
const rankingState = {
    currentPage: 1,
    itemsPerPage: 10,
    scores: [],
    filterLevel: 'all'
};

// Elementos DOM
const startScreen = document.getElementById('startScreen');
const howToPlayScreen = document.getElementById('howToPlayScreen');
const nameScreen = document.getElementById('nameScreen');
const levelSelectScreen = document.getElementById('levelSelectScreen');
const rankingScreen = document.getElementById('rankingScreen');
const gameScreen = document.getElementById('gameScreen');
const pauseScreen = document.getElementById('pauseScreen');
const completionModal = document.getElementById('completionModal');

const wordGrid = document.getElementById('wordGrid');
const wordsList = document.getElementById('wordsList');
const levelTitle = document.getElementById('levelTitle');
const wordsRemaining = document.getElementById('wordsRemaining');
const gameTimer = document.getElementById('gameTimer');
const playerNameInput = document.getElementById('playerName');
const rankingList = document.getElementById('rankingList');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageInfo = document.getElementById('pageInfo');
const levelFilter = document.getElementById('levelFilter');

// Event listeners
document.getElementById('startBtn').addEventListener('click', () => showScreen(nameScreen));
document.getElementById('rankingBtn').addEventListener('click', () => {
    loadRanking();
    showScreen(rankingScreen);
});
document.getElementById('howToPlayBtn').addEventListener('click', () => showScreen(howToPlayScreen));
document.getElementById('backFromHowToBtn').addEventListener('click', () => showScreen(startScreen));
document.getElementById('confirmNameBtn').addEventListener('click', confirmName);
document.getElementById('backFromNameBtn').addEventListener('click', () => showScreen(startScreen));
document.getElementById('backToStartBtn').addEventListener('click', () => showScreen(startScreen));
document.getElementById('backToStartFromRankingBtn').addEventListener('click', () => showScreen(startScreen));
document.getElementById('viewRankingBtn').addEventListener('click', () => {
    loadRanking();
    showScreen(rankingScreen);
});
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
levelFilter.addEventListener('change', (e) => {
    rankingState.filterLevel = e.target.value;
    rankingState.currentPage = 1;
    loadRanking();
});

// Permitir Enter no input de nome
playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        confirmName();
    }
});
document.getElementById('pauseBtn').addEventListener('click', () => {
    gameState.isPaused = true;
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    showScreen(pauseScreen);
});
document.getElementById('resumeBtn').addEventListener('click', () => {
    gameState.isPaused = false;
    // Ajustar startTime para compensar o tempo que já passou
    gameState.startTime = Date.now() - (gameState.elapsedTime * 1000);
    // Reiniciar timer
    gameState.timerInterval = setInterval(updateTimer, 100);
    showScreen(gameScreen);
});
document.getElementById('quitBtn').addEventListener('click', () => {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    showScreen(levelSelectScreen);
    resetGame();
});
document.getElementById('hintBtn').addEventListener('click', useHint);
document.getElementById('repeatBtn').addEventListener('click', () => {
    startLevel(gameState.currentLevel);
    showScreen(gameScreen);
});
document.getElementById('nextBtn').addEventListener('click', () => {
    const nextLevelIndex = levels.findIndex(l => l.id === gameState.currentLevel.id) + 1;
    if (nextLevelIndex < levels.length) {
        startLevel(levels[nextLevelIndex]);
        showScreen(gameScreen);
    } else {
        showScreen(levelSelectScreen);
    }
});
document.getElementById('shareBtn').addEventListener('click', shareScore);

// Configurações
document.getElementById('soundToggle').addEventListener('change', (e) => {
    gameState.settings.sound = e.target.checked;
});
document.getElementById('vibrationToggle').addEventListener('change', (e) => {
    gameState.settings.vibration = e.target.checked;
});
document.getElementById('contrastToggle').addEventListener('change', (e) => {
    gameState.settings.highContrast = e.target.checked;
    document.body.classList.toggle('high-contrast', e.target.checked);
});

// Sons
function playSound(type) {
    if (!gameState.settings.sound) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'found') {
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'error') {
        oscillator.frequency.value = 300;
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }
}

// Vibração
function vibrate(duration = 50) {
    if (!gameState.settings.vibration || !navigator.vibrate) return;
    navigator.vibrate(duration);
}

// Funções de tela
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

// Inicializar seletor de níveis
function initLevelSelector() {
    const levelGrid = document.getElementById('levelGrid');
    levelGrid.innerHTML = '';
    
    levels.forEach((level, index) => {
        const card = document.createElement('div');
        card.className = 'level-card';
        card.style.borderColor = level.themeColor;
        card.innerHTML = `
            <div class="level-card-number">${index + 1}</div>
            <div class="level-card-title">${level.title}</div>
        `;
        card.addEventListener('click', () => startLevel(level));
        levelGrid.appendChild(card);
    });
}

// Gerar grelha e posicionar palavras
function generateGrid(level) {
    const size = level.gridSize;
    let grid = Array(size).fill(null).map(() => Array(size).fill(''));
    const wordPlacements = [];
    
    // Ordenar palavras por tamanho (maiores primeiro para facilitar posicionamento)
    const sortedWords = [...level.wordList].sort((a, b) => b.length - a.length);
    
    // Tentar múltiplas vezes até conseguir colocar todas as palavras
    let maxAttempts = 10;
    let allWordsPlaced = false;
    
    while (!allWordsPlaced && maxAttempts > 0) {
        grid = Array(size).fill(null).map(() => Array(size).fill(''));
        wordPlacements.length = 0;
        
        allWordsPlaced = true;
        for (const word of sortedWords) {
            const placement = placeWord(grid, word, size);
            if (placement) {
                wordPlacements.push(placement);
            } else {
                allWordsPlaced = false;
                break;
            }
        }
        
        maxAttempts--;
    }
    
    // Se ainda não conseguiu, pelo menos tentar colocar o máximo possível
    if (!allWordsPlaced) {
        console.warn('Algumas palavras não puderam ser colocadas. Tentando novamente...');
        // Recriar grelha e tentar novamente
        grid = Array(size).fill(null).map(() => Array(size).fill(''));
        wordPlacements.length = 0;
        
        for (const word of sortedWords) {
            const placement = placeWord(grid, word, size);
            if (placement) {
                wordPlacements.push(placement);
            } else {
                console.error(`ERRO: Não foi possível colocar a palavra "${word}"`);
            }
        }
    }
    
    // Preencher células vazias com letras aleatórias
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (!grid[i][j]) {
                grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    }
    
    return { grid, wordPlacements };
}

function placeWord(grid, word, size) {
    const directions = [
        { dr: 0, dc: 1 },   // horizontal
        { dr: 1, dc: 0 },   // vertical
        { dr: 1, dc: 1 },   // diagonal principal
        { dr: 1, dc: -1 }   // diagonal secundária
    ];
    
    // Para palavras grandes (>= tamanho da grelha), tentar sistematicamente primeiro
    if (word.length >= size) {
        // Tentar todas as posições possíveis para palavras que ocupam linha/coluna completa
        for (const dir of directions) {
            // Para palavras do tamanho da grelha, só podem estar em uma linha/coluna completa
            if (word.length === size) {
                if (dir.dr === 0 && dir.dc === 1) {
                    // Horizontal - tentar cada linha
                    for (let row = 0; row < size; row++) {
                        let canPlace = true;
                        const cells = [];
                        for (let col = 0; col < size; col++) {
                            const cellLetter = grid[row][col];
                            if (cellLetter && cellLetter !== word[col]) {
                                canPlace = false;
                                break;
                            }
                            cells.push({ row: row, col: col });
                        }
                        if (canPlace) {
                            for (let col = 0; col < size; col++) {
                                grid[row][col] = word[col];
                            }
                            return { word: word, cells: cells, direction: dir };
                        }
                    }
                } else if (dir.dr === 1 && dir.dc === 0) {
                    // Vertical - tentar cada coluna
                    for (let col = 0; col < size; col++) {
                        let canPlace = true;
                        const cells = [];
                        for (let row = 0; row < size; row++) {
                            const cellLetter = grid[row][col];
                            if (cellLetter && cellLetter !== word[row]) {
                                canPlace = false;
                                break;
                            }
                            cells.push({ row: row, col: col });
                        }
                        if (canPlace) {
                            for (let row = 0; row < size; row++) {
                                grid[row][col] = word[row];
                            }
                            return { word: word, cells: cells, direction: dir };
                        }
                    }
                }
            }
        }
    }
    
    // Para palavras menores ou se não conseguiu colocar sistematicamente, tentar aleatoriamente
    const attempts = 500; // Aumentar tentativas
    for (let attempt = 0; attempt < attempts; attempt++) {
        const dir = directions[Math.floor(Math.random() * directions.length)];
        
        // Calcular posição inicial válida
        let startRow, startCol;
        if (dir.dr === 0 && dir.dc === 1) {
            // Horizontal
            startRow = Math.floor(Math.random() * size);
            startCol = Math.floor(Math.random() * (size - word.length + 1));
        } else if (dir.dr === 1 && dir.dc === 0) {
            // Vertical
            startRow = Math.floor(Math.random() * (size - word.length + 1));
            startCol = Math.floor(Math.random() * size);
        } else if (dir.dr === 1 && dir.dc === 1) {
            // Diagonal principal
            const maxStart = size - word.length;
            startRow = Math.floor(Math.random() * (maxStart + 1));
            startCol = Math.floor(Math.random() * (maxStart + 1));
        } else {
            // Diagonal secundária
            const maxStart = size - word.length;
            startRow = Math.floor(Math.random() * (maxStart + 1));
            startCol = word.length - 1 + Math.floor(Math.random() * (size - word.length + 1));
        }
        
        // Verificar se cabe na grelha
        const endRow = startRow + (word.length - 1) * dir.dr;
        const endCol = startCol + (word.length - 1) * dir.dc;
        
        if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
            continue;
        }
        
        // Verificar se pode colocar (células vazias ou com letras compatíveis)
        let canPlace = true;
        const cells = [];
        for (let i = 0; i < word.length; i++) {
            const r = startRow + i * dir.dr;
            const c = startCol + i * dir.dc;
            const cellLetter = grid[r][c];
            
            if (cellLetter && cellLetter !== word[i]) {
                canPlace = false;
                break;
            }
            cells.push({ row: r, col: c });
        }
        
        if (canPlace) {
            // Colocar a palavra
            for (let i = 0; i < word.length; i++) {
                const r = startRow + i * dir.dr;
                const c = startCol + i * dir.dc;
                grid[r][c] = word[i];
            }
            
            return {
                word: word,
                cells: cells,
                direction: dir
            };
        }
    }
    
    // Se ainda não conseguiu, tentar forçar colocação (sobrescrevendo células)
    console.warn(`Não foi possível colocar "${word}" sem conflitos, tentando forçar...`);
    for (const dir of directions) {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const endRow = row + (word.length - 1) * dir.dr;
                const endCol = col + (word.length - 1) * dir.dc;
                
                if (endRow >= 0 && endRow < size && endCol >= 0 && endCol < size) {
                    const cells = [];
                    for (let i = 0; i < word.length; i++) {
                        const r = row + i * dir.dr;
                        const c = col + i * dir.dc;
                        cells.push({ row: r, col: c });
                    }
                    
                    // Forçar colocação
                    for (let i = 0; i < word.length; i++) {
                        const r = row + i * dir.dr;
                        const c = col + i * dir.dc;
                        grid[r][c] = word[i];
                    }
                    
                    return { word: word, cells: cells, direction: dir };
                }
            }
        }
    }
    
    return null; // Não foi possível posicionar
}

// Função para atualizar o timer
function updateTimer() {
    if (!gameState.isPaused && gameState.startTime) {
        gameState.elapsedTime = Math.floor((Date.now() - gameState.startTime) / 1000);
        const minutes = Math.floor(gameState.elapsedTime / 60);
        const seconds = gameState.elapsedTime % 60;
        gameTimer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

// Iniciar nível
function startLevel(level) {
    gameState.currentLevel = level;
    gameState.foundWords.clear();
    gameState.selectedCells = [];
    gameState.isSelecting = false;
    gameState.score = 0;
    gameState.startTime = Date.now();
    gameState.elapsedTime = 0;
    gameState.hintsUsed = 0;
    gameState.isPaused = false;
    
    // Limpar timer anterior se existir
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    const { grid, wordPlacements } = generateGrid(level);
    gameState.grid = grid;
    gameState.wordPlacements = wordPlacements;
    
    levelTitle.textContent = level.title;
    levelTitle.style.color = level.themeColor;
    
    renderGrid();
    renderWordList();
    updateWordsRemaining();
    gameTimer.textContent = '00:00';
    
    // Iniciar timer
    gameState.timerInterval = setInterval(updateTimer, 100);
    
    // Resetar dica
    const hintBtn = document.getElementById('hintBtn');
    hintBtn.disabled = false;
    hintBtn.style.opacity = '1';
    
    // Mudar para a tela de jogo
    showScreen(gameScreen);
}

function renderGrid() {
    wordGrid.innerHTML = '';
    wordGrid.style.gridTemplateColumns = `repeat(${gameState.currentLevel.gridSize}, 1fr)`;
    
    const size = gameState.currentLevel.gridSize;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.textContent = gameState.grid[i][j];
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            // Event listeners para seleção
            cell.addEventListener('mousedown', handleSelectStart);
            cell.addEventListener('touchstart', handleSelectStart, { passive: true });
            cell.addEventListener('mouseenter', handleSelectMove);
            cell.addEventListener('touchmove', handleSelectMove, { passive: false });
            cell.addEventListener('mouseup', handleSelectEnd);
            cell.addEventListener('touchend', handleSelectEnd);
            
            wordGrid.appendChild(cell);
        }
    }
}

function renderWordList() {
    wordsList.innerHTML = '';
    gameState.currentLevel.wordList.forEach(word => {
        const chip = document.createElement('div');
        chip.className = 'word-chip';
        chip.textContent = word;
        chip.dataset.word = word;
        if (gameState.foundWords.has(word)) {
            chip.classList.add('found');
        }
        wordsList.appendChild(chip);
    });
}

function updateWordsRemaining() {
    const remaining = gameState.currentLevel.wordList.length - gameState.foundWords.size;
    wordsRemaining.textContent = `${remaining} palavra${remaining !== 1 ? 's' : ''}`;
}

// Seleção de palavras
function handleSelectStart(e) {
    e.preventDefault();
    gameState.isSelecting = true;
    gameState.selectedCells = [];
    enableTouchPrevention();
    
    const cell = e.target.closest('.grid-cell');
    if (cell) {
        addCellToSelection(cell);
    }
}

function handleSelectMove(e) {
    if (!gameState.isSelecting) return;
    e.preventDefault();
    
    const touch = e.touches ? e.touches[0] : null;
    const point = touch || e;
    const element = document.elementFromPoint(point.clientX, point.clientY);
    const cell = element?.closest('.grid-cell');
    
    if (cell && !gameState.selectedCells.includes(cell)) {
        // Verificar se é adjacente
        const lastCell = gameState.selectedCells[gameState.selectedCells.length - 1];
        if (lastCell) {
            const lastRow = parseInt(lastCell.dataset.row);
            const lastCol = parseInt(lastCell.dataset.col);
            const cellRow = parseInt(cell.dataset.row);
            const cellCol = parseInt(cell.dataset.col);
            
            const dr = Math.abs(cellRow - lastRow);
            const dc = Math.abs(cellCol - lastCol);
            
            // Permitir horizontal, vertical e diagonal
            if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1) || (dr === 1 && dc === 1)) {
                addCellToSelection(cell);
            }
        }
    }
}

function handleSelectEnd(e) {
    if (!gameState.isSelecting) return;
    e.preventDefault();
    
    gameState.isSelecting = false;
    disableTouchPrevention();
    
    if (gameState.selectedCells.length > 0) {
        validateSelection();
    }
    
    clearSelection();
}

function addCellToSelection(cell) {
    if (!gameState.selectedCells.includes(cell)) {
        gameState.selectedCells.push(cell);
        cell.classList.add('selected');
    }
}

function clearSelection() {
    gameState.selectedCells.forEach(cell => {
        cell.classList.remove('selected');
    });
    gameState.selectedCells = [];
}

function validateSelection() {
    const selectedWord = gameState.selectedCells.map(cell => cell.textContent).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
    
    // Verificar palavra normal e invertida
    let foundWord = null;
    if (gameState.currentLevel.wordList.includes(selectedWord)) {
        foundWord = selectedWord;
    } else if (gameState.currentLevel.wordList.includes(reversedWord)) {
        foundWord = reversedWord;
    }
    
    if (foundWord && !gameState.foundWords.has(foundWord)) {
        // Palavra encontrada!
        gameState.foundWords.add(foundWord);
        
        // Marcar células como encontradas
        gameState.selectedCells.forEach(cell => {
            cell.classList.remove('selected');
            cell.classList.add('found');
        });
        
        // Atualizar chip
        const chip = document.querySelector(`[data-word="${foundWord}"]`);
        if (chip) {
            chip.classList.add('found');
        }
        
        // Pontuação
        gameState.score += 100;
        
        // Feedback
        playSound('found');
        vibrate(100);
        
        updateWordsRemaining();
        
        // Verificar se completou
        if (gameState.foundWords.size === gameState.currentLevel.wordList.length) {
            setTimeout(() => showCompletion(), 500);
        }
    } else {
        // Palavra incorreta
        gameState.selectedCells.forEach(cell => {
            cell.style.animation = 'shake 0.3s';
        });
        
        playSound('error');
        vibrate(50);
        
        setTimeout(() => {
            gameState.selectedCells.forEach(cell => {
                cell.style.animation = '';
            });
        }, 300);
    }
}

// Sistema de dicas
function useHint() {
    if (gameState.hintsUsed >= gameState.currentLevel.hints) {
        return;
    }
    
    const unfoundWords = gameState.currentLevel.wordList.filter(
        word => !gameState.foundWords.has(word)
    );
    
    if (unfoundWords.length === 0) return;
    
    const randomWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
    const placement = gameState.wordPlacements.find(p => p.word === randomWord);
    
    if (placement && placement.cells.length > 0) {
        const firstCell = placement.cells[0];
        const cell = document.querySelector(
            `[data-row="${firstCell.row}"][data-col="${firstCell.col}"]`
        );
        
        if (cell) {
            cell.classList.add('hint');
            setTimeout(() => {
                cell.classList.remove('hint');
            }, 2000);
        }
        
        gameState.hintsUsed++;
        
        if (gameState.hintsUsed >= gameState.currentLevel.hints) {
            const hintBtn = document.getElementById('hintBtn');
            hintBtn.disabled = true;
            hintBtn.style.opacity = '0.3';
        }
    }
}

// Modal de conclusão
function showCompletion() {
    // Parar timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    
    const level = gameState.currentLevel;
    const timeElapsed = gameState.elapsedTime;
    
    // Bônus por completar
    gameState.score += 200;
    
    // Bônus por tempo (se < 60s)
    if (timeElapsed < 60) {
        gameState.score = Math.floor(gameState.score * 1.2);
    }
    
    // Salvar pontuação no ranking (ordenado por tempo)
    if (gameState.playerName.trim()) {
        saveScore(gameState.playerName.trim(), gameState.score, level.id, level.title, timeElapsed);
    }
    
    document.getElementById('completionTitle').textContent = `Concluíste: ${level.title}`;
    document.getElementById('verseRef').textContent = level.versicle.ref;
    document.getElementById('verseText').textContent = level.versicle.text;
    document.getElementById('impactPhrase').textContent = level.impact;
    document.getElementById('finalScore').textContent = gameState.score;
    
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    document.getElementById('finalTime').textContent = timeStr;
    
    showScreen(completionModal);
}

function shareScore() {
    const level = gameState.currentLevel;
    const text = `Concluí o nível "${level.title}" em Palavras de Vida com ${gameState.score} pontos!`;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Palavras de Vida',
            text: text,
            url: url
        });
    } else {
        // Fallback: copiar para clipboard
        navigator.clipboard.writeText(`${text} ${url}`).then(() => {
            alert('Link copiado para a área de transferência!');
        });
    }
}

function resetGame() {
    gameState.currentLevel = null;
    gameState.foundWords.clear();
    gameState.selectedCells = [];
    gameState.isSelecting = false;
    gameState.score = 0;
    gameState.startTime = null;
    gameState.elapsedTime = 0;
    gameState.hintsUsed = 0;
    gameState.isPaused = false;
    
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

// Prevenir scroll durante seleção
let touchMoveHandler = null;

function enableTouchPrevention() {
    if (!touchMoveHandler) {
        touchMoveHandler = (e) => {
            if (gameState.isSelecting) {
                e.preventDefault();
            }
        };
        document.addEventListener('touchmove', touchMoveHandler, { passive: false });
    }
}

function disableTouchPrevention() {
    if (touchMoveHandler) {
        document.removeEventListener('touchmove', touchMoveHandler);
        touchMoveHandler = null;
    }
}

// Sistema de Ranking - Funções

function confirmName() {
    const name = playerNameInput.value.trim();
    if (name) {
        gameState.playerName = name;
        // Salvar nome para próxima vez
        localStorage.setItem('lastPlayerNameWordsOfLife', name);
        showScreen(levelSelectScreen);
    } else {
        alert('Por favor, digita o teu nome!');
        playerNameInput.focus();
    }
}

function saveScore(name, score, levelId, levelTitle, timeElapsed) {
    const scores = getScores();
    
    const newScore = {
        name: name,
        score: score,
        levelId: levelId,
        levelTitle: levelTitle,
        timeElapsed: timeElapsed,
        date: new Date().toISOString(),
        timestamp: Date.now()
    };
    
    scores.push(newScore);
    
    // Ordenar por tempo (menor primeiro) e depois por pontuação (maior primeiro em caso de empate)
    scores.sort((a, b) => {
        if (a.timeElapsed !== b.timeElapsed) {
            return a.timeElapsed - b.timeElapsed;
        }
        return b.score - a.score;
    });
    
    // Manter apenas os top 1000 scores para não encher muito o localStorage
    if (scores.length > 1000) {
        scores.splice(1000);
    }
    
    localStorage.setItem('wordsOfLifeScores', JSON.stringify(scores));
}

function getScores() {
    const scoresJson = localStorage.getItem('wordsOfLifeScores');
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
    let allScores = getScores();
    
    // Filtrar por nível se necessário
    if (rankingState.filterLevel !== 'all') {
        allScores = allScores.filter(score => score.levelId === rankingState.filterLevel);
    }
    
    rankingState.scores = allScores;
    rankingState.currentPage = 1;
    
    // Atualizar filtro de níveis
    updateLevelFilter();
    
    displayRanking();
}

function updateLevelFilter() {
    // Limpar opções existentes (exceto "Todos os Níveis")
    while (levelFilter.options.length > 1) {
        levelFilter.remove(1);
    }
    
    // Adicionar opções para cada nível
    levels.forEach(level => {
        const option = document.createElement('option');
        option.value = level.id;
        option.textContent = level.title;
        levelFilter.appendChild(option);
    });
    
    // Definir valor atual
    levelFilter.value = rankingState.filterLevel;
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
        
        const minutes = Math.floor(scoreData.timeElapsed / 60);
        const seconds = scoreData.timeElapsed % 60;
        const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
        
        item.innerHTML = `
            <div class="ranking-position">${position}</div>
            <div class="ranking-info">
                <div class="ranking-name">${escapeHtml(scoreData.name)}</div>
                <div class="ranking-level">${scoreData.levelTitle}</div>
                <div class="ranking-date">${dateStr}</div>
            </div>
            <div style="text-align: right;">
                <div class="ranking-time" style="font-size: 1.3rem; font-weight: bold; color: var(--found-glow); margin-bottom: 0.25rem;">${timeStr}</div>
                <div class="ranking-score" style="font-size: 0.9rem; color: rgba(236, 239, 244, 0.7);">${scoreData.score.toLocaleString('pt-PT')} pts</div>
            </div>
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

// Inicializar
initLevelSelector();
updateLevelFilter();

// Carregar último nome usado ao iniciar
window.addEventListener('DOMContentLoaded', () => {
    const lastName = localStorage.getItem('lastPlayerNameWordsOfLife');
    if (lastName) {
        playerNameInput.value = lastName;
    }
});

// Carregar configurações salvas
const savedSettings = localStorage.getItem('wordsOfLifeSettings');
if (savedSettings) {
    gameState.settings = { ...gameState.settings, ...JSON.parse(savedSettings) };
    document.getElementById('soundToggle').checked = gameState.settings.sound;
    document.getElementById('vibrationToggle').checked = gameState.settings.vibration;
    document.getElementById('contrastToggle').checked = gameState.settings.highContrast;
    document.body.classList.toggle('high-contrast', gameState.settings.highContrast);
}

// Salvar configurações ao mudar
['soundToggle', 'vibrationToggle', 'contrastToggle'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
        localStorage.setItem('wordsOfLifeSettings', JSON.stringify(gameState.settings));
    });
});

