// Classe da câmera do jogo
class Camera {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.target = null; // Objeto que a câmera segue (geralmente o jogador)
        this.smoothness = 0.1; // Suavidade do movimento da câmera (0-1)
    }

    update() {
        if (this.target) {
            // Calcula a posição alvo da câmera (centralizada no alvo)
            const targetX = this.target.x - this.game.canvas.width / 2;
            const targetY = this.target.y - this.game.canvas.height / 2;

            // Aplica suavidade ao movimento
            this.x += (targetX - this.x) * this.smoothness;
            this.y += (targetY - this.y) * this.smoothness;
        }
    }

    apply(context) {
        // Aplica a transformação da câmera ao contexto
        context.translate(-this.x, -this.y);
    }
} 