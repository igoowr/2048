
var tabuleiro;
var score = 0;
var linhas = 4;
var colunas = 4;

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
            tabuleiro[l][c] = 2;
            let peca = document.getElementById(l.toString() + "-" +c.toString());
            peca.innerText = "2";
            peca.classList.add("x2");
            found = true;
        }
    }
}

function atualizarPeca(peca, num) {
    peca.innerText = "";
    peca.classList.value = ""; //limpar a classList
    peca.classList.add("peca");
    if (num > 0) {
        peca.innerText = num;
        if (num <= 4096) {
            peca.classList.add("x" + num.toString());
        } else {
            peca.classList.add("x8192");
        }
    }
}

document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft") {
        moverEsquerda();
        adicionarDois();
    } else if (e.code == "ArrowRight"){
        moverDireita();
        adicionarDois();
    } else if (e. code == "ArrowUp"){
        moverCima();
        adicionarDois();
    } else if (e.code == "ArrowDown"){
        moverBaixo();
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
            atualizarPeca(peca, num);
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
            atualizarPeca(peca, num);
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
            atualizarPeca(peca, num);
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
            atualizarPeca(peca, num);
        }
        
    }
}