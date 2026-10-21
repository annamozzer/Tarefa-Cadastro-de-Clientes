// Funções utilitárias
const obterElemento = (id) => document.getElementById(id);
const limparCampos = () => {
    nome.value = "";
    email.value = "";
};

// Variáveis principais
const listaClientes = obterElemento("clientesCadastrados");
const nome = obterElemento("nome");
const email = obterElemento("email");
const formulario = document.querySelector("form");

// API do CrudCrud
const API_URL = "https://crudcrud.com/api/4dd28ebee59f40059aaf234eeca80c66/cadastro";

// Faz uma requisição GET para a API externa para buscar a lista de clientes ao carregar a página
fetch(API_URL)
    .then(response => {
        if (!response.ok) {
            console.error(`Erro: ${response.status}`);
        }
        return response.json();
    })
    .then((clientes) => {
        clientes.forEach((cliente) => {
            criarItem(cliente);
        });
    })
    .catch((error) => {
        console.error("Erro ao buscar clientes: ", error);
        alert("Não foi possível carregar clientes.");
    });

// Cria um item na lista de clientes com as informações de cadastro
function criarItem(cliente) {
    const item = document.createElement("li");
    item.innerHTML = `${cliente.nome}<br>${cliente.email} <button type="button" data-id="${cliente._id}">X</button>`;

    // Seleciona o botão "Excluir" e adiciona um ouvinte de evento, que ao ser clicado, exlui o cliente da lista
    const botaoExcluir = item.querySelector("button");
    botaoExcluir.addEventListener("click", () => {
        excluirItem(cliente._id, item);
    });
    // Adiciona o cliente à lista
    listaClientes.appendChild(item);
}

// Faz uma requisição POST para a API externa para cadastrar um novo cliente ao enviar o formulário
formulario.addEventListener("submit", (event) => {
    // Previne o recarregamento da página ao enviar o formulário
    event.preventDefault();

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nome.value,
            email: email.value
        })
    })
        .then(response => {
            if (!response.ok) {
                console.error(`Erro: ${response.status}`);
            }
            return response.json();
        })
        .then((cliente) => {
            criarItem(cliente);
            limparCampos();
        })
        .catch((error) => {
            console.error("Erro ao cadastrar cliente: ", error);
            alert("Não foi possível cadastrar cliente.");
        });
});

// Exclui um cliente cadastrado 
function excluirItem(id, item) {
    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                item.remove();
            } else {
                alert("Não foi possível excluir o cliente.");
            }
        })
        .catch((error) => {
            console.error("Erro ao excluir cliente: ", error);
        });
}
