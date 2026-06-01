(function (global) {
    const TITULOS_MODAL = {
        sucesso: 'Sucesso',
        erro: 'Atenção',
        aviso: 'Aviso',
        info: 'Informação',
    };
    const ICONES_MODAL = {
        sucesso: 'fa-check-circle',
        erro: 'fa-exclamation-circle',
        aviso: 'fa-exclamation-triangle',
        info: 'fa-info-circle',
    };
    let modalEl = null;
    let tituloEl = null;
    let mensagemEl = null;
    let iconeEl = null;
    let conteudoEl = null;
    let btnOk = null;
    let btnCancelar = null;
    let acoesEl = null;
    let resolverModal = null;
    let modoConfirmacaoModal = false;

    function inferirTipoModal(mensagem) {
        const m = String(mensagem || '').toLowerCase();
        if (/sucesso|salvo|salva|enviad|inclu[ií]d|alterad|cadastr|agendad|confirmad/.test(m)) return 'sucesso';
        if (/erro|falha|incorret|inv[aá]lid|n[aã]o foi|n[aã]o [eé] poss|preench|informe|permiss|cannot/.test(m)) return 'erro';
        if (/aten[cç][aã]o|aviso|cuidado/.test(m)) return 'aviso';
        return 'info';
    }

    function normalizarOpcoesModal(opcoes) {
        if (typeof opcoes === 'string') return { mensagem: opcoes };
        return opcoes || {};
    }

    function garantirModal() {
        if (modalEl) return;
        modalEl = document.createElement('div');
        modalEl.id = 'vitacareModalGlobal';
        modalEl.className = 'modal-fundo vitacare-modal-global';
        modalEl.setAttribute('role', 'alertdialog');
        modalEl.setAttribute('aria-modal', 'true');
        modalEl.setAttribute('aria-labelledby', 'vitacareModalTitulo');
        modalEl.setAttribute('aria-describedby', 'vitacareModalMensagem');
        modalEl.hidden = true;
        modalEl.innerHTML =
            '<div class="modal-conteudo modal-conteudo--aviso">' +
            '<div class="vitacare-modal-icone" aria-hidden="true"><i class="fas fa-info-circle"></i></div>' +
            '<h2 id="vitacareModalTitulo" class="modal-conteudo__titulo"></h2>' +
            '<p id="vitacareModalMensagem"></p>' +
            '<div class="modal-acoes vitacare-modal-acoes"></div></div>';
        (document.body || document.documentElement).appendChild(modalEl);
        conteudoEl = modalEl.querySelector('.modal-conteudo');
        tituloEl = document.getElementById('vitacareModalTitulo');
        mensagemEl = document.getElementById('vitacareModalMensagem');
        iconeEl = modalEl.querySelector('.vitacare-modal-icone i');
        acoesEl = modalEl.querySelector('.vitacare-modal-acoes');
        btnOk = document.createElement('button');
        btnOk.type = 'button';
        btnOk.className = 'modal-botao modal-botao--confirmar';
        btnOk.textContent = 'OK';
        btnOk.addEventListener('click', function () { fecharModal(true); });
        btnCancelar = document.createElement('button');
        btnCancelar.type = 'button';
        btnCancelar.className = 'modal-botao modal-botao--cancelar';
        btnCancelar.textContent = 'Cancelar';
        btnCancelar.addEventListener('click', function () { fecharModal(false); });
        modalEl.addEventListener('click', function (e) {
            if (e.target === modalEl && !modoConfirmacaoModal) fecharModal(true);
        });
        document.addEventListener('keydown', function (e) {
            if (!modalEl || !modalEl.classList.contains('ativo')) return;
            if (e.key === 'Escape') {
                e.preventDefault();
                fecharModal(!modoConfirmacaoModal);
            }
        });
    }

    function fecharModal(confirmado) {
        if (!modalEl) return;
        modalEl.classList.remove('ativo');
        modalEl.hidden = true;
        document.body.classList.remove('vitacare-modal-aberto');
        const resolve = resolverModal;
        resolverModal = null;
        modoConfirmacaoModal = false;
        if (resolve) resolve(!!confirmado);
    }

    function abrirModal(opcoes) {
        garantirModal();
        const opts = normalizarOpcoesModal(opcoes);
        const mensagem = opts.mensagem != null ? String(opts.mensagem) : '';
        const tipo = opts.tipo || inferirTipoModal(mensagem);
        modoConfirmacaoModal = !!opts.confirmar;
        tituloEl.textContent = opts.titulo || TITULOS_MODAL[tipo] || TITULOS_MODAL.info;
        mensagemEl.textContent = mensagem;
        iconeEl.className = 'fas ' + (ICONES_MODAL[tipo] || ICONES_MODAL.info);
        conteudoEl.className = 'modal-conteudo modal-conteudo--aviso vitacare-modal--' + tipo;
        acoesEl.innerHTML = '';
        if (modoConfirmacaoModal) acoesEl.appendChild(btnCancelar);
        btnOk.textContent = opts.botao || 'OK';
        acoesEl.appendChild(btnOk);
        modalEl.hidden = false;
        modalEl.classList.add('ativo');
        document.body.classList.add('vitacare-modal-aberto');
        btnOk.focus();
        return new Promise(function (resolve) { resolverModal = resolve; });
    }

    function mostrarModal(opcoes) {
        return abrirModal(opcoes).then(function () {});
    }

    global.VitaCareModal = {
        mostrar: mostrarModal,
        alerta: mostrarModal,
        confirmar: function (opcoes) {
            const opts = normalizarOpcoesModal(opcoes);
            opts.confirmar = true;
            opts.titulo = opts.titulo || 'Confirmar';
            opts.botao = opts.botao || 'Sim';
            if (!opts.tipo) opts.tipo = 'aviso';
            return abrirModal(opts);
        },
        inferirTipo: inferirTipoModal,
    };

    const API_BASE = (global.location?.origin || 'http://127.0.0.1:1880') + '/api';

    const REDIRECIONAMENTO = {
        admin: '/html/admin/inicio-admin.html',
        paciente: '/html/paciente/inicio-paciente.html',
        funcionario: '/html/funcionario/inicio-funcionario.html',
        medico: '/html/medico/inicio-medico.html',
    };

    async function apiFetch(path, options = {}) {
        const url = path.startsWith('http') ? path : API_BASE + path;
        const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
        const init = Object.assign({}, options, { headers });
        if (init.body && typeof init.body === 'object') {
            init.body = JSON.stringify(init.body);
        }
        const resposta = await fetch(url, init);
        const texto = await resposta.text();
        let dados = null;
        if (texto) {
            const pareceHtml = /^\s*</.test(texto);
            if (pareceHtml) {
                const match = texto.match(/<pre>([^<]+)<\/pre>/i);
                dados = {
                    error: match
                        ? match[1].trim()
                        : 'Servidor indisponível. Reinicie o Node-RED e clique em Deploy em /admin/',
                };
            } else {
                try { dados = JSON.parse(texto); } catch { dados = { error: texto }; }
            }
        }
        if (!resposta.ok) {
            const erro = new Error((dados && dados.error) || 'Erro HTTP ' + resposta.status);
            erro.status = resposta.status;
            erro.dados = dados;
            throw erro;
        }
        return dados;
    }

    function obterUsuario() {
        try {
            return JSON.parse(localStorage.getItem('vitacare_user') || 'null');
        } catch {
            return null;
        }
    }

    function logout() {
        localStorage.removeItem('vitacare_user');
        localStorage.removeItem('vitacare_token');
        global.location.href = '/html/login/login.html';
    }

    function detectarPerfilPagina() {
        const p = global.location.pathname || '';
        if (p.includes('/html/admin/')) return ['admin'];
        if (p.includes('/html/funcionario/')) return ['funcionario', 'admin'];
        if (p.includes('/html/medico/')) return ['medico'];
        if (p.includes('/html/paciente/')) return ['paciente'];
        return null;
    }

    function exigirLogin(perfis) {
        const usuario = obterUsuario();
        if (!usuario || !usuario.id) {
            const voltar = encodeURIComponent(global.location.pathname + global.location.search);
            global.location.href = '/html/login/login.html?redirect=' + voltar;
            return null;
        }
        if (perfis && perfis.length && !perfis.includes(usuario.tipo)) {
            const destino = REDIRECIONAMENTO[usuario.tipo] || '/html/login/login.html';
            mostrarModal({
                mensagem: 'Você não tem permissão para acessar esta área.',
                tipo: 'erro',
            }).then(function () {
                global.location.href = destino;
            });
            return null;
        }
        return usuario;
    }

    function formatarDataBR(iso) {
        if (iso == null || iso === '') return '';
        const s = String(iso).trim();
        const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (m) return m[3] + '/' + m[2] + '/' + m[1];
        const d = new Date(s);
        if (isNaN(d.getTime())) return '—';
        return d.toLocaleDateString('pt-BR');
    }

    function rotuloTipo(tipo) {
        const mapa = {
            paciente: 'Paciente',
            funcionario: 'Funcionário',
            medico: 'Médico',
            admin: 'Administrador',
        };
        return mapa[tipo] || tipo;
    }

    function classeEtiquetaStatus(status) {
        const s = String(status || '').toLowerCase();
        if (s === 'confirmada' || s === 'realizada') return 'etiqueta etiqueta--confirmada';
        if (s === 'pendente' || s === 'agendada') return 'etiqueta etiqueta--pendente';
        return 'etiqueta';
    }

    function esc(texto) {
        const d = document.createElement('div');
        d.textContent = texto == null ? '' : String(texto);
        return d.innerHTML;
    }

    global.VitaCareAPI = {
        base: API_BASE,
        fetch: apiFetch,
        obterUsuario,
        exigirLogin,
        logout,
        detectarPerfilPagina,
        formatarDataBR,
        rotuloTipo,
        classeEtiquetaStatus,
        esc,
        REDIRECIONAMENTO,
    };

    /**
     * Substitui alert nativo por modal VitaCare.
     * Para confirmações, use await VitaCareModal.confirmar(...) (não há confirm síncrono).
     */
    global.alert = function (mensagem) {
        mostrarModal({
            mensagem: mensagem == null ? '' : String(mensagem),
            tipo: inferirTipoModal(mensagem),
        });
    };

})(window);
