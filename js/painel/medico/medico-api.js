(function (global) {
    async function obterMedicoLogado(usuarioId) {
        const id = Number(usuarioId);
        if (!id) throw new Error('Usuário inválido');

        try {
            return await VitaCareAPI.fetch('/medico/perfil?usuario_id=' + id);
        } catch (erroPerfil) {
            try {
                return await VitaCareAPI.fetch('/medico/me?usuario_id=' + id);
            } catch (erroMe) {
                try {
                    return await VitaCareAPI.fetch('/medicos?usuario_id=' + id);
                } catch (erroLista) {
                    const lista = await VitaCareAPI.fetch('/medicos');
                    const medico = (lista.medicos || []).find(function (m) {
                        return (m.email || '').toLowerCase() === (VitaCareAPI.obterUsuario()?.email || '').toLowerCase();
                    });
                    if (medico) return { success: true, medico: medico };
                    throw erroPerfil;
                }
            }
        }
    }

    async function salvarPerfilMedico(usuarioId, dados) {
        const body = typeof dados === 'object' && dados !== null
            ? Object.assign({ usuario_id: usuarioId }, dados)
            : { usuario_id: usuarioId, crm: arguments[1], especialidade: arguments[2] };
        try {
            return await VitaCareAPI.fetch('/medico/perfil', { method: 'PUT', body: body });
        } catch (e1) {
            return await VitaCareAPI.fetch('/medico/perfil', { method: 'POST', body: body });
        }
    }

    global.VitaCareMedico = { obterMedicoLogado, salvarPerfilMedico };
})(window);
