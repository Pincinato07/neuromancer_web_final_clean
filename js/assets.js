// Gerenciador de assets do jogo
const Assets = {
    // Status de carregamento
    loaded: false,
    loadedCount: 0,
    totalCount: 0,
    
    // Armazenamento de imagens
    images: {},
    
    // Armazenamento de sons
    sounds: {},
    
    // Lista de assets para carregar
    imageFiles: [
        { name: 'player_idle', src: 'assets/sprites/player_idle.png' },
        { name: 'player_walk', src: 'assets/sprites/player_walk.png' },
        { name: 'chiba_city_bg', src: 'assets/sprites/chiba_city_bg.png' },
        { name: 'matrix_zone_bg', src: 'assets/sprites/matrix_zone_bg.png' },
        { name: 'ziggurat_tower_bg', src: 'assets/sprites/ziggurat_tower_bg.png' },
        { name: 'straylight_bg', src: 'assets/sprites/straylight_bg.png' },
        { name: 'core_bg', src: 'assets/sprites/core_bg.png' },
        { name: 'terminal', src: 'assets/sprites/terminal.png' },
        { name: 'npc_contact', src: 'assets/sprites/npc_contact.png' },
        { name: 'wintermute', src: 'assets/sprites/wintermute.png' },
        { name: 'sombra', src: 'assets/sprites/sombra.png' },
        { name: 'flatline', src: 'assets/sprites/flatline.png' },
        { name: 'hack_interface', src: 'assets/sprites/hack_interface.png' },
        { name: 'data_nodes', src: 'assets/sprites/data_nodes.png' }
    ],
    
    soundFiles: [
        { name: 'background_music', src: 'assets/audio/background_music.mp3' },
        { name: 'footstep', src: 'assets/audio/footstep.mp3' },
        { name: 'interact', src: 'assets/audio/interact.mp3' },
        { name: 'hack_start', src: 'assets/audio/hack_start.mp3' },
        { name: 'hack_success', src: 'assets/audio/hack_success.mp3' },
        { name: 'hack_fail', src: 'assets/audio/hack_fail.mp3' },
        { name: 'transition', src: 'assets/audio/transition.mp3' },
        { name: 'ending', src: 'assets/audio/ending.mp3' }
    ],
    
    // Inicializa o carregamento de assets
    init: function(callback) {
        // Cria assets temporários para desenvolvimento
        this.createTempAssets();
        
        // Configura o callback de conclusão
        this.callback = callback;
        
        // Calcula o total de assets
        this.totalCount = this.imageFiles.length + this.soundFiles.length;
        
        // Carrega as imagens
        this.loadImages();
        
        // Carrega os sons
        this.loadSounds();
    },
    
    // Cria assets temporários para desenvolvimento
    createTempAssets: function() {
        // Backgrounds das fases
        const backgrounds = {
            'chiba_city_bg': Assets.createTempBackground('#1a1a1a', '#00FFFF', 'Chiba City'),
            'matrix_zone_bg': Assets.createTempBackground('#000000', '#00FF00', 'Matrix Zone'),
            'ziggurat_tower_bg': Assets.createTempBackground('#2a2a2a', '#FF00FF', 'Ziggurat Tower'),
            'straylight_bg': Assets.createTempBackground('#1a1a1a', '#FFFFFF', 'Straylight'),
            'core_bg': Assets.createTempBackground('#000000', '#FF0000', 'Core')
        };

        // Personagens
        const characters = {
            'wintermute': Assets.createTempCharacter('#FFFFFF', '#00FFFF', 'W'),
            'sombra': Assets.createTempCharacter('#000000', '#FF00FF', 'S'),
            'flatline': Assets.createTempCharacter('#FF0000', '#FFFFFF', 'F')
        };

        // Objetos
        const objects = {
            'terminal': Assets.createTempObject('#00FFFF', '#000000', 'T'),
            'npc_contact': Assets.createTempCharacter('#FF00FF', '#FFFFFF', 'C')
        };

        // Sons temporários
        const sounds = {
            'footstep': new Audio(),
            'interact': new Audio(),
            'transition': new Audio(),
            'ending': new Audio()
        };

        // Adiciona todos os assets temporários
        Object.entries(backgrounds).forEach(([key, value]) => this.images[key] = value);
        Object.entries(characters).forEach(([key, value]) => this.images[key] = value);
        Object.entries(objects).forEach(([key, value]) => this.images[key] = value);
        Object.entries(sounds).forEach(([key, value]) => this.sounds[key] = value);
    },
    
    createTempBackground: function(bgColor, neonColor, text) {
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');

        // Fundo
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Efeito de grade
        ctx.strokeStyle = neonColor;
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }

        // Texto da fase
        ctx.font = '48px "Press Start 2P"';
        ctx.fillStyle = neonColor;
        ctx.textAlign = 'center';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        return canvas;
    },
    
    createTempCharacter: function(bgColor, textColor, text) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        // Corpo
        ctx.fillStyle = bgColor;
        ctx.fillRect(16, 8, 32, 48);

        // Cabeça
        ctx.beginPath();
        ctx.arc(32, 16, 12, 0, Math.PI * 2);
        ctx.fill();

        // Texto
        ctx.font = '24px "Press Start 2P"';
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 32, 32);

        return canvas;
    },
    
    createTempObject: function(bgColor, textColor, text) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        // Base
        ctx.fillStyle = bgColor;
        ctx.fillRect(8, 8, 48, 48);

        // Detalhes
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(12, 12, 40, 40);

        // Texto
        ctx.font = '24px "Press Start 2P"';
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 32, 32);

        return canvas;
    },
    
    // Cria uma imagem temporária a partir de um dataURL
    createTempImage: function(name, dataURL) {
        const img = new Image();
        img.src = dataURL;
        this.images[name] = img;
        this.imageFiles = this.imageFiles.filter(file => file.name !== name);
        this.totalCount = this.imageFiles.length + this.soundFiles.length;
    },
    
    // Carrega as imagens
    loadImages: function() {
        if (this.imageFiles.length === 0) {
            // Se todas as imagens já foram criadas temporariamente
            if (this.soundFiles.length === 0) {
                this.loaded = true;
                if (this.callback) {
                    this.callback();
                }
            }
            return;
        }
        
        this.imageFiles.forEach(imageFile => {
            const img = new Image();
            
            img.onload = () => {
                this.loadedCount++;
                this.updateLoadingProgress();
                
                if (this.loadedCount === this.totalCount) {
                    this.loaded = true;
                    if (this.callback) {
                        this.callback();
                    }
                }
            };
            
            img.onerror = () => {
                console.error(`Erro ao carregar imagem: ${imageFile.src}`);
                this.loadedCount++;
                this.updateLoadingProgress();
                
                if (this.loadedCount === this.totalCount) {
                    this.loaded = true;
                    if (this.callback) {
                        this.callback();
                    }
                }
            };
            
            img.src = imageFile.src;
            this.images[imageFile.name] = img;
        });
    },
    
    // Carrega os sons
    loadSounds: function() {
        if (this.soundFiles.length === 0) {
            if (this.imageFiles.length === 0 && this.loadedCount === this.totalCount) {
                this.loaded = true;
                if (this.callback) {
                    this.callback();
                }
            }
            return;
        }
        
        this.soundFiles.forEach(soundFile => {
            // Cria um objeto de áudio vazio para desenvolvimento
            // Em produção, carregaria os arquivos reais
            this.sounds[soundFile.name] = {
                play: function() { console.log(`Playing sound: ${soundFile.name}`); },
                pause: function() { console.log(`Pausing sound: ${soundFile.name}`); },
                stop: function() { console.log(`Stopping sound: ${soundFile.name}`); }
            };
            
            this.loadedCount++;
            this.updateLoadingProgress();
            
            if (this.loadedCount === this.totalCount) {
                this.loaded = true;
                if (this.callback) {
                    this.callback();
                }
            }
        });
    },
    
    // Atualiza a barra de progresso de carregamento
    updateLoadingProgress: function() {
        const loadingBar = document.querySelector('.loading-bar');
        const progress = (this.loadedCount / this.totalCount) * 100;
        
        if (loadingBar) {
            loadingBar.style.width = `${progress}%`;
        }
    },
    
    // Retorna uma imagem pelo nome
    getImage: function(name) {
        return this.images[name];
    },
    
    // Retorna um som pelo nome
    getSound: function(name) {
        return this.sounds[name];
    },
    
    // Toca um som pelo nome
    playSound: function(name, loop = false) {
        const sound = this.sounds[name];
        if (sound) {
            sound.play();
        }
    },
    
    // Para um som pelo nome
    stopSound: function(name) {
        const sound = this.sounds[name];
        if (sound) {
            sound.stop();
        }
    }
};
