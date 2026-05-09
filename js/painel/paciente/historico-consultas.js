// =========================================
// Histórico do paciente – busca pelo ID
// =========================================
document.addEventListener('DOMContentLoaded', async () => {
    const tabela = document.querySelector('.tabela-dados tbody');
    const pacienteId = 1; // demonstrativo
    const resp = await apiRequisicao(`/api/historico/${pacienteId}`);
    if (resp.consultas) {
        tabela.innerHTML = resp.consultas.map(c => `
      <tr>
        <td>${c.data}</td>
        <td>${c.horario}</td>
        <td>${c.especialidade}</td>
        <td>${c.medico}</td>
        <td><span class="etiqueta etiqueta--${c.status === 'confirmada' ? 'confirmada' : 'pendente'}">${c.status}</span></td>
      </tr>
    `).join('');
    }
});