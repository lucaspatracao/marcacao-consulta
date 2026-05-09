// =========================================
// Formulário de contato – envio simulado
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario-contato');
    const modal = document.getElementById('modal-confirmacao');
    const botaoCancelar = document.getElementById('botao-cancelar-modal');
    const botaoConfirmar = document.getElementById('botao-confirmar-modal');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        modal.classList.add('ativo');   // exibe modal
    });

    botaoCancelar.addEventListener('click', () => modal.classList.remove('ativo'));
    botaoConfirmar.addEventListener('click', () => {
        modal.classList.remove('ativo');
        alert('Mensagem enviada (simulação).');
        form.reset();
    });
});