document.addEventListener('DOMContentLoaded', async function () {
    if (!VitaCareAPI.exigirLogin(['funcionario', 'admin'])) return;

    const corpo = document.querySelector('#corpoPacientes') || document.querySelector('table tbody');
    if (!corpo) return;

    corpo.innerHTML = '<tr><td colspan="4">Carregando pacientes...</td></tr>';

    try {
        const [pacientesDados, consultasDados] = await Promise.all([
            VitaCareAPI.fetch('/pacientes'),
            VitaCareAPI.fetch('/consultas'),
        ]);
        const pacientes = pacientesDados.pacientes || [];
        const consultas = consultasDados.consultas || [];

        if (!pacientes.length) {
            corpo.innerHTML = '<tr><td colspan="4">Nenhum paciente cadastrado.</td></tr>';
            return;
        }

        corpo.innerHTML = pacientes.map(function (p) {
            const doPaciente = consultas.filter(function (c) { return c.paciente_id === p.id; });
            const ultima = doPaciente.length
                ? doPaciente.sort(function (a, b) { return String(b.data).localeCompare(String(a.data)); })[0]
                : null;
            return '<tr>' +
                '<td>' + VitaCareAPI.esc(p.nome_completo) + '</td>' +
                '<td>' + VitaCareAPI.esc(p.telefone || '—') + '</td>' +
                '<td>' + (ultima ? VitaCareAPI.formatarDataBR(ultima.data) + ' ' + VitaCareAPI.esc(ultima.horario) : '—') + '</td>' +
                '<td>' + VitaCareAPI.esc(p.email || '') + '</td>' +
                '</tr>';
        }).join('');
    } catch (erro) {
        corpo.innerHTML = '<tr><td colspan="4">' + VitaCareAPI.esc(erro.dados?.error || erro.message) + '</td></tr>';
    }
});
