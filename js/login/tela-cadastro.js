// =========================================
// Cadastro de paciente via Node‑RED
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario-cadastro');
    const modal = document.getElementById('modal-confirmacao');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        modal.classList.add('ativo');
    });

    document.getElementById('botao-modal-confirmar').addEventListener('click', async () => {
        modal.classList.remove('ativo');
        const dados = {
            nome: document.getElementById('nome-cadastro').value,
            email: document.getElementById('email-cadastro').value,
            senha: document.getElementById('senha-cadastro').value,
            telefone: document.getElementById('telefone-cadastro').value,
            nascimento: document.getElementById('nascimento-cadastro').value
        };
        const resultado = await apiRequisicao('/api/cadastro', 'POST', dados);
        if (resultado.erro) {
            alert(resultado.erro);
        } else {
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'login.html';
        }
    });
    document.getElementById('botao-modal-cancelar').addEventListener('click', () => modal.classList.remove('ativo'));
});