// =========================================
// Login paciente
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario-login-paciente');
    const modal = document.getElementById('modal-confirmacao');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        modal.classList.add('ativo');
    });

    document.getElementById('botao-confirmar').addEventListener('click', () => {
        modal.classList.remove('ativo');
        window.location.href = '../paciente/inicio-paciente.html';
    });
    document.getElementById('botao-cancelar').addEventListener('click', () => modal.classList.remove('ativo'));
});