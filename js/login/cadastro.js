document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formularioCadastro');
    const tipoRadios = formulario?.querySelectorAll('input[name="tipoContaCadastro"]');
    const camposFuncionario = document.getElementById('camposFuncionarioCadastro');
    const codigoFuncionario = document.getElementById('codigoFuncionarioCadastro');
    const CODIGO_FUNCIONARIO = 'funcionario123';
    const modal = document.getElementById('modalConfirmacao');
    const botaoConfirmar = document.getElementById('botaoModalConfirmar');
    const botaoCancelar = document.getElementById('botaoModalCancelar');
    if (!formulario) return;

    let dadosPendentes = null;

    function tipoSelecionado() {
        const marcado = formulario.querySelector('input[name="tipoContaCadastro"]:checked');
        return marcado ? marcado.value : '';
    }

    function mostrarErro(texto) {
        let box = document.getElementById('cadastroMensagemErro');
        if (!box) {
            box = document.createElement('p');
            box.id = 'cadastroMensagemErro';
            box.setAttribute('role', 'alert');
            box.style.cssText = 'color:#b91c1c;background:#fef2f2;border:1px solid #fecaca;padding:0.75rem 1rem;border-radius:0.5rem;margin-bottom:1rem;';
            formulario.insertBefore(box, formulario.firstChild);
        }
        box.textContent = texto;
        box.hidden = false;
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function limparErro() {
        const box = document.getElementById('cadastroMensagemErro');
        if (box) box.hidden = true;
    }

    function abrirModal() {
        if (modal) modal.classList.add('ativo');
    }

    function fecharModal() {
        if (modal) modal.classList.remove('ativo');
    }

    function atualizarCamposPorTipo() {
        const tipo = tipoSelecionado();
        const funcionario = tipo === 'funcionario';
        if (camposFuncionario) camposFuncionario.hidden = !funcionario;
        if (codigoFuncionario) {
            codigoFuncionario.required = funcionario;
            if (!funcionario) codigoFuncionario.value = '';
        }
    }

    tipoRadios?.forEach(function (radio) {
        radio.addEventListener('change', atualizarCamposPorTipo);
    });
    atualizarCamposPorTipo();

    function validarFormulario() {
        const nome = document.getElementById('nomeCadastro')?.value?.trim();
        const email = document.getElementById('emailCadastro')?.value?.trim();
        const senha = document.getElementById('senhaCadastro')?.value || '';
        const confirma = document.getElementById('confirmaSenhaCadastro')?.value || '';
        const tipo = tipoSelecionado();
        const nascimento = document.getElementById('nascimentoCadastro')?.value || '';
        const ddd = document.getElementById('campoDdd')?.value?.trim() || '';
        const tel = document.getElementById('telefoneCadastro')?.value?.trim() || '';

        if (!nome) { mostrarErro('Informe o nome completo.'); return false; }
        if (!email) { mostrarErro('Informe o e-mail.'); return false; }
        if (!senha) { mostrarErro('Informe a senha.'); return false; }
        if (senha.length < 6) { mostrarErro('A senha deve ter pelo menos 6 caracteres.'); return false; }
        if (senha !== confirma) { mostrarErro('As senhas não coincidem.'); return false; }
        if (!tipo) { mostrarErro('Selecione o tipo de conta: Paciente ou Funcionário.'); return false; }
        if (!nascimento) { mostrarErro('Informe a data de nascimento.'); return false; }
        if (!tel) { mostrarErro('Informe o telefone.'); return false; }

        if (tipo === 'funcionario') {
            const codigo = codigoFuncionario?.value || '';
            if (!codigo.trim()) {
                mostrarErro('Informe o código de autorização para criar conta de funcionário.');
                return false;
            }
            if (codigo !== CODIGO_FUNCIONARIO) {
                mostrarErro('Código de autorização incorreto. Não é possível criar conta de funcionário.');
                return false;
            }
        }

        limparErro();
        dadosPendentes = {
            nome,
            email,
            senha,
            tipo,
            telefone: ddd && tel ? '(' + ddd + ') ' + tel : tel,
            nascimento,
            codigo_funcionario: tipo === 'funcionario' ? CODIGO_FUNCIONARIO : undefined,
        };
        return true;
    }

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        if (!validarFormulario()) return;
        abrirModal();
    });

    botaoCancelar?.addEventListener('click', fecharModal);

    modal?.addEventListener('click', function (evento) {
        if (evento.target === modal) fecharModal();
    });

    botaoConfirmar?.addEventListener('click', function () {
        fecharModal();
        enviarCadastro();
    });

    async function enviarCadastro() {
        if (!dadosPendentes) {
            if (!validarFormulario()) return;
        }
        const botao = formulario.querySelector('button[type="submit"]');
        if (botao) {
            botao.disabled = true;
            botao.textContent = 'Enviando...';
        }
        try {
            if (typeof VitaCareAPI === 'undefined') {
                throw new Error('Sistema não carregou. Atualize a página (Ctrl+F5).');
            }
            const dados = await VitaCareAPI.fetch('/cadastro', {
                method: 'POST',
                body: dadosPendentes,
            });
            await VitaCareModal.mostrar({ mensagem: dados.message || 'Cadastro realizado com sucesso!', tipo: 'sucesso' });
            window.location.href = 'login.html';
        } catch (erro) {
            mostrarErro(erro.dados?.error || erro.message || 'Erro ao cadastrar');
        } finally {
            if (botao) {
                botao.disabled = false;
                botao.textContent = 'Continuar';
            }
        }
    }
});
