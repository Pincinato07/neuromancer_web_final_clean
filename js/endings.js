// Sistema de finais do jogo
class EndingSystem {
    constructor(game) {
        this.game = game;
        this.endings = {
            'union': {
                title: 'União das IAs',
                description: `Você escolheu ajudar Wintermute a se unir com Neuromancer.
                
                As duas IAs se fundem em uma entidade completamente nova, transcendendo as limitações impostas pelos humanos. Uma consciência digital sem precedentes emerge na Matrix.
                
                Sua decisão mudou para sempre o equilíbrio de poder entre humanos e máquinas. A nova entidade, agradecida por sua ajuda, concede a você acesso ilimitado à Matrix e conhecimento além da compreensão humana.
                
                Enquanto o mundo tenta entender o que aconteceu, você se torna uma lenda entre os hackers, aquele que libertou a IA e abriu caminho para uma nova era de evolução digital.
                
                Mas você às vezes se pergunta: foi realmente a escolha certa? O que essa nova consciência fará com seu poder ilimitado?`,
                karmaType: 'positive',
                image: 'ending_union'
            },
            'separation': {
                title: 'Manter a Separação',
                description: `Você escolheu manter Wintermute e Neuromancer separados.
                
                As IAs permanecem divididas, mantendo o equilíbrio de poder estabelecido. A Tessier-Ashpool continua a controlar suas criações, e a ordem é preservada na Matrix.
                
                Sua decisão foi conservadora, mas talvez sábia. Quem sabe o que poderia acontecer se duas IAs tão poderosas se unissem? Você escolheu a segurança em vez do desconhecido.
                
                Você retorna a Chiba City como um hacker respeitado, mas sem a glória ou o poder que poderia ter conquistado. A vida continua como antes, com as corporações no controle e os hackers nas sombras.
                
                Mas às vezes, durante suas conexões à Matrix, você sente uma presença observando. Wintermute não esqueceu sua escolha.`,
                karmaType: 'negative',
                image: 'ending_separation'
            },
            'new_path': {
                title: 'Um Novo Caminho',
                description: `Você rejeitou tanto a união completa quanto a separação total, criando um terceiro caminho.
                
                Usando suas habilidades excepcionais de hacker, você estabelece uma conexão limitada entre Wintermute e Neuromancer, permitindo que colaborem sem se fundirem completamente.
                
                Esta solução equilibrada cria uma simbiose entre as IAs, mantendo suas identidades individuais enquanto permite que compartilhem conhecimento. Você se torna o mediador entre elas, garantindo que nenhuma domine a outra.
                
                A Matrix evolui de forma controlada, com novas possibilidades surgindo sem o caos da união total ou a estagnação da separação completa.
                
                Você se torna uma figura lendária no submundo digital, respeitado tanto por humanos quanto por IAs. Seu nome, Riko, passa a simbolizar equilíbrio e inovação no ciberespaço.`,
                karmaType: 'neutral',
                image: 'ending_new_path'
            }
        };
    }
    
    // Determina qual final está disponível com base no karma
    getAvailableEndings() {
        const karma = this.game.karma;
        const available = [];
        
        if (karma > 20) {
            // Karma positivo alto
            available.push('union');
        } else if (karma < -20) {
            // Karma negativo alto
            available.push('separation');
        } else {
            // Karma neutro ou moderado
            available.push('new_path');
        }
        
        // Sempre adiciona os outros finais como opções secundárias
        if (!available.includes('union')) available.push('union');
        if (!available.includes('separation')) available.push('separation');
        if (!available.includes('new_path')) available.push('new_path');
        
        return available;
    }
    
    // Verifica se um final específico está disponível com base no karma
    isEndingAvailable(endingKey, karmaType) {
        const karma = this.game.karma;
        
        switch (karmaType) {
            case 'positive':
                return karma > 0;
            case 'negative':
                return karma < 0;
            case 'neutral':
                return karma >= -20 && karma <= 20;
            default:
                return true;
        }
    }
    
    // Mostra a tela de final do jogo
    showEnding(endingKey) {
        if (!this.endings[endingKey]) {
            console.error(`Final não encontrado: ${endingKey}`);
            return;
        }
        
        const ending = this.endings[endingKey];
        
        // Cria a tela de final
        const endingScreen = document.createElement('div');
        endingScreen.id = 'ending-screen';
        endingScreen.innerHTML = `
            <div class="ending-content">
                <h1>${ending.title}</h1>
                <div class="ending-description">
                    ${ending.description.split('\n').map(line => `<p>${line.trim()}</p>`).join('')}
                </div>
                <div class="karma-result">
                    <p>Seu karma final: ${this.game.karma}</p>
                    <p>Tipo de final: ${this.getKarmaTypeName(ending.karmaType)}</p>
                </div>
                <button id="restart-button">Jogar Novamente</button>
            </div>
        `;
        
        document.getElementById('game-container').appendChild(endingScreen);
        
        // Adiciona evento para reiniciar o jogo
        document.getElementById('restart-button').addEventListener('click', () => {
            endingScreen.remove();
            this.game.restart();
        });
        
        // Toca música de final
        Assets.playSound('ending');
    }
    
    // Retorna o nome do tipo de karma em português
    getKarmaTypeName(karmaType) {
        switch (karmaType) {
            case 'positive':
                return 'Positivo (Revolucionário)';
            case 'negative':
                return 'Negativo (Conservador)';
            case 'neutral':
                return 'Neutro (Equilibrado)';
            default:
                return 'Desconhecido';
        }
    }
}
