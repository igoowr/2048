
var tabuleiro;
var score = 0;
var linhas = 4;
var colunas = 4;
var historico = [];
var historicoScore = [];


window.onload = function() {
    iniciarJogo();
}

function iniciarJogo() {
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
    
    for (let l = 0; l < linhas; l++) {
        for (let c = 0; c < colunas; c++) {
            //<div></div>
            let peca = document.createElement("div");
            peca.id = l.toString() + "-" + c.toString();
            let num = tabuleiro[l][c];
            atualizarPeca(peca, num);
            document.getElementById("tabuleiro").appendChild(peca);
        }
    }

    adicionarDois();
    adicionarDois();
}

function temPecaVazia(){
    for (let l = 0; l < linhas; l++){
        for (let c = 0; c < colunas; c++){
            if (tabuleiro[l][c] == 0){
                return true;
            }
        }
    }
}

function adicionarDois(){
    if (!temPecaVazia()){
        alert("GAME OVER")
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
            
            let peca = document.getElementById(l.toString() + "-" +c.toString());
            peca.innerText = valor;
            peca.classList.add("x" + valor);

            peca.classList.add("nova");
            setTimeout(() => {
                peca.classList.remove("nova");
            }, 500);
            
            found = true;
        }
    }
}

function atualizarPeca(peca, num, animarMerge = false){
    let textoAnterior = peca.innerText;
    
    peca.innerText = "";
    peca.classList.value = ""; //limpar a classList
    peca.classList.add("peca");

    if (num > 0) {
        peca.innerText = num;
        if (num <= 4096) { // definir cor da peça
            peca.classList.add("x" + num.toString());
        } else {
            peca.classList.add("x8192");
        }

        // ajustar tamanho da fonte
        if (num < 100) {
            peca.style.fontSize = "48px";
        } else if (num < 1000) {
            peca.style.fontSize = "40px";
        } else {
            peca.style.fontSize = "35px";
        }

        //ANIMAÇÃO MERGE
        if (animarMerge && num > parseInt(textoAnterior || 0)) {
            peca.classList.add("merge");
            setTimeout(() => {
                peca.classList.remove("merge");
            }, 200);
        }   else {
            peca.style.fontSize = "42px"; // se a peça estiver vazia, volta ao tamanho padrao
        }        
    }
}

document.addEventListener("keyup", (e) => {
    //SALVAR GRID ANTES DE QUALQUER MOVIMENTO
    let gridAnterior = copiarGrid(tabuleiro);

    historico.push(copiarGrid(tabuleiro));
    historicoScore.push(score);

    if (e.code == "ArrowLeft") {
        moverEsquerda();
    } else if (e.code == "ArrowRight"){
        moverDireita();
    } else if (e.code == "ArrowUp"){
        moverCima();
    } else if (e.code == "ArrowDown"){
        moverBaixo();
    } else {
        return;
    }

    //COMPARAR O GRID ANTES E DEPOIS DO MOVIMENTO E ADICIONAR O 2
    if (validarMovimento(gridAnterior, tabuleiro)){
        adicionarDois();
    }

    document.getElementById("score").innerText = score;
})

function filtrarZeros(linha) {
    return linha.filter(num => num != 0); // cria nova array sem 0s
}

function mover(linha){
    linha = filtrarZeros(linha);  // se livra dos 0s => [2,0,2,2] -> [2,2,2]


    //slide
    for (let i = 0; i < linha.length; i++){
        // checar todo "2"
        if (linha[i] == linha [i+1]){ 
            linha[i] *= 2;
            linha[i+1] = 0;
            score += linha[i];
        } // [2, 2, 2] -> [4, 0, 2]
    }

    linha = filtrarZeros(linha); // [4, 2]

    // adicionar zeros nas posições restantes
    while (linha.length < colunas) {
        linha.push(0);
    } //[4, 2, 0, 0]

    return linha;
}

function moverEsquerda() {
    for (let l = 0; l < linhas; l++) {
        let linha = tabuleiro[l];
        linha = mover(linha);
        tabuleiro[l] = linha;

        for (let c = 0; c < colunas; c++){
            let peca = document.getElementById(l.toString() + "-" + c.toString());
            let num = tabuleiro[l][c];
            atualizarPeca(peca, num, true);
        }
    }
}

function moverDireita() {
    for (let l = 0; l < linhas; l++) {
        let linha = tabuleiro[l];
        linha.reverse();
        linha = mover(linha);
        linha.reverse();
        tabuleiro[l] = linha;

        for (let c = 0; c < colunas; c++){
            let peca = document.getElementById(l.toString() + "-" + c.toString());
            let num = tabuleiro[l][c];
            atualizarPeca(peca, num, true);
        }
    }
}

function moverCima() {
    for (let c = 0; c < colunas; c++){
        let linha = [tabuleiro[0][c], tabuleiro [1][c], tabuleiro [2][c], tabuleiro[3][c]];
        linha = mover(linha);
        // tabuleiro[0][c] = linha [0];
        // tabuleiro[1][c] = linha [1];
        // tabuleiro[2][c] = linha [2];
        // tabuleiro[3][c] = linha [3];
        for (let l = 0; l < linhas; l++){
            tabuleiro[l][c] = linha[l];
            let peca = document.getElementById(l.toString() + "-" + c.toString());
            let num = tabuleiro[l][c];
            atualizarPeca(peca, num, true);
        }
        
    }
}

function moverBaixo() {
    for (let c = 0; c < colunas; c++){
        let linha = [tabuleiro[0][c], tabuleiro [1][c], tabuleiro [2][c], tabuleiro[3][c]];
        linha.reverse();
        linha = mover(linha);
        linha.reverse();
        // tabuleiro[0][c] = linha [0];
        // tabuleiro[1][c] = linha [1];
        // tabuleiro[2][c] = linha [2];
        // tabuleiro[3][c] = linha [3];
        for (let l = 0; l < linhas; l++){
            tabuleiro[l][c] = linha[l];
            let peca = document.getElementById(l.toString() + "-" + c.toString());
            let num = tabuleiro[l][c];
            atualizarPeca(peca, num, true);
        }
        
    }
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

function copiarGrid(grid){ // copia o grid (necessária pra fazer a comparação e validar o movimento)
    let novoGrid = [];
    for (let i = 0; i < 4; i++){
        novoGrid[i] = grid[i].slice(); //copia cada linha
    }
    return novoGrid;
}

// toggle do tema
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
document.getElementById("redoBtn").addEventListener("click", refazerMovimento);

