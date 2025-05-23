// Classe do jogador
class Player {
    constructor(game, x = 100, y = undefined) {
        this.game = game;
        this.width = 64;
        this.height = 64;
        this.x = x;
        this.y = y || game.height - this.height - 50; // 50 pixels acima do chão
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
        this.isOnGround = true;
        
        // Animação
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrames = 2;
        this.frameTimer = 0;
        this.frameInterval = 150;
        
        // Interação
        this.interactionRadius = 50;
        this.nearbyInteractables = [];
    }
    
    update(deltaTime) {
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

            // Movimento vertical
            if (this.game.keys.ArrowUp || this.game.keys.KeyW) {
                this.velocityY = this.isSprinting ? -this.sprintSpeed : -this.speed;
                this.isMoving = true;
            } else if (this.game.keys.ArrowDown || this.game.keys.KeyS) {
                this.velocityY = this.isSprinting ? this.sprintSpeed : this.speed;
                this.isMoving = true;
            } else {
                this.velocityY = 0;
            }
            
            // Sprint
            if ((this.game.keys.ShiftLeft || this.game.keys.ShiftRight) && this.energy > 0 && this.isMoving) {
                this.isSprinting = true;
                this.energy -= this.energySprintCost;
                if (this.energy < 0) this.energy = 0;
            } else {
                this.isSprinting = false;
                if (this.energy < this.maxEnergy) {
                    this.energy += this.energyRegenRate;
                    if (this.energy > this.maxEnergy) this.energy = this.maxEnergy;
                }
            }
            
            // Atualiza posição com verificação de colisão
            const nextX = this.x + this.velocityX;
            const nextY = this.y + this.velocityY;
            
            // Verifica colisões com limites da fase
            const phase = this.game.phases.getCurrentPhase();
            let canMoveX = true;
            let canMoveY = true;
            
            if (phase && phase.boundaries) {
                const playerRectX = {
                    x: nextX,
                    y: this.y,
                    width: this.width,
                    height: this.height
                };
                
                const playerRectY = {
                    x: this.x,
                    y: nextY,
                    width: this.width,
                    height: this.height
                };
                
                for (const boundary of phase.boundaries) {
                    if (Utils.collisionCheck(playerRectX, boundary)) {
                        canMoveX = false;
                    }
                    if (Utils.collisionCheck(playerRectY, boundary)) {
                        canMoveY = false;
                    }
                }
            }
            
            // Move apenas se não houver colisão
            if (canMoveX) {
                this.x = nextX;
            }
            if (canMoveY) {
                this.y = nextY;
            }
            
            // Limites da tela
            if (this.x < 0) this.x = 0;
            if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
            if (this.y < 0) this.y = 0;
            if (this.y > this.game.height - this.height) this.y = this.game.height - this.height;
            
            // Animação
            if (this.isMoving) {
                this.frameTimer += deltaTime;
                if (this.frameTimer > this.frameInterval) {
                    this.frameTimer = 0;
                    this.frameX = (this.frameX + 1) % this.maxFrames;
                }
            } else {
                this.frameX = 0;
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
            }
        } catch (error) {
            console.error('Erro no update do player:', error);
            this.game.gameState = "error";
        }
    }
    
    draw(context) {
        try {
            // Desenha o jogador
            const idleImage = this.game.assets.images['player_idle'];
            const walkImage = this.game.assets.images['player_walk'];
            
            if (!idleImage || !walkImage) {
                // Desenhar placeholder de erro
                context.fillStyle = "#FF0000";
                context.fillRect(this.x, this.y, this.width, this.height);
                context.fillStyle = "#FFFFFF";
                context.fillText("ERR", this.x + 5, this.y + 20);
                return;
            }
            
            const image = this.isMoving ? walkImage : idleImage;
            
            // Calcula a posição do frame na spritesheet
            const frameWidth = image.width / this.maxFrames;
            const frameHeight = image.height;
            
            // Limpa a área antes de desenhar (remove o rastro cinza)
            context.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
            
            // Desenha o frame atual
            context.save();
            if (this.direction === -1) {
                // Inverte horizontalmente se estiver olhando para a esquerda
                context.translate(this.x + this.width, this.y);
                context.scale(-1, 1);
                context.drawImage(
                    image,
                    this.frameX * frameWidth, 0, frameWidth, frameHeight,
                    0, 0, this.width, this.height
                );
            } else {
                context.drawImage(
                    image,
                    this.frameX * frameWidth, 0, frameWidth, frameHeight,
                    this.x, this.y, this.width, this.height
                );
            }
            context.restore();
            
            // Desenha círculo de interação (para debug)
            if (this.game.debugMode) {
                context.strokeStyle = "#0df2c9";
                context.beginPath();
                context.arc(this.x + this.width/2, this.y + this.height/2, this.interactionRadius, 0, Math.PI * 2);
                context.stroke();
            }
        } catch (error) {
            console.error('Erro no draw do player:', error);
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
