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
    } else {
        alert("Por favor, digite alguma tarefa!");
    }
}

function marcarConcluida(elemento) {
    elemento.classList.toggle('concluida');
}