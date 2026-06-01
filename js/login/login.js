document.addEventListener('DOMContentLoaded', function () {

    function vincularLogin(formulario, campoEmail, campoSenha) {

        if (!formulario || !campoEmail || !campoSenha) return;

        formulario.addEventListener('submit', async function (evento) {

            evento.preventDefault();

            const email = campoEmail.value.trim();
            const senha = campoSenha.value;

            if (!email) {
                await VitaCareModal.mostrar({ mensagem: 'Informe seu e-mail.', tipo: 'aviso' });
                campoEmail.focus();
                return;
            }
            if (!senha) {
                await VitaCareModal.mostrar({ mensagem: 'Informe sua senha.', tipo: 'aviso' });
                campoSenha.focus();
                return;
            }

            try {

                const dados = await VitaCareAPI.fetch('/login', {

                    method: 'POST',

                    body: { email: email, senha: senha },

                });

                if (dados.success) {

                    localStorage.setItem('vitacare_token', dados.token || '');

                    localStorage.setItem('vitacare_user', JSON.stringify(dados.user || {}));

                    const params = new URLSearchParams(window.location.search);

                    const redirect = params.get('redirect');

                    const destino = redirect || dados.redirect || (VitaCareAPI.REDIRECIONAMENTO[dados.user?.tipo] || '/html/paciente/inicio-paciente.html');

                    window.location.href = destino;

                }

            } catch (erro) {

                await VitaCareModal.mostrar({ mensagem: erro.dados?.error || erro.message, tipo: 'erro' });

            }

        });

    }



    vincularLogin(

        document.getElementById('formularioLogin'),

        document.getElementById('emailLogin'),

        document.getElementById('senhaLogin')

    );

    vincularLogin(

        document.getElementById('loginFormPaciente'),

        document.getElementById('email'),

        document.getElementById('senha')

    );

    vincularLogin(

        document.getElementById('loginFormFuncionario'),

        document.getElementById('email'),

        document.getElementById('senha')

    );

});

