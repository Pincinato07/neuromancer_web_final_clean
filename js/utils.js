// Utilitários para o jogo
const Utils = {
    // Detecta colisão entre dois retângulos
    collisionCheck: function(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    },
    
    // Calcula distância entre dois pontos
    distance: function(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },
    
    // Limita um valor entre min e max
    clamp: function(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    
    // Gera um número aleatório entre min e max
    random: function(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    // Gera um número inteiro aleatório entre min e max (inclusive)
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Converte graus para radianos
    degToRad: function(degrees) {
        return degrees * Math.PI / 180;
    },
    
    // Converte radianos para graus
    radToDeg: function(radians) {
        return radians * 180 / Math.PI;
    },
    
    // Retorna um item aleatório de um array
    randomItem: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    // Embaralha um array
    shuffleArray: function(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    },
    
    // Easing functions para animações
    easing: {
        // Aceleração linear
        linear: t => t,
        
        // Aceleração suave no início
        easeInQuad: t => t * t,
        
        // Desaceleração suave no final
        easeOutQuad: t => t * (2 - t),
        
        // Aceleração e desaceleração suaves
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    },
    
    // Desenha texto com contorno
    drawTextWithOutline: function(ctx, text, x, y, fillStyle, strokeStyle, lineWidth, font) {
        ctx.font = font || ctx.font;
        ctx.strokeStyle = strokeStyle || '#000000';
        ctx.lineWidth = lineWidth || 3;
        ctx.strokeText(text, x, y);
        ctx.fillStyle = fillStyle || '#ffffff';
        ctx.fillText(text, x, y);
    },
    
    // Desenha retângulo com bordas arredondadas
    drawRoundedRect: function(ctx, x, y, width, height, radius, fill, stroke) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        
        if (fill) {
            ctx.fillStyle = fill;
            ctx.fill();
        }
        
        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.stroke();
        }
    },
    
    // Cria um efeito de "glitch" em uma imagem
    applyGlitchEffect: function(ctx, x, y, width, height, intensity) {
        const imageData = ctx.getImageData(x, y, width, height);
        const data = imageData.data;
        const intensity_scaled = intensity || 10;
        
        // Aplica distorções aleatórias nos canais RGB
        for (let i = 0; i < data.length; i += 4) {
            // Altera canais RGB aleatoriamente
            if (Math.random() < 0.1) {
                const offset = Math.floor(Math.random() * intensity_scaled) * 4;
                if (i + offset < data.length) {
                    data[i] = data[i + offset]; // R
                }
            }
            if (Math.random() < 0.1) {
                const offset = Math.floor(Math.random() * intensity_scaled) * 4;
                if (i + offset + 1 < data.length) {
                    data[i + 1] = data[i + offset + 1]; // G
                }
            }
            if (Math.random() < 0.1) {
                const offset = Math.floor(Math.random() * intensity_scaled) * 4;
                if (i + offset + 2 < data.length) {
                    data[i + 2] = data[i + offset + 2]; // B
                }
            }
        }
        
        ctx.putImageData(imageData, x, y);
    }
};
