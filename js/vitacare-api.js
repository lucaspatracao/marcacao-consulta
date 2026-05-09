// =========================================
// VitaCare – API base (Node‑RED)
// =========================================
const API_BASE = window.location.origin;   // mesmo servidor onde o Node‑RED está

async function apiRequisicao(url, metodo = 'GET', dados = null) {
    const opcoes = {
        method: metodo,
        headers: { 'Content-Type': 'application/json' }
    };
    if (dados) opcoes.body = JSON.stringify(dados);
    try {
        const resposta = await fetch(API_BASE + url, opcoes);
        return await resposta.json();
    } catch (erro) {
        console.error('Erro na requisição:', erro);
        return { erro: 'Falha na comunicação com o servidor.' };
    }
}

function exibirMensagem(elementoId, texto, tipo = 'info') {
    const el = document.getElementById(elementoId);
    if (!el) return;
    el.textContent = texto;
    el.className = `mensagem-feedback texto-${tipo}`;
}