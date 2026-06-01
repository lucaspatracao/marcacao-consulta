document.addEventListener('DOMContentLoaded', async function () {
    const usuario = VitaCareAPI.exigirLogin(['medico']);
    if (!usuario) return;

    const form = document.getElementById('formPerfilMedico');
    const nome = document.getElementById('nomeMed');
    const email = document.getElementById('emailMed');
    const tel = document.getElementById('telMed');
    const esp = document.getElementById('espMed');
    const crm = document.getElementById('crmMed');
    const botaoSalvar = document.getElementById('botaoSalvarPerfilMed');

    function preencherCampos(perfil) {
        if (nome) nome.value = perfil.nome || '';
        if (email) email.value = perfil.email || '';
        if (tel) tel.value = perfil.telefone || '';
        if (esp) esp.value = perfil.especialidade || '';
        if (crm) crm.value = perfil.crm || '';
    }

    function atualizarSessao(perfil) {
        const atualizado = Object.assign({}, usuario, {
            nome: perfil.nome,
            email: perfil.email,
            telefone: perfil.telefone || '',
            crm: perfil.crm,
            especialidade: perfil.especialidade,
        });
        localStorage.setItem('vitacare_user', JSON.stringify(atualizado));
    }

    preencherCampos(usuario);

    async function carregarPerfil() {
        try {
            const dados = await VitaCareAPI.fetch('/medico/perfil?usuario_id=' + encodeURIComponent(usuario.id));
            const perfil = dados.perfil || {};
            preencherCampos(perfil);
            atualizarSessao(perfil);
        } catch (erro) {
            if (usuario.especialidade && esp) esp.value = usuario.especialidade;
            if (usuario.crm && crm) crm.value = usuario.crm;
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
        const crmVal = crm?.value.trim();
        const espVal = esp?.value.trim();

        if (!nomeVal || nomeVal.length < 2) {
            await VitaCareModal.mostrar({ mensagem: 'Informe seu nome completo.', tipo: 'aviso' });
            nome?.focus();
            return;
        }
        if (!crmVal || !espVal) {
            await VitaCareModal.mostrar({ mensagem: 'Preencha CRM e especialidade.', tipo: 'aviso' });
            return;
        }

        try {
            if (botaoSalvar) botaoSalvar.disabled = true;
            const dados = await VitaCareMedico.salvarPerfilMedico(usuario.id, {
                nome: nomeVal,
                telefone: telVal,
                crm: crmVal,
                especialidade: espVal,
            });
            const perfil = {
                nome: dados.perfil?.nome || nomeVal,
                email: email?.value || usuario.email,
                telefone: dados.perfil?.telefone != null ? dados.perfil.telefone : telVal,
                crm: dados.perfil?.crm || crmVal,
                especialidade: dados.perfil?.especialidade || espVal,
            };
            atualizarSessao(perfil);
            await VitaCareModal.mostrar({
                mensagem: dados.message || 'Perfil salvo com sucesso!',
                tipo: 'sucesso',
            });
            await carregarPerfil();
        } catch (erro) {
            await VitaCareModal.mostrar({
                mensagem: erro.dados?.error || erro.message,
                tipo: 'erro',
            });
        } finally {
            if (botaoSalvar) botaoSalvar.disabled = false;
        }
    });
});
