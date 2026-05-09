// =========================================
// Comportamentos padrão dos painéis
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    // Destaca o item de menu ativo
    const paginaAtual = window.location.pathname.split('/').pop();
    document.querySelectorAll('.menu-lateral a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === paginaAtual) {
            link.parentElement.classList.add('menu-lateral__item--ativo');
        }
    });

    // (Opcional) Alternar menu em telas menores
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.querySelector('.painel-funcionario__menu').classList.toggle('expandido');
        });
    }
});