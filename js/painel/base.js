document.addEventListener('DOMContentLoaded', function () {
    if (typeof VitaCareAPI === 'undefined') return;

    const perfil = VitaCareAPI.detectarPerfilPagina();
    if (perfil) {
        const usuario = VitaCareAPI.exigirLogin(perfil);
        if (!usuario) return;
        window.__vitacareUsuario = usuario;
    }

    document.querySelectorAll('.menu-lateral-botao-sair').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            VitaCareAPI.logout();
        });
    });

    const usuario = VitaCareAPI.obterUsuario();
    document.querySelectorAll('[data-vitacare-usuario]').forEach(function (el) {
        if (usuario && usuario.nome) el.textContent = usuario.nome;
    });

    if (perfil && perfil.includes('funcionario') && !document.querySelector('script[data-vitacare-notificacoes]')) {
        const script = document.createElement('script');
        script.src = '../../js/painel/funcionario/notificacoes-contato.js';
        script.defer = true;
        script.setAttribute('data-vitacare-notificacoes', '1');
        document.body.appendChild(script);
        script.addEventListener('load', function () {
            if (global.VitaCareNotificacoes) {
                if (global.VitaCareNotificacoes.iniciar) global.VitaCareNotificacoes.iniciar();
                else global.VitaCareNotificacoes.atualizarBadgeMenu();
            }
        });
    }
});
