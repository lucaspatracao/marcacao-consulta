(function (global) {
    const CHAVE = 'vitacare_a11y';
    const ESCALAS = [0.875, 1, 1.125, 1.25, 1.375, 1.5];
    const PADRAO = {
        fontScale: 1,
        altoContraste: false,
        linksSublinhados: false,
    };

    function carregar() {
        try {
            const salvo = JSON.parse(localStorage.getItem(CHAVE) || 'null');
            if (!salvo || typeof salvo !== 'object') return Object.assign({}, PADRAO);
            return {
                fontScale: ESCALAS.includes(salvo.fontScale) ? salvo.fontScale : PADRAO.fontScale,
                altoContraste: !!salvo.altoContraste,
                linksSublinhados: !!salvo.linksSublinhados,
            };
        } catch {
            return Object.assign({}, PADRAO);
        }
    }

    function salvar(prefs) {
        localStorage.setItem(CHAVE, JSON.stringify(prefs));
    }

    let prefs = carregar();

    function aplicar() {
        const html = document.documentElement;
        html.style.setProperty('--vitacare-font-scale', String(prefs.fontScale));
        html.classList.toggle('vitacare-alto-contraste', prefs.altoContraste);
        html.classList.toggle('vitacare-links-sublinhados', prefs.linksSublinhados);
        html.classList.remove('vitacare-reduzir-movimento');
    }

    function indiceEscala() {
        const i = ESCALAS.indexOf(prefs.fontScale);
        return i >= 0 ? i : 1;
    }

    function textoEscala() {
        const pct = Math.round(prefs.fontScale * 100);
        if (prefs.fontScale === 1) return 'Tamanho do texto: ' + pct + '% (padrão)';
        return 'Tamanho do texto: ' + pct + '%';
    }

    function aumentarTexto() {
        const i = indiceEscala();
        if (i < ESCALAS.length - 1) {
            prefs.fontScale = ESCALAS[i + 1];
            salvar(prefs);
            aplicar();
            atualizarPainel();
        }
    }

    function diminuirTexto() {
        const i = indiceEscala();
        if (i > 0) {
            prefs.fontScale = ESCALAS[i - 1];
            salvar(prefs);
            aplicar();
            atualizarPainel();
        }
    }

    function textoPadrao() {
        prefs.fontScale = 1;
        salvar(prefs);
        aplicar();
        atualizarPainel();
    }

    function alternarContraste() {
        prefs.altoContraste = !prefs.altoContraste;
        salvar(prefs);
        aplicar();
        atualizarPainel();
    }

    function alternarSublinhar() {
        prefs.linksSublinhados = !prefs.linksSublinhados;
        salvar(prefs);
        aplicar();
        atualizarPainel();
    }

    function resetar() {
        prefs = Object.assign({}, PADRAO);
        salvar(prefs);
        aplicar();
        atualizarPainel();
    }

    function atualizarPainel() {
        const status = document.getElementById('a11yTextoStatus');
        if (status) status.textContent = textoEscala();

        const btnContraste = document.getElementById('a11yContraste');
        if (btnContraste) {
            btnContraste.setAttribute('aria-pressed', prefs.altoContraste ? 'true' : 'false');
            btnContraste.textContent = prefs.altoContraste ? 'Desativar alto contraste' : 'Ativar alto contraste';
            btnContraste.classList.toggle('a11y-botao--ativo', prefs.altoContraste);
        }

        const btnSub = document.getElementById('a11ySublinhar');
        if (btnSub) {
            btnSub.setAttribute('aria-pressed', prefs.linksSublinhados ? 'true' : 'false');
            btnSub.textContent = prefs.linksSublinhados ? 'Remover sublinhado' : 'Sublinhar links';
            btnSub.classList.toggle('a11y-botao--ativo', prefs.linksSublinhados);
        }

        const menor = document.getElementById('a11yMenor');
        const maior = document.getElementById('a11yMaior');
        if (menor) menor.disabled = indiceEscala() === 0;
        if (maior) maior.disabled = indiceEscala() === ESCALAS.length - 1;
    }

    function iniciarPainel() {
        document.getElementById('a11yMenor')?.addEventListener('click', diminuirTexto);
        document.getElementById('a11yMaior')?.addEventListener('click', aumentarTexto);
        document.getElementById('a11yTextoPadrao')?.addEventListener('click', textoPadrao);
        document.getElementById('a11yContraste')?.addEventListener('click', alternarContraste);
        document.getElementById('a11ySublinhar')?.addEventListener('click', alternarSublinhar);
        document.getElementById('a11yReset')?.addEventListener('click', async function () {
            const mensagem = 'Restaurar todas as preferências de acessibilidade?';
            let confirmou = false;
            if (global.VitaCareModal && global.VitaCareModal.confirmar) {
                confirmou = await global.VitaCareModal.confirmar({
                    mensagem: mensagem,
                    titulo: 'Restaurar preferências',
                    botao: 'Restaurar',
                });
            }
            if (confirmou) resetar();
        });
        atualizarPainel();
    }

    aplicar();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarPainel);
    } else {
        iniciarPainel();
    }

    global.VitaCareA11y = {
        getPrefs: function () { return Object.assign({}, prefs); },
        resetar: resetar,
        aplicar: aplicar,
    };
})(window);
