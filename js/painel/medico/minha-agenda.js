// =========================================
// Minha agenda – carrega horários do médico logado
// =========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Supondo que o ID do médico logado seja fixo (1) para demonstração
    const resp = await apiRequisicao('/api/horarios?medico=1');
    const tabela = document.querySelector('.tabela-dados tbody');
    if (resp.horarios) {
        tabela.innerHTML = resp.horarios.map(h => `
      <tr>
        <td>${h.data}</td>
        <td>${h.horario}</td>
        <td>${h.medico}</td>
        <td>${h.especialidade}</td>
      </tr>
    `).join('');
    }
});