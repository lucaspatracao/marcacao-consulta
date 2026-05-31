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
[![Figma](https://img.shields.io/badge/Figma-FF4785?logo=figma&logoColor=white)](https://www.figma.com/)

---

## 📺 Vídeos do Projeto

### 🎤 Vídeo de Apresentação

[![Google Drive](https://img.shields.io/badge/Google%20Drive-Assistir%20Vídeo-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/file/d/1cUzozwtJV62PzHQF0LNh0gfgFX66lybV/view?usp=sharing)

> Apresentação do VitaCare demonstrando a solução completa, seus diferenciais e o modelo de negócio.

### 🏆 Vídeo SAGA SENAI

[![Google Drive](https://img.shields.io/badge/Google%20Drive-Assistir%20Vídeo-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/file/d/1BZwAtJNAiGsuAukpfJHJMCvUSam6oQAr/view?usp=sharing)

> Apresentação oficial do VitaCare para a plataforma SAGA SENAI, demonstrando a solução desenvolvida para o desafio de marcação de consultas acessível.

---

## 📄 Relatório Técnico

[![Google Docs](https://img.shields.io/badge/Google%20Docs-Relatório%20Técnico-4285F4?style=for-the-badge&logo=googledocs&logoColor=white)](https://docs.google.com/document/d/13S5zdEDWgDui4Qkc7WLS9qaFGwi1lus4DIwgJ_at0YQ/edit?usp=sharing)

> Documentação completa do projeto, incluindo introdução, fundamentação teórica, desenvolvimento e conclusões.

---

## Links Úteis

[![Google Drive](https://img.shields.io/badge/Google%20Drive-Documentação-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/drive/folders/1D_quSWgk3pWBXbv5N-NpaJ0JHVbaDDTe?usp=drive_link) [![Figma](https://img.shields.io/badge/Figma-Protótipo-FF4785?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/design/nrJQBDVF8kQHMbw780XqR3/Projetos---Marca%C3%A7%C3%A3o-de-Consultas--Prot%C3%B3tipo-?node-id=0-1&t=aZjA2XkYp24a31is-1)

---

## O que é o VitaCare?

O **VitaCare** é um sistema digital de agendamento de consultas médicas focado em **acessibilidade**, **redução de absenteísmo** e **eficiência operacional**. Ele atende pacientes, médicos e funcionários, respeitando requisitos como baixo custo, funcionamento offline e inclusão digital.

### Como Funciona

O paciente pode agendar online ou presencialmente com um funcionário. O sistema:
- Exibe horários disponíveis.
- Envia lembretes automáticos (WhatsApp/SMS – integração futura).
- Permite confirmar presença por link.
- Libera vagas não confirmadas para uma lista de espera inteligente.

**Perfis:**
- **FUNCIONÁRIO** – valida consultas, define agendas, cadastra médicos e faz agendamento offline.
- **MÉDICO** – visualiza própria agenda e histórico dos pacientes.
- **PACIENTE** – agenda consultas, confirma presença, acompanha histórico.

---

## Instalação e Execução

### Pré‑requisitos
- Node.js (v14+)
- Node‑RED (instalado globalmente ou local)
- MySQL Server (5.7+)
- Navegador moderno

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/vitacare.git
cd vitacare
```

### 2. Configure o banco de dados
- Acesse o MySQL (`mysql -u root -p`).
- Execute o script de criação:
  
  ```sql
  SOURCE caminho/para/banco-vitacare.sql;
  ```
  
- Verifique se o banco `vitacare` foi criado e possui dados iniciais (médicos, funcionários, etc.).

### 3. Importe o fluxo no Node‑RED
- Inicie o Node‑RED: `node-red`
- Acesse o editor: `http://localhost:1880`
- Instale os nós: `node-red-node-mysql` (e opcionalmente `node-red-contrib-bcrypt`)
- Clique em **Importar** e cole o conteúdo do arquivo `fluxo-node-red.json`
- Configure a conexão MySQL (nó `vitacare`) com suas credenciais
- Clique em **Deploy**

### 4. Execute o front‑end
Você pode abrir o arquivo `index.html` diretamente no navegador ou usar um servidor local:

```bash
python -m http.server 8000   # ou use Live Server no VS Code
```

### 5. Teste o sistema
- Faça login como paciente ou funcionário, crie uma conta de médico pelo funcionário e agende uma consulta.

---

## Quem Somos

| Membro | Redes Sociais |
|:------:|:-------------:|
| **Lucas Patracão** | [![Instagram](https://img.shields.io/badge/Instagram-@lnpatracao-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/lnpatracao) |
| **Nykolas Isler** | [![Instagram](https://img.shields.io/badge/Instagram-@nykolasgi-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/nykolasgi) |
| **Otávio Garcia** | [![Instagram](https://img.shields.io/badge/Instagram-@tavio.ftw-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/tavio.ftw) |
| **Rafael Rubiá** | [![Instagram](https://img.shields.io/badge/Instagram-@rafa_rubia7-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/rafa_rubia7) |
| **Samuel Santana** | [![Instagram](https://img.shields.io/badge/Instagram-@_samusantana_-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/_samusantana_) |

**Equipe VitaCare – Projeto Integrador SENAI © 2026**
