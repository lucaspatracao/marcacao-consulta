document.addEventListener('DOMContentLoaded', function () {
    const usuario = VitaCareAPI.exigirLogin(['paciente']);
    if (!usuario) return;

    const voltarPainel = document.getElementById('voltarPainelPaciente');
    if (voltarPainel && usuario.tipo === 'paciente') {
        voltarPainel.hidden = false;
        voltarPainel.href = VitaCareAPI.REDIRECIONAMENTO.paciente;
    }

    const botaoBuscar = document.getElementById('botaoBuscarHorarios');
    const areaHorarios = document.getElementById('areaHorarios');
    const tituloDia = document.getElementById('tituloDiaSelecionado');
    const calendarioEl = document.getElementById('calendarioAgenda');
    const avisoGeral = document.getElementById('agendaAvisoGeral');
    const campoEsp = document.getElementById('campoEspecialidade');
    const campoMedico = document.getElementById('campoMedico');
    const modal = document.getElementById('modalConfirmacao');
    const botaoConfirmar = document.getElementById('botaoModalConfirmar');
    const botaoCancelar = document.getElementById('botaoModalCancelar');

    let horarioSelecionado = null;
    let todosHorarios = [];
    let medicosCadastrados = [];
    let calendario = null;
    let carregando = false;

    function diasNoMes(ano, mesIndice) {
        return new Date(ano, mesIndice + 1, 0).getDate();
    }

    function primeiroDiaMes(ano, mesIndice) {
        return ano + '-' + String(mesIndice + 1).padStart(2, '0') + '-01';
    }

    const AVISO_SEM_MEDICOS = 'Nenhum medico cadastrado.';

    function normalizarAvisoAgenda(texto) {
        if (!texto) return '';
        if (/nenhum\s+m[eé]dico\s+cadastrado/i.test(String(texto))) return AVISO_SEM_MEDICOS;
        return texto;
    }

    function mostrarAvisoGeral(texto, erro) {
        if (!avisoGeral) return;
        const mensagem = normalizarAvisoAgenda(texto);
        if (!mensagem) {
            avisoGeral.hidden = true;
            avisoGeral.textContent = '';
            return;
        }
        avisoGeral.hidden = false;
        avisoGeral.textContent = mensagem;
        avisoGeral.className = 'agendamento-aviso' + (erro ? ' agendamento-aviso--erro' : '');
    }

    async function carregarMedicosSelect() {
        if (!campoMedico) return;
        try {
            const dados = await VitaCareAPI.fetch('/medicos');
            medicosCadastrados = dados.medicos || [];
            campoMedico.innerHTML = '<option value="">Qualquer profissional</option>';
            medicosCadastrados.forEach(function (m) {
                const opt = document.createElement('option');
                opt.value = String(m.id);
                opt.textContent = m.nome + ' (' + m.especialidade + ')';
                campoMedico.appendChild(opt);
            });
            if (!medicosCadastrados.length) {
                mostrarAvisoGeral(AVISO_SEM_MEDICOS, true);
            } else {
                mostrarAvisoGeral('');
            }
        } catch (e) {
            medicosCadastrados = [];
            mostrarAvisoGeral('Não foi possível carregar a lista de médicos. Verifique o Node-RED e o MySQL.', true);
        }
    }

    function formatarDataBR(iso) {
        if (!iso) return '';
        const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (m) return m[3] + '/' + m[2] + '/' + m[1];
        return String(iso);
    }

    function mostrarMsg(texto, erro) {
        if (!areaHorarios) return;
        areaHorarios.innerHTML = '<p class="agendamento-sem-vagas">' + VitaCareAPI.esc(texto) + '</p>';
        if (erro) {
            const p = areaHorarios.querySelector('p');
            if (p) p.style.color = '#b91c1c';
        }
    }

    function resumoDosHorarios(lista) {
        const porDia = {};
        lista.forEach(function (h) {
            if (!porDia[h.data]) porDia[h.data] = { livres: 0, total: 0 };
            porDia[h.data].total += 1;
            if (h.disponivel !== false) porDia[h.data].livres += 1;
        });
        const resumo = {};
        Object.keys(porDia).forEach(function (data) {
            const d = porDia[data];
            if (d.livres === 0) resumo[data] = 'cheio';
            else if (d.livres <= 4) resumo[data] = 'parcial';
            else resumo[data] = 'livre';
        });
        return resumo;
    }

    function renderizarHorariosDoDia(data) {
        if (!areaHorarios) return;
        if (!medicosCadastrados.length) {
            mostrarMsg(AVISO_SEM_MEDICOS);
            return;
        }
        const lista = todosHorarios.filter(function (h) { return h.data === data; });
        if (tituloDia) {
            tituloDia.innerHTML = '<i class="fas fa-clock" aria-hidden="true"></i> Horários em <strong>' + formatarDataBR(data) + '</strong>';
        }
        if (!lista.length) {
            mostrarMsg('Nenhum horário neste dia. Escolha outro dia ou altere especialidade/médico.');
            return;
        }
        const livres = lista.filter(function (h) { return h.disponivel !== false; });
        if (!livres.length) {
            mostrarMsg('Todos os horários deste dia estão reservados. Escolha outro dia no calendário.');
            return;
        }

        areaHorarios.innerHTML = '';
        areaHorarios.className = 'grade-horarios';
        livres.forEach(function (h) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'botao-horario';
            btn.textContent = h.horario + ' — ' + h.medico;
            btn.title = 'Clique para agendar';
            btn.addEventListener('click', function () {
                document.querySelectorAll('.botao-horario--selecionado').forEach(function (b) {
                    b.classList.remove('botao-horario--selecionado');
                });
                btn.classList.add('botao-horario--selecionado');
                horarioSelecionado = h;
                abrirModal();
            });
            areaHorarios.appendChild(btn);
        });
    }

    async function buscarHorariosMes(ano, mesIndice) {
        if (carregando) return;
        if (!medicosCadastrados.length) {
            todosHorarios = [];
            if (calendario) calendario.atualizarResumo({});
            mostrarMsg(AVISO_SEM_MEDICOS);
            return;
        }

        carregando = true;
        if (botaoBuscar) botaoBuscar.disabled = true;
        if (areaHorarios) areaHorarios.innerHTML = '<p class="agendamento-sem-vagas">Carregando agenda...</p>';

        const dataInicio = primeiroDiaMes(ano, mesIndice);
        const totalDias = diasNoMes(ano, mesIndice);
        const params = new URLSearchParams({ data: dataInicio, dias: String(totalDias) });
        if (campoEsp?.value) params.set('especialidade', campoEsp.value);
        if (campoMedico?.value) params.set('medico', campoMedico.value);

        try {
            const dados = await VitaCareAPI.fetch('/horarios?' + params.toString());
            todosHorarios = dados.horarios || [];
            if (dados.aviso) mostrarAvisoGeral(dados.aviso, true);
            else if (medicosCadastrados.length) mostrarAvisoGeral('');

            if (calendario) calendario.atualizarResumo(resumoDosHorarios(todosHorarios));
            const dia = calendario ? calendario.getDataSelecionada() : dataInicio;
            renderizarHorariosDoDia(dia);
        } catch (erro) {
            todosHorarios = [];
            if (calendario) calendario.atualizarResumo({});
            mostrarMsg(erro.dados?.error || erro.message || 'Erro ao buscar horários. Faça Deploy no Node-RED.', true);
        } finally {
            carregando = false;
            if (botaoBuscar) botaoBuscar.disabled = false;
        }
    }

    function abrirModal() {
        if (!modal) return;
        modal.removeAttribute('hidden');
        modal.classList.add('ativo');
    }

    function fecharModal() {
        if (!modal) return;
        modal.classList.remove('ativo');
        modal.setAttribute('hidden', '');
    }

    if (calendarioEl) {
        const hoje = new Date();
        calendario = VitaCareCalendario.montar(calendarioEl, {
            dataInicial: VitaCareCalendario.isoLocal(hoje),
            onSelecionarDia: function (iso) {
                horarioSelecionado = null;
                renderizarHorariosDoDia(iso);
            },
            onMudarMes: function (ano, mes) {
                buscarHorariosMes(ano, mes);
            },
        });
    }

    botaoBuscar?.addEventListener('click', function () {
        const m = calendario ? calendario.getMesVisivel() : null;
        const hoje = new Date();
        const ano = m ? m.ano : hoje.getFullYear();
        const mes = m ? m.mes : hoje.getMonth();
        buscarHorariosMes(ano, mes);
    });

    campoEsp?.addEventListener('change', function () { botaoBuscar?.click(); });
    campoMedico?.addEventListener('change', function () { botaoBuscar?.click(); });

    botaoCancelar?.addEventListener('click', fecharModal);
    modal?.addEventListener('click', function (e) {
        if (e.target === modal) fecharModal();
    });

    botaoConfirmar?.addEventListener('click', async function () {
        fecharModal();
        if (!horarioSelecionado) return;
        try {
            botaoConfirmar.disabled = true;
            const dados = await VitaCareAPI.fetch('/agendar', {
                method: 'POST',
                body: {
                    paciente_id: usuario.id,
                    medico_id: horarioSelecionado.medico_id,
                    data: horarioSelecionado.data,
                    horario: horarioSelecionado.horario,
                    especialidade: horarioSelecionado.especialidade,
                },
            });
            await VitaCareModal.mostrar({ mensagem: dados.message || 'Consulta agendada com sucesso!', tipo: 'sucesso' });
            window.location.href = '/html/paciente/historico-consultas.html';
        } catch (erro) {
            await VitaCareModal.mostrar({ mensagem: erro.dados?.error || erro.message || 'Erro ao agendar', tipo: 'erro' });
            botaoBuscar?.click();
        } finally {
            botaoConfirmar.disabled = false;
        }
    });

    carregarMedicosSelect().then(function () {
        const hoje = new Date();
        buscarHorariosMes(hoje.getFullYear(), hoje.getMonth());
    });
});
