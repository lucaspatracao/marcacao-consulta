document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formularioContato');
    const modal = document.getElementById('modalConfirmacao');
    const botaoConfirmar = document.getElementById('botaoModalConfirmar');
    const botaoCancelar = document.getElementById('botaoModalCancelar');
    const linkPainel = document.getElementById('contatoVoltarPainel');
    const mensagemOk = document.getElementById('contatoMensagemSucesso');

    if (!formulario) return;

    let dadosPendentes = null;
    const usuario = typeof VitaCareAPI !== 'undefined' ? VitaCareAPI.obterUsuario() : null;

    const PAINEL = {
        admin: '/html/admin/inicio-admin.html',
        funcionario: '/html/funcionario/inicio-funcionario.html',
        medico: '/html/medico/inicio-medico.html',
        paciente: '/html/paciente/inicio-paciente.html',
    };

    if (usuario) {
        const nome = document.getElementById('nomeContato');
        const email = document.getElementById('emailContato');
        if (nome && usuario.nome) nome.value = usuario.nome;
        if (email && usuario.email) email.value = usuario.email;

        if (linkPainel && PAINEL[usuario.tipo]) {
            linkPainel.href = PAINEL[usuario.tipo];
            linkPainel.hidden = false;
        }
        const linkEntrar = document.getElementById('contatoLinkEntrar');
        if (linkEntrar) linkEntrar.hidden = true;

        if (usuario.tipo === 'funcionario') {
            const tipoCaso = document.getElementById('tipoCaso');
            if (tipoCaso && !tipoCaso.querySelector('[value="suporte"]')) {
                const opt = document.createElement('option');
                opt.value = 'suporte';
                opt.textContent = 'Suporte interno (funcionário)';
                tipoCaso.insertBefore(opt, tipoCaso.options[1] || null);
            }
        }
    }

    function mostrarErro(texto) {
        let box = document.getElementById('contatoMensagemErro');
        if (!box) {
            box = document.createElement('p');
            box.id = 'contatoMensagemErro';
            box.setAttribute('role', 'alert');
            box.className = 'contato-alerta contato-alerta--erro';
            formulario.insertBefore(box, formulario.firstChild);
        }
        box.textContent = texto;
        box.hidden = false;
        if (mensagemOk) mensagemOk.hidden = true;
    }

    function limparErro() {
        const box = document.getElementById('contatoMensagemErro');
        if (box) box.hidden = true;
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

    function validar() {
        const motivo = document.getElementById('tipoCaso')?.value?.trim();
        const nome = document.getElementById('nomeContato')?.value?.trim();
        const email = document.getElementById('emailContato')?.value?.trim();
        const mensagem = document.getElementById('mensagemContato')?.value?.trim();

        if (!motivo) { mostrarErro('Selecione o motivo do contato.'); return false; }
        if (!nome) { mostrarErro('Informe seu nome.'); return false; }
        if (!email) { mostrarErro('Informe seu e-mail.'); return false; }
        if (!mensagem || mensagem.length < 10) {
            mostrarErro('Escreva uma mensagem com pelo menos 10 caracteres.');
            return false;
        }

        limparErro();
        dadosPendentes = {
            motivo: motivo,
            tipoCaso: motivo,
            nome: nome,
            email: email,
            mensagem: mensagem,
            usuario_id: usuario?.id || null,
            tipo_perfil: usuario?.tipo || null,
        };
        return true;
    }

    async function enviarMensagem() {
        if (!dadosPendentes && !validar()) return;

        const botao = formulario.querySelector('button[type="submit"]');
        if (botao) {
            botao.disabled = true;
            botao.textContent = 'Enviando...';
        }

        try {
            if (typeof VitaCareAPI === 'undefined') {
                throw new Error('Sistema não carregou. Atualize a página (Ctrl+F5).');
            }
            const dados = await VitaCareAPI.fetch('/contato', {
                method: 'POST',
                body: dadosPendentes,
            });
            formulario.reset();
            if (usuario) {
                const nome = document.getElementById('nomeContato');
                const email = document.getElementById('emailContato');
                if (nome && usuario.nome) nome.value = usuario.nome;
                if (email && usuario.email) email.value = usuario.email;
            }
            if (mensagemOk) {
                mensagemOk.textContent = dados.message || 'Mensagem enviada com sucesso!';
                mensagemOk.hidden = false;
            } else {
                await VitaCareModal.mostrar({ mensagem: dados.message || 'Mensagem enviada com sucesso!', tipo: 'sucesso' });
            }
            dadosPendentes = null;
        } catch (erro) {
            mostrarErro(erro.dados?.error || erro.message || 'Não foi possível enviar. Verifique o Node-RED e o MySQL.');
        } finally {
            if (botao) {
                botao.disabled = false;
                botao.textContent = 'Enviar mensagem';
            }
        }
    }

    formulario.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validar()) return;
        if (modal && botaoConfirmar) {
            abrirModal();
        } else {
            enviarMensagem();
        }
    });

    botaoCancelar?.addEventListener('click', fecharModal);
    modal?.addEventListener('click', function (e) {
        if (e.target === modal) fecharModal();
    });

    botaoConfirmar?.addEventListener('click', async function () {
        fecharModal();
        await enviarMensagem();
    });
});
