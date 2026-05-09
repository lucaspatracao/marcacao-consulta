// =========================================
// Lista de pacientes – obtém via API
// =========================================
document.addEventListener('DOMContentLoaded', async () => {
    const tabela = document.querySelector('.tabela-dados tbody');
    const resp = await apiRequisicao('/api/admin/usuarios'); // mesma rota de admin, mas pode filtrar
    if (resp.usuarios) {
        const pacientes = resp.usuarios.filter(u => u.tipo === 'paciente');
        tabela.innerHTML = pacientes.map(p => `
      <tr>
        <td>${p.nome_completo}</td>
        <td>${p.telefone || '-'}</td>
        <td>-</td>
        <td><button class="botao-acao"><i class="fas fa-history"></i></button></td>
      </tr>
    `).join('');
    }
});