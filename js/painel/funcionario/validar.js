document.addEventListener('DOMContentLoaded', async function () {
    if (!VitaCareAPI.exigirLogin(['funcionario', 'admin'])) return;

    const corpo = document.querySelector('#corpoValidar') || document.querySelector('table tbody');
    const contador = document.querySelector('#contadorPendentes');
    if (!corpo) return;

    async function carregar() {
        corpo.innerHTML = '<tr><td colspan="6">Carregando...</td></tr>';
        try {
            const dados = await VitaCareAPI.fetch('/validar/pendentes');
            const lista = dados.pendentes || [];
            if (contador) {
                contador.textContent = lista.length + (lista.length === 1 ? ' pendente' : ' pendentes');
                contador.className = 'etiqueta ' + (lista.length ? 'etiqueta--pendente' : 'etiqueta--confirmada');
            }
            if (!lista.length) {
                corpo.innerHTML = '<tr><td colspan="6">Nenhuma solicitação pendente.</td></tr>';
                return;
            }
            corpo.innerHTML = lista.map(function (c) {
                return '<tr data-id="' + c.id + '">' +
                    '<td>' + VitaCareAPI.esc(c.paciente) + '</td>' +
                    '<td>' + VitaCareAPI.formatarDataBR(c.data) + '</td>' +
                    '<td>' + VitaCareAPI.esc(c.horario) + '</td>' +
                    '<td>' + VitaCareAPI.esc(c.medico) + '</td>' +
                    '<td><span class="etiqueta etiqueta--pendente">Pendente</span></td>' +
                    '<td class="celula-acoes">' +
                    '<button type="button" class="botao-acao botao-acao--confirmar" data-acao="confirmar" title="Validar"><i class="fas fa-check"></i></button>' +
                    '<button type="button" class="botao-acao botao-acao--recusar" data-acao="cancelar" title="Cancelar"><i class="fas fa-times"></i></button>' +
                    '</td></tr>';
            }).join('');

            corpo.querySelectorAll('button[data-acao]').forEach(function (btn) {
                btn.addEventListener('click', async function () {
                    const tr = btn.closest('tr');
                    const id = tr && tr.dataset.id;
                    if (!id) return;
                    const confirmou = await VitaCareModal.confirmar({
                        mensagem: btn.dataset.acao === 'confirmar'
                            ? 'Confirmar esta consulta?'
                            : 'Cancelar esta solicitação?',
                        titulo: 'Confirmar ação',
                    });
                    if (!confirmou) return;
                    try {
                        btn.disabled = true;
                        await VitaCareAPI.fetch('/validar/confirmar', {
                            method: 'POST',
                            body: { consulta_id: Number(id), acao: btn.dataset.acao },
                        });
                        await carregar();
                    } catch (erro) {
                        await VitaCareModal.mostrar({ mensagem: erro.dados?.error || erro.message, tipo: 'erro' });
                    } finally {
                        btn.disabled = false;
                    }
                });
            });
        } catch (erro) {
            corpo.innerHTML = '<tr><td colspan="6">' + VitaCareAPI.esc(erro.dados?.error || erro.message) + '</td></tr>';
        }
    }

    carregar();
});
