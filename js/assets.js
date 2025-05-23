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
        { name: 'terminal', src: 'assets/sprites/terminal.png' },
        { name: 'npc_contact', src: 'assets/sprites/npc_contact.png' },
        { name: 'hack_interface', src: 'assets/sprites/hack_interface.png' },
        { name: 'data_nodes', src: 'assets/sprites/data_nodes.png' }
    ],
    
    soundFiles: [
        { name: 'background_music', src: 'assets/audio/background_music.mp3' },
        { name: 'hack_start', src: 'assets/audio/hack_start.mp3' },
        { name: 'hack_success', src: 'assets/audio/hack_success.mp3' },
        { name: 'hack_fail', src: 'assets/audio/hack_fail.mp3' },
        { name: 'footstep', src: 'assets/audio/footstep.mp3' }
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
        // Cria canvas temporário
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Tamanhos padrão
        tempCanvas.width = 64;
        tempCanvas.height = 64;
        
        // Cria player_idle
        tempCtx.fillStyle = '#0df2c9';
        tempCtx.fillRect(16, 8, 32, 48);
        tempCtx.fillStyle = '#ff00ff';
        tempCtx.fillRect(24, 16, 16, 8); // Rosto
        this.createTempImage('player_idle', tempCanvas.toDataURL());
        
        // Cria player_walk (2 frames)
        tempCanvas.width = 128; // 2 frames
        tempCtx.fillStyle = '#0df2c9';
        tempCtx.fillRect(16, 12, 32, 44); // Frame 1
        tempCtx.fillRect(80, 8, 32, 48); // Frame 2
        tempCtx.fillStyle = '#ff00ff';
        tempCtx.fillRect(24, 20, 16, 8); // Rosto frame 1
        tempCtx.fillRect(88, 16, 16, 8); // Rosto frame 2
        this.createTempImage('player_walk', tempCanvas.toDataURL());
        
        // Cria background de Chiba City
        tempCanvas.width = 1280;
        tempCanvas.height = 720;
        
        // Fundo escuro
        tempCtx.fillStyle = '#0a0a0a';
        tempCtx.fillRect(0, 0, 1280, 720);
        
        // Chão
        tempCtx.fillStyle = '#222222';
        tempCtx.fillRect(0, 600, 1280, 120);
        
        // Prédios de fundo
        for (let i = 0; i < 10; i++) {
            const height = 200 + Math.random() * 300;
            const width = 80 + Math.random() * 120;
            const x = i * 130;
            
            // Prédio
            tempCtx.fillStyle = `rgb(${20 + i * 5}, ${20 + i * 2}, ${30 + i * 3})`;
            tempCtx.fillRect(x, 600 - height, width, height);
            
            // Janelas
            tempCtx.fillStyle = '#ff00ff';
            for (let j = 0; j < 5; j++) {
                for (let k = 0; k < Math.floor(height / 40); k++) {
                    if (Math.random() > 0.3) {
                        tempCtx.fillRect(x + 10 + j * (width / 6), 620 - height + k * 40, 10, 20);
                    }
                }
            }
        }
        
        // Néon
        tempCtx.fillStyle = '#0df2c9';
        tempCtx.fillRect(200, 400, 200, 50);
        tempCtx.fillStyle = '#000000';
        tempCtx.font = '30px monospace';
        tempCtx.fillText('HOTEL', 250, 435);
        
        tempCtx.fillStyle = '#ff00ff';
        tempCtx.fillRect(600, 350, 150, 40);
        tempCtx.fillStyle = '#000000';
        tempCtx.fillText('BAR', 650, 380);
        
        this.createTempImage('chiba_city_bg', tempCanvas.toDataURL());
        
        // Cria terminal
        tempCanvas.width = 64;
        tempCanvas.height = 96;
        tempCtx.fillStyle = '#333333';
        tempCtx.fillRect(8, 16, 48, 80);
        tempCtx.fillStyle = '#0df2c9';
        tempCtx.fillRect(16, 24, 32, 24);
        tempCtx.fillStyle = '#222222';
        tempCtx.fillRect(16, 56, 32, 32);
        this.createTempImage('terminal', tempCanvas.toDataURL());
        
        // Cria NPC
        tempCanvas.width = 64;
        tempCanvas.height = 64;
        tempCtx.fillStyle = '#ff5500';
        tempCtx.fillRect(16, 8, 32, 48);
        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillRect(24, 16, 16, 8); // Rosto
        this.createTempImage('npc_contact', tempCanvas.toDataURL());
        
        // Cria interface de hack
        tempCanvas.width = 800;
        tempCanvas.height = 600;
        tempCtx.fillStyle = '#000000';
        tempCtx.fillRect(0, 0, 800, 600);
        
        // Grade de fundo
        tempCtx.strokeStyle = '#0df2c9';
        tempCtx.lineWidth = 1;
        for (let i = 0; i < 20; i++) {
            tempCtx.beginPath();
            tempCtx.moveTo(0, i * 30);
            tempCtx.lineTo(800, i * 30);
            tempCtx.stroke();
            
            tempCtx.beginPath();
            tempCtx.moveTo(i * 40, 0);
            tempCtx.lineTo(i * 40, 600);
            tempCtx.stroke();
        }
        
        // Borda
        tempCtx.strokeStyle = '#ff00ff';
        tempCtx.lineWidth = 4;
        tempCtx.strokeRect(2, 2, 796, 596);
        
        this.createTempImage('hack_interface', tempCanvas.toDataURL());
        
        // Cria nós de dados
        tempCanvas.width = 192; // 3 tipos
        tempCanvas.height = 64;
        
        // Nó vermelho (dados)
        tempCtx.fillStyle = '#ff0000';
        tempCtx.beginPath();
        tempCtx.arc(32, 32, 24, 0, Math.PI * 2);
        tempCtx.fill();
        
        // Nó verde (acesso)
        tempCtx.fillStyle = '#00ff00';
        tempCtx.beginPath();
        tempCtx.arc(96, 32, 24, 0, Math.PI * 2);
        tempCtx.fill();
        
        // Nó azul (segurança)
        tempCtx.fillStyle = '#0000ff';
        tempCtx.beginPath();
        tempCtx.arc(160, 32, 24, 0, Math.PI * 2);
        tempCtx.fill();
        
        this.createTempImage('data_nodes', tempCanvas.toDataURL());
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
