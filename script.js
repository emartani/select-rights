document.addEventListener('DOMContentLoaded', () => {
    const animalGrid = document.getElementById('animal-grid');
    const instructions = document.getElementById('instructions');
    const checkAnswersBtn = document.getElementById('check-answers');
    const feedback = document.getElementById('feedback');
    const nextLevelBtn = document.getElementById('next-level');
    const restartGameBtn = document.getElementById('restart-game');
    const scoreDisplay = document.getElementById('score');

    // Elementos de áudio
    const correctSound = document.getElementById('correct-sound');
    const wrongSound = document.getElementById('wrong-sound');
    const levelCompleteSound = document.getElementById('level-complete-sound');
    const gameCompleteSound = document.getElementById('game-complete-sound');

    // Sua lista atual de animais
    const animals = [
        // Direitos
        { name: 'PROTECTION (proteção)', type: 'rights', image: 'images/1.png' },
        { name: 'LIVE, STUDY, PLAY (viver, estudar, brincar)', type: 'rights', image: 'images/2.png' },
        { name: 'EDUCATION (educação)', type: 'rights', image: 'images/3.png' },
        { name: 'HEALTH CARE (cuidados com saúde)', type: 'rights', image: 'images/4.png' },
        { name: 'BE HEARD (ser escutado)', type: 'rights', image: 'images/5.png' },
        { name: 'HEALTHY FOOD (comida saudável)', type: 'rights', image: 'images/6.png' },
        // Responsabilidades
        { name: 'NOT BULLY OR FIGHT (não brigar nem fazer bullying)', type: 'responsibilities', image: 'images/7.png' },
        { name: 'CLEAN PLACES (manter lugares limpos)', type: 'responsibilities', image: 'images/8.png' },
        { name: 'LEARN AND RESPECT TEACHERS (aprender e respeitar os professores)', type: 'responsibilities', image: 'images/9.png' },
        { name: 'RESPECT OPINIONS (respeitar opiniões das pessoas)', type: 'responsibilities', image: 'images/10.png' },
        { name: 'NOT WASTE FOOD (não desperdiçar comida)', type: 'responsibilities', image: 'images/11.png' },
        { name: 'INCLUSION (incluir todos nos jogos)', type: 'responsibilities', image: 'images/12.png' },
        { name: 'TAKE CARE OF MYSELF (me cuidar bem)', type: 'responsibilities', image: 'images/13.png' }
    ];

    let currentLevel = 1; // 1 para vertebrados, 2 para invertebrados
    let score = 0;
    let selectedAnimalsData = []; // Para armazenar os objetos dos animais selecionados

    // Função para embaralhar um array (Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Função para exibir os animais no grid
    function displayAnimals(level) {
        animalGrid.innerHTML = ''; // Limpa o grid
        selectedAnimalsData = []; // Reseta as seleções
        feedback.textContent = ''; // Limpa o feedback
        checkAnswersBtn.style.display = 'block';
        nextLevelBtn.style.display = 'none';
        restartGameBtn.style.display = 'none';

        let animalsToDisplay = [];
        const allrightss = animals.filter(animal => animal.type === 'rights');
        const allresponsibilitiess = animals.filter(animal => animal.type === 'responsibilities');
        
        // Embaralha as listas completas de vertebrados e invertebrados
        shuffleArray(allrightss);
        shuffleArray(allresponsibilitiess);

        // Definimos que queremos exibir 8 animais no total para preencher 2 linhas de 4
        const numrightssToShow = 4; 
        const numresponsibilitiessToShow = 4; 

        if (level === 1) {
            // Nível 1: Selecionar Vertebrados
            // Pega 4 vertebrados e 4 invertebrados (ou o máximo disponível se não houver 4)
            animalsToDisplay = [
                ...allrightss.slice(0, Math.min(allrightss.length, numrightssToShow)), 
                ...allresponsibilitiess.slice(0, Math.min(allresponsibilitiess.length, numresponsibilitiessToShow))
            ];
            instructions.textContent = 'Clique nos seus direitos - ** RIGHTS **!';
        } else if (level === 2) {
            // Nível 2: Selecionar Invertebrados
            // Pega 4 invertebrados e 4 vertebrados (ou o máximo disponível se não houver 4)
            animalsToDisplay = [
                ...allresponsibilitiess.slice(0, Math.min(allresponsibilitiess.length, numresponsibilitiessToShow)), 
                ...allrightss.slice(0, Math.min(allrightss.length, numrightssToShow))
            ];
            instructions.textContent = 'Agora clique nas suas responsabilidades - ** RESPONSIBILITIES **!';
        }

        shuffleArray(animalsToDisplay); // Embaralha a seleção final para randomizar a ordem no grid

        animalsToDisplay.forEach(animal => {
            const animalCard = document.createElement('div');
            animalCard.classList.add('animal-card');
            animalCard.dataset.type = animal.type; 
            animalCard.dataset.name = animal.name; 

            const displayName = animal.name.charAt(0) + animal.name.slice(1).toLowerCase();

            animalCard.innerHTML = `
                <img src="${animal.image}" alt="${animal.name}">
                <p>${displayName}</p>
            `;

            animalCard.addEventListener('click', () => {
                animalCard.classList.toggle('selected');
                if (animalCard.classList.contains('selected')) {
                    selectedAnimalsData.push(animal);
                } else {
                    selectedAnimalsData = selectedAnimalsData.filter(a => a.name !== animal.name);
                }
            });
            animalGrid.appendChild(animalCard);
        });
    }

    // Função para verificar as respostas
    checkAnswersBtn.addEventListener('click', () => {
        let allCorrectForLevel = true;
        let correctSelections = 0;
        let totalRequiredSelections = 0;

        const animalCards = document.querySelectorAll('.animal-card');
        
        // Desabilita cliques nos cards durante a verificação
        animalCards.forEach(card => card.style.pointerEvents = 'none');
        checkAnswersBtn.style.display = 'none'; // Esconde o botão de verificar

        animalCards.forEach(card => {
            const isSelected = card.classList.contains('selected');
            const animalType = card.dataset.type;
            
            // Remove classes de feedback de tentativas anteriores
            card.classList.remove('correct-answer', 'wrong-answer', 'wrong-selected', 'not-selected-correct');

            if (currentLevel === 1) { // Nível 1: Selecionar vertebrados
                if (animalType === 'rights') {
                    totalRequiredSelections++;
                    if (isSelected) {
                        correctSelections++;
                        card.classList.add('correct-answer');
                    } else {
                        allCorrectForLevel = false;
                        card.classList.add('not-selected-correct'); // Vertebrado que deveria ter sido selecionado
                    }
                } else { // Invertebrado
                    if (isSelected) { // Invertebrado selecionado indevidamente
                        allCorrectForLevel = false;
                        card.classList.add('wrong-selected');
                    }
                    // Se invertebrado e não selecionado, está correto para este nível
                }
            } else if (currentLevel === 2) { // Nível 2: Selecionar invertebrados
                if (animalType === 'responsibilities') {
                    totalRequiredSelections++;
                    if (isSelected) {
                        correctSelections++;
                        card.classList.add('correct-answer');
                    } else {
                        allCorrectForLevel = false;
                        card.classList.add('not-selected-correct'); // Invertebrado que deveria ter sido selecionado
                    }
                } else { // Vertebrado
                    if (isSelected) { // Vertebrado selecionado indevidamente
                        allCorrectForLevel = false;
                        card.classList.add('wrong-selected');
                    }
                    // Se vertebrado e não selecionado, está correto para este nível
                }
            }
        });

        // Contagem final de acertos para a pontuação
        const currentLevelCorrectAnimals = Array.from(animalCards).filter(card => {
            const animalType = card.dataset.type;
            return (currentLevel === 1 && animalType === 'rights') || 
                   (currentLevel === 2 && animalType === 'responsibilities');
        });
        
        // Verifica se a quantidade de corretos selecionados é igual ao total que deveria ser selecionado
        // E se nenhum animal incorreto foi selecionado
        const selectedIncorrectly = Array.from(animalCards).some(card => {
            const isSelected = card.classList.contains('selected');
            const animalType = card.dataset.type;
            return (currentLevel === 1 && animalType === 'responsibilities' && isSelected) ||
                   (currentLevel === 2 && animalType === 'rights' && isSelected);
        });

        if (allCorrectForLevel && selectedIncorrectly === false && correctSelections === totalRequiredSelections) {
            feedback.textContent = 'Parabéns! Você acertou todos!';
            feedback.classList.remove('wrong');
            feedback.classList.add('correct');
            correctSound.play(); // Toca som de acerto

            score += 10; // Adiciona pontos por acerto completo no nível
            scoreDisplay.textContent = score;

            if (currentLevel < 2) { // Se ainda não é o último nível
                nextLevelBtn.style.display = 'block';
                levelCompleteSound.play(); // Toca som de nível completo
            } else {
                feedback.textContent += ' Você completou o jogo!';
                gameCompleteSound.play(); // Toca som de jogo completo
                restartGameBtn.style.display = 'block'; // Mostra botão de reiniciar jogo
            }
        } else {
            feedback.textContent = 'Ops! Tente novamente. Veja as marcações.';
            feedback.classList.remove('correct');
            feedback.classList.add('wrong');
            wrongSound.play(); // Toca som de erro
            
            // Reabilita cliques e limpa seleções para nova tentativa
            animalCards.forEach(card => {
                card.style.pointerEvents = 'auto'; // Reabilita cliques
                if (!card.classList.contains('correct-answer')) { // Se não foi um acerto, limpa a seleção
                    card.classList.remove('selected');
                }
                // Garante que as bordas voltem ao normal para a próxima tentativa se não estiverem corretas
                if (!card.classList.contains('correct-answer')) {
                    card.classList.remove('correct-answer', 'wrong-answer', 'wrong-selected', 'not-selected-correct');
                }
            });
            checkAnswersBtn.style.display = 'block'; // Volta o botão de verificar
        }
    });

    // Evento para passar para o próximo nível
    nextLevelBtn.addEventListener('click', () => {
        currentLevel++;
        displayAnimals(currentLevel);
    });

    // Evento para reiniciar o jogo
    restartGameBtn.addEventListener('click', () => {
        currentLevel = 1;
        score = 0;
        scoreDisplay.textContent = score;
        displayAnimals(currentLevel);
    });

    // Iniciar o jogo no nível 1 ao carregar a página
    displayAnimals(currentLevel);
});