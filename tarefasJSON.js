/**
 * Exporta a lista de tarefas para um arquivo .JSON.
 * 
 * @function
 * @param {Array} arrayDeTarefas - a lista de tarefas a ser exportada
 * @returns {void}
 */
export function exportarTarefasParaJSON(arrayDeTarefas) {
    const jsonData = JSON.stringify(arrayDeTarefas);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'tarefas.json';
    a.click();

    URL.revokeObjectURL(url);
    alert("Lista de tarefas exportada para tarefas.json.");
};
