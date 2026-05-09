// =========================================
// Recuperação de senha (simulação)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario-recuperar-senha');
    const modal = document.getElementById('modal-confirmacao');
    const botaoOk = document.getElementById('botao-modal-ok');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        modal.classList.add('ativo');
    });

    botaoOk.addEventListener('click', () => {
        modal.classList.remove('ativo');
        form.reset();
    });
});