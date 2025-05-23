// Classe do jogador
class Player {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 48;
        this.speed = 5;
        this.sprintSpeed = 8;
        this.velocityX = 0;
        this.velocityY = 0;
        this.direction = 1; // 1 = direita, -1 = esquerda
        this.isMoving = false;
        this.isSprinting = false;
        this.isInteracting = false;
        this.energy = 100;
        this.maxEnergy = 100;
        this.energyRegenRate = 0.2;
        this.energySprintCost = 0.5;
        
        // Animação
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrames = 2; // 2 frames de animação para andar
        this.frameTimer = 0;
        this.frameInterval = 150; // Tempo entre frames em ms
        
        // Interação
        this.interactionRadius = 50;
        this.nearbyInteractables = [];
    }
    
    update(deltaTime) {
        this.game.log("    [Player] Iniciando update...");
        try {
            // Movimento horizontal
            if (this.game.keys.ArrowRight || this.game.keys.KeyD) {
                this.velocityX = this.isSprinting ? this.sprintSpeed : this.speed;
                this.direction = 1;
                this.isMoving = true;
            } else if (this.game.keys.ArrowLeft || this.game.keys.KeyA) {
                this.velocityX = this.isSprinting ? -this.sprintSpeed : -this.speed;
                this.direction = -1;
                this.isMoving = true;
            } else {
                this.velocityX = 0;
                this.isMoving = false;
            }
            
            // Sprint
            if ((this.game.keys.ShiftLeft || this.game.keys.ShiftRight) && this.energy > 0 && this.isMoving) {
                this.isSprinting = true;
                this.energy -= this.energySprintCost;
                if (this.energy < 0) this.energy = 0;
            } else {
                this.isSprinting = false;
                // Regenera energia quando não está sprintando
                if (this.energy < this.maxEnergy) {
                    this.energy += this.energyRegenRate;
                    if (this.energy > this.maxEnergy) this.energy = this.maxEnergy;
                }
            }
            
            // Atualiza posição
            this.x += this.velocityX;
            
            // Limites da tela
            if (this.x < 0) this.x = 0;
            if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
            
            // Colisão com o chão (fixo em y)
            this.y = 550; // Posição fixa no chão
            
            // Animação
            if (this.isMoving) {
                this.frameTimer += deltaTime;
                if (this.frameTimer > this.frameInterval) {
                    this.frameTimer = 0;
                    this.frameX = (this.frameX + 1) % this.maxFrames;
                }
            } else {
                this.frameX = 0; // Frame parado
            }
            
            // Verifica interações
            this.checkInteractions();
            
            // Interagir com tecla E
            if (this.game.keys.KeyE && !this.isInteracting) {
                this.interact();
            }
            
            // Hackear com tecla F
            if (this.game.keys.KeyF && !this.isInteracting) {
                this.hack();
            }
            
            // Atualiza a barra de energia na UI
            const energyBar = document.getElementById("energy-bar");
            if (energyBar) {
                energyBar.style.width = `${this.energy}%`;
            } else {
                this.game.log("ERRO: Elemento #energy-bar não encontrado no DOM!");
            }
            this.game.log("    [Player] Update concluído.");
        } catch (error) {
            this.game.log(`ERRO CRÍTICO durante [Player] update: ${error.message} \n ${error.stack}`);
            this.game.gameState = "error";
        }
    }
    
    draw(context) {
        this.game.log("    [Player] Iniciando draw...");
        try {
            // Desenha o jogador
            this.game.log("      [Player] Tentando obter assets playerIdle/playerWalk...");
            const idleImage = window.AssetManager.get("playerIdle");
            const walkImage = window.AssetManager.get("playerWalk");
            
            if (!idleImage || !walkImage) {
                this.game.log("ERRO: Assets do jogador (playerIdle/playerWalk) não encontrados ou não carregados!");
                // Desenhar placeholder de erro
                context.fillStyle = "#FF0000";
                context.fillRect(this.x, this.y, this.width, this.height);
                context.fillStyle = "#FFFFFF";
                context.fillText("ERR", this.x + 5, this.y + 20);
                this.game.log("    [Player] Draw interrompido (falha nos assets).");
                return;
            }
            
            const image = this.isMoving ? walkImage : idleImage;
            this.game.log(`      [Player] Usando imagem: ${this.isMoving ? "playerWalk" : "playerIdle"}`);
            
            // Calcula a posição do frame na spritesheet
            const frameWidth = image.width / this.maxFrames;
            const frameHeight = image.height;
            this.game.log(`      [Player] Frame: ${this.frameX}, Width: ${frameWidth}, Height: ${frameHeight}`);
            
            // Desenha o frame atual
            context.save();
            if (this.direction === -1) {
                // Inverte horizontalmente se estiver olhando para a esquerda
                this.game.log(`      [Player] Desenhando invertido em (${this.x}, ${this.y})`);
                context.translate(this.x + this.width, this.y); // Corrigido: translate usa this.y
                context.scale(-1, 1);
                context.drawImage(
                    image,
                    this.frameX * frameWidth, 0, frameWidth, frameHeight,
                    0, 0, this.width, this.height // Corrigido: desenha em 0,0 após translate
                );
            } else {
                this.game.log(`      [Player] Desenhando normal em (${this.x}, ${this.y})`);
                context.drawImage(
                    image,
                    this.frameX * frameWidth, 0, frameWidth, frameHeight,
                    this.x, this.y, this.width, this.height
                );
            }
            context.restore();
            
            // Desenha círculo de interação (para debug)
            if (this.game.debugMode) { // Corrigido: usa this.game.debugMode
                this.game.log("      [Player] Desenhando círculo de interação (debug)...");
                context.strokeStyle = "#0df2c9";
                context.beginPath();
                context.arc(this.x + this.width/2, this.y + this.height/2, this.interactionRadius, 0, Math.PI * 2);
                context.stroke();
            }
            this.game.log("    [Player] Draw concluído.");
        } catch (error) {
            this.game.log(`ERRO CRÍTICO durante [Player] draw: ${error.message} \n ${error.stack}`);
            this.game.gameState = "error";
        }
    }
    
    checkInteractions() {
        // Limpa a lista de interações
        this.nearbyInteractables = [];
        
        // Verifica todos os objetos interativos
        this.game.world.interactables.forEach(interactable => {
            const distance = Utils.distance(
                this.x + this.width/2, 
                this.y + this.height/2,
                interactable.x + interactable.width/2,
                interactable.y + interactable.height/2
            );
            
            if (distance < this.interactionRadius) {
                this.nearbyInteractables.push(interactable);
                
                // Destaca o objeto interativo mais próximo
                interactable.highlight = true;
            } else {
                interactable.highlight = false;
            }
        });
    }
    
    interact() {
        // Se houver objetos interativos próximos
        if (this.nearbyInteractables.length > 0) {
            // Interage com o primeiro objeto da lista
            const interactable = this.nearbyInteractables[0];
            interactable.interact(this);
            this.isInteracting = true;
            
            // Som de interação
            Assets.playSound('hack_start');
        }
    }
    
    hack() {
        // Se houver objetos hackeáveis próximos
        const hackables = this.nearbyInteractables.filter(obj => obj.type === 'terminal');
        if (hackables.length > 0) {
            // Inicia o minigame de hack
            this.game.startHackMinigame(hackables[0]);
            this.isInteracting = true;
            
            // Som de hack
            Assets.playSound('hack_start');
        }
    }
    
    stopInteracting() {
        this.isInteracting = false;
    }
}
