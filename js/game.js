// Classe principal do jogo
class Game {
    constructor() {
        // Canvas e contexto
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Dimensões do canvas
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Estado do jogo
        this.running = false;
        this.loading = true;
        this.loadingProgress = 0;
        
        // Tempo
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // Controles
        this.keys = {};
        this.setupControls();
        
        // Sistemas do jogo
        this.assets = Assets;
        this.player = new Player(this);
        this.world = new World(this);
        this.camera = new Camera(this);
        this.dialogue = new DialogueSystem(this);
        this.hackMinigame = new HackMinigame(this);
        this.phases = new GamePhases(this);
        this.endings = new GameEndings(this);
        
        // Objeto interativo atual
        this.currentInteractable = null;
        
        // Sistema de karma
        this.karma = 0;
        this.karmaElement = document.getElementById('karma-value');
        
        // Missões
        this.missions = [];
        this.completedMissions = [];
        
        // Carrega os assets iniciais
        this.loadAssets();
        
        // Inicia o loop do jogo quando os assets estiverem carregados
        this.assets.onLoadComplete = () => {
            this.loading = false;
            this.showStartScreen();
        };
        
        // Habilita suporte a touch para o minigame de hack
        this.hackMinigame.enableTouchSupport();
    }
    
    // Configura os controles do jogo
    setupControls() {
        // Teclado
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Interação com E
            if (e.code === 'KeyE' && this.currentInteractable && !this.dialogue.active && !this.hackMinigame.active) {
                this.interact();
            }
            
            // Hack com F
            if (e.code === 'KeyF' && this.currentInteractable && this.currentInteractable.hackable && !this.dialogue.active && !this.hackMinigame.active) {
                this.hack();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }
    
    // Carrega os assets do jogo
    loadAssets() {
        // Imagens
        this.assets.loadImage('player_idle', 'assets/sprites/player_idle.png');
        this.assets.loadImage('player_walk', 'assets/sprites/player_walk.png');
        this.assets.loadImage('chiba_city_bg', 'assets/sprites/chiba_city_bg.png');
        this.assets.loadImage('matrix_zone_bg', 'assets/sprites/matrix_zone_bg.png');
        this.assets.loadImage('ziggurat_tower_bg', 'assets/sprites/ziggurat_tower_bg.png');
        this.assets.loadImage('straylight_bg', 'assets/sprites/straylight_bg.png');
        this.assets.loadImage('core_bg', 'assets/sprites/core_bg.png');
        this.assets.loadImage('terminal', 'assets/sprites/terminal.png');
        this.assets.loadImage('npc_contact', 'assets/sprites/npc_contact.png');
        this.assets.loadImage('wintermute', 'assets/sprites/wintermute.png');
        this.assets.loadImage('sombra', 'assets/sprites/sombra.png');
        this.assets.loadImage('flatline', 'assets/sprites/flatline.png');
        this.assets.loadImage('hack_interface', 'assets/sprites/hack_interface.png');
        this.assets.loadImage('data_nodes', 'assets/sprites/data_nodes.png');
        
        // Sons
        this.assets.loadSound('footstep', 'assets/audio/footstep.mp3');
        this.assets.loadSound('interact', 'assets/audio/interact.mp3');
        this.assets.loadSound('hack_start', 'assets/audio/hack_start.mp3');
        this.assets.loadSound('hack_success', 'assets/audio/hack_success.mp3');
        this.assets.loadSound('hack_fail', 'assets/audio/hack_fail.mp3');
        this.assets.loadSound('transition', 'assets/audio/transition.mp3');
        this.assets.loadSound('ending', 'assets/audio/ending.mp3');
    }
    
    // Carrega os assets específicos da fase atual
    loadPhaseAssets() {
        const phase = this.phases.getCurrentPhase();
        
        // Carrega o background da fase
        if (phase.background) {
            this.assets.loadImage(phase.background, `assets/sprites/${phase.background}.png`);
        }
        
        // Carrega sprites de NPCs
        phase.npcs.forEach(npc => {
            if (npc.sprite) {
                this.assets.loadImage(npc.sprite, `assets/sprites/${npc.sprite}.png`);
            }
        });
        
        // Carrega sprites de objetos
        phase.objects.forEach(obj => {
            if (obj.sprite) {
                this.assets.loadImage(obj.sprite, `assets/sprites/${obj.sprite}.png`);
            }
        });
    }
    
    // Mostra a tela de início
    showStartScreen() {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('start-screen').classList.remove('hidden');
        
        document.getElementById('start-button').addEventListener('click', () => {
            document.getElementById('start-screen').classList.add('hidden');
            this.start();
        });
    }
    
    // Inicia o jogo
    start() {
        this.running = true;
        this.lastTime = performance.now();
        
        // Inicia na fase Chiba City
        this.phases.changePhase('chiba');
        
        // Atualiza o karma inicial
        this.updateKarmaDisplay();
        
        // Inicia o loop do jogo
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    // Reinicia o jogo
    restart() {
        // Reseta o estado do jogo
        this.karma = 0;
        this.missions = [];
        this.completedMissions = [];
        this.currentInteractable = null;
        
        // Esconde sistemas ativos
        this.dialogue.hide();
        this.hackMinigame.active = false;
        this.hackMinigame.hackContainer.classList.add('hidden');
        
        // Remove telas de final
        const endingScreen = document.getElementById('ending-screen');
        if (endingScreen) {
            endingScreen.remove();
        }
        
        // Inicia o jogo novamente
        this.start();
    }
    
    // Loop principal do jogo
    gameLoop(timestamp) {
        // Calcula o delta time
        this.deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Limita o delta time para evitar saltos grandes
        if (this.deltaTime > 100) this.deltaTime = 100;
        
        // Atualiza o jogo
        if (this.running) {
            this.update();
            this.draw();
        }
        
        // Continua o loop
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    // Atualiza o estado do jogo
    update() {
        // Atualiza o jogador
        this.player.update(this.deltaTime);
        
        // Atualiza a câmera
        this.camera.update();
        
        // Atualiza o mundo
        this.world.update(this.deltaTime);
        
        // Atualiza o minigame de hack
        this.hackMinigame.update(this.deltaTime);
        
        // Verifica colisões com objetos interativos
        this.checkInteractions();
    }
    
    // Desenha o jogo
    draw() {
        // Limpa o canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Aplica transformação da câmera
        this.ctx.save();
        this.camera.apply(this.ctx);
        
        // Desenha o mundo
        this.world.draw(this.ctx);
        
        // Desenha o jogador
        this.player.draw(this.ctx);
        
        // Restaura o contexto
        this.ctx.restore();
        
        // Desenha o minigame de hack (sem transformação da câmera)
        this.hackMinigame.draw();
        
        // Desenha a tela de loading
        if (this.loading) {
            this.drawLoadingScreen();
        }
    }
    
    // Desenha a tela de carregamento
    drawLoadingScreen() {
        const loadingBar = document.querySelector('.loading-bar');
        loadingBar.style.width = `${this.loadingProgress * 100}%`;
        
        const loadingText = document.querySelector('.loading-text');
        loadingText.textContent = `Carregando... ${Math.floor(this.loadingProgress * 100)}%`;
    }
    
    // Verifica interações com objetos
    checkInteractions() {
        if (this.dialogue.active || this.hackMinigame.active) return;
        
        // Reseta o objeto interativo atual
        this.currentInteractable = null;
        
        // Verifica NPCs
        const phase = this.phases.getCurrentPhase();
        
        // Verifica colisão com NPCs
        for (const npc of phase.npcs) {
            const npcRect = {
                x: npc.x - 32,
                y: npc.y - 32,
                width: 64,
                height: 64
            };
            
            const playerRect = {
                x: this.player.x - this.player.width / 2,
                y: this.player.y - this.player.height / 2,
                width: this.player.width,
                height: this.player.height
            };
            
            // Aumenta a área de interação
            const interactionRect = {
                x: playerRect.x - 20,
                y: playerRect.y - 20,
                width: playerRect.width + 40,
                height: playerRect.height + 40
            };
            
            if (Utils.collisionCheck(interactionRect, npcRect)) {
                this.currentInteractable = npc;
                
                // Mostra dica de interação
                this.showInteractionHint('E');
                
                break;
            }
        }
        
        // Verifica objetos se não encontrou NPC
        if (!this.currentInteractable) {
            for (const obj of phase.objects) {
                const objRect = {
                    x: obj.x - 32,
                    y: obj.y - 32,
                    width: 64,
                    height: 64
                };
                
                const playerRect = {
                    x: this.player.x - this.player.width / 2,
                    y: this.player.y - this.player.height / 2,
                    width: this.player.width,
                    height: this.player.height
                };
                
                // Aumenta a área de interação
                const interactionRect = {
                    x: playerRect.x - 20,
                    y: playerRect.y - 20,
                    width: playerRect.width + 40,
                    height: playerRect.height + 40
                };
                
                if (Utils.collisionCheck(interactionRect, objRect)) {
                    this.currentInteractable = obj;
                    
                    // Mostra dica de interação
                    if (obj.hackable) {
                        this.showInteractionHint('E / F');
                    } else {
                        this.showInteractionHint('E');
                    }
                    
                    break;
                }
            }
        }
        
        // Se não há objeto interativo, esconde a dica
        if (!this.currentInteractable) {
            this.hideInteractionHint();
        }
    }
    
    // Mostra dica de interação
    showInteractionHint(key) {
        // Implementação visual da dica de interação
        // (pode ser implementada com um elemento HTML ou canvas)
    }
    
    // Esconde dica de interação
    hideInteractionHint() {
        // Implementação para esconder a dica
    }
    
    // Interage com o objeto atual
    interact() {
        if (!this.currentInteractable || this.dialogue.active || this.hackMinigame.active) return;
        
        // Toca som de interação
        Assets.playSound('interact');
        
        // Inicia diálogo
        if (this.currentInteractable.dialogue) {
            // Verifica se é um NPC com missão completada
            if (this.currentInteractable.name && 
                this.missions.includes(`Extrair dados do terminal`) && 
                this.completedMissions.includes(`Extrair dados do terminal`) &&
                this.currentInteractable.name === 'Contato') {
                
                // Mostra diálogo de missão completada
                this.dialogue.show(
                    this.currentInteractable.name,
                    this.currentInteractable.dialogue.completion.text,
                    this.currentInteractable.dialogue.completion.options
                );
                return;
            }
            
            // Diálogo inicial padrão
            this.dialogue.show(
                this.currentInteractable.name || 'Objeto',
                this.currentInteractable.dialogue.initial,
                this.currentInteractable.dialogue.options
            );
        }
    }
    
    // Inicia hack no objeto atual
    hack() {
        if (!this.currentInteractable || !this.currentInteractable.hackable || this.dialogue.active || this.hackMinigame.active) return;
        
        // Inicia o minigame de hack
        this.hackMinigame.start(this.currentInteractable);
    }
    
    // Adiciona uma missão
    addMission(mission) {
        if (!this.missions.includes(mission)) {
            this.missions.push(mission);
            console.log(`Nova missão: ${mission}`);
            
            // Mostra notificação de nova missão
            this.showNotification(`Nova missão: ${mission}`);
        }
    }
    
    // Completa uma missão
    completeMission(mission) {
        if (this.missions.includes(mission) && !this.completedMissions.includes(mission)) {
            this.completedMissions.push(mission);
            console.log(`Missão completada: ${mission}`);
            
            // Mostra notificação de missão completada
            this.showNotification(`Missão completada: ${mission}`);
            
            // Recompensa de karma
            this.changeKarma(15);
        }
    }
    
    // Mostra uma notificação
    showNotification(text) {
        // Implementação visual da notificação
        // (pode ser implementada com um elemento HTML temporário)
        console.log(`Notificação: ${text}`);
    }
    
    // Altera o karma do jogador
    changeKarma(amount) {
        this.karma += amount;
        this.updateKarmaDisplay();
        
        // Mostra notificação de mudança de karma
        if (amount > 0) {
            this.showNotification(`Karma +${amount}`);
        } else if (amount < 0) {
            this.showNotification(`Karma ${amount}`);
        }
    }
    
    // Atualiza o display de karma
    updateKarmaDisplay() {
        // Atualiza o valor
        this.karmaElement.textContent = this.karma;
        
        // Atualiza a cor com base no valor
        if (this.karma > 20) {
            this.karmaElement.style.color = '#00ff00'; // Verde para karma positivo alto
        } else if (this.karma < -20) {
            this.karmaElement.style.color = '#ff0000'; // Vermelho para karma negativo alto
        } else {
            this.karmaElement.style.color = '#aa00ff'; // Roxo para karma neutro
        }
    }
    
    // Mostra transição entre fases
    showTransition(phaseName) {
        // Cria elemento de transição
        const transition = document.createElement('div');
        transition.className = 'phase-transition';
        transition.innerHTML = `<h2>${phaseName}</h2>`;
        
        // Adiciona ao DOM
        document.body.appendChild(transition);
        
        // Toca som de transição
        Assets.playSound('transition');
        
        // Remove após a animação
        setTimeout(() => {
            transition.classList.add('fade-out');
            setTimeout(() => {
                transition.remove();
            }, 1000);
        }, 2000);
    }
    
    // Finaliza o jogo com um dos finais
    endGame(endingKey) {
        // Pausa o jogo
        this.running = false;
        
        // Mostra o final
        this.endings.showEnding(endingKey);
    }
    
    // Redimensiona o canvas quando a janela muda de tamanho
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

// Inicia o jogo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
