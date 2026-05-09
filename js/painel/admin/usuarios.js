// =========================================
// Usuários – listagem e alteração de tipo
// =========================================
document.addEventListener('DOMContentLoaded', async () => {
    const tabela = document.querySelector('.tabela-dados tbody');
    const resp = await apiRequisicao('/api/admin/usuarios');
    if (resp.usuarios) {
        tabela.innerHTML = resp.usuarios.map(u => `
      <tr>
        <td>${u.nome_completo}</td>
        <td>${u.email}</td>
        <td><span class="etiqueta etiqueta--${u.tipo === 'paciente' ? 'confirmada' : 'pendente'}">${u.tipo}</span></td>
        <td>
          <select class="seletor-tipo-usuario" data-id="${u.id}">
            <option value="paciente" ${u.tipo === 'paciente' ? 'selected' : ''}>Paciente</option>
            <option value="funcionario" ${u.tipo === 'funcionario' ? 'selected' : ''}>Funcionário</option>
            <option value="medico" ${u.tipo === 'medico' ? 'selected' : ''}>Médico</option>
          </select>
        </td>
      </tr>
    `).join('');

        // Evento nos selects
        tabela.querySelectorAll('.seletor-tipo-usuario').forEach(select => {
            select.addEventListener('change', async () => {
                const id = select.dataset.id;
                const tipo = select.value;
                await apiRequisicao(`/api/admin/usuarios/${id}`, 'PUT', { tipo });
                alert('Tipo atualizado!');
                location.reload();
            });
        });
    } else {
        tabela.innerHTML = '<tr><td colspan="4">Erro ao carregar usuários.</td></tr>';
    }
});