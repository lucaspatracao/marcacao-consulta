// =========================================
// Escolha de perfil – redireciona para os logins
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.botao-paciente').addEventListener('click', () => {
        window.location.href = 'login-paciente.html';
    });
    document.querySelector('.botao-admin').addEventListener('click', () => {
        window.location.href = 'login-funcionario.html'; // admin usa o mesmo login de funcionário
    });
});