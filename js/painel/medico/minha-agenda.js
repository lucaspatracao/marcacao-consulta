document.addEventListener('DOMContentLoaded', async function () {
    const usuario = window.__vitacareUsuario || VitaCareAPI.obterUsuario();
    if (!usuario || !usuario.id) return;

    const corpo = document.querySelector('#corpoAgenda') || document.querySelector('table tbody');
    const nomeEl = document.querySelector('[data-vitacare-medico-nome]');
    if (!corpo) return;

    corpo.innerHTML = '<tr><td colspan="4">Carregando agenda...</td></tr>';

    try {
        const perfil = await VitaCareMedico.obterMedicoLogado(usuario.id);
        const medico = perfil.medico;
        const nomeExibir = medico.nome || usuario.nome;
        if (nomeEl) nomeEl.textContent = nomeExibir;

        const dados = await VitaCareAPI.fetch('/consultas?medico_id=' + medico.id);
        const lista = (dados.consultas || []).filter(function (c) {
            return c.status !== 'cancelada';
        });

        if (!lista.length) {
            corpo.innerHTML = '<tr><td colspan="4">Nenhuma consulta na sua agenda.</td></tr>';
            return;
        }

        corpo.innerHTML = lista.map(function (c) {
            return '<tr>' +
                '<td>' + VitaCareAPI.formatarDataBR(c.data) + '</td>' +
                '<td>' + VitaCareAPI.esc(c.horario) + '</td>' +
                '<td>' + VitaCareAPI.esc(c.paciente) + '</td>' +
                '<td>' + VitaCareAPI.esc(c.convenio || '—') + '</td>' +
                '</tr>';
        }).join('');
    } catch (erro) {
        if (nomeEl) nomeEl.textContent = usuario.nome || 'Médico';
        corpo.innerHTML = '<tr><td colspan="4">' + VitaCareAPI.esc(erro.dados?.error || erro.message) +
            '. Faça Deploy no Node-RED (http://127.0.0.1:1880/admin) e entre com ana.beatriz@vitacare.local</td></tr>';
    }
});
