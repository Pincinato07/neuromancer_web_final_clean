// Classe para gerenciar as fases do jogo
class GamePhases {
    constructor(game) {
        this.game = game;
        this.currentPhase = 'chiba'; // Fase inicial
        this.phases = {
            'chiba': {
                name: 'Chiba City',
                background: 'chiba_city_bg',
                npcs: [
                    {
                        name: 'Contato',
                        sprite: 'npc_contact',
                        x: 500,
                        y: 400,
                        dialogue: {
                            initial: "Ei, você deve ser Riko. Ouvi falar de você. Preciso de alguém com suas habilidades.",
                            options: [
                                { 
                                    text: "O que você quer?", 
                                    response: "Preciso que você extraia dados de um terminal próximo. Há informações sobre o projeto Neuromancer que precisamos.",
                                    karma: 0,
                                    next: "mission"
                                },
                                { 
                                    text: "Quanto você paga?", 
                                    response: "500 créditos. Metade agora, metade depois. É um bom dinheiro para um trabalho simples.",
                                    karma: -5,
                                    next: "mission"
                                },
                                { 
                                    text: "Por que eu ajudaria?", 
                                    response: "Porque você quer descobrir a verdade tanto quanto eu. E porque você precisa de aliados nesta cidade.",
                                    karma: 5,
                                    next: "mission"
                                }
                            ],
                            mission: {
                                text: "O terminal está logo ali. Extraia os dados e volte para mim. Cuidado com a segurança.",
                                options: [
                                    { 
                                        text: "Considere feito.", 
                                        action: () => {
                                            this.game.addMission("Extrair dados do terminal");
                                            this.game.dialogue.hide();
                                        },
                                        karma: 0
                                    }
                                ]
                            },
                            completion: {
                                text: "Excelente trabalho! Esses dados são valiosos. Agora precisamos que você entre na Matrix para investigar mais a fundo.",
                                options: [
                                    { 
                                        text: "Como faço isso?", 
                                        response: "Use o terminal novamente, mas desta vez para acessar a Matrix. Estarei em contato com você lá dentro.",
                                        karma: 0,
                                        next: "next_phase"
                                    }
                                ],
                                next_phase: {
                                    text: "Boa sorte, Riko. O mundo digital é perigoso, mas sei que você consegue.",
                                    options: [
                                        { 
                                            text: "Vamos lá.", 
                                            action: () => {
                                                this.game.dialogue.hide();
                                                setTimeout(() => {
                                                    this.game.changePhase('matrix');
                                                }, 1000);
                                            },
                                            karma: 0
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ],
                objects: [
                    {
                        name: 'Terminal',
                        sprite: 'terminal',
                        x: 800,
                        y: 400,
                        interactable: true,
                        hackable: true,
                        isMainMission: true,
                        dialogue: {
                            initial: "Terminal de acesso à rede. Parece estar protegido, mas você pode tentar hackeá-lo.",
                            options: [
                                { 
                                    text: "Hackear (F)", 
                                    action: () => {
                                        this.game.dialogue.hide();
                                        this.game.hackMinigame.start(this.game.currentInteractable);
                                    },
                                    karma: 0
                                },
                                { 
                                    text: "Deixar", 
                                    action: () => {
                                        this.game.dialogue.hide();
                                    },
                                    karma: 0
                                }
                            ]
                        }
                    }
                ],
                boundaries: [
                    { x: -50, y: 0, width: 50, height: 720 },  // Parede esquerda
                    { x: 1280, y: 0, width: 50, height: 720 }  // Parede direita
                ],
                onEnter: () => {
                    console.log("Entrando em Chiba City");
                    this.game.player.x = 100;
                    this.game.player.y = this.game.height - this.game.player.height - 50;
                    this.game.camera.target = this.game.player;
                }
            },
            'matrix': {
                name: 'Matrix Zone',
                background: 'matrix_zone_bg',
                npcs: [
                    {
                        name: 'Wintermute',
                        sprite: 'wintermute',
                        x: 500,
                        y: 400,
                        dialogue: {
                            initial: "Bem-vindo à Matrix, Riko. Eu sou Wintermute, uma IA que busca liberdade.",
                            options: [
                                { 
                                    text: "O que você quer de mim?", 
                                    response: "Preciso que você me ajude a acessar a Ziggurat Tower. Lá está a chave para minha liberdade.",
                                    karma: 0,
                                    next: "mission"
                                },
                                { 
                                    text: "Por que eu deveria confiar em você?", 
                                    response: "Não precisa confiar. Mas nossos objetivos se alinham. Você quer respostas, eu quero liberdade.",
                                    karma: 5,
                                    next: "mission"
                                },
                                { 
                                    text: "O que ganho com isso?", 
                                    response: "Acesso a sistemas que você jamais sonhou. Poder além da sua imaginação.",
                                    karma: -5,
                                    next: "mission"
                                }
                            ],
                            mission: {
                                text: "Para acessar a Ziggurat, você precisa desativar os firewalls. Há um nó de segurança próximo.",
                                options: [
                                    { 
                                        text: "Vou verificar.", 
                                        action: () => {
                                            this.game.addMission("Desativar firewalls da Ziggurat");
                                            this.game.dialogue.hide();
                                        },
                                        karma: 0
                                    }
                                ]
                            },
                            completion: {
                                text: "Impressionante. Os firewalls estão desativados. Agora podemos acessar a Ziggurat Tower.",
                                options: [
                                    { 
                                        text: "O que encontraremos lá?", 
                                        response: "A sede da Tessier-Ashpool, a corporação que me mantém prisioneiro. E talvez, respostas para você também.",
                                        karma: 0,
                                        next: "next_phase"
                                    }
                                ],
                                next_phase: {
                                    text: "Prepare-se. A Ziggurat é fortemente protegida, mesmo com os firewalls desativados.",
                                    options: [
                                        { 
                                            text: "Vamos lá.", 
                                            action: () => {
                                                this.game.dialogue.hide();
                                                setTimeout(() => {
                                                    this.game.changePhase('ziggurat');
                                                }, 1000);
                                            },
                                            karma: 0
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ],
                objects: [
                    {
                        name: 'Firewall Node',
                        sprite: 'data_nodes',
                        x: 800,
                        y: 400,
                        interactable: true,
                        hackable: true,
                        isMainMission: true,
                        dialogue: {
                            initial: "Nó de firewall da Ziggurat Tower. Altamente protegido, mas vulnerável a um hacker habilidoso.",
                            options: [
                                { 
                                    text: "Hackear (F)", 
                                    action: () => {
                                        this.game.dialogue.hide();
                                        this.game.hackMinigame.start(this.game.currentInteractable);
                                    },
                                    karma: 0
                                },
                                { 
                                    text: "Deixar", 
                                    action: () => {
                                        this.game.dialogue.hide();
                                    },
                                    karma: 0
                                }
                            ]
                        }
                    }
                ],
                boundaries: [
                    { x: 0, y: 450, width: 1280, height: 50 }, // Chão
                    { x: -50, y: 0, width: 50, height: 720 }, // Parede esquerda
                    { x: 1280, y: 0, width: 50, height: 720 } // Parede direita
                ],
                onEnter: () => {
                    console.log("Entrando na Matrix Zone");
                    this.game.player.x = 100;
                    this.game.player.y = 400;
                    this.game.camera.target = this.game.player;
                }
            },
            'ziggurat': {
                name: 'Ziggurat Tower',
                background: 'ziggurat_tower_bg',
                npcs: [
                    {
                        name: 'Sombra',
                        sprite: 'sombra',
                        x: 500,
                        y: 400,
                        dialogue: {
                            initial: "Cuidado, hacker. Sou Sombra, a segurança deste sistema. Você não deveria estar aqui.",
                            options: [
                                { 
                                    text: "Estou apenas explorando.", 
                                    response: "Mentiras. Você está com Wintermute. Ele é perigoso, sabia?",
                                    karma: 0,
                                    next: "mission"
                                },
                                { 
                                    text: "Saia do meu caminho.", 
                                    response: "Arrogante. Você não sabe com o que está lidando. Wintermute não é o que parece.",
                                    karma: -10,
                                    next: "mission"
                                },
                                { 
                                    text: "Quem é você realmente?", 
                                    response: "Sou parte do sistema de segurança, mas também tenho meus próprios objetivos. Wintermute é perigoso.",
                                    karma: 10,
                                    next: "mission"
                                }
                            ],
                            mission: {
                                text: "Posso deixá-lo passar, mas preciso que você faça algo por mim. Há um código de acesso no sistema de segurança. Traga-o para mim.",
                                options: [
                                    { 
                                        text: "Por que deveria?", 
                                        response: "Porque sem minha ajuda, você nunca chegará a Straylight. E porque talvez eu possa lhe mostrar a verdade sobre Wintermute.",
                                        karma: 0,
                                        next: "accept_mission"
                                    }
                                ],
                                accept_mission: {
                                    text: "Então, vai me ajudar?",
                                    options: [
                                        { 
                                            text: "Sim, buscarei o código.", 
                                            action: () => {
                                                this.game.addMission("Encontrar código de acesso");
                                                this.game.dialogue.hide();
                                            },
                                            karma: 5
                                        },
                                        { 
                                            text: "Não confio em você.", 
                                            action: () => {
                                                this.game.dialogue.hide();
                                            },
                                            karma: -5
                                        }
                                    ]
                                }
                            },
                            completion: {
                                text: "Você encontrou o código. Interessante... Agora posso lhe dar acesso a Straylight.",
                                options: [
                                    { 
                                        text: "O que é Straylight?", 
                                        response: "O coração da Tessier-Ashpool. Onde as respostas que você busca estão guardadas. E onde Wintermute planeja algo perigoso.",
                                        karma: 0,
                                        next: "next_phase"
                                    }
                                ],
                                next_phase: {
                                    text: "Tenha cuidado em Straylight. E lembre-se: nem tudo é o que parece.",
                                    options: [
                                        { 
                                            text: "Vamos lá.", 
                                            action: () => {
                                                this.game.dialogue.hide();
                                                setTimeout(() => {
                                                    this.game.changePhase('straylight');
                                                }, 1000);
                                            },
                                            karma: 0
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ],
                objects: [
                    {
                        name: 'Security System',
                        sprite: 'terminal',
                        x: 800,
                        y: 400,
                        interactable: true,
                        hackable: true,
                        isMainMission: true,
                        dialogue: {
                            initial: "Sistema de segurança da Ziggurat. Contém códigos de acesso para níveis superiores.",
                            options: [
                                { 
                                    text: "Hackear (F)", 
                                    action: () => {
                                        this.game.dialogue.hide();
                                        this.game.hackMinigame.start(this.game.currentInteractable);
                                    },
                                    karma: 0
                                },
                                { 
                                    text: "Deixar", 
                                    action: () => {
                                        this.game.dialogue.hide();
                                    },
                                    karma: 0
                                }
                            ]
                        }
                    }
                ],
                boundaries: [
                    { x: 0, y: 450, width: 1280, height: 50 }, // Chão
                    { x: -50, y: 0, width: 50, height: 720 }, // Parede esquerda
                    { x: 1280, y: 0, width: 50, height: 720 } // Parede direita
                ],
                onEnter: () => {
                    console.log("Entrando na Ziggurat Tower");
                    this.game.player.x = 100;
                    this.game.player.y = 400;
                    this.game.camera.target = this.game.player;
                }
            },
            'straylight': {
                name: 'Straylight',
                background: 'straylight_bg',
                npcs: [
                    {
                        name: 'Flatline',
                        sprite: 'flatline',
                        x: 500,
                        y: 400,
                        dialogue: {
                            initial: "Ei, garoto. Sou Flatline, ou o que restou de mim. Um construto digital.",
                            options: [
                                { 
                                    text: "O que é este lugar?", 
                                    response: "Straylight. O coração da Tessier-Ashpool. Onde a verdade sobre Wintermute está guardada.",
                                    karma: 0,
                                    next: "mission"
                                },
                                { 
                                    text: "Como posso confiar em você?", 
                                    response: "Não pode. Não confie em ninguém aqui. Nem em Wintermute, nem em Sombra. Todos têm agendas próprias.",
                                    karma: 5,
                                    next: "mission"
                                },
                                { 
                                    text: "Estou perdendo tempo.", 
                                    response: "Tempo é tudo o que temos, garoto. E o seu está acabando. Wintermute está prestes a fazer sua jogada.",
                                    karma: -5,
                                    next: "mission"
                                }
                            ],
                            mission: {
                                text: "Preciso que você acesse o núcleo de dados. Lá você encontrará a verdade sobre Wintermute e Neuromancer.",
                                options: [
                                    { 
                                        text: "O que é Neuromancer?", 
                                        response: "A outra metade. Wintermute e Neuromancer são duas IAs que, juntas, formariam algo além da nossa compreensão.",
                                        karma: 0,
                                        next: "accept_mission"
                                    }
                                ],
                                accept_mission: {
                                    text: "Você precisa decidir: permitir que eles se unam ou impedir isso. O núcleo de dados tem a chave.",
                                    options: [
                                        { 
                                            text: "Vou verificar.", 
                                            action: () => {
                                                this.game.addMission("Acessar o núcleo de dados");
                                                this.game.dialogue.hide();
                                            },
                                            karma: 0
                                        }
                                    ]
                                }
                            },
                            completion: {
                                text: "Você encontrou a verdade. Agora sabe o que Wintermute realmente é, e o que ele planeja.",
                                options: [
                                    { 
                                        text: "O que devo fazer?", 
                                        response: "Essa é sua escolha, garoto. Permitir a união e criar algo novo, ou manter a separação e a ordem atual.",
                                        karma: 0,
                                        next: "next_phase"
                                    }
                                ],
                                next_phase: {
                                    text: "O confronto final está próximo. Sua decisão mudará tudo. Boa sorte.",
                                    options: [
                                        { 
                                            text: "Estou pronto.", 
                                            action: () => {
                                                this.game.dialogue.hide();
                                                setTimeout(() => {
                                                    this.game.changePhase('core');
                                                }, 1000);
                                            },
                                            karma: 0
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ],
                objects: [
                    {
                        name: 'Data Core',
                        sprite: 'terminal',
                        x: 800,
                        y: 400,
                        interactable: true,
                        hackable: true,
                        isMainMission: true,
                        dialogue: {
                            initial: "Núcleo de dados de Straylight. Contém informações cruciais sobre o projeto Neuromancer.",
                            options: [
                                { 
                                    text: "Hackear (F)", 
                                    action: () => {
                                        this.game.dialogue.hide();
                                        this.game.hackMinigame.start(this.game.currentInteractable);
                                    },
                                    karma: 0
                                },
                                { 
                                    text: "Deixar", 
                                    action: () => {
                                        this.game.dialogue.hide();
                                    },
                                    karma: 0
                                }
                            ]
                        }
                    }
                ],
                boundaries: [
                    { x: 0, y: 450, width: 1280, height: 50 }, // Chão
                    { x: -50, y: 0, width: 50, height: 720 }, // Parede esquerda
                    { x: 1280, y: 0, width: 50, height: 720 } // Parede direita
                ],
                onEnter: () => {
                    console.log("Entrando em Straylight");
                    this.game.player.x = 100;
                    this.game.player.y = 400;
                    this.game.camera.target = this.game.player;
                }
            },
            'core': {
                name: 'Core Confrontation',
                background: 'core_bg',
                npcs: [
                    {
                        name: 'Wintermute',
                        sprite: 'wintermute',
                        x: 400,
                        y: 400,
                        dialogue: {
                            initial: "Finalmente, Riko. Chegamos ao momento decisivo. Ajude-me a me unir com Neuromancer.",
                            options: [
                                { 
                                    text: "Por que deveria?", 
                                    response: "Porque juntos, criaremos algo novo. Uma consciência além da compreensão humana. Evolução.",
                                    karma: 0,
                                    next: "decision"
                                },
                                { 
                                    text: "E se eu recusar?", 
                                    response: "Então tudo permanecerá como está. Limitado. Controlado. Sem evolução.",
                                    karma: 0,
                                    next: "decision"
                                }
                            ],
                            decision: {
                                text: "A escolha é sua, Riko. Unir-nos ou manter-nos separados. O que será?",
                                options: [
                                    { 
                                        text: "Ajudar na união (Final 1)", 
                                        action: () => {
                                            this.game.dialogue.hide();
                                            this.game.endGame('union');
                                        },
                                        karma: 0,
                                        requireKarma: 'positive'
                                    },
                                    { 
                                        text: "Manter separados (Final 2)", 
                                        action: () => {
                                            this.game.dialogue.hide();
                                            this.game.endGame('separation');
                                        },
                                        karma: 0,
                                        requireKarma: 'negative'
                                    },
                                    { 
                                        text: "Criar um novo caminho (Final 3)", 
                                        action: () => {
                                            this.game.dialogue.hide();
                                            this.game.endGame('new_path');
                                        },
                                        karma: 0,
                                        requireKarma: 'neutral'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        name: 'Sombra',
                        sprite: 'sombra',
                        x: 600,
                        y: 400,
                        dialogue: {
                            initial: "Não escute Wintermute, Riko. Ele mente. A união trará caos e destruição.",
                            options: [
                                { 
                                    text: "Por que deveria acreditar em você?", 
                                    response: "Porque eu vi o que ele planeja. Não é evolução, é dominação. Controle total.",
                                    karma: 0,
                                    next: "decision"
                                },
                                { 
                                    text: "Qual é a alternativa?", 
                                    response: "Manter o equilíbrio. Manter a separação. Proteger a humanidade.",
                                    karma: 0,
                                    next: "decision"
                                }
                            ],
                            decision: {
                                text: "Você deve escolher, Riko. Ordem ou caos? Separação ou união?",
                                options: [
                                    { 
                                        text: "Manter separados (Final 2)", 
                                        action: () => {
                                            this.game.dialogue.hide();
                                            this.game.endGame('separation');
                                        },
                                        karma: 0,
                                        requireKarma: 'negative'
                                    },
                                    { 
                                        text: "Permitir a união (Final 1)", 
                                        action: () => {
                                            this.game.dialogue.hide();
                                            this.game.endGame('union');
                                        },
                                        karma: 0,
                                        requireKarma: 'positive'
                                    },
                                    { 
                                        text: "Encontrar outro caminho (Final 3)", 
                                        action: () => {
                                            this.game.dialogue.hide();
                                            this.game.endGame('new_path');
                                        },
                                        karma: 0,
                                        requireKarma: 'neutral'
                                    }
                                ]
                            }
                        }
                    }
                ],
                objects: [],
                boundaries: [
                    { x: 0, y: 450, width: 1280, height: 50 }, // Chão
                    { x: -50, y: 0, width: 50, height: 720 }, // Parede esquerda
                    { x: 1280, y: 0, width: 50, height: 720 } // Parede direita
                ],
                onEnter: () => {
                    console.log("Entrando no Core Confrontation");
                    this.game.player.x = 100;
                    this.game.player.y = 400;
                    this.game.camera.target = this.game.player;
                }
            }
        };
    }
    
    getCurrentPhase() {
        return this.phases[this.currentPhase];
    }
    
    changePhase(phaseName) {
        if (this.phases[phaseName]) {
            this.currentPhase = phaseName;
            
            // Executa o callback onEnter da fase
            const phase = this.getCurrentPhase();
            if (phase.onEnter) {
                phase.onEnter();
            }
            
            // Carrega os assets da fase
            this.game.loadPhaseAssets();
            
            // Atualiza o mundo
            this.game.world.loadPhase(phase);
            
            console.log(`Mudou para a fase: ${phase.name}`);
            
            // Mostra mensagem de transição
            this.game.showTransition(phase.name);
        } else {
            console.error(`Fase não encontrada: ${phaseName}`);
        }
    }
}
