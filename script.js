// Aguarda a página carregar para criar os botões de filtro via JS
window.addEventListener('DOMContentLoaded', () => {
    const lista = document.getElementById('lista');
    
    // Cria o container dos botões
    const filtroContainer = document.createElement('div');
    filtroContainer.style.margin = '15px 0';
    filtroContainer.style.display = 'flex';
    filtroContainer.style.gap = '10px';

    // Configuração dos botões (Nome e Tipo)
    const opcoes = [
        { nome: 'Todas', tipo: 'todas' },
        { nome: 'Pendentes', tipo: 'pendentes' },
        { nome: 'Concluídas', tipo: 'concluidas' }
    ];

    // Cria e adiciona cada botão na tela
    opcoes.forEach((opcao, index) => {
        const botao = document.createElement('button');
        botao.textContent = opcao.nome;
        botao.className = 'btn-filtro';
        
        // Estilo básico dos botões via JS
        botao.style.padding = '6px 12px';
        botao.style.cursor = 'pointer';
        botao.style.border = '1px solid #ccc';
        botao.style.borderRadius = '4px';
        botao.style.background = index === 0 ? '#007bff' : '#f9f9f9'; // 'Todas' começa ativo
        botao.style.color = index === 0 ? 'white' : 'black';

        botao.onclick = () => filtrarTarefas(opcao.tipo, botao);
        filtroContainer.appendChild(botao);
    });

    // Insere os botões logo acima da lista de tarefas
    lista.parentNode.insertBefore(filtroContainer, lista);
    lista.dataset.filtroAtual = 'todas';
});

// Sua função original modificada para limpar o input e resetar o filtro
function adicionarTarefa() {
    const input = document.getElementById('novaTarefa');
    const textoTarefa = input.value.trim();

    if (textoTarefa !== "") {
        const lista = document.getElementById('lista');
        const novoItem = document.createElement('li');
        
        novoItem.textContent = textoTarefa;
        novoItem.onclick = function() { marcarConcluida(this); };

        lista.appendChild(novoItem);
        input.value = "";

        // Força a atualização do filtro atual para incluir a nova tarefa se necessário
        const filtroAtual = lista.dataset.filtroAtual || 'todas';
        document.querySelector(`.btn-filtro`).click(); // Reseta para 'Todas' ao adicionar
    } else {
        alert("Por favor, digite alguma tarefa!");
    }
}

// Sua função original modificada para aplicar o estilo visual e atualizar o filtro
function marcarConcluida(elemento) {
    elemento.classList.toggle('concluida');
    
    // Aplica o risco visual diretamente via JS caso não queira mexer no CSS
    if (elemento.classList.contains('concluida')) {
        elemento.style.textDecoration = 'line-through';
        elemento.style.opacity = '0.6';
    } else {
        elemento.style.textDecoration = 'none';
        elemento.style.opacity = '1';
    }

    // Atualiza a visualização caso esteja nos filtros 'Pendentes' ou 'Concluídas'
    const lista = document.getElementById('lista');
    const botoes = document.querySelectorAll('.btn-filtro');
    const botaoAtivo = Array.from(botoes).find(b => b.style.background === 'rgb(0, 123, 255)' || b.style.background === '#007bff');
    
    if (lista.dataset.filtroAtual !== 'todas') {
        filtrarTarefas(lista.dataset.filtroAtual, botaoAtivo);
    }
}

// Nova função de gerenciamento do filtro
function filtrarTarefas(tipo, botaoClicado) {
    const tarefas = document.querySelectorAll('#lista li');
    const botoes = document.querySelectorAll('.btn-filtro');
    const lista = document.getElementById('lista');

    lista.dataset.filtroAtual = tipo;

    // Alterna o estilo visual de ativo/inativo dos botões
    botoes.forEach(b => {
        b.style.background = '#f9f9f9';
        b.style.color = 'black';
    });
    if (botaoClicado) {
        botaoClicado.style.background = '#007bff';
        botaoClicado.style.color = 'white';
    }

    // Esconde ou mostra as tarefas baseado no filtro escolhido
    tarefas.forEach(tarefa => {
        const estaConcluida = tarefa.classList.contains('concluida');

        switch (tipo) {
            case 'todas':
                tarefa.style.display = 'block';
                break;
            case 'pendentes':
                tarefa.style.display = estaConcluida ? 'none' : 'block';
                break;
            case 'concluidas':
                tarefa.style.display = estaConcluida ? 'block' : 'none';
                break;
        }
    });
}