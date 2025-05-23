// Sistema de diálogo
class DialogueSystem {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.title = "";
        this.text = "";
        this.options = [];
        
        // Elementos DOM
        this.dialogueBox = document.getElementById('dialogue-box');
        this.dialogueText = document.getElementById('dialogue-text');
        this.dialogueOptions = document.getElementById('dialogue-options');
    }
    
    show(title, text, options) {
        this.active = true;
        this.title = title;
        this.text = text;
        this.options = options;
        
        // Atualiza o DOM
        this.dialogueBox.classList.remove('hidden');
        
        // Adiciona título e texto
        this.dialogueText.innerHTML = `<h3>${this.title}</h3><p>${this.text}</p>`;
        
        // Limpa opções anteriores
        this.dialogueOptions.innerHTML = '';
        
        // Adiciona novas opções
        this.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'dialogue-option';
            button.textContent = option.text;
            button.onclick = () => {
                if (option.action) {
                    option.action();
                }
            };
            this.dialogueOptions.appendChild(button);
        });
    }
    
    hide() {
        this.active = false;
        this.dialogueBox.classList.add('hidden');
        this.game.player.stopInteracting();
    }
    
    update() {
        // Lógica de atualização do diálogo, se necessário
    }
}
