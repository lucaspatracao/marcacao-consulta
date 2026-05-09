// =========================================
// Parâmetros – carrega e salva via Node‑RED
// =========================================
document.addEventListener('DOMContentLoaded', async () => {
    const btnSalvar = document.querySelector('.painel-bloco .botao-contorno');
    const inputs = {
        abertura: document.getElementById('abertura'),
        fechamento: document.getElementById('fechamento'),
        especialidades: document.getElementById('lista-especialidades'),
        convenios: document.getElementById('lista-convenios')
    };

    // Carregar parâmetros atuais
    const resp = await apiRequisicao('/api/admin/parametros');
    if (resp.parametros) {
        inputs.abertura.value = resp.parametros.horario_abertura || '08:00';
        inputs.fechamento.value = resp.parametros.horario_fechamento || '18:00';
        inputs.especialidades.value = resp.parametros.especialidades || '';
        inputs.convenios.value = resp.parametros.convenios || '';
    }

    btnSalvar.addEventListener('click', async () => {
        const dados = {
            horario_abertura: inputs.abertura.value,
            horario_fechamento: inputs.fechamento.value,
            especialidades: inputs.especialidades.value,
            convenios: inputs.convenios.value
        };
        const resultado = await apiRequisicao('/api/admin/parametros', 'POST', dados);
        alert(resultado.erro || 'Parâmetros salvos com sucesso!');
    });
});