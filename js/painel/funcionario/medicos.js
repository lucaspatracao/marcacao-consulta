document.addEventListener('DOMContentLoaded', function () {
    const usuario = typeof VitaCareAPI !== 'undefined'
        ? VitaCareAPI.exigirLogin(['funcionario', 'admin'])
        : null;
    if (!usuario) return;

    const grade = document.getElementById('listaMedicos');
    const botaoIncluir = document.getElementById('botaoIncluirMedico');
    const modal = document.getElementById('modalIncluirMedico');
    const form = document.getElementById('formIncluirMedico');
    const contador = document.getElementById('contadorMedicos');

    if (!grade) return;

    async function carregarMedicos() {
        grade.innerHTML = '<p class="agendamento-sem-vagas">Carregando médicos...</p>';
        try {
            const dados = await VitaCareAPI.fetch('/medicos');
            const lista = dados.medicos || [];
            if (contador) {
                contador.textContent = lista.length
                    ? lista.length + (lista.length === 1 ? ' médico' : ' médicos') + ' na equipe'
                    : 'Nenhum médico cadastrado';
            }
            if (!lista.length) {
                grade.innerHTML = '<p class="agendamento-sem-vagas">Nenhum médico cadastrado. Clique em Incluir para adicionar.</p>';
                return;
            }
            grade.innerHTML = lista.map(function (m) {
                return '<article class="cartao-medico">' +
                    '<div class="cartao-medico__icone" aria-hidden="true"><i class="fas fa-user-md"></i></div>' +
                    '<div class="cartao-medico__info">' +
                    '<h4>' + VitaCareAPI.esc(m.nome) + '</h4>' +
                    '<p>' + VitaCareAPI.esc(m.especialidade) + ' · CRM ' + VitaCareAPI.esc(m.crm) + '</p>' +
                    (m.email ? '<p class="cartao-medico__email">' + VitaCareAPI.esc(m.email) + '</p>' : '') +
                    '</div></article>';
            }).join('');
        } catch (erro) {
            grade.innerHTML = '<p class="agendamento-sem-vagas">' + VitaCareAPI.esc(erro.dados?.error || erro.message) +
                '. Verifique o Node-RED (Deploy) e o MySQL.</p>';
        }
    }

    function abrirModal() {
        if (!modal) return;
        modal.classList.add('ativo');
        modal.setAttribute('aria-hidden', 'false');
        document.getElementById('medicoNome')?.focus();
    }

    function fecharModal() {
        if (!modal) return;
        modal.classList.remove('ativo');
        modal.setAttribute('aria-hidden', 'true');
        form?.reset();
    }

    botaoIncluir?.addEventListener('click', abrirModal);
    document.getElementById('fecharModalMedico')?.addEventListener('click', fecharModal);
    document.getElementById('cancelarModalMedico')?.addEventListener('click', fecharModal);
    modal?.addEventListener('click', function (e) {
        if (e.target === modal) fecharModal();
    });

    form?.addEventListener('submit', async function (e) {
        e.preventDefault();
        const nome = document.getElementById('medicoNome')?.value.trim();
        const email = document.getElementById('medicoEmail')?.value.trim();
        const crm = document.getElementById('medicoCrm')?.value.trim();
        const especialidade = document.getElementById('medicoEspecialidade')?.value.trim();
        const senha = document.getElementById('medicoSenha')?.value.trim() || '';
        const botao = document.getElementById('salvarModalMedico');

        if (!nome || !email || !crm || !especialidade) {
            await VitaCareModal.mostrar({ mensagem: 'Preencha nome, e-mail, CRM e especialidade.', tipo: 'aviso' });
            return;
        }
        if (!senha) {
            await VitaCareModal.mostrar({ mensagem: 'Informe a senha inicial do médico.', tipo: 'aviso' });
            return;
        }
        if (senha.length < 6) {
            await VitaCareModal.mostrar({ mensagem: 'A senha inicial deve ter pelo menos 6 caracteres.', tipo: 'aviso' });
            return;
        }

        try {
            if (botao) botao.disabled = true;
            await VitaCareAPI.fetch('/medicos', {
                method: 'POST',
                body: { nome: nome, email: email, crm: crm, especialidade: especialidade, senha: senha },
            });
            fecharModal();
            await VitaCareModal.mostrar({ mensagem: 'Médico incluído. Senha inicial: ' + senha, tipo: 'sucesso' });
            await carregarMedicos();
        } catch (erro) {
            await VitaCareModal.mostrar({ mensagem: erro.dados?.error || erro.message, tipo: 'erro' });
        } finally {
            if (botao) botao.disabled = false;
        }
    });

    carregarMedicos();
});
