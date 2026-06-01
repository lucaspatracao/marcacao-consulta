(function (global) {
    const MOTIVOS = {
        duvidas: 'Dúvidas',
        erros: 'Erros no site',
        sugestoes: 'Sugestões',
        suporte: 'Suporte interno',
        agendamento: 'Agendamentos',
    };

    let ultimoTotalNaoLidas = 0;
    let iniciado = false;

    function esc(texto) {
        return typeof VitaCareAPI !== 'undefined' ? VitaCareAPI.esc(texto) : String(texto || '');
    }

    async function buscarMensagens(apenasNaoLidas) {
        const q = apenasNaoLidas ? '?apenas_nao_lidas=1' : '';
        return VitaCareAPI.fetch('/contato/mensagens' + q);
    }

    function atualizarBadge(naoLidas) {
        document.querySelectorAll('.menu-badge-notificacao').forEach(function (badge) {
            if (naoLidas > 0) {
                badge.textContent = naoLidas > 99 ? '99+' : String(naoLidas);
                badge.hidden = false;
            } else {
                badge.hidden = true;
            }
        });
        const alerta = document.getElementById('alertaNotificacoesContato');
        if (alerta) {
            if (naoLidas > 0) {
                alerta.hidden = false;
                alerta.innerHTML = '<i class="fas fa-bell" aria-hidden="true"></i> Você tem <strong>' + naoLidas +
                    '</strong> nova(s) mensagem(ns) de contato. <a href="mensagens-contato.html">Ver agora</a>';
            } else {
                alerta.hidden = true;
            }
        }
    }

    async function atualizarBadgeMenu() {
        if (typeof VitaCareAPI === 'undefined') return;
        const perfil = VitaCareAPI.detectarPerfilPagina();
        if (!perfil || !perfil.includes('funcionario')) return;
        try {
            const dados = await buscarMensagens(true);
            const n = dados.nao_lidas || 0;
            if (n > ultimoTotalNaoLidas && ultimoTotalNaoLidas > 0 && 'Notification' in global && Notification.permission === 'granted') {
                new Notification('VitaCare — Nova mensagem de contato', {
                    body: 'Há ' + n + ' mensagem(ns) aguardando leitura.',
                    icon: '/img/projeto-logotipo.png',
                });
            }
            ultimoTotalNaoLidas = n;
            atualizarBadge(n);
        } catch (e) {
            /* silencioso no badge */
        }
    }

    async function marcarComoLida(id) {
        await VitaCareAPI.fetch('/contato/mensagens/lida', { method: 'PUT', body: { id: id } });
    }

    function renderizarLista(mensagens, corpo) {
        if (!mensagens.length) {
            corpo.innerHTML = '<p class="agendamento-sem-vagas">Nenhuma mensagem de contato.</p>';
            return;
        }
        corpo.innerHTML = mensagens.map(function (m) {
            const motivo = MOTIVOS[m.motivo] || m.motivo;
            const naoLida = !Number(m.lida);
            return '<article class="notificacao-cartao' + (naoLida ? ' notificacao-cartao--nova' : '') + '" data-id="' + m.id + '">' +
                '<div class="notificacao-cartao__cabecalho">' +
                '<span class="notificacao-cartao__motivo">' + esc(motivo) + '</span>' +
                (naoLida ? '<span class="notificacao-cartao__badge">Nova</span>' : '') +
                '</div>' +
                '<p class="notificacao-cartao__meta"><strong>' + esc(m.nome) + '</strong> · ' + esc(m.email) +
                (m.tipo_perfil ? ' · ' + esc(m.tipo_perfil) : '') + '</p>' +
                '<p class="notificacao-cartao__texto">' + esc(m.mensagem) + '</p>' +
                '<p class="notificacao-cartao__data">' + esc(m.criado_em) + '</p>' +
                (naoLida ? '<button type="button" class="botao-contorno notificacao-cartao__ler" data-marcar-lida="' + m.id + '">Marcar como lida</button>' : '') +
                '</article>';
        }).join('');

        corpo.querySelectorAll('[data-marcar-lida]').forEach(function (btn) {
            btn.addEventListener('click', async function () {
                try {
                    await marcarComoLida(Number(btn.getAttribute('data-marcar-lida')));
                    await carregarPaginaMensagens();
                    await atualizarBadgeMenu();
                } catch (erro) {
                    await VitaCareModal.mostrar({ mensagem: erro.dados?.error || erro.message, tipo: 'erro' });
                }
            });
        });
    }

    async function carregarPaginaMensagens() {
        const corpo = document.getElementById('listaMensagensContato');
        if (!corpo) return;
        corpo.innerHTML = '<p class="agendamento-sem-vagas">Carregando mensagens...</p>';
        try {
            const dados = await buscarMensagens(false);
            renderizarLista(dados.mensagens || [], corpo);
            atualizarBadge(dados.nao_lidas || 0);
            ultimoTotalNaoLidas = dados.nao_lidas || 0;
        } catch (erro) {
            corpo.innerHTML = '<p class="agendamento-sem-vagas">' + esc(erro.dados?.error || erro.message) + '</p>';
        }
    }

    function iniciarPagina() {
        document.getElementById('botaoMarcarTodasLidas')?.addEventListener('click', async function () {
            try {
                const dados = await buscarMensagens(true);
                const lista = dados.mensagens || [];
                for (let i = 0; i < lista.length; i++) {
                    await marcarComoLida(lista[i].id);
                }
                await carregarPaginaMensagens();
                await atualizarBadgeMenu();
            } catch (erro) {
                await VitaCareModal.mostrar({ mensagem: erro.dados?.error || erro.message, tipo: 'erro' });
            }
        });
        document.getElementById('botaoAtualizarMensagens')?.addEventListener('click', carregarPaginaMensagens);
        carregarPaginaMensagens();
    }

    function iniciar() {
        if (iniciado) return;
        iniciado = true;
        if ('Notification' in global && Notification.permission === 'default') {
            Notification.requestPermission();
        }
        atualizarBadgeMenu();
        setInterval(atualizarBadgeMenu, 45000);
        if (document.getElementById('listaMensagensContato')) iniciarPagina();
    }

    global.VitaCareNotificacoes = {
        iniciar: iniciar,
        atualizarBadgeMenu: atualizarBadgeMenu,
        carregarPaginaMensagens: carregarPaginaMensagens,
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})(window);
