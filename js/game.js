// Classe principal do jogo
class Game {
    constructor() {
        console.log('Construtor do Game chamado!');
        // Canvas e contexto
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Dimensões do canvas e do jogo
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Centraliza o canvas na tela
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '50%';
        this.canvas.style.top = '50%';
        this.canvas.style.transform = 'translate(-50%, -50%)';
        this.canvas.style.backgroundColor = '#000';
        
        // Adiciona listener para redimensionamento
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();
        
        // Estado do jogo
        this.running = false;
        this.loading = true;
        this.loadingProgress = 0;
        this.debugMode = false; // Modo debug
        
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
        this.dialogue = new Dialogue(this);
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
        
        // Habilita suporte a touch para o minigame de hack
        this.hackMinigame.enableTouchSupport();
        
        this.updateMissionList();
    }
    
    // Função de log para debug
    log(message) {
        if (this.debugMode) {
            console.log(message);
        }
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
        // Inicializa o carregamento de assets
        this.assets.init(() => {
            this.loading = false;
            this.showStartScreen();
        });
    }
    
    // Carrega os assets específicos da fase atual
    loadPhaseAssets() {
        const phase = this.phases.getCurrentPhase();
        
        // Os assets já foram carregados pelo sistema de assets temporários
        // Não é necessário carregar novamente
        console.log(`Carregando assets da fase: ${phase.name}`);
    }
    
    // Mostra a tela de início
    showStartScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const startScreen = document.getElementById('start-screen');
        const startButton = document.getElementById('start-button');

        // Se a tela de loading existir, esconde ela
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }

        // Se a tela de início existir, mostra ela
        if (startScreen) {
            startScreen.classList.remove('hidden');

            // Se o botão de início existir, adiciona o evento de clique
            if (startButton) {
                startButton.addEventListener('click', () => {
                    startScreen.classList.add('hidden');
                    this.start();
                });
            } else {
                // Se não houver botão, inicia o jogo diretamente
                this.start();
            }
        } else {
            // Se não houver tela de início, inicia o jogo diretamente
            this.start();
        }
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
        
        // Obtém a fase atual
        const phase = this.phases.getCurrentPhase();
        if (!phase) return;
        
        // Verifica NPCs
        if (phase.npcs) {
            for (const npc of phase.npcs) {
                const npcRect = {
                    x: npc.x,
                    y: npc.y,
                    width: 64,
                    height: 64
                };
                
                const playerRect = {
                    x: this.player.x,
                    y: this.player.y,
                    width: this.player.width,
                    height: this.player.height
                };
                
                // Aumenta a área de interação
                const interactionRect = {
                    x: playerRect.x - 30,
                    y: playerRect.y - 30,
                    width: playerRect.width + 60,
                    height: playerRect.height + 60
                };
                
                if (Utils.collisionCheck(interactionRect, npcRect)) {
                    this.currentInteractable = npc;
                    this.showInteractionHint('E');
                    break;
                }
            }
        }
        
        // Verifica objetos se não encontrou NPC
        if (!this.currentInteractable && phase.objects) {
            for (const obj of phase.objects) {
                const objRect = {
                    x: obj.x,
                    y: obj.y,
                    width: 64,
                    height: 64
                };
                
                const playerRect = {
                    x: this.player.x,
                    y: this.player.y,
                    width: this.player.width,
                    height: this.player.height
                };
                
                // Aumenta a área de interação
                const interactionRect = {
                    x: playerRect.x - 30,
                    y: playerRect.y - 30,
                    width: playerRect.width + 60,
                    height: playerRect.height + 60
                };
                
                if (Utils.collisionCheck(interactionRect, objRect)) {
                    this.currentInteractable = obj;
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
        const hint = document.createElement('div');
        hint.id = 'interaction-hint';
        hint.className = 'interaction-hint';
        hint.textContent = `Pressione ${key}`;
        
        // Remove dica anterior se existir
        const oldHint = document.getElementById('interaction-hint');
        if (oldHint) oldHint.remove();
        
        document.body.appendChild(hint);
    }
    
    // Esconde dica de interação
    hideInteractionHint() {
        const hint = document.getElementById('interaction-hint');
        if (hint) hint.remove();
    }
    
    // Interage com o objeto atual
    interact() {
        if (!this.currentInteractable || this.dialogue.active || this.hackMinigame.active) return;
        
        // Toca som de interação
        Assets.playSound('interact');
        
        // Se o objeto tem diálogo
        if (this.currentInteractable.dialogue) {
            const dialogue = this.currentInteractable.dialogue;
            
            // Verifica se é um NPC com missão completada
            if (this.currentInteractable.name && 
                this.missions.includes('Extrair dados do terminal') && 
                this.completedMissions.includes('Extrair dados do terminal') &&
                this.currentInteractable.name === 'Contato') {
                
                this.dialogue.show(
                    this.currentInteractable.name,
                    dialogue.completion.text,
                    dialogue.completion.options,
                    dialogue.completion
                );
                return;
            }
            
            // Diálogo inicial
            this.dialogue.show(
                this.currentInteractable.name || 'Objeto',
                dialogue.initial,
                dialogue.options,
                dialogue
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
            this.updateMissionList();
            this.showNotification(`Nova missão: ${mission}`);
        }
    }
    
    // Completa uma missão
    completeMission(mission) {
        if (this.missions.includes(mission) && !this.completedMissions.includes(mission)) {
            this.completedMissions.push(mission);
            this.updateMissionList();
            this.showNotification(`Missão completada: ${mission}`);
            this.changeKarma(15);
        }
    }
    
    // Mostra uma notificação
    showNotification(text) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = text;
        document.body.appendChild(notification);
        
        // Remove a notificação após a animação
        setTimeout(() => {
            notification.remove();
        }, 3000);
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
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.width = this.width + 'px';
            gameContainer.style.height = this.height + 'px';
            gameContainer.style.transform = '';
        }
        this.updateMissionList();
    }
    
    updateMissionList() {
        const missionList = document.getElementById('mission-list');
        if (!missionList) return;
        let html = '<b>Missões:</b><br>';
        if (this.missions.length === 0) {
            html += "<span style='color:#888'>Nenhuma missão ativa</span>";
        } else {
            this.missions.forEach(mission => {
                if (this.completedMissions.includes(mission)) {
                    html += `<span style='color:#0f0'>✔ ${mission}</span><br>`;
                } else {
                    html += `<span style='color:#0df2c9'>${mission}</span><br>`;
                }
            });
        }
        missionList.innerHTML = html;
    }
}

// Inicia o jogo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
