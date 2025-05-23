// Classe do mundo do jogo
class World {
    constructor(game) {
        this.game = game;
        
        // Elementos do mundo
        this.interactables = [];
        this.npcs = [];
        this.obstacles = [];
        
        // Inicializa o mundo
        this.init();
    }
    
    init() {
        // Cria objetos interativos
        this.createInteractables();
        
        // Cria NPCs
        this.createNPCs();
        
        // Cria obstáculos
        this.createObstacles();
    }
    
    createInteractables() {
        // Terminal de computador (hackeável)
        this.interactables.push({
            type: 'terminal',
            x: 600,
            y: 504,
            width: 64,
            height: 96,
            highlight: false,
            interact: (player) => {
                // Inicia diálogo
                this.game.dialogue.show(
                    "Terminal de Acesso",
                    "Terminal de acesso à rede corporativa. Parece vulnerável a invasões.",
                    [
                        { text: "Hackear sistema", action: () => this.game.startHackMinigame(this.interactables[0]) },
                        { text: "Cancelar", action: () => this.game.dialogue.hide() }
                    ]
                );
            }
        });
        
        // Outro objeto interativo (informação)
        this.interactables.push({
            type: 'info',
            x: 300,
            y: 530,
            width: 40,
            height: 70,
            highlight: false,
            interact: (player) => {
                // Mostra informação
                this.game.dialogue.show(
                    "Cartaz Neon",
                    "Um cartaz brilhante anuncia: 'PROCURA-SE: Especialista em segurança digital. Recompensa generosa. Procure Wintermute no Bar Chatsubo.'",
                    [
                        { text: "Continuar", action: () => this.game.dialogue.hide() }
                    ]
                );
            }
        });
    }
    
    createNPCs() {
        // NPC de contato
        this.npcs.push({
            type: 'contact',
            name: 'Contato',
            x: 800,
            y: 502,
            width: 64,
            height: 64,
            direction: -1, // Olhando para a esquerda
            highlight: false,
            interact: (player) => {
                // Inicia diálogo com o NPC
                this.game.dialogue.show(
                    "Contato Misterioso",
                    "Ei, você parece ser o tipo de pessoa que sabe navegar na Matrix. Tenho um trabalho que pode te interessar...",
                    [
                        { 
                            text: "Conte-me mais", 
                            action: () => {
                                this.game.dialogue.show(
                                    "Contato Misterioso",
                                    "Preciso que você extraia alguns dados de um terminal corporativo. É um trabalho simples para alguém com suas habilidades. A recompensa é boa.",
                                    [
                                        { 
                                            text: "Aceitar trabalho", 
                                            action: () => {
                                                this.game.dialogue.show(
                                                    "Contato Misterioso",
                                                    "Excelente! O terminal está logo ali. Traga os dados quando terminar.",
                                                    [{ text: "Vou fazer isso", action: () => this.game.dialogue.hide() }]
                                                );
                                                // Adiciona missão
                                                this.game.addMission("Extrair dados do terminal");
                                            } 
                                        },
                                        { 
                                            text: "Recusar", 
                                            action: () => {
                                                this.game.dialogue.show(
                                                    "Contato Misterioso",
                                                    "Sua perda. Se mudar de ideia, estarei por aqui.",
                                                    [{ text: "Até mais", action: () => this.game.dialogue.hide() }]
                                                );
                                            } 
                                        }
                                    ]
                                );
                            } 
                        },
                        { text: "Não estou interessado", action: () => this.game.dialogue.hide() }
                    ]
                );
            }
        });
    }
    
    createObstacles() {
        // Limites do mundo (paredes invisíveis)
        this.obstacles.push({
            x: -50,
            y: 0,
            width: 50,
            height: this.game.height
        });
        
        this.obstacles.push({
            x: this.game.width,
            y: 0,
            width: 50,
            height: this.game.height
        });
        
        // Chão
        this.obstacles.push({
            x: 0,
            y: 600,
            width: this.game.width,
            height: 50
        });
    }
    
    update(deltaTime) {
        this.game.log("    [World] Iniciando update...");
        try {
            // Atualiza NPCs
            this.npcs.forEach(npc => {
                // Lógica de NPC (movimento, comportamento, etc.)
                // Por enquanto, eles são estáticos
            });
            this.game.log("    [World] Update concluído.");
        } catch (error) {
            this.game.log(`ERRO CRÍTICO durante [World] update: ${error.message} \n ${error.stack}`);
            this.game.gameState = 'error';
        }
    }
    
    draw(context) {
        this.game.log("    [World] Iniciando draw...");
        try {
            // Desenha o background
            this.game.log("      [World] Tentando obter asset 'chibaCityBg'...");
            const bgImage = window.AssetManager.get("chibaCityBg");
            if (!bgImage) {
                this.game.log("ERRO: Asset 'chibaCityBg' não encontrado ou não carregado!");
                // Desenhar fundo de fallback
                context.fillStyle = '#333';
                context.fillRect(0, 0, this.game.width, this.game.height);
                context.fillStyle = '#FFF';
                context.fillText("Erro ao carregar background", this.game.width / 2, this.game.height / 2);
                this.game.log("    [World] Draw interrompido (falha no background).");
                return; // Não continuar renderizando se o fundo falhar
            }
            this.game.log("      [World] Desenhando background...");
            context.drawImage(bgImage, 0, 0, this.game.width, this.game.height);
            
            // Desenha objetos interativos
            this.game.log("      [World] Desenhando interativos...");
            this.interactables.forEach(interactable => {
                // ... (código de desenho dos interativos mantido)
                if (interactable.type === 'terminal') {
                    const terminalImage = window.AssetManager.get('terminal');
                    if (terminalImage) context.drawImage(terminalImage, interactable.x, interactable.y, interactable.width, interactable.height);
                    // ... (highlight e texto mantidos)
                } else if (interactable.type === 'info') {
                    // ... (desenho do info mantido)
                }
            });
            
            // Desenha NPCs
            this.game.log("      [World] Desenhando NPCs...");
            this.npcs.forEach(npc => {
                const npcImage = window.AssetManager.get('npcContact');
                if (!npcImage) {
                    this.game.log(`ERRO: Asset 'npcContact' não encontrado para NPC ${npc.name}`);
                    return; // Pular desenho deste NPC
                }
                // ... (código de desenho do NPC mantido)
                context.save();
                if (npc.direction === -1) {
                    context.translate(npc.x + npc.width, npc.y); // Corrigido Y
                    context.scale(-1, 1);
                    context.drawImage(npcImage, 0, 0, npc.width, npc.height, 0, 0, npc.width, npc.height); // Corrigido Y
                } else {
                    context.drawImage(npcImage, npc.x, npc.y, npc.width, npc.height);
                }
                context.restore();
                // ... (highlight e texto mantidos)
            });
            
            // Desenha obstáculos (apenas em modo debug)
            if (this.game.debugMode) {
                this.game.log("      [World] Desenhando obstáculos (debug)...");
                context.strokeStyle = '#ff0000';
                context.lineWidth = 2;
                this.obstacles.forEach(obstacle => {
                    context.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                });
            }
            this.game.log("    [World] Draw concluído.");
        } catch (error) {
            this.game.log(`ERRO CRÍTICO durante [World] draw: ${error.message} \n ${error.stack}`);
            this.game.gameState = 'error';
        }
    }
    
    // Verifica colisão com obstáculos
    checkCollision(entity) {
        let collided = false;
        
        this.obstacles.forEach(obstacle => {
            if (Utils.collisionCheck(entity, obstacle)) {
                collided = true;
            }
        });
        
        return collided;
    }
}
