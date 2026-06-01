document.addEventListener('DOMContentLoaded', async function () {
    const usuario = VitaCareAPI.exigirLogin(['paciente']);
    if (!usuario) return;

    const corpoTabela = document.querySelector('table tbody');
    if (!corpoTabela) return;

    try {
        const dados = await VitaCareAPI.fetch('/historico/' + usuario.id);
        const consultas = dados.consultas || [];
        if (!consultas.length) {
            corpoTabela.innerHTML = '<tr><td colspan="5">Nenhuma consulta agendada ainda.</td></tr>';
            return;
        }
        corpoTabela.innerHTML = consultas.map(function (c) {
            const dataFmt = VitaCareAPI.formatarDataBR(c.data);
            const st = String(c.status || '');
            return '<tr><td>' + dataFmt + '</td><td>' + VitaCareAPI.esc(c.horario) + '</td><td>' + VitaCareAPI.esc(c.especialidade) + '</td><td>' + VitaCareAPI.esc(c.medico) + '</td><td><span class="' + VitaCareAPI.classeEtiquetaStatus(st) + '">' + VitaCareAPI.esc(st) + '</span></td></tr>';
        }).join('');
    } catch (erro) {
        corpoTabela.innerHTML = '<tr><td colspan="5">' + (erro.dados?.error || erro.message) + '</td></tr>';
    }
});
