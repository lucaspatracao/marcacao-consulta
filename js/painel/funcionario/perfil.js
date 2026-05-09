// =========================================
// Perfil do funcionário – simulação de salvamento
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const btnSalvar = document.querySelector('.perfil-form-func .botao-contorno');
    btnSalvar.addEventListener('click', () => {
        const nome = document.getElementById('nome-perfil-func').value;
        const email = document.getElementById('email-perfil-func').value;
        alert(`Perfil atualizado:\nNome: ${nome}\nE-mail: ${email}`);
    });
});