// =========================================
// Agendamento de consulta – busca de horários
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const botaoBuscar = document.getElementById('botao-buscar-horarios');
    const areaHorarios = document.getElementById('area-horarios');
    const especialidade = document.getElementById('campo-especialidade');
    const medico = document.getElementById('campo-medico');
    const data = document.getElementById('campo-data');

    botaoBuscar.addEventListener('click', async () => {
        areaHorarios.innerHTML = '<p>Buscando...</p>';
        const params = new URLSearchParams();
        if (data.value) params.append('data', data.value);
        if (especialidade.value) params.append('especialidade', especialidade.value);
        if (medico.value) params.append('medico', medico.value);

        const resultado = await apiRequisicao(`/api/horarios?${params.toString()}`);
        if (resultado.erro) {
            areaHorarios.innerHTML = `<p class="texto-erro">${resultado.erro}</p>`;
            return;
        }
        if (!resultado.horarios || resultado.horarios.length === 0) {
            areaHorarios.innerHTML = '<p>Nenhum horário disponível.</p>';
            return;
        }
        areaHorarios.innerHTML = resultado.horarios.map(h =>
            `<button class="botao-horario" data-id="${h.id}" data-info="${h.data} ${h.horario} - ${h.medico}">${h.horario}</button>`
        ).join('');

        // Evento nos botões de horário (apenas exemplo – agendamento real exigiria login)
        areaHorarios.querySelectorAll('.botao-horario').forEach(botao => {
            botao.addEventListener('click', () => {
                const info = botao.dataset.info;
                if (confirm(`Agendar consulta em ${info}?`)) {
                    // Aqui chamaria POST /api/agendar – para demonstração, mostra um alerta
                    alert('Agendamento simulado com sucesso!');
                }
            });
        });
    });
});