document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formularioRecuperarSenha');
    const email = document.getElementById('emailRecuperacao');
    const novaSenha = document.getElementById('novaSenhaRecuperacao');
    const confirmaSenha = document.getElementById('confirmaSenhaRecuperacao');
    const mensagem = document.getElementById('mensagemAlterarSenha');
    const botao = formulario && formulario.querySelector('.botao-recuperar');

    if (!formulario || !email || !novaSenha || !confirmaSenha) return;

    function mostrarErro(texto) {
        if (!mensagem) {
            VitaCareModal.mostrar({ mensagem: texto, tipo: 'erro' });
            return;
        }
        mensagem.textContent = texto;
        mensagem.hidden = !texto;
    }

    formulario.addEventListener('submit', async function (evento) {
        evento.preventDefault();
        mostrarErro('');

        const emailValor = email.value.trim().toLowerCase();
        const senha = novaSenha.value;
        const confirma = confirmaSenha.value;

        if (!emailValor) {
            mostrarErro('Informe o e-mail.');
            return;
        }
        if (senha.length < 6) {
            mostrarErro('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (senha !== confirma) {
            mostrarErro('As senhas não coincidem.');
            return;
        }

        if (botao) {
            botao.disabled = true;
            botao.textContent = 'Salvando...';
        }

        try {
            await VitaCareAPI.fetch('/senha/alterar', {
                method: 'POST',
                body: { email: emailValor, senha: senha },
            });
            await VitaCareModal.mostrar({ mensagem: 'Senha alterada com sucesso! Faça login com a nova senha.', tipo: 'sucesso' });
            window.location.href = 'login.html';
        } catch (erro) {
            mostrarErro(erro.dados?.error || erro.message || 'Não foi possível alterar a senha.');
        } finally {
            if (botao) {
                botao.disabled = false;
                botao.textContent = 'Alterar senha';
            }
        }
    });
});
