// Sistema de diálogo
class Dialogue {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.title = "";
        this.text = "";
        this.options = [];
        this.currentDialogue = null;
        
        // Elementos DOM
        this.dialogueBox = document.getElementById('dialogue-box');
        this.dialogueText = document.getElementById('dialogue-text');
        this.dialogueOptions = document.getElementById('dialogue-options');
        
        // Bind para tecla ESC
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && this.active) {
                this.hide();
            }
        });
    }
    
    show(title, text, options, currentDialogue = null) {
        this.active = true;
        this.title = title;
        this.text = text;
        this.options = options;
        this.currentDialogue = currentDialogue;
        
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
                // Atualiza karma se houver
                if (typeof option.karma === 'number') {
                    this.game.changeKarma(option.karma);
                }
                
                // Se houver resposta, mostra ela
                if (option.response) {
                    this.show(this.title, option.response, [{
                        text: "Continuar",
                        next: option.next
                    }], this.currentDialogue);
                    return;
                }
                
                // Se houver próximo diálogo
                if (option.next && this.currentDialogue && this.currentDialogue[option.next]) {
                    const nextDialogue = this.currentDialogue[option.next];
                    this.show(this.title, nextDialogue.text, nextDialogue.options, this.currentDialogue);
                    return;
                }
                
                // Se houver ação
                if (option.action) {
                    option.action();
                    return;
                }
                
                // Se não houver mais nada, fecha o diálogo
                this.hide();
            };
            
            this.dialogueOptions.appendChild(button);
        });
        
        // Atualiza o estado do jogador
        this.game.player.isInteracting = true;
    }
    
    hide() {
        this.active = false;
        this.dialogueBox.classList.add('hidden');
        this.currentDialogue = null;
        this.game.player.isInteracting = false;
    }
    
    update() {
        // Atualiza a posição do diálogo se necessário
        if (this.active && this.dialogueBox) {
            // Mantém o diálogo visível e bem posicionado
            this.dialogueBox.style.display = 'block';
        }
    }
}
