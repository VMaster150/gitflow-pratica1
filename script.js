// Aguarda a página carregar para configurar filtros, temas e carregar dados
window.addEventListener('DOMContentLoaded', () => {
    const lista = document.getElementById('lista');
    
    // --- LÓGICA DO FILTRO ---
    const filtroContainer = document.createElement('div');
    filtroContainer.style.margin = '15px 0';
    filtroContainer.style.display = 'flex';
    filtroContainer.style.gap = '10px';

    const opcoes = [
        { nome: 'Todas', tipo: 'todas' },
        { nome: 'Pendentes', tipo: 'pendentes' },
        { nome: 'Concluídas', tipo: 'concluidas' }
    ];

    opcoes.forEach((opcao, index) => {
        const botao = document.createElement('button');
        botao.textContent = opcao.nome;
        botao.className = 'btn-filtro';
        botao.style.padding = '6px 12px';
        botao.style.cursor = 'pointer';
        botao.style.border = '1px solid var(--borda)';
        botao.style.borderRadius = '4px';
        
        // Estilo inicial: "Todas" começa ativo refletindo as variáveis CSS
        botao.style.background = index === 0 ? 'var(--cor-destaque)' : 'var(--fundo-item)'; 
        botao.style.color = index === 0 ? 'var(--texto-destaque)' : 'var(--texto-principal)';

        botao.onclick = () => filtrarTarefas(opcao.tipo, botao);
        filtroContainer.appendChild(botao);
    });

    lista.parentNode.insertBefore(filtroContainer, lista);
    lista.dataset.filtroAtual = 'todas';

    // --- LÓGICA DO TEMA (LIGHT/DARK) ---
    const botaoTema = document.getElementById('botao-tema');
    const temaSalvo = localStorage.getItem('tema');

    if (temaSalvo === 'dark') {
        document.body.classList.add('dark-mode');
    }

    botaoTema.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('tema', 'dark');
        } else {
            localStorage.setItem('tema', 'light');
        }
        // Recarrega os filtros rápidos para ajustar as cores dos botões ao trocar de tema
        const botaoAtivo = document.querySelector('.btn-filtro');
        if (botaoAtivo) resetarCoresBotoesFiltro();
    });

    // Carrega as tarefas salvas do LocalStorage
    carregarTarefasSalvas();
});

// Funções auxiliares do LocalStorage
function obterTarefasDoStorage() {
    return JSON.parse(localStorage.getItem('tarefas') || '[]');
}

function carregarTarefasSalvas() {
    const lista = document.getElementById('lista');
    lista.innerHTML = ""; 

    const tarefas = obterTarefasDoStorage();

    tarefas.forEach(tarefa => {
        const novoItem = document.createElement('li');
        novoItem.textContent = tarefa.texto;
        
        if (tarefa.concluida) {
            novoItem.classList.add('concluida');
        }

        novoItem.onclick = function() { marcarConcluida(this); };
        lista.appendChild(novoItem);
    });
}

// Adicionar Tarefa com Loading de 1 segundo (conforme seu código anterior)
function adicionarTarefa() {
    const input = document.getElementById('novaTarefa');
    const textoTarefa = input.value.trim();
    const loading = document.getElementById('loading');

    if (textoTarefa !== "") {
        if (loading) loading.style.display = "flex";

        setTimeout(function() {
            const lista = document.getElementById('lista');
            
            // Salva no LocalStorage primeiro
            const tarefasAtuais = obterTarefasDoStorage();
            tarefasAtuais.push({ texto: textoTarefa, concluida: false });
            localStorage.setItem('tarefas', JSON.stringify(tarefasAtuais));

            // Atualiza a tela
            carregarTarefasSalvas();

            input.value = "";
            if (loading) loading.style.display = "none";

            // Reseta visualização para exibir 'Todas'
            const primeiroBotao = document.querySelector(`.btn-filtro`);
            if (primeiroBotao) filtrarTarefas('todas', primeiroBotao);
            
        }, 1000);

    } else {
        alert("Por favor, digite alguma tarefa!");
    }
}

// Marcar Concluída
function marcarConcluida(elemento) {
    elemento.classList.toggle('concluida');
    const estaConcluida = elemento.classList.contains('concluida');

    const tarefasAtuais = obterTarefasDoStorage();
    const tarefaModificada = tarefasAtuais.find(t => t.texto === elemento.textContent);
    
    if (tarefaModificada) {
        tarefaModificada.concluida = estaConcluida;
        localStorage.setItem('tarefas', JSON.stringify(tarefasAtuais));
    }

    const lista = document.getElementById('lista');
    if (lista.dataset.filtroAtual !== 'todas') {
        const botoes = document.querySelectorAll('.btn-filtro');
        // Re-aplica o filtro ativo no momento
        const botaoAtivo = Array.from(botoes).find(b => b.style.background === 'var(--cor-destaque)');
        filtrarTarefas(lista.dataset.filtroAtual, botaoAtivo);
    }
}

// Auxiliar para limpar cores inline dos filtros
function resetarCoresBotoesFiltro() {
    const botoes = document.querySelectorAll('.btn-filtro');
    const lista = document.getElementById('lista');
    botoes.forEach(b => {
        b.style.background = 'var(--fundo-item)';
        b.style.color = 'var(--texto-principal)';
    });
}

// Filtrar Tarefas
function filtrarTarefas(tipo, botaoClicado) {
    const tarefas = document.querySelectorAll('#lista li');
    const lista = document.getElementById('lista');

    lista.dataset.filtroAtual = tipo;
    resetarCoresBotoesFiltro();

    if (botaoClicado) {
        botaoClicado.style.background = 'var(--cor-destaque)';
        botaoClicado.style.color = 'var(--texto-destaque)';
    }

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