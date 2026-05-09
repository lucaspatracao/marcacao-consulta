// =========================================
// Histórico médico – (exemplo) busca todos
// =========================================
document.addEventListener('DOMContentLoaded', async () => {
    const tabela = document.querySelector('.tabela-dados tbody');
    const resp = await apiRequisicao('/api/historico/0'); // ID genérico
    if (resp.consultas) {
        tabela.innerHTML = resp.consultas.map(c => `
      <tr>
        <td>${c.paciente || '-'}</td>
        <td>${c.data}</td>
        <td>${c.diagnostico || '-'}</td>
      </tr>
    `).join('');
    }
});