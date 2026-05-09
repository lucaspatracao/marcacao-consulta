// =========================================
// Login – autenticação via Node‑RED
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario-login');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email-login').value;
        const senha = document.getElementById('senha-login').value;

        const resultado = await apiRequisicao('/api/login', 'POST', { email, senha });

        if (resultado.erro) {
            alert(resultado.erro);
            return;
        }
        // Redireciona conforme perfil (já definido no Node‑RED)
        if (resultado.redirect) {
            window.location.href = resultado.redirect;
        } else {
            alert('Login bem-sucedido, mas sem redirecionamento definido.');
        }
    });
});