document.addEventListener('DOMContentLoaded', async function () {
    const usuario = window.__vitacareUsuario || VitaCareAPI.obterUsuario();
    if (!usuario || !usuario.id) return;

    const corpo = document.querySelector('#corpoHistorico') || document.querySelector('table tbody');
    if (!corpo) return;

    corpo.innerHTML = '<tr><td colspan="3">Carregando histórico...</td></tr>';

    try {
        const perfil = await VitaCareMedico.obterMedicoLogado(usuario.id);
        const dados = await VitaCareAPI.fetch('/consultas?medico_id=' + perfil.medico.id + '&status=realizada');
        const lista = dados.consultas || [];
        if (!lista.length) {
            corpo.innerHTML = '<tr><td colspan="3">Nenhum atendimento registrado como realizado.</td></tr>';
            return;
        }
        corpo.innerHTML = lista.map(function (c) {
            return '<tr>' +
                '<td>' + VitaCareAPI.esc(c.paciente) + '</td>' +
                '<td>' + VitaCareAPI.formatarDataBR(c.data) + '</td>' +
                '<td>' + VitaCareAPI.esc(c.especialidade) + ' — ' + VitaCareAPI.esc(c.status) + '</td>' +
                '</tr>';
        }).join('');
    } catch (erro) {
        corpo.innerHTML = '<tr><td colspan="3">' + VitaCareAPI.esc(erro.dados?.error || erro.message) + '</td></tr>';
    }
});
