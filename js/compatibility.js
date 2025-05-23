// Ajustes de responsividade para o protótipo
window.addEventListener('resize', function() {
    // Atualiza dimensões do canvas principal
    if (window.game) {
        window.game.resize();
    }
    
    // Ajusta o hack canvas se estiver ativo
    const hackCanvas = document.getElementById('hack-canvas');
    if (hackCanvas) {
        const container = document.getElementById('hack-minigame');
        if (!container.classList.contains('hidden')) {
            hackCanvas.width = Math.min(800, window.innerWidth * 0.8);
            hackCanvas.height = Math.min(600, window.innerHeight * 0.8);
        }
    }
});

// Correções de compatibilidade entre navegadores
document.addEventListener('DOMContentLoaded', function() {
    // Detecta navegador e aplica correções específicas
    const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;
    const isChrome = navigator.userAgent.indexOf('Chrome') !== -1;
    const isSafari = navigator.userAgent.indexOf('Safari') !== -1 && !isChrome;
    
    if (isFirefox) {
        // Correções para Firefox
        document.documentElement.classList.add('firefox');
    } else if (isSafari) {
        // Correções para Safari
        document.documentElement.classList.add('safari');
    }
    
    // Ajusta para telas de alta resolução
    if (window.devicePixelRatio > 1) {
        document.documentElement.classList.add('high-dpi');
    }
    
    // Ajusta para dispositivos móveis
    if ('ontouchstart' in window) {
        document.documentElement.classList.add('touch-device');
        
        // Adiciona controles virtuais para dispositivos móveis
        const gameContainer = document.getElementById('game-container');
        const touchControls = document.createElement('div');
        touchControls.id = 'touch-controls';
        touchControls.innerHTML = `
            <div class="touch-dpad">
                <button id="touch-left">◀</button>
                <button id="touch-right">▶</button>
            </div>
            <div class="touch-actions">
                <button id="touch-interact">E</button>
                <button id="touch-hack">F</button>
            </div>
        `;
        gameContainer.appendChild(touchControls);
        
        // Implementa lógica dos controles touch
        document.getElementById('touch-left').addEventListener('touchstart', function() {
            if (window.game) window.game.keys.KeyA = true;
        });
        document.getElementById('touch-left').addEventListener('touchend', function() {
            if (window.game) window.game.keys.KeyA = false;
        });
        document.getElementById('touch-right').addEventListener('touchstart', function() {
            if (window.game) window.game.keys.KeyD = true;
        });
        document.getElementById('touch-right').addEventListener('touchend', function() {
            if (window.game) window.game.keys.KeyD = false;
        });
        document.getElementById('touch-interact').addEventListener('touchstart', function() {
            if (window.game) window.game.keys.KeyE = true;
        });
        document.getElementById('touch-interact').addEventListener('touchend', function() {
            if (window.game) window.game.keys.KeyE = false;
        });
        document.getElementById('touch-hack').addEventListener('touchstart', function() {
            if (window.game) window.game.keys.KeyF = true;
        });
        document.getElementById('touch-hack').addEventListener('touchend', function() {
            if (window.game) window.game.keys.KeyF = false;
        });
    }
});

// Correções de bugs conhecidos
function fixKnownBugs() {
    // Corrige problema de colisão em alguns navegadores
    const originalCollisionCheck = Utils.collisionCheck;
    Utils.collisionCheck = function(rect1, rect2) {
        // Adiciona uma margem de tolerância para evitar problemas de precisão
        const margin = 1;
        return rect1.x < rect2.x + rect2.width + margin &&
               rect1.x + rect1.width + margin > rect2.x &&
               rect1.y < rect2.y + rect2.height + margin &&
               rect1.y + rect1.height + margin > rect2.y;
    };
    
    // Corrige problema de animação em alguns navegadores
    const originalDraw = Player.prototype.draw;
    if (originalDraw) {
        Player.prototype.draw = function(context) {
            try {
                originalDraw.call(this, context);
            } catch (e) {
                // Fallback para renderização simples em caso de erro
                context.fillStyle = '#0df2c9';
                context.fillRect(this.x, this.y, this.width, this.height);
                console.error('Erro na renderização do player:', e);
            }
        };
    }
}

// Validação de desempenho
let lastFpsUpdate = 0;
let framesCount = 0;
let currentFps = 0;

function monitorPerformance(timestamp) {
    framesCount++;
    
    if (timestamp - lastFpsUpdate >= 1000) {
        currentFps = framesCount;
        framesCount = 0;
        lastFpsUpdate = timestamp;
        
        // Ajusta qualidade com base no FPS
        if (currentFps < 30 && window.game) {
            // Reduz efeitos visuais para melhorar desempenho
            window.game.reducedEffects = true;
        } else if (window.game) {
            window.game.reducedEffects = false;
        }
    }
    
    requestAnimationFrame(monitorPerformance);
}

// Inicia monitoramento de desempenho
requestAnimationFrame(monitorPerformance);

// Modifica o Game.js para expor a instância globalmente
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
    
    // Aplica correções de bugs
    fixKnownBugs();
});
