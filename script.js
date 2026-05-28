window.addEventListener('DOMContentLoaded', () => {
    const lista = document.getElementById('lista');
    
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
        botao.style.border = '1px solid #ccc';
        botao.style.borderRadius = '4px';
        botao.style.background = index === 0 ? '#007bff' : '#f9f9f9'; 
        botao.style.color = index === 0 ? 'white' : 'black';

        botao.onclick = () => filtrarTarefas(opcao.tipo, botao);
        filtroContainer.appendChild(botao);
    });

    lista.parentNode.insertBefore(filtroContainer, lista);
    lista.dataset.filtroAtual = 'todas';

    carregarTarefasSalvas();
});

function obterTarefasDoStorage() {
    const dados = localStorage.getItem('tarefas');
    return JSON.parse(dados || '[]');
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
            novoItem.style.textDecoration = 'line-through';
            novoItem.style.opacity = '0.6';
        }

        novoItem.onclick = function() { marcarConcluida(this); };
        lista.appendChild(novoItem);
    });
}

function adicionarTarefa() {
    const input = document.getElementById('novaTarefa');
    const textoTarefa = input.value.trim();
    const loading = document.getElementById('loading');

    if (textoTarefa !== "") {
        if (loading) loading.style.display = "flex";

        setTimeout(function() {
            const lista = document.getElementById('lista');
            const novoItem = document.createElement('li');
            
            novoItem.textContent = textoTarefa;
            novoItem.onclick = function() { marcarConcluida(this); };

            lista.appendChild(novoItem);
            
            const tarefasAtuais = obterTarefasDoStorage();
            tarefasAtuais.push({ texto: textoTarefa, concluida: false });
            localStorage.setItem('tarefas', JSON.stringify(tarefasAtuais));

            input.value = "";

            if (loading) loading.style.display = "none";

            const filtroAtual = lista.dataset.filtroAtual || 'todas';
            const primeiroBotao = document.querySelector(`.btn-filtro`);
            if (primeiroBotao) primeiroBotao.click();
            
        }, 1000);

    } else {
        alert("Por favor, digite alguma tarefa!");
    }
}

function marcarConcluida(elemento) {
    elemento.classList.toggle('concluida');
    
    let estaConcluida = false;

    if (elemento.classList.contains('concluida')) {
        elemento.style.textDecoration = 'line-through';
        elemento.style.opacity = '0.6';
        estaConcluida = true;
    } else {
        elemento.style.textDecoration = 'none';
        elemento.style.opacity = '1';
    }

    const tarefasAtuais = obterTarefasDoStorage();
    const textoElemento = elemento.textContent;
    
    const tarefaModificada = tarefasAtuais.find(t => t.texto === textoElemento);
    if (tarefaModificada) {
        tarefaModificada.concluida = estaConcluida;
        localStorage.setItem('tarefas', JSON.stringify(tarefasAtuais));
    }

    const lista = document.getElementById('lista');
    const botoes = document.querySelectorAll('.btn-filtro');
    const botaoAtivo = Array.from(botoes).find(b => b.style.background === 'rgb(0, 123, 255)' || b.style.background === '#007bff');
    
    if (lista.dataset.filtroAtual !== 'todas') {
        filtrarTarefas(lista.dataset.filtroAtual, botaoAtivo);
    }
}

function filtrarTarefas(tipo, botaoClicado) {
    const tarefas = document.querySelectorAll('#lista li');
    const botoes = document.querySelectorAll('.btn-filtro');
    const lista = document.getElementById('lista');

    lista.dataset.filtroAtual = tipo;

    botoes.forEach(b => {
        b.style.background = '#f9f9f9';
        b.style.color = 'black';
    });
    if (botaoClicado) {
        botaoClicado.style.background = '#007bff';
        botaoClicado.style.color = 'white';
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