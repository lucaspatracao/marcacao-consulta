// =========================================
// Login funcionário (admin) – igual ao login normal
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario-login-funcionario');
    const modal = document.getElementById('modal-confirmacao');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        modal.classList.add('ativo');
    });

    document.getElementById('botao-confirmar').addEventListener('click', () => {
        modal.classList.remove('ativo');
        // Redireciona para o painel (simulação)
        window.location.href = '../funcionario/inicio-funcionario.html';
    });
    document.getElementById('botao-cancelar').addEventListener('click', () => modal.classList.remove('ativo'));
});