document.addEventListener('DOMContentLoaded', async function () {
    if (!VitaCareAPI.exigirLogin(['funcionario', 'admin'])) return;

    const calendarioEl = document.getElementById('calendarioFuncionario');
    const detalheDia = document.getElementById('detalheDiaCalendario');
    const tituloDia = document.getElementById('tituloDiaCalendario');
    const botaoAtualizar = document.getElementById('botaoAtualizarCalendario');

    if (!calendarioEl || !detalheDia) return;

    let consultas = [];
    let calendario = null;

    function resumoConsultas(lista) {
        const porDia = {};
        lista.forEach(function (c) {
            if (!porDia[c.data]) porDia[c.data] = 0;
            porDia[c.data] += 1;
        });
        const resumo = {};
        Object.keys(porDia).forEach(function (data) {
            const n = porDia[data];
            if (n >= 8) resumo[data] = 'cheio';
            else if (n >= 3) resumo[data] = 'parcial';
            else resumo[data] = 'livre';
        });
        return resumo;
    }

    function renderizarDetalheDia(data) {
        const doDia = consultas.filter(function (c) { return c.data === data; })
            .sort(function (a, b) { return String(a.horario).localeCompare(String(b.horario)); });

        if (tituloDia) {
            tituloDia.innerHTML = '<i class="fas fa-calendar-day" aria-hidden="true"></i> ' +
                VitaCareAPI.formatarDataBR(data) + ' — ' + doDia.length + ' consulta(s)';
        }

        if (!doDia.length) {
            detalheDia.innerHTML = '<p class="agendamento-sem-vagas">Nenhuma consulta neste dia.</p>';
            return;
        }

        detalheDia.innerHTML = '<div class="tabela-envoltorio"><table class="tabela-dados"><thead><tr>' +
            '<th>Horário</th><th>Paciente</th><th>Médico</th><th>Status</th></tr></thead><tbody>' +
            doDia.map(function (c) {
                return '<tr>' +
                    '<td>' + VitaCareAPI.esc(c.horario) + '</td>' +
                    '<td>' + VitaCareAPI.esc(c.paciente) + '</td>' +
                    '<td>' + VitaCareAPI.esc(c.medico) + '</td>' +
                    '<td><span class="' + VitaCareAPI.classeEtiquetaStatus(c.status) + '">' + VitaCareAPI.esc(c.status) + '</span></td>' +
                    '</tr>';
            }).join('') + '</tbody></table></div>';
    }

    async function carregarConsultas() {
        detalheDia.innerHTML = '<p class="agendamento-sem-vagas">Carregando agenda...</p>';
        try {
            const dados = await VitaCareAPI.fetch('/consultas');
            consultas = (dados.consultas || []).filter(function (c) {
                return c.status !== 'cancelada';
            });
            if (calendario) calendario.atualizarResumo(resumoConsultas(consultas));
            const dia = calendario ? calendario.getDataSelecionada() : VitaCareCalendario.isoLocal(new Date());
            renderizarDetalheDia(dia);
        } catch (erro) {
            consultas = [];
            detalheDia.innerHTML = '<p class="agendamento-sem-vagas">' + VitaCareAPI.esc(erro.dados?.error || erro.message) + '</p>';
        }
    }

    calendario = VitaCareCalendario.montar(calendarioEl, {
        dataInicial: VitaCareCalendario.isoLocal(new Date()),
        permitirPassado: true,
        onSelecionarDia: renderizarDetalheDia,
        onMudarMes: function () {
            if (consultas.length) calendario.atualizarResumo(resumoConsultas(consultas));
        },
    });

    botaoAtualizar?.addEventListener('click', carregarConsultas);
    carregarConsultas();
});
