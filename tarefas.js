/**
 * Importa a função para exportar as tarefas para um arquivo JSON.
 * 
 * @module tarefasJSON
 * @function exportarTarefasParaJSON
 * @param {Array} tarefas - A lista de tarefas a serem exportadas.
 */
import {exportarTarefasParaJSON} from './tarefasJSON.js'

/**
 * Constantes para as ações do menu.
 * Cada constante representa uma ação que o usuário pode realizar no sistema de gerenciamento de tarefas.
 */

/**
 * @constant {string}
 * @default '1'
 * @description Adicionar uma nova tarefa.
 */
const ADICIONAR_TAREFA = '1';

/**
 * @constant {string}
 * @default '2'
 * @description Mostrar todas as tarefas.
 */
const MOSTRAR_TAREFAS = '2';

/**
 * @constant {string}
 * @default '3'
 * @description Editar uma tarefa existente.
 */
const EDITAR_TAREFA = '3';

/**
 * @constant {string}
 * @default '4'
 * @description Remover uma tarefa existente.
 */
const REMOVER_TAREFA = '4';

/**
 * @constant {string}
 * @default '5'
 * @description Marcar uma tarefa como concluída.
 */
const CONCLUIR_TAREFA = '5';

/**
 * @constant {string}
 * @default '6'
 * @description Buscar tarefas por prioridade.
 */
const BUSCAR_POR_PRIORIDADE = '6';

/**
 * @constant {string}
 * @default '7'
 * @description Contar tarefas que foram concluídas.
 */
const CONTAR_TAREFAS_CONCLUIDAS = '7';

/**
 * @constant {string}
 * @default '8'
 * @description Selecionar uma tarefa aleatória.
 */
const SELECIONAR_TAREFA_ALEATORIA = '8';

/**
 * @constant {string}
 * @default '9'
 * @description Adicionar uma descrição a uma tarefa.
 */
const ADICIONAR_DESCRICAO = '9';

/**
 * @constant {string}
 * @default '10'
 * @description Exibir a descrição de uma tarefa.
 */
const EXIBIR_DESCRICAO = '10';

/**
 * @constant {string}
 * @default '11'
 * @description Exportar tarefas para um arquivo JSON.
 */
const EXPORTAR_TAREFAS_JSON = '11';

/**
 * @constant {string}
 * @default '12'
 * @description Limpar o console ou a tela.
 */
const LIMPAR = '12';

/**
 * Classe que representa uma Tarefa.
 */
class Tarefa {
    /**
     * @constructor
     * @param {number} id - ID da tarefa.
     * @param {string} titulo - Título da tarefa.
     * @param {string} descricao - Descrição da tarefa.
     * @param {string} prioridade - Prioridade da tarefa (alta, média, baixa).
     */
    constructor(id, titulo, descricao, prioridade) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.prioridade = prioridade;
        this.status = 'pendente';
    }
}


/**
 * Classe que gerencia o sistema de tarefas (padrão Singleton).
 */
class GerenciadorDeTarefas {
    static instancia = null;
    constructor() {
        // Garantir que só exista uma instancia da classe (Singleton).
        if (GerenciadorDeTarefas.instancia) {
            return GerenciadorDeTarefas.instancia;
        }
        this.arrayDeTarefas = [];
        this.idTarefaAtual = 0;
        this.acoes = {
            [ADICIONAR_TAREFA]: () => this.adicionarTarefa(),
            [MOSTRAR_TAREFAS]: () => this.mostrarTarefas(),
            [EDITAR_TAREFA]: () => this.editarTarefa(parseInt(prompt("ID da tarefa:"))),
            [REMOVER_TAREFA]: () => this.removerTarefa(parseInt(prompt("Digite o ID da tarefa a ser removida:"))),
            [CONCLUIR_TAREFA]: () => this.concluirTarefa(parseInt(prompt("Digite o ID da tarefa a ser concluída:"))),
            [BUSCAR_POR_PRIORIDADE]: () => this.buscarPorPrioridade(prompt("Digite a prioridade (alta, média, baixa):")),
            [CONTAR_TAREFAS_CONCLUIDAS]: () => this.contarTarefasConcluidas(),
            [SELECIONAR_TAREFA_ALEATORIA]: () => this.selecionarTarefaAleatoria(),
            [ADICIONAR_DESCRICAO]: () => this.adicionarNotaATarefa(parseInt(prompt("Digite o ID da tarefa:"))),
            [EXIBIR_DESCRICAO]: () => this.exibirNotasDaTarefa(parseInt(prompt("Digite o ID da tarefa:"))),
            [EXPORTAR_TAREFAS_JSON]: () => exportarTarefasParaJSON(this.arrayDeTarefas),
            [LIMPAR]: () => this.limpando()
        };
        GerenciadorDeTarefas.instancia = this;
    }

    /**
     * Adiciona uma nova tarefa.
     */
    adicionarTarefa() {
        const [titulo, descricao, prioridade] = this.obterInformacoesTarefa();
        const novaTarefa = new Tarefa(this.idTarefaAtual++, titulo, descricao, prioridade);
        this.arrayDeTarefas.push(novaTarefa);
        this.exibirMensagem("Tarefa adicionada com sucesso.");
        this.mostrarTarefas();
    }

    /**
     * Solicita ao usuário as informações de uma tarefa.
     * @returns retorna as informações obtidas de uma determinada tarefa.
     */
    obterInformacoesTarefa() {
        let tituloRetorno = prompt("Título:");
        let descricaoRetorno = prompt("Descrição:");
        let prioridadeRetorno = prompt("Prioridade (alta/média/baixa):");

        if (tituloRetorno.length > 20) {
            tituloRetorno = tituloRetorno.slice(0, 20);
        }

        if (descricaoRetorno.length > 120) {
            descricaoRetorno = descricaoRetorno.slice(0, 120);
        }
        // Verificar se a prioridade é válida
        const prioridadeValida = prioridadeRetorno.toLowerCase() === "alta" ||
            prioridadeRetorno.toLowerCase() === "média" ||
            prioridadeRetorno.toLowerCase() === "media" ||
            prioridadeRetorno.toLowerCase() === "baixa";

        if (!prioridadeValida) {
            prioridadeRetorno = "Sem prioridade";
        }

        return [tituloRetorno, descricaoRetorno, prioridadeRetorno];
    }

    /**
     * Exibe as tarefas cadastradas.
     */
    mostrarTarefas() {
        const tarefasDiv = document.getElementById("tarefas");
        tarefasDiv.innerHTML = ""; // Limpa a área antes de mostrar novas tarefas

        if (this.arrayDeTarefas.length === 0) {
            const mensagemMostrada = document.createElement('h3');
            mensagemMostrada.textContent = "Não há tarefas cadastradas";
            tarefasDiv.appendChild(mensagemMostrada);
            return;
        }
        const listaDeTarefas = this.gerarListaDeTarefasHTML();
        tarefasDiv.appendChild(listaDeTarefas);
    }

    /**
     * Gera uma lista de tarefas em formato HTML, filtrada por prioridade (se fornecida).
     * 
     * @param {string|null} [prioridade=null] - A prioridade pela qual filtrar as tarefas (alta, média, baixa) ou null para todas.
     * @returns {HTMLUListElement} A lista de tarefas em formato HTML.
     */
    gerarListaDeTarefasHTML(prioridade = null) {
        const listaDeTarefas = document.createElement('ul');
        this.arrayDeTarefas.forEach(tarefa => {
            const tarefaItem = this.criarElementoTarefaHTML(tarefa);
            if (prioridade === null) {
                listaDeTarefas.appendChild(tarefaItem);
            } else if (tarefa.prioridade === prioridade) {
                listaDeTarefas.appendChild(tarefaItem);
            }
        });
        return listaDeTarefas;
    }

    /**
     * Cria um elemento HTML para exibir os detalhes de uma tarefa.
     * 
     * @param {Object} tarefa - O objeto tarefa contendo informações como id, título, status e prioridade.
     * @returns {HTMLLIElement} O elemento HTML para exibir a tarefa.
     */
    criarElementoTarefaHTML(tarefa) {
        const tarefaItem = document.createElement("li");
        tarefaItem.textContent = `ID[${tarefa.id}]: ${tarefa.titulo} (${tarefa.status}) | Prioridade -> ${tarefa.prioridade}`;
        return tarefaItem;
    }

    /**
     * Edita uma tarefa com base no seu ID. Permite alterar título, descrição e prioridade.
     * 
     * @param {number} id - O ID da tarefa a ser editada.
     */
    editarTarefa(id) {
        const tarefa = this.buscarTarefaPorId(id);
        if (tarefa) {
            tarefa.titulo = this.obterNovoValor("Novo título", tarefa.titulo);
            tarefa.descricao = this.obterNovoValor("Nova descrição", tarefa.descricao);
            tarefa.prioridade = this.obterNovoValor("Nova prioridade", tarefa.prioridade);
            this.exibirMensagem("Tarefa editada com sucesso.");
        } else {
            this.exibirMensagem("Tarefa não encontrada.");
        }
        this.mostrarTarefas();
    }

    /**
     * Obtém um novo valor para um campo específico da tarefa. Se o novo valor for vazio, mantém o valor antigo.
     * 
     * @param {string} pergunta - A pergunta a ser exibida ao usuário (ex: "Novo título").
     * @param {string} valorAntigo - O valor antigo do campo da tarefa.
     * @returns {string} O novo valor inserido pelo usuário ou o valor antigo se o novo valor for vazio.
     */
    obterNovoValor(pergunta, valorAntigo) {
        const novoValor = prompt(pergunta);
        return novoValor ? novoValor : valorAntigo;
    }

    /**
     * Remove uma tarefa com base no seu ID.
     * 
     * @param {number} id - O ID da tarefa a ser removida.
     */
    removerTarefa(id) {
        const index = this.arrayDeTarefas.findIndex(tarefa => tarefa.id === id);
        if (index === -1) {
            alert("Tarefa não encontrada.");
            return;
        }

        this.arrayDeTarefas.splice(index, 1);
        alert("Tarefa removida.");
        this.mostrarTarefas();
    }

    /**
     * Marca uma tarefa como concluída com base no seu ID.
     * 
     * @param {number} id - O ID da tarefa a ser concluída.
     */
    concluirTarefa(id) {
        const tarefa = this.buscarTarefaPorId(id);
        if (!tarefa) {
            alert("Tarefa não encontrada.");
            return;
        }

        tarefa.status = 'concluída';
        alert("Tarefa marcada como concluída.");
        this.mostrarTarefas();
    }

    /**
     * Busca uma tarefa no array de tarefas com base no ID fornecido.
     * 
     * @param {number} id - O ID da tarefa a ser buscada.
     * @returns {Object|null} A tarefa encontrada ou null se não for encontrada.
     */
    buscarTarefaPorId(id) {
        return this.arrayDeTarefas.find(tarefa => tarefa.id === id);
    }

    /**
     * Busca e exibe tarefas com base na prioridade fornecida.
     * 
     * @param {string} prioridade - A prioridade pela qual as tarefas serão filtradas (alta, média, baixa).
     */
    buscarPorPrioridade(prioridade) {
        const resultadoDiv = document.getElementById("tarefas");
        if (!this.validarCampoNaoVazio(prioridade)) {
            resultadoDiv.innerHTML = "<p>Nenhuma tarefa disponível.</p>";
            return;
        }
        resultadoDiv.innerHTML = ""; // Limpa a área de resultados antes de mostrar
        const listaTarefas = this.gerarListaDeTarefasHTML(prioridade);
        resultadoDiv.appendChild(listaTarefas);
    }

    /**
     * Conta e exibe o número de tarefas concluídas.
     */
    contarTarefasConcluidas() {
        const concluidas = this.arrayDeTarefas.filter(tarefa => tarefa.status === 'concluída').length;
        document.getElementById("tarefas").innerHTML = `<h3>Número de tarefas concluídas: ${concluidas}</h3>`;
    }

    /**
     * Seleciona e exibe uma tarefa aleatória da lista de tarefas.
     */
    selecionarTarefaAleatoria() {
        let resultadoDiv = document.getElementById("tarefas");
        if (this.arrayDeTarefas.length === 0) {
            resultadoDiv.innerHTML = "<p>Nenhuma tarefa disponível.</p>";
            return;
        }
        let index = Math.floor(Math.random() * this.arrayDeTarefas.length);
        resultadoDiv.innerHTML = "<h3>Tarefa aleatória: " + this.arrayDeTarefas[index].titulo +
            " - prioridade (" + this.arrayDeTarefas[index].prioridade + ")</h3>";
    }

    /**
     * Solicita ao usuário que escolha uma ação do menu.
     * 
     * @returns {string} O número da ação escolhida pelo usuário.
     */
    acaoDoMenu() {
        const acao = prompt("Digite o número correspondente à ação desejada (1-9):");
        return acao;
    }

    /**
     * Exibe o menu de sistema de tarefas e executa a ação escolhida pelo usuário.
     */
    menuSistemaDeTarefas() {
        const acaoEscolhida = this.acaoDoMenu();
        if (this.acoes[acaoEscolhida]) {
            this.acoes[acaoEscolhida]();

        } else {
            console.log("Ação inválida, tente novamente.");
        }
    }

    /**
     * Valida se o campo fornecido não está vazio ou nulo.
     * 
     * @param {string|null|undefined} elemento - O campo a ser validado.
     * @returns {string|null} O campo se válido, ou null se estiver vazio.
     */
    validarCampoNaoVazio(elemento) {
        if (elemento !== null && elemento !== undefined) {
            return elemento;
        } else {
            return null;
        }
    }

    /**
     * Exibe uma mensagem de alerta ao usuário.
     * 
     * @param {string} mensagem - A mensagem a ser exibida.
     */
    exibirMensagem(mensagem) {
        alert(mensagem);
    }

    /**
     * Adiciona uma nota à tarefa especificada.
     * @param {number} id - O ID da tarefa à qual adicionar a nota.
     */
    adicionarNotaATarefa(id) {
        const tarefa = this.buscarTarefaPorId(id);
        if (!tarefa) {
            this.exibirMensagem("Tarefa não encontrada.");
            return;
        }

        const nota = prompt("Digite a nota para esta tarefa:");
        tarefa.descricao = nota;
        this.exibirMensagem("Nota adicionada com sucesso.");
    }

    /**
     * Exibe todas as notas associadas a uma tarefa.
     * @param {number} id - O ID da tarefa cujas notas serão exibidas.
     */
    exibirNotasDaTarefa(id) {
        const tarefa = this.buscarTarefaPorId(id);
        if (!tarefa) {
            this.exibirMensagem("Tarefa não encontrada.");
            return;
        }

        if (!tarefa.descricao || tarefa.descricao.length === 0) {
            this.exibirMensagem("Nenhuma descrição para exibir.");
            return;
        }

        const notasDiv = document.getElementById("tarefas");
        notasDiv.innerHTML = `<h3>Notas para a tarefa ${tarefa.titulo}:</h3>`;
        const listaDeNotas = document.createElement('h5');
        listaDeNotas.innerHTML = tarefa.descricao;
        notasDiv.appendChild(listaDeNotas);
    }

    /**
     * Limpa as tarefas e reinicia o sistema.
     */
    limpando(){
        const tarefas = document.getElementById("tarefas");
        tarefas.innerHTML = '';
        alert('Campos de tarefas limpos')
    }

}

/**
 * Inicia o sistema de tarefas.
 */
document.getElementById("iniciarSistema").addEventListener("click", function () {
    const gerenciadorDeTarefas = new GerenciadorDeTarefas();
    gerenciadorDeTarefas.menuSistemaDeTarefas();
});