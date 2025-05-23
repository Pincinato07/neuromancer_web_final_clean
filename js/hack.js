// Correção do sistema de minigame de hack
class HackingSystem {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.target = null;
        this.timer = 60; // Tempo em segundos
        this.nodes = []; // Nós de dados para conectar
        this.connections = []; // Conexões entre nós
        this.selectedNode = null;
        this.success = false;
        this.failed = false;
        this.completed = false; // Flag para controlar conclusão
        
        // Elementos DOM
        this.hackContainer = document.getElementById('hack-minigame');
        this.hackCanvas = document.getElementById('hack-canvas');
        this.hackTimer = document.getElementById('hack-timer');
        this.hackStatus = document.getElementById('hack-status');
        
        // Configuração do canvas
        this.ctx = this.hackCanvas.getContext('2d');
        this.hackCanvas.width = 800;
        this.hackCanvas.height = 600;
        
        // Eventos de mouse
        this.hackCanvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.hackCanvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.hackCanvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Posição do mouse
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Debug
        this.debug = false;
    }
    
    start(target) {
        this.active = true;
        this.target = target;
        this.timer = 60;
        this.success = false;
        this.failed = false;
        this.completed = false;
        this.selectedNode = null;
        
        // Mostra o minigame
        this.hackContainer.classList.remove('hidden');
        
        // Atualiza o status
        this.hackStatus.textContent = "CONECTANDO...";
        
        // Gera os nós de dados
        this.generateNodes();
        
        // Limpa as conexões
        this.connections = [];
        
        // Toca som de início
        Assets.playSound('hack_start');
        
        // Ajusta o tamanho do canvas para o container
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        const container = this.hackContainer;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Mantém a proporção 4:3, mas ajusta ao tamanho do container
        const maxWidth = Math.min(800, containerWidth * 0.8);
        const maxHeight = Math.min(600, containerHeight * 0.8);
        
        // Ajusta o canvas
        this.hackCanvas.width = maxWidth;
        this.hackCanvas.height = maxHeight;
    }
    
    end(success) {
        if (this.completed) return; // Evita múltiplas chamadas
        
        this.completed = true;
        this.active = false;
        this.success = success;
        
        // Atualiza o status
        this.hackStatus.textContent = success ? "HACK BEM-SUCEDIDO" : "HACK FALHOU";
        
        // Toca som de resultado
        Assets.playSound(success ? 'hack_success' : 'hack_fail');
        
        // Esconde o minigame após um delay
        setTimeout(() => {
            this.hackContainer.classList.add('hidden');
            this.game.player.stopInteracting();
            
            // Recompensa se for bem-sucedido
            if (success) {
                this.game.dialogue.show(
                    "Hack Bem-Sucedido",
                    "Você extraiu os dados com sucesso. As informações revelam detalhes sobre um projeto secreto chamado 'Neuromancer'.",
                    [{ 
                        text: "Continuar", 
                        action: () => {
                            this.game.dialogue.hide();
                            
                            // Completa a missão se existir
                            if (this.game.missions.includes("Extrair dados do terminal")) {
                                this.game.completeMission("Extrair dados do terminal");
                                
                                // Avança para a próxima fase se for a missão principal
                                if (this.target && this.target.isMainMission) {
                                    setTimeout(() => {
                                        this.game.changePhase('matrix');
                                    }, 1000);
                                }
                            }
                        } 
                    }]
                );
                
                // Aumenta karma
                this.game.changeKarma(10);
            } else {
                // Diminui karma
                this.game.changeKarma(-5);
            }
        }, 2000);
    }
    
    generateNodes() {
        this.nodes = [];
        
        // Nó de entrada (verde)
        this.nodes.push({
            type: 'entry',
            x: 100,
            y: 300,
            radius: 24,
            color: '#00ff00',
            connected: true, // Já está conectado à rede
            highlight: false
        });
        
        // Nós de dados (vermelho)
        for (let i = 0; i < 3; i++) {
            this.nodes.push({
                type: 'data',
                x: 300 + i * 150,
                y: 200 + Math.random() * 200,
                radius: 24,
                color: '#ff0000',
                connected: false,
                highlight: false
            });
        }
        
        // Nó de saída (azul)
        this.nodes.push({
            type: 'exit',
            x: 700,
            y: 300,
            radius: 24,
            color: '#0000ff',
            connected: false,
            highlight: false
        });
    }
    
    update(deltaTime) {
        if (!this.active || this.completed) return;
        
        // Atualiza o timer
        this.timer -= deltaTime / 1000; // Converte para segundos
        this.hackTimer.textContent = Math.ceil(this.timer);
        
        // Verifica se o tempo acabou
        if (this.timer <= 0) {
            this.end(false);
            return;
        }
        
        // Verifica se todos os nós estão conectados
        const allConnected = this.nodes.every(node => node.connected);
        if (allConnected && !this.completed) {
            this.end(true);
            return;
        }
        
        // Atualiza o status
        if (this.selectedNode) {
            this.hackStatus.textContent = "CONECTANDO NÓ...";
        } else {
            this.hackStatus.textContent = "SELECIONE UM NÓ";
        }
        
        // Debug
        if (this.debug) {
            console.log("Nodes:", this.nodes.map(n => n.connected));
            console.log("All connected:", allConnected);
        }
    }
    
    draw() {
        if (!this.active) return;
        
        const ctx = this.ctx;
        
        // Limpa o canvas
        ctx.clearRect(0, 0, this.hackCanvas.width, this.hackCanvas.height);
        
        // Desenha o fundo
        const hackInterface = Assets.getImage('hack_interface');
        ctx.drawImage(hackInterface, 0, 0, this.hackCanvas.width, this.hackCanvas.height);
        
        // Desenha as conexões
        ctx.strokeStyle = '#0df2c9';
        ctx.lineWidth = 3;
        this.connections.forEach(conn => {
            ctx.beginPath();
            ctx.moveTo(conn.from.x, conn.from.y);
            ctx.lineTo(conn.to.x, conn.to.y);
            ctx.stroke();
        });
        
        // Desenha a conexão em progresso
        if (this.selectedNode) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(this.selectedNode.x, this.selectedNode.y);
            ctx.lineTo(this.mouseX, this.mouseY);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        // Desenha os nós
        this.nodes.forEach(node => {
            // Desenha o círculo do nó
            ctx.fillStyle = node.connected ? '#00ff88' : node.color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Destaca se estiver selecionado ou sob o mouse
            if (node.highlight || node === this.selectedNode) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
        
        // Desenha o texto de instruções
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px monospace';
        ctx.fillText('Conecte todos os nós para extrair os dados', 20, 30);
        
        // Efeito de glitch aleatório
        if (Math.random() < 0.05) {
            const x = Math.random() * this.hackCanvas.width;
            const y = Math.random() * this.hackCanvas.height;
            const width = 50 + Math.random() * 100;
            const height = 10 + Math.random() * 20;
            Utils.applyGlitchEffect(ctx, x, y, width, height, 5);
        }
        
        // Debug
        if (this.debug) {
            ctx.fillStyle = '#ff0000';
            ctx.font = '14px monospace';
            ctx.fillText(`Nodes: ${this.nodes.length}, Connected: ${this.nodes.filter(n => n.connected).length}`, 20, 50);
            ctx.fillText(`Selected: ${this.selectedNode ? 'Yes' : 'No'}`, 20, 70);
            ctx.fillText(`Completed: ${this.completed}`, 20, 90);
        }
    }
    
    handleMouseDown(e) {
        if (!this.active || this.completed) return;
        
        // Calcula a posição do mouse relativa ao canvas
        const rect = this.hackCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Verifica se clicou em algum nó
        for (const node of this.nodes) {
            const distance = Utils.distance(x, y, node.x, node.y);
            if (distance < node.radius) {
                // Só pode selecionar nós já conectados
                if (node.connected) {
                    this.selectedNode = node;
                    break;
                }
            }
        }
    }
    
    handleMouseMove(e) {
        if (!this.active || this.completed) return;
        
        // Atualiza a posição do mouse
        const rect = this.hackCanvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        
        // Destaca os nós sob o mouse
        this.nodes.forEach(node => {
            const distance = Utils.distance(this.mouseX, this.mouseY, node.x, node.y);
            node.highlight = distance < node.radius;
        });
    }
    
    handleMouseUp(e) {
        if (!this.active || this.completed || !this.selectedNode) return;
        
        // Calcula a posição do mouse relativa ao canvas
        const rect = this.hackCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Verifica se soltou sobre algum nó
        for (const node of this.nodes) {
            const distance = Utils.distance(x, y, node.x, node.y);
            if (distance < node.radius && node !== this.selectedNode) {
                // Cria uma conexão
                this.connections.push({
                    from: this.selectedNode,
                    to: node
                });
                
                // Marca o nó como conectado
                node.connected = true;
                
                // Toca som de conexão
                Assets.playSound('hack_start');
                
                break;
            }
        }
        
        // Limpa o nó selecionado
        this.selectedNode = null;
        
        // Verifica se todos os nós estão conectados após esta ação
        const allConnected = this.nodes.every(node => node.connected);
        if (allConnected && !this.completed) {
            this.end(true);
        }
    }
    
    // Adiciona suporte a touch para dispositivos móveis
    enableTouchSupport() {
        this.hackCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.handleMouseDown(mouseEvent);
        });
        
        this.hackCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.handleMouseMove(mouseEvent);
        });
        
        this.hackCanvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const mouseEvent = new MouseEvent('mouseup', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.handleMouseUp(mouseEvent);
        });
    }
}
