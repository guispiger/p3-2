//SELECAO ITEMS HTML teste
const mensagemAplicacao = document.querySelector(".mensagem-aplicacao");
const formulario = document.querySelector(".formulario");
const item = document.getElementById("item");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".container-itens");
const listaItens = document.querySelector(".lista-itens");
const btnRemoverTodosItens = document.querySelector(".apagar-itens");

//opcoes editaveis
let elementoEditavel;
let flagEditavel = false;
let idItemEditado = "";

//EVENT LISTENERS GERAIS
//enviar fomulario
formulario.addEventListener("submit", addItem);
//formulario.addEventListener("submit", removerBotaoCancelar);
//apagar toda a lista
btnRemoverTodosItens.addEventListener("click", apagarTodosItens);
//btnRemoverTodosItens.addEventListener("click", removerBotaoCancelar);
//carregar armazenamento local na tela
window.addEventListener("DOMContentLoaded", carregarArmazenamentoLocal);

//FUNCOES
//adicionar itens
function addItem(e) {
    e.preventDefault();
    const valor = item.value;
    const id = new Date().getTime().toString();


    if (valor !== '' && !flagEditavel) {
        //SE NESSAS CONDICOES, CRIA NOVO ITEM NA LISTA

        criarItemLista(id, valor);

        //mostrar mensagem
        apresentarMensagem("Item adicionado a lista!", "success");

        //trocar visibilidade
        container.classList.remove("visually-hidden");

        //adicionar ao armazenamento local
        addAoAmazenamentoLocal(id, valor);

        //retornar ao padrao
        retornarAoPadrao();

    } else if (valor !== '' && flagEditavel) {
        //SE NESSAS CONDICOES, EDITA UM ITEM DA LISTA

        elementoEditavel.innerHTML = valor;
        apresentarMensagem("Item editado", "success");
        editarNoArmazenamentoLocal(idItemEditado, valor);
        retornarAoPadrao();
    } else {
        apresentarMensagem("Por favor adicione um item a lista!", "warning");
    }
};


//adicionar um item da lista ao html
function criarItemLista(id, valor) {
    const elemento = document.createElement("div");
    //adicionar classe
    elemento.classList.add("item-lista");
    elemento.classList.add("row");
    //elemento.classList.add("offset-1");
    elemento.classList.add("shadow");
    elemento.classList.add("mb-3");
    elemento.classList.add("mx-5");
    elemento.classList.add("border");
    elemento.classList.add("border-light");
    elemento.classList.add("rounded");
    //adicionar id
    const atributo = document.createAttribute("data-id");
    atributo.value = id;
    elemento.setAttributeNode(atributo);
    //criar novo elemento no html
    elemento.innerHTML = `
        <p class="titulo col-6 my-auto">${valor}</p>
            <div class="container-botoes col-4 row ms-auto">
                <button type="button" title="Editar item" class="botao-editar col btn btn-link text-dark">
                <i class="bi bi-pencil-square"></i>
                </button>
                <button type="button" title="Remover item" class="botao-remover col btn btn-link text-dark">
                    <i class="bi bi-trash"></i>
                </button>
            </div>`;

    //eventos botoes item
    const btnRemoverItem = elemento.querySelector(".botao-remover");
    const btnEditarItem = elemento.querySelector(".botao-editar");

    btnEditarItem.addEventListener("click", editarItem);
    btnRemoverItem.addEventListener("click", removerItem);
    
    // anexar filho
    listaItens.appendChild(elemento);
}

//apagar toda a lista
function apagarTodosItens() {
    const itens = document.querySelectorAll(".item-lista");

    if (itens.length > 0) {
        itens.forEach(element => { listaItens.removeChild(element); });
    }

    container.classList.add("visually-hidden");
    apresentarMensagem("Lista apagada!", "danger");
    retornarAoPadrao();

    localStorage.removeItem("lista");
};

//remover um item
function removerItem(e) {
    const elemento = e.currentTarget.parentElement.parentElement;
    const id = elemento.dataset.id;

    listaItens.removeChild(elemento);

    if (listaItens.children.length === 0) {
        container.classList.add("visually-hidden");
    }

    apresentarMensagem("Item removido!", "danger");
    retornarAoPadrao();
    removerDoArmazenamentoLocal(id);
};

//editar item
function editarItem(e) {
    //seleciona todo o bloco do item, seu titulo e botoes
    const elemento = e.currentTarget.parentElement.parentElement;

    //seleciona o titulo do item a ser editado
    elementoEditavel = e.currentTarget.parentElement.previousElementSibling;

    //define o valor do formulario para o titulo
    item.value = elementoEditavel.innerHTML;

    flagEditavel = true;
    idItemEditado = elemento.dataset.id;
    submitBtn.textContent = "Editar";

    //cria botao cancelar edição
    const controlesForm = formulario.querySelector(".formulario-controles");
    const botaoCancelar = controlesForm.querySelector(".cancelar-btn");
    botaoCancelar.classList.remove("visually-hidden");
    
    //evento ao clicar no botao cancelar
    botaoCancelar.addEventListener("click", retornarAoPadrao);
};

//remover botar cancelar edicao
function removerBotaoCancelar(){
    const controlesForm = formulario.querySelector(".formulario-controles");
    const botaoCancelar = controlesForm.querySelector(".cancelar-btn");
    botaoCancelar.classList.add("visually-hidden");
    //retornarAoPadrao();
}


//apresentar mensagem
function apresentarMensagem(texto, acao) {
    mensagemAplicacao.textContent = texto;
    mensagemAplicacao.classList.add(`bg-${acao}`);

    //remove mensagem da tela apos 2segundo
    setTimeout(function () {
        mensagemAplicacao.textContent = "";
        mensagemAplicacao.classList.remove(`bg-${acao}`);
    }, 2000)
};

//retornar ao padrao
function retornarAoPadrao() {
    item.value = "";
    flagEditavel = false;
    idEditavel = "";
    submitBtn.textContent = "Adicionar";
    removerBotaoCancelar();
};


///ARMAZENAMENTO LOCAL
function addAoAmazenamentoLocal(id, valor) {
    const itemArmazenar = { id: id, value: valor };
    let itens = getLocaStorage();

    itens.push(itemArmazenar);

    localStorage.setItem("lista", JSON.stringify(itens));

}

function removerDoArmazenamentoLocal(id) {
    let itens = getLocaStorage();

    itens = itens.filter(function (item) {
        if (item.id !== id) {
            return item;
        }
    });

    localStorage.setItem("lista", JSON.stringify(itens));
};

function editarNoArmazenamentoLocal(id, valor) {
    let itens = getLocaStorage();

    itens = itens.map(function (item) {
        if (item.id === id) {
            item.value = valor;
        }
        return item;
    })

    localStorage.setItem("lista", JSON.stringify(itens));
};

function getLocaStorage() {
    let itens;
    if (localStorage.getItem("lista")) {
        itens = JSON.parse(localStorage.getItem("lista"));
    } else {
        itens = [];
    }
    return itens;
};

function carregarArmazenamentoLocal() {
    let itens = getLocaStorage();

    if (itens.length > 0) {
        itens.forEach(function (item) {
            criarItemLista(item.id, item.value);
        });
        container.classList.remove("visually-hidden");
    }
}