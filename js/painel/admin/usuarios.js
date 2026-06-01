document.addEventListener('DOMContentLoaded', async function () {
    const usuario = VitaCareAPI.exigirLogin(['admin']);
    if (!usuario) return;

    const corpo = document.querySelector('#corpoUsuarios') || document.querySelector('table tbody');
    if (!corpo) return;

    corpo.innerHTML = '<tr><td colspan="4">Carregando usuários...</td></tr>';

    try {
        const dados = await VitaCareAPI.fetch('/admin/usuarios');
        const lista = dados.usuarios || [];
        if (!lista.length) {
            corpo.innerHTML = '<tr><td colspan="4">Nenhum usuário cadastrado.</td></tr>';
            return;
        }

        corpo.innerHTML = lista.map(function (u) {
            const tipoAtual = u.tipo || 'paciente';
            const cls = tipoAtual === 'paciente' ? 'etiqueta--confirmada' : (tipoAtual === 'funcionario' ? 'etiqueta--pendente' : 'etiqueta--confirmada');
            const opcoes = ['paciente', 'funcionario', 'medico', 'admin'].map(function (t) {
                return '<option value="' + t + '"' + (tipoAtual === t ? ' selected' : '') + '>' + VitaCareAPI.rotuloTipo(t) + '</option>';
            }).join('');
            return '<tr data-id="' + u.id + '">' +
                '<td>' + VitaCareAPI.esc(u.nome_completo) + '</td>' +
                '<td>' + VitaCareAPI.esc(u.email) + '</td>' +
                '<td><span class="etiqueta ' + cls + '">' + VitaCareAPI.rotuloTipo(tipoAtual) + '</span></td>' +
                '<td><select class="seletor-tipo-usuario" aria-label="Tipo para ' + VitaCareAPI.esc(u.nome_completo) + '">' + opcoes + '</select></td>' +
                '</tr>';
        }).join('');

        corpo.querySelectorAll('.seletor-tipo-usuario').forEach(function (sel) {
            sel.addEventListener('change', async function () {
                const tr = sel.closest('tr');
                const id = tr && tr.dataset.id;
                if (!id) return;
                try {
                    await VitaCareAPI.fetch('/admin/usuarios/' + id, {
                        method: 'PUT',
                        body: { tipo: sel.value },
                    });
                    const etiqueta = tr.querySelector('.etiqueta');
                    if (etiqueta) {
                        etiqueta.textContent = VitaCareAPI.rotuloTipo(sel.value);
                        etiqueta.className = 'etiqueta etiqueta--confirmada';
                    }
                } catch (erro) {
                    await VitaCareModal.mostrar({ mensagem: erro.dados?.error || erro.message, tipo: 'erro' });
                }
            });
        });
    } catch (erro) {
        corpo.innerHTML = '<tr><td colspan="4">' + VitaCareAPI.esc(erro.dados?.error || erro.message) + '</td></tr>';
    }
});
