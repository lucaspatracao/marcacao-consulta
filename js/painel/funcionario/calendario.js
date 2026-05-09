// =========================================
// Calendário – (exemplo) carrega horários
// =========================================
document.addEventListener('DOMContentLoaded', async () => {
    const tabela = document.querySelector('.tabela-dados tbody');
    const resp = await apiRequisicao('/api/horarios');
    if (resp.horarios) {
        tabela.innerHTML = resp.horarios.map(h => `
      <tr>
        <td>${h.data}</td>
        <td>${h.medico}</td>
        <td>${h.horario}</td>
        <td>1</td>
        <td><button class="botao-acao"><i class="fas fa-edit"></i></button></td>
      </tr>
    `).join('');
    }
});