document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-role]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const role = btn.getAttribute('data-role');
            if (role === 'paciente') {
                window.location.href = 'login-paciente.html';
            } else if (role === 'admin') {
                window.location.href = 'login.html';
            } else {
                window.location.href = 'login.html';
            }
        });
    });
});
