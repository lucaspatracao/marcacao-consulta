#!/usr/bin/env node
/**
 * Garante nos de perfil no flows.json (o editor Node-RED pode remove-los ao salvar).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const flowsPath = path.join(root, 'flows.json');
const addonPath = path.join(root, 'flows-perfil-addon.json');
const backupPath = path.join(root, '.flows.json.backup');

function loadJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

let addon;
if (fs.existsSync(addonPath)) {
    addon = loadJson(addonPath);
} else if (fs.existsSync(backupPath)) {
    const backup = loadJson(backupPath);
    addon = backup.filter(function (n) {
        return n.id && String(n.id).startsWith('pf-');
    });
    fs.writeFileSync(addonPath, JSON.stringify(addon, null, 4));
    console.log('Criado flows-perfil-addon.json a partir do backup.');
} else {
    console.error('Nenhum flows-perfil-addon.json encontrado.');
    process.exit(1);
}

const flows = loadJson(flowsPath);
const ids = new Set(flows.map(function (n) { return n.id; }));
let added = 0;

addon.forEach(function (node) {
    if (!ids.has(node.id)) {
        flows.push(node);
        ids.add(node.id);
        added++;
    }
});

fs.writeFileSync(flowsPath, JSON.stringify(flows, null, 4));
console.log('flows.json atualizado. Nos de perfil adicionados:', added, '| total addon:', addon.length);
