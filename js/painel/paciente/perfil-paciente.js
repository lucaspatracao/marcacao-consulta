document.addEventListener('DOMContentLoaded', async function () {
    const usuario = VitaCareAPI.exigirLogin(['paciente']);
    if (!usuario) return;

    const form = document.getElementById('formPerfilPaciente');
    const nome = document.getElementById('nomePac');
    const email = document.getElementById('emailPac');
    const tel = document.getElementById('telPac');
    const botaoSalvar = document.getElementById('botaoSalvarPerfilPac');

    function preencherCampos(perfil) {
        if (nome) nome.value = perfil.nome || '';
        if (email) email.value = perfil.email || '';
        if (tel) tel.value = perfil.telefone || '';
    }

    function atualizarSessao(perfil) {
        const atualizado = Object.assign({}, usuario, {
            nome: perfil.nome,
            email: perfil.email,
            telefone: perfil.telefone || '',
        });
        localStorage.setItem('vitacare_user', JSON.stringify(atualizado));
    }

    preencherCampos(usuario);

    async function carregarPerfil() {
        try {
            const dados = await VitaCareAPI.fetch('/paciente/perfil?usuario_id=' + encodeURIComponent(usuario.id));
            const perfil = dados.perfil || {};
            preencherCampos(perfil);
            atualizarSessao(perfil);
        } catch (erro) {
            if (erro.status !== 404) {
                console.warn(erro.dados?.error || erro.message);
            }
        }
    }

    await carregarPerfil();

    form?.addEventListener('submit', async function (e) {
        e.preventDefault();
        const nomeVal = nome?.value.trim();
        const telVal = tel?.value.trim() || '';

        if (!nomeVal || nomeVal.length < 2) {
            await VitaCareModal.mostrar({ mensagem: 'Informe seu nome completo.', tipo: 'aviso' });
            nome?.focus();
            return;
        }

        try {
            if (botaoSalvar) botaoSalvar.disabled = true;
            const dados = await VitaCareAPI.fetch('/paciente/perfil', {
                method: 'PUT',
                body: {
                    usuario_id: usuario.id,
                    nome: nomeVal,
                    telefone: telVal,
                },
            });
            const perfil = {
                nome: dados.perfil?.nome || nomeVal,
                email: email?.value || usuario.email,
                telefone: dados.perfil?.telefone != null ? dados.perfil.telefone : telVal,
            };
            atualizarSessao(perfil);
            await VitaCareModal.mostrar({ mensagem: dados.message || 'Perfil salvo com sucesso!', tipo: 'sucesso' });
        } catch (erro) {
            await VitaCareModal.mostrar({ mensagem: erro.dados?.error || erro.message || 'Não foi possível salvar o perfil.', tipo: 'erro' });
        } finally {
            if (botaoSalvar) botaoSalvar.disabled = false;
        }
    });
});
