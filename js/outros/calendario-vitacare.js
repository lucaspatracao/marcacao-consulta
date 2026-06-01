(function (global) {
    const MESES = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];
    const DIAS_SEM = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    function isoLocal(data) {
        const y = data.getFullYear();
        const m = String(data.getMonth() + 1).padStart(2, '0');
        const d = String(data.getDate()).padStart(2, '0');
        return y + '-' + m + '-' + d;
    }

    function montar(container, opcoes) {
        opcoes = opcoes || {};
        let anoVisivel;
        let mesVisivel;
        let dataSelecionada = opcoes.dataInicial || isoLocal(new Date());
        let resumoDias = opcoes.resumoDias || {};

        function definirMesVisivel(iso) {
            const p = iso.split('-');
            anoVisivel = Number(p[0]);
            mesVisivel = Number(p[1]) - 1;
        }

        definirMesVisivel(dataSelecionada);

        function renderizar() {
            if (!container) return;
            const hoje = isoLocal(new Date());
            const primeiro = new Date(anoVisivel, mesVisivel, 1);
            const ultimo = new Date(anoVisivel, mesVisivel + 1, 0);
            const inicioGrade = primeiro.getDay();
            const totalDias = ultimo.getDate();

            const nav = document.createElement('div');
            nav.className = 'calendario-vitacare__nav';
            nav.innerHTML =
                '<button type="button" class="calendario-vitacare__nav-btn" data-acao="anterior" aria-label="Mês anterior"><i class="fas fa-chevron-left"></i></button>' +
                '<span class="calendario-vitacare__mes-titulo">' + MESES[mesVisivel] + ' ' + anoVisivel + '</span>' +
                '<button type="button" class="calendario-vitacare__nav-btn" data-acao="proximo" aria-label="Próximo mês"><i class="fas fa-chevron-right"></i></button>';

            const gradeCab = document.createElement('div');
            gradeCab.className = 'calendario-vitacare__cabecalho';
            gradeCab.setAttribute('aria-hidden', 'true');
            DIAS_SEM.forEach(function (nome) {
                const c = document.createElement('span');
                c.className = 'calendario-vitacare__dia-semana';
                c.textContent = nome;
                gradeCab.appendChild(c);
            });

            const grade = document.createElement('div');
            grade.className = 'calendario-vitacare__grade';
            grade.setAttribute('role', 'grid');
            grade.setAttribute('aria-label', 'Dias do mês');

            for (let i = 0; i < inicioGrade; i++) {
                const vazio = document.createElement('span');
                vazio.className = 'calendario-vitacare__celula calendario-vitacare__celula--vazia';
                grade.appendChild(vazio);
            }

            for (let dia = 1; dia <= totalDias; dia++) {
                const iso = anoVisivel + '-' + String(mesVisivel + 1).padStart(2, '0') + '-' + String(dia).padStart(2, '0');
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'calendario-vitacare__dia';
                btn.textContent = String(dia);
                btn.setAttribute('data-data', iso);
                btn.setAttribute('aria-label', 'Dia ' + dia);

                const resumo = resumoDias[iso];
                if (resumo) btn.classList.add('calendario-vitacare__dia--' + resumo);
                if (iso === dataSelecionada) btn.classList.add('calendario-vitacare__dia--selecionado');
                if (!opcoes.permitirPassado && iso < hoje) {
                    btn.classList.add('calendario-vitacare__dia--passado');
                    btn.disabled = true;
                }

                btn.addEventListener('click', function () {
                    if (btn.disabled) return;
                    dataSelecionada = iso;
                    renderizar();
                    if (typeof opcoes.onSelecionarDia === 'function') opcoes.onSelecionarDia(iso);
                });
                grade.appendChild(btn);
            }

            const legenda = document.createElement('div');
            legenda.className = 'calendario-vitacare__legenda';
            legenda.innerHTML =
                '<span><i class="calendario-vitacare__ponto calendario-vitacare__ponto--livre"></i> Com vagas</span>' +
                '<span><i class="calendario-vitacare__ponto calendario-vitacare__ponto--parcial"></i> Poucas vagas</span>' +
                '<span><i class="calendario-vitacare__ponto calendario-vitacare__ponto--cheio"></i> Lotado</span>';

            container.innerHTML = '';
            container.className = 'calendario-vitacare';
            container.appendChild(nav);
            container.appendChild(gradeCab);
            container.appendChild(grade);
            container.appendChild(legenda);

            nav.querySelector('[data-acao="anterior"]').addEventListener('click', function () {
                mesVisivel -= 1;
                if (mesVisivel < 0) { mesVisivel = 11; anoVisivel -= 1; }
                notificarMudancaMes();
            });
            nav.querySelector('[data-acao="proximo"]').addEventListener('click', function () {
                mesVisivel += 1;
                if (mesVisivel > 11) { mesVisivel = 0; anoVisivel += 1; }
                notificarMudancaMes();
            });
        }

        function notificarMudancaMes() {
            renderizar();
            const iso = anoVisivel + '-' + String(mesVisivel + 1).padStart(2, '0') + '-01';
            if (typeof opcoes.onMudarMes === 'function') opcoes.onMudarMes(anoVisivel, mesVisivel, iso);
        }

        renderizar();

        return {
            atualizarResumo: function (resumo) {
                resumoDias = resumo || {};
                renderizar();
            },
            getDataSelecionada: function () { return dataSelecionada; },
            setDataSelecionada: function (iso) {
                dataSelecionada = iso;
                definirMesVisivel(iso);
                renderizar();
            },
            getMesVisivel: function () {
                return { ano: anoVisivel, mes: mesVisivel };
            },
        };
    }

    global.VitaCareCalendario = { montar: montar, isoLocal: isoLocal };
})(window);
