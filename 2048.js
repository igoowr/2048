//sons

const somSlide = new Audio("sons/swish.mp3");
const somMerge = new Audio("sons/pop.mp3");

somSlide.volume = 0.06;
somMerge.volume = 0.1;

// --- SISTEMA DE SOM (Web Audio API) ---
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let somPopBuffer = null;
let somSlideBuffer = null;

async function carregarSons() {
    somPopBuffer = await carregarBuffer("sons/pop.mp3");
    somSlideBuffer = await carregarBuffer("sons/swish.mp3");
}

function carregarBuffer(url) {
    return fetch(url)
        .then(res => res.arrayBuffer())
        .then(buf => audioCtx.decodeAudioData(buf));
}

function tocarSom(buffer, detune = 0, volume = 1) {
    if (!somAtivo) return;
    if (!buffer) return;

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.detune.value = detune;

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = volume;

    source.connect(gainNode).connect(audioCtx.destination);
    source.start(0);
}

const ANIMACAO_MS = 160;
const TAMANHO_PECA = 117;

var tabuleiro;
var score = 0;
var linhas = 4;
var colunas = 4;
var historico = [];
var historicoScore = [];
let bloqueado = false;

var gameOver = false;

window.onload = function() {
    carregarSons().then(() => {
        iniciarJogo();
    });
}

function iniciarJogo() {
    gameOver = false;
    score = 0;
    historico = [];
    historicoScore = [];
    
    tabuleiro = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
    
    // tabuleiro = [
    //     [2, 2, 2, 2],
    //     [2, 2, 2, 2],
    //     [4, 4, 8, 8],
    //     [4, 4, 8, 8]
    // ]
    
    const boardEl = document.getElementById("tabuleiro");
    boardEl.innerHTML = ""; // LIMPAR POSSIVEIS PEÇAS ANTIGAS

    for (let l = 0; l < linhas; l++) {
        for (let c = 0; c < colunas; c++) {
            //<div></div>
            let peca = document.createElement("div");
            peca.id = l.toString() + "-" + c.toString();

            atualizarPeca(peca, 0);
            boardEl.appendChild(peca);
        }
    }

    adicionarDois();
    adicionarDois();
    document.getElementById("score").innerText = score;
}

function temPecaVazia(){
    for (let l = 0; l < linhas; l++){
        for (let c = 0; c < colunas; c++){
            if (tabuleiro[l][c] == 0){
                return true;
            }
        }
    }
    return false;
}

function temMovimentoPossivel(){
    for (let l = 0; l < linhas; l++){
        for (let c = 0; c < colunas; c++){
            if (tabuleiro[l][c] == 0) return true;
            if (c < colunas - 1 && tabuleiro[l][c] === tabuleiro[l][c+1]) return true;
            if (l < linhas - 1 && tabuleiro[l][c] === tabuleiro[l+1][c]) return true;
        }
    }
    return false;
}

function mostrarGameOver() {
    gameOver = true;

    document.getElementById("gameOverScore").innerText = "Pontuação Final: " + score; // MOSTRAR SCORE NA BOX

    document.getElementById("gameOverModal").style.display = "flex"; 
}

function adicionarDois(){
    if (!temPecaVazia()){
        if (!temMovimentoPossivel()){
            mostrarGameOver();
        }
        return;
    }

    let found = false;
    while (!found){
        //coordenada [l][c] aleatória
        let l = Math.floor(Math.random() * linhas); // 0-1 * 4 -> 0-4
        let c = Math.floor(Math.random() * colunas);
    
        if (tabuleiro[l][c] == 0){
            // 90% chance de gerar 2, 10% chance de gerar 4
            let valor = Math.random() < 0.9 ? 2 : 4;
            tabuleiro[l][c] = valor;
            
            let peca = document.getElementById(l.toString() + "-" + c.toString());
            atualizarPeca(peca, valor);

            peca.classList.add("peca-spawn-pop");
            setTimeout(() => {
                peca.classList.remove("peca-spawn-pop");
            }, 200);
            
            found = true;
        }
    }
}

function atualizarPeca(peca, num, animarMerge = false){
    let textoAnterior = peca.innerText;

    peca.innerText = "";
    peca.className = ""; // limpar a classList
    peca.classList.add("peca");
    peca.style.fontSize = "48px";

    if (num > 0) {
        peca.innerText = num;
        if (num <= 4096) {
            peca.classList.add("x" + num.toString());
        } else {
            peca.classList.add("x8192");
        }

        if (num < 100) {
            peca.style.fontSize = "48px";
        } else if (num < 1000) {
            peca.style.fontSize = "40px";
        } else {
            peca.style.fontSize = "35px";
        }

    } else {
        // peça vazia: garantir estilo padrão
        peca.style.fontSize = "48px";
    }
}

function animarMovimento(lOrig, cOrig, lDest, cDest) {
    const board = document.getElementById("tabuleiro");
    const src = document.getElementById(lOrig + "-" + cOrig);
    const dest = document.getElementById(lDest + "-" + cDest);

    if (!src || !src.innerText || src.innerText.trim() === "") return;

    if (getComputedStyle(board).position === "static") {
        board.style.position = "relative";
    }

    const startX = src.offsetLeft;
    const startY = src.offsetTop;
    const endX = dest ? dest.offsetLeft : startX;
    const endY = dest ? dest.offsetTop : startY;

    // criar clone
    const clone = src.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.left = startX + "px";
    clone.style.top  = startY + "px";
    clone.style.width = src.offsetWidth + "px";
    clone.style.height = src.offsetHeight + "px";
    clone.style.margin = "0";
    clone.style.zIndex = "1000";
    clone.style.pointerEvents = "none";
    clone.style.transition = `transform ${ANIMACAO_MS}ms ease-out`;
    clone.style.transform = "translate(0, 0)";

    board.appendChild(clone);

    // esconder a peça original enquanto o clone anima
    src.style.opacity = "0";

    // forçar reflow para garantir transição
    clone.getBoundingClientRect();

    // iniciar animação no próximo frame
    requestAnimationFrame(() => {
        clone.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;
    });

    // após animação, remover clone e mostrar peça real
    setTimeout(() => {
        if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
        src.style.opacity = "1";
    }, ANIMACAO_MS + 20);
}

document.addEventListener("keyup", (e) => {
    if (gameOver || bloqueado) return; // jogo acabou = nao fazer mais movimentos

    bloqueado = true;

    // SALVAR GRID ANTES DE QUALQUER MOVIMENTO
    let gridAnterior = copiarGrid(tabuleiro);

    historico.push(copiarGrid(tabuleiro));
    historicoScore.push(score);

    let movimentoValido = false;

    if (e.code == "ArrowLeft") {
        movimentoValido = moverEsquerda();
    } else if (e.code == "ArrowRight"){
        movimentoValido = moverDireita();
    } else if (e.code == "ArrowUp"){
        movimentoValido = moverCima();
    } else if (e.code == "ArrowDown"){
        movimentoValido = moverBaixo();
    } else {
        historico.pop();
        historicoScore.pop();
        return;
    }

    if (!movimentoValido) {
        historico.pop();
        historicoScore.pop();
        bloqueado = false;
        return;
    }

    somSlide.currentTime = 0;
    somSlide.playbackRate = 0.85 + Math.random() * 0.30;
    somSlide.play();

    setTimeout(() => {
        adicionarDois();

        setTimeout(() => {
            bloqueado = false;
        }, 220);

        document.getElementById("score").innerText = score;

        if (!temPecaVazia() && !temMovimentoPossivel()){
            mostrarGameOver();
        }
    }, ANIMACAO_MS);
});

function pegarDetuneMerge(valor) {
    if (valor < 8) return 800;   // bem agudo
    if (valor < 32) return 400;
    if (valor < 128) return 0;   // neutro
    if (valor < 512) return -300;
    return -600;                 // grave
}


function filtrarZeros(linha) {
    return linha.filter(num => num != 0); // cria nova array sem 0s
}

function mover(linha) {
    let items = [];
    for (let i = 0; i < linha.length; i++) {
        if (linha[i] !== 0) items.push({ value: linha[i], index: i });
    }

    let resultSlots = [];
    let i = 0;
    while (i < items.length) {
        if (i + 1 < items.length && items[i].value === items[i + 1].value) {
            
            tocarSom(
                somPopBuffer,
                pegarDetuneMerge(items[i].value),
                0.2
            );

            // merge
            let mergedValue = items[i].value * 2;
            resultSlots.push({ value: mergedValue, sources: [items[i].index, items[i + 1].index] });
            score += mergedValue; // só adicionar score quando houver merge
            i += 2;

        } else {
            // apenas mover
            resultSlots.push({ value: items[i].value, sources: [items[i].index] });
            i += 1;
        }
    }

    let linhaFinal = [];
    let movimentos = [];
    for (let k = 0; k < resultSlots.length; k++) {
        linhaFinal.push(resultSlots[k].value);
        resultSlots[k].sources.forEach(srcIndex => {
            movimentos.push({ de: srcIndex, para: k });
        });
    }

    // completar com zeros
    while (linhaFinal.length < colunas) linhaFinal.push(0);

    return { linha: linhaFinal, movimentos };
}

function moverEsquerda() {
    let houveMovimento = false;

    for (let l = 0; l < linhas; l++) {
        let linhaOriginal = tabuleiro[l].slice();
        let { linha, movimentos } = mover(linhaOriginal);

        if (JSON.stringify(linhaOriginal) !== JSON.stringify(linha)) {
            houveMovimento = true;
        }

        movimentos.forEach(m => {
            animarMovimento(l, m.de, l, m.para);
        });

        // atualizar DOM só depois da animação
        setTimeout(() => {
            tabuleiro[l] = linha;
            for (let c = 0; c < colunas; c++) {
                atualizarPeca(document.getElementById(l + "-" + c), linha[c], true);
            }
        }, ANIMACAO_MS);
    }

    return houveMovimento;
}

function moverDireita() {
    let houveMovimento = false;

    for (let l = 0; l < linhas; l++) {
        let linhaOriginal = tabuleiro[l].slice();
        let entrada = linhaOriginal.slice().reverse();
        let { linha, movimentos } = mover(entrada);

        linha.reverse();

        if (JSON.stringify(linhaOriginal) !== JSON.stringify(linha)) {
            houveMovimento = true;
        }

        movimentos.forEach(m => {
            animarMovimento(l, 3 - m.de, l, 3 - m.para);
        });

        setTimeout(() => {
            tabuleiro[l] = linha;
            for (let c = 0; c < colunas; c++) {
                atualizarPeca(document.getElementById(l + "-" + c), linha[c], true);
            }
        }, ANIMACAO_MS);
    }

    return houveMovimento;
}

function moverCima() {
    let houveMovimento = false;

    for (let c = 0; c < colunas; c++) {
        let colunaOriginal = [
            tabuleiro[0][c],
            tabuleiro[1][c],
            tabuleiro[2][c],
            tabuleiro[3][c]
        ];

        let { linha, movimentos } = mover(colunaOriginal);

        if (JSON.stringify(colunaOriginal) !== JSON.stringify(linha)) {
            houveMovimento = true;
        }

        movimentos.forEach(m => {
            animarMovimento(m.de, c, m.para, c);
        });

        setTimeout(() => {
            for (let l = 0; l < linhas; l++) {
                tabuleiro[l][c] = linha[l];
                atualizarPeca(document.getElementById(l + "-" + c), linha[l], true);
            }
        }, ANIMACAO_MS);
    }

    return houveMovimento;
}

function moverBaixo() {
    let houveMovimento = false;

    for (let c = 0; c < colunas; c++) {
        let colunaOriginal = [
            tabuleiro[0][c],
            tabuleiro[1][c],
            tabuleiro[2][c],
            tabuleiro[3][c]
        ];
        let entrada = colunaOriginal.slice().reverse();
        let { linha, movimentos } = mover(entrada);

        linha.reverse();

        if (JSON.stringify(colunaOriginal) !== JSON.stringify(linha)) {
            houveMovimento = true;
        }

        movimentos.forEach(m => {
            animarMovimento(3 - m.de, c, 3 - m.para, c);
        });

        setTimeout(() => {
            for (let l = 0; l < linhas; l++) {
                tabuleiro[l][c] = linha[l];
                atualizarPeca(document.getElementById(l + "-" + c), linha[l], true);
            }
        }, ANIMACAO_MS);
    }

    return houveMovimento;
}

function validarMovimento(gridAnterior, gridAtual){
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            if (gridAnterior[i][j] !== gridAtual[i][j]){
                return true; //houve mudança = movimento válido
            }
        }
    }
    return false; //não houve mudança = movimento inválido
}

function copiarGrid(grid){
    let novoGrid = [];
    for (let i = 0; i < 4; i++){
        novoGrid[i] = grid[i].slice();
    }
    return novoGrid;
}

document.addEventListener('DOMContentLoaded', function() {
    const toggleTema = document.getElementById('toggleTema');
    const body = document.body;

    // Ler preferência salva
    const temaSalvo = localStorage.getItem('tema2048');
    if (temaSalvo === 'dark') {
        body.setAttribute('data-tema', 'dark');
    } else {
        body.removeAttribute('data-tema');
    }

    toggleTema.addEventListener('click', function() {
        if (body.getAttribute('data-tema') === 'dark') {
            body.removeAttribute('data-tema');
            localStorage.setItem('tema2048', 'claro');
        } else {
            body.setAttribute('data-tema', 'dark');
            localStorage.setItem('tema2048', 'dark');
        }
    });
});

function refazerMovimento() {
    if (historico.length === 0) {
        return; // nada pra refazer
    }

    // pegar o último estado salvo
    tabuleiro = historico.pop();
    score = historicoScore.pop();

    // atualizar a tela
    for (let l = 0; l < linhas; l++) {
        for (let c = 0; c < colunas; c++) {
            let peca = document.getElementById(l.toString() + "-" + c.toString());
            atualizarPeca(peca, tabuleiro[l][c]);
        }
    }

    document.getElementById("score").innerText = score;
}

document.getElementById("btnNovoJogo").addEventListener("click", () => {
    document.getElementById("gameOverModal").style.display = "none";
    iniciarJogo();
});

// botões
const botaoSom = document.getElementById("botaoSom");
const iconeSom = document.getElementById("iconeSom");

    let somAtivo = true;

    botaoSom.addEventListener("click", () => {
        somAtivo = !somAtivo;

        somSlide.muted = !somAtivo;
        somMerge.muted = !somAtivo;
        document.querySelectorAll("audio").forEach(a => a.muted = !somAtivo);

        if (somAtivo) audioCtx.resume();
        else audioCtx.suspend();

        iconeSom.classList.toggle("som-desligado", !somAtivo);
});

document.getElementById("redoBtn").addEventListener("click", refazerMovimento);
document.getElementById("resetBtn").addEventListener("click", () => {
    iniciarJogo();
});

