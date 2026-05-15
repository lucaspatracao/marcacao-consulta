<div align="center">
  <img 
    src="https://github.com/user-attachments/assets/f15af37b-665d-4840-8383-8891874464b8" 
    alt="Logomarca VitaCare" 
    style="max-width: 100%; height: auto; width: 400px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 8px;"
  >
  <img 
    src="https://github.com/user-attachments/assets/bb729cb1-f162-4b34-938a-b229404115df" 
    alt="Logotipo VitaCare" 
    style="max-width: 100%; height: auto; width: 400px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 20px;"
  >
</div>

# VitaCare – Sistema de Marcação de Consultas Acessível

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Node‑RED](https://img.shields.io/badge/Node‑RED-8F0000?logo=nodered&logoColor=white)](https://nodered.org/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Figma](https://img.shields.io/badge/Figma-FF4785?logo=figma&logoColor=white)](https://www.figma.com/design/nrJQBDVF8kQHMbw780XqR3/Projetos---Marca%C3%A7%C3%A3o-de-Consultas--Prot%C3%B3tipo-)

---

## 🔗 Links Úteis

[![Google Drive](https://img.shields.io/badge/Google%20Drive-Documentação-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/drive/folders/1D_quSWgk3pWBXbv5N-NpaJ0JHVbaDDTe?usp=drive_link)

---

## 🌐 Visão Geral

O **VitaCare** é um sistema digital de agendamento de consultas médicas desenvolvido para atender pacientes, médicos, funcionários administrativos e administradores. Seu principal diferencial é unir **acessibilidade**, **redução de absenteísmo** e **eficiência operacional**, respeitando restrições como baixo custo, funcionamento offline e não exclusão digital.

A solução foi concebida no âmbito do desafio **SagaSENAI** e conta com uma arquitetura completa: **front-end responsivo** (HTML, CSS, JS), **back-end em Node‑RED** com API REST, e **banco de dados MySQL** para persistência. O sistema também oferece um **protótio no Figma** e documentação completa no Google Drive.

---

## ⚙️ Como Funciona

O sistema opera em modo híbrido, permitindo agendamento online (pelo paciente) ou presencial/telefônico (por um funcionário). O fluxo principal é:

1. **Solicitação** – Paciente acessa o portal web ou contata a recepção.
2. **Validação** – Dados cadastrais e elegibilidade são verificados (offline usa cópia local sincronizada futuramente).
3. **Exibição de horários** – Mostra agenda médica conforme especialidade e data.
4. **Seleção** – Escolha do horário pelo paciente ou atendente.
5. **Confirmação** – Registro salvo localmente e, se online, enviado ao servidor. Comprovante gerado.
6. **Lembretes automáticos** – Mensagens 48h e 2h antes da consulta (WhatsApp/SMS – integração futura).
7. **Confirmação de presença** – Paciente responde SIM/NÃO. Se não confirmar até 24h antes, a vaga é liberada.
8. **Pós-consulta** – Histórico atualizado com comparecimento/falta e anotações clínicas.

### Perfis de usuário

- **ADMIN** – Acesso total, gerencia usuários e parâmetros globais (pré-cadastrado: `admin@vitacare.local` / `VitaCare2026`).
- **FUNCIONÁRIO** – Valida consultas, define agendas, faz agendamentos offline.
- **MÉDICO** – Gerencia própria agenda, visualiza histórico e registra evoluções.
- **PACIENTE** – Solicita consultas online, confirma presença, acompanha histórico.

---

## 📦 Funcionalidades Implementadas

### Front-end (protótipo estático + integração com API)
- [x] Tela de **Login** com validação via API (`/api/login`).
- [x] Tela de **Cadastro** para novos pacientes (`/api/cadastro`).
- [x] Tela de **Recuperação de senha** (simulada).
- [x] **Agendamento de consultas** – busca de horários e criação via API.
- [x] **Histórico de consultas** por paciente (`/api/historico/:id`).
- [x] **Painel do Administrador** – listagem de usuários, alteração de perfil e parâmetros globais.
- [x] **Painel do Funcionário** – validação de consultas pendentes, calendário, médicos.
- [x] **Painel do Médico** – visualização da agenda e histórico dos pacientes.
- [x] **Painel do Paciente** – agendamento, histórico e perfil.
- [x] **Páginas de acessibilidade** – ajuste de tamanho de texto, alto contraste e tutorial.

### Back-end (Node‑RED + MySQL)
- [x] API REST completa:
  - `POST /api/cadastro` – cria novo usuário (tipo paciente).
  - `POST /api/login` – autentica e retorna perfil + token.
  - `GET /api/horarios` – lista horários disponíveis com filtros.
  - `POST /api/agendar` – agenda uma consulta e bloqueia o horário.
  - `GET /api/historico/:paciente_id` – histórico de consultas do paciente.
  - `GET /api/admin/usuarios` – lista todos os usuários (admin).
  - `PUT /api/admin/usuarios/:id` – altera o tipo de usuário.
  - `GET /api/admin/parametros` – retorna parâmetros do sistema.
  - `POST /api/admin/parametros` – atualiza parâmetros.
  - `GET /api/validar/pendentes` – lista solicitações aguardando validação.
  - `POST /api/validar/confirmar` – confirma ou cancela uma consulta pendente.
- [x] **Persistência MySQL** com tabelas: `usuarios`, `medicos`, `consultas`, `historico_medico`, `horarios_disponiveis`, `parametros_sistema`.
- [x] **Dados iniciais** – admin padrão, médicos, horários de exemplo.

### Acessibilidade e UX
- [x] Contraste mínimo 4.5:1, fonte `Inter` (16px base), suporte a teclado (Tab, Enter).
- [x] Botões grandes (44x44px), labels ARIA, layout responsivo.
- [x] Modo de alto contraste e ajuste de tamanho de texto (JavaScript).
- [x] Tutorial interativo com carrossel CSS puro.

---

## 📁 Estrutura do Projeto

```
vitacare/
├── index.html                     # Página inicial
├── img/                           # Logotipos e ícones
├── html/
│   ├── login/                     # Login, cadastro, recuperação de senha
│   ├── admin/                     # Painel do administrador
│   ├── funcionario/               # Painel do funcionário
│   ├── medico/                    # Painel do médico
│   ├── paciente/                  # Painel do paciente
│   └── outros/                    # Agendamento público, contato, tutorial, acessibilidade
├── css/                           # Estilos globais e específicos por módulo
├── js/                            # Scripts por página e API base (vitacare-api.js)
├── fluxo-node-red.json            # Arquivo de configuração do Node‑RED (endpoints)
└── banco-vitacare.sql             # Script de criação do banco de dados e dados iniciais
```

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia       | Ícone                                                                 | Finalidade                                  |
|------------------|-----------------------------------------------------------------------|---------------------------------------------|
| HTML5            | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) | Estrutura semântica das páginas             |
| CSS3             | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) | Estilização responsiva e acessível          |
| JavaScript (ES6) | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) | Interatividade, chamadas `fetch` e WebSocket |
| Node‑RED         | ![Node‑RED](https://img.shields.io/badge/Node‑RED-8F0000?logo=nodered&logoColor=white) | Backend, API REST e lógica de negócios      |
| MySQL            | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white) | Persistência de dados                       |
| Font Awesome     | ![Font Awesome](https://img.shields.io/badge/Font%20Awesome-528DD7?logo=fontawesome&logoColor=white) | Ícones vetoriais                            |
| Google Fonts     | ![Google Fonts](https://img.shields.io/badge/Google%20Fonts-4285F4?logo=googlefonts&logoColor=white) | Fonte "Inter"                               |
| Figma            | ![Figma](https://img.shields.io/badge/Figma-FF4785?logo=figma&logoColor=white) | Prototipação de interfaces                  |

---

## 🚀 Guia de Instalação e Execução

O sistema é composto por três partes principais: **front-end** (arquivos estáticos), **back-end** (Node‑RED) e **banco de dados** (MySQL). Pode ser executado em um único computador ou em máquinas separadas.

### Pré-requisitos

- **Node.js** (versão 14 ou superior) e **npm**.
- **Node‑RED** (instalado globalmente ou localmente).
- **MySQL Server** (versão 5.7 ou 8.0).
- Navegador web moderno (Chrome, Firefox, Edge).

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/vitacare.git
cd vitacare
```

### 2. Configure o Banco de Dados MySQL

- Acesse o MySQL (ex.: `mysql -u root -p`).
- Execute o script de criação do banco e das tabelas:

```sql
SOURCE caminho/para/banco-vitacare.sql;
```

Ou copie o conteúdo do arquivo `banco-vitacare.sql` e cole no cliente MySQL.

- Verifique se o banco `vitacare` foi criado e as tabelas estão populadas com dados iniciais (admin, médicos, parâmetros).

### 3. Importe e Configure o Node‑RED

- Inicie o Node‑RED:

```bash
node-red
```

- Acesse o editor: `http://localhost:1880`.
- Instale os nós complementares (se ainda não tiver):
  - `node-red-node-mysql`
  - (Opcional) `node-red-contrib-bcrypt` – para hashing de senhas. Caso não instale, substitua `bcrypt` no código por uma função de comparação simples (apenas para testes).
- No menu, clique em **Importar** e cole o conteúdo do arquivo `fluxo-node-red.json` (disponível no repositório).
- Configure a conexão com o MySQL:
  - Localize o nó `MySQLdatabase` com nome `vitacare`.
  - Ajuste os parâmetros (host, porta, usuário, senha) conforme sua instalação.
- **Ajuste a porta de escuta**:
  - Por padrão, o Node‑RED usa a porta 1880. O front-end espera a API na mesma origem (porta 1880). Se mudar, atualize a variável `API_BASE` no arquivo `js/vitacare-api.js`.
- Clique em **Deploy** (canto superior direito).

> **Importante:** Para que as senhas sejam validadas corretamente, o nó `bcrypt` deve estar disponível. No código do fluxo, a função `Processar Cadastro` e `Verificar Senha` utilizam `bcrypt`. Você pode instalar o pacote `bcryptjs` globalmente no Node‑RED ou substituir por uma comparação simples em ambiente de demonstração.

### 4. Execute o Front-end

Como o front-end é estático, você pode abrir o arquivo `index.html` diretamente no navegador ou usar um servidor local:

```bash
# Usando Python 3
python -m http.server 8000

# Ou com extensão Live Server do VS Code
```

Acesse `http://localhost:8000` (ou a porta escolhida).

### 5. Teste o Sistema

- **Acesse o login**: `admin@vitacare.local` / `VitaCare2026`. Após o login, você será redirecionado para o painel do administrador.
- **Cadastre um novo paciente**: use o formulário de cadastro. Após cadastrar, faça login com o novo e-mail/senha para acessar o painel do paciente.
- **Agende uma consulta**: no painel do paciente ou na página pública de agendamento, busque horários e confirme.
- **Administrador**: na listagem de usuários, altere o tipo de um usuário para `funcionario` ou `medico` e veja os respectivos painéis.

---

## 👥 Equipe

| Membro | Redes Sociais |
|:------:|:-------------:|
| **Lucas Patracão** | [![Instagram](https://img.shields.io/badge/Instagram-@lnpatracao-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/lnpatracao) |
| **Nykolas Isler** | [![Instagram](https://img.shields.io/badge/Instagram-@maricosta-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/nykolasgi) |
| **Otávio Garcia** | [![Instagram](https://img.shields.io/badge/Instagram-@maricosta-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/tavio.ftw) |
| **Rafael Rubiá** | [![Instagram](https://img.shields.io/badge/Instagram-@rafaoliveira-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/rafa_rubia7) |
| **Samuel Santana** | [![Instagram](https://img.shields.io/badge/Instagram-@camilarocha-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/_samusantana_) |

**Equipe VitaCare – Projeto Integrador SENAI © 2026**

---
