document.addEventListener('DOMContentLoaded', async function () {
    const usuario = VitaCareAPI.exigirLogin(['admin']);
    if (!usuario) return;

    const abertura = document.getElementById('abertura');
    const fechamento = document.getElementById('fechamento');
    const especialidades = document.getElementById('especialidadesLista');
    const convenios = document.getElementById('conveniosLista');
    const botao = document.querySelector('.parametros-grid .botao-contorno');

    try {
        const dados = await VitaCareAPI.fetch('/admin/parametros');
        const p = dados.parametros || {};
        if (abertura && p.horario_abertura) abertura.value = String(p.horario_abertura).slice(0, 5);
        if (fechamento && p.horario_fechamento) fechamento.value = String(p.horario_fechamento).slice(0, 5);
        if (especialidades && p.especialidades) especialidades.value = p.especialidades;
        if (convenios && p.convenios) convenios.value = p.convenios;
    } catch (erro) {
        console.warn(erro);
    }

    botao?.addEventListener('click', async function () {
        try {
            botao.disabled = true;
            await VitaCareAPI.fetch('/admin/parametros', {
                method: 'POST',
                body: {
                    horario_abertura: abertura?.value || '08:00',
                    horario_fechamento: fechamento?.value || '18:00',
                    especialidades: especialidades?.value || '',
                    convenios: convenios?.value || '',
                },
            });
            await VitaCareModal.mostrar({ mensagem: 'Parâmetros salvos com sucesso.', tipo: 'sucesso' });
        } catch (erro) {
            await VitaCareModal.mostrar({ mensagem: erro.dados?.error || erro.message, tipo: 'erro' });
        } finally {
            botao.disabled = false;
        }
    });
});
