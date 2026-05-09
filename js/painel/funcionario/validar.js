// =========================================
// Validar consultas – lista pendentes e ações
// =========================================
document.addEventListener('DOMContentLoaded', async () => {
    const tabela = document.querySelector('.tabela-dados tbody');
    const resp = await apiRequisicao('/api/validar/pendentes');
    if (resp.pendentes) {
        tabela.innerHTML = resp.pendentes.map(c => `
      <tr>
        <td>${c.paciente}</td>
        <td>${c.data}</td>
        <td>${c.horario}</td>
        <td>${c.medico}</td>
        <td><span class="etiqueta etiqueta--pendente">Pendente</span></td>
        <td class="celula-acoes">
          <button class="botao-acao botao-acao--confirmar" data-id="${c.id}"><i class="fas fa-check"></i></button>
          <button class="botao-acao botao-acao--recusar" data-id="${c.id}"><i class="fas fa-times"></i></button>
        </td>
      </tr>
    `).join('');

        tabela.querySelectorAll('.botao-acao--confirmar, .botao-acao--recusar').forEach(btn => {
            btn.addEventListener('click', async () => {
                const acao = btn.classList.contains('botao-acao--confirmar') ? 'confirmar' : 'cancelar';
                const id = btn.dataset.id;
                await apiRequisicao('/api/validar/confirmar', 'POST', { consulta_id: id, acao });
                location.reload();
            });
        });
    }
});