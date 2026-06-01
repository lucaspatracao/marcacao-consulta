#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const flowsPath = path.join(__dirname, '..', 'flows.json');
const flows = JSON.parse(fs.readFileSync(flowsPath, 'utf8'));
const rotas = [
    'GET /paciente/perfil',
    'PUT /paciente/perfil',
    'GET /funcionario/perfil',
    'PUT /funcionario/perfil',
    'GET /medico/perfil',
];
const httpIn = flows.filter((n) => n.type === 'http in' && n.url);
const faltando = rotas.filter((r) => {
    const [method, url] = r.split(' ');
    return !httpIn.some((n) => n.method === method.toLowerCase() && n.url === url);
});
if (faltando.length) {
    console.error('Rotas ausentes em flows.json:\n' + faltando.join('\n'));
    process.exit(1);
}
console.log('OK: todas as rotas de perfil estao em flows.json');
console.log('Reinicie o Node-RED (pare e rode: npm start) e teste salvar o perfil.');
