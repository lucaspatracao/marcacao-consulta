<div align="center">
  <img 
    src="https://github.com/user-attachments/assets/f15af37b-665d-4840-8383-8891874464b8" 
    alt="Logomarca Conecta Saúde" 
    style="max-width: 100%; height: auto; width: 400px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 8px;"
  >
  <img 
    src="https://github.com/user-attachments/assets/bb729cb1-f162-4b34-938a-b229404115df" 
    alt="Logotipo Conecta Saúde" 
    style="max-width: 100%; height: auto; width: 400px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 20px;"
  >
</div>

# Projeto Integrador: Conecta Saúde
## Sistema de Marcação de Consultas Acessível

---

## 🎨 Figma - Protótipo do Projeto

[![Figma](https://img.shields.io/badge/Figma-Protótipo-FF4785?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/design/nrJQBDVF8kQHMbw780XqR3/Projetos---Marca%C3%A7%C3%A3o-de-Consultas--Prot%C3%B3tipo-?node-id=0-1&t=aZjA2XkYp24a31is-1)

## 📁 Drive - Documentação

[![Google Drive](https://img.shields.io/badge/Google%20Drive-Documentação-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/file/d/1qvHUsGlULXYvHcsf3mBO38dPqwBa6gj7/view?usp=sharing)

---

## 1. Resumo

O presente projeto visa desenvolver um sistema digital de agendamento de consultas médicas que atenda às necessidades de pacientes, médicos, funcionários administrativos e administradores, com foco em acessibilidade, redução de absenteísmo e eficiência operacional. A solução foi concebida para respeitar as restrições do contratante (SagaSENAI), incluindo baixo custo, funcionamento offline, compatibilidade com sistemas legados e não exclusão digital.

---

## 2. Contexto e Problema

Atualmente, o agendamento de consultas é realizado de forma híbrida (presencial, telefone, WhatsApp, e-mail), com etapas manuais, planilhas desconectadas e alta dependência de comunicação informal. Isso gera:

- Longos tempos de espera entre solicitação e confirmação.
- Falta de padronização entre canais.
- Dificuldade de acesso para idosos e pessoas com baixa familiaridade digital.
- Alta taxa de absenteísmo (pacientes não comparecem).
- Sobrecarga da equipe administrativa.
- Ausência de histórico centralizado do paciente.

---

## 3. Objetivos do Projeto

### 3.1 Objetivos Estratégicos (alinhados ao SagaSENAI)

- Reduzir o tempo médio entre a solicitação e a confirmação da consulta.
- Melhorar a experiência do paciente com acesso facilitado e informações claras.
- Garantir acessibilidade para idosos e pessoas com baixa escolaridade digital.
- Diminuir o absenteísmo por meio de lembretes automáticos e confirmação ativa.
- Centralizar histórico de consultas e disponibilidade médica.
- Padronizar o processo de agendamento, eliminando retrabalho e falhas.
- Otimizar o uso da equipe administrativa, reduzindo sobrecarga.
- Garantir sustentabilidade (fim do uso de papéis e planilhas manuais).

### 3.2 Objetivos Específicos

- Desenvolver uma interface web responsiva e acessível (WCAG 2.1 nível AA).
- Implementar modo offline para uso em áreas sem conectividade.
- Permitir agendamento tanto pelo paciente (online) quanto por atendente (presencial/telefone).
- Gerar lembretes automáticos via WhatsApp/SMS (integração com gateway de baixo custo).
- Disponibilizar painel administrativo para gestão de usuários e permissões.

---

## 4. Perfis de Usuário e Funcionalidades

O sistema possui quatro tipos de usuário. O **ADMIN** é pré-cadastrado. Todos os demais são criados como **PACIENTE**; o ADMIN pode promovê-los a **FUNCIONÁRIO** ou **MÉDICO**.

### 4.1 ADMIN (pré-definido)

- Acesso total ao sistema.
- Visualizar lista completa de usuários cadastrados.
- Alterar tipo de usuário (Paciente ↔ Funcionário ↔ Médico).
- Configurar parâmetros globais (horários padrão, especialidades, convênios).

### 4.2 FUNCIONÁRIO (Recepcionista / RH)

- Validar consultas solicitadas por pacientes.
- Ver e definir o calendário/agenda do médico (disponibilidade).
- Realizar agendamento offline (em nome do paciente, sem internet).
- Gerenciar perfil próprio.
- Visualizar histórico de consultas de pacientes (quando necessário para triagem).

### 4.3 MÉDICO

- Ver e definir seu próprio calendário/consultas.
- Acessar histórico de consultas dos seus pacientes.
- Registrar informações clínicas pós-consulta (se aplicável).
- Gerenciar perfil próprio.

### 4.4 PACIENTE

- Solicitar agendamento de consultas online.
- Consultar horários disponíveis em tempo real (quando online).
- Visualizar histórico de suas próprias consultas.
- Confirmar presença via link (WhatsApp/SMS).
- Gerenciar perfil próprio.
- Caso não tenha acesso digital, pode solicitar agendamento presencial ou telefônico a um funcionário.

---

## 5. Funcionalidades Transversais (Inteligentes)

- **Lembretes automáticos:** envio de mensagem 48h e 2h antes da consulta.
- **Confirmação ativa de presença:** paciente responde SIM/NÃO. Se não confirmar em até 24h antes, a vaga é liberada automaticamente.
- **Liberação automática de vagas não confirmadas** para a lista de espera.
- **Lista de espera inteligente:** notifica o próximo paciente da fila assim que uma vaga é liberada (por WhatsApp/SMS).
- **Sincronização offline-first:** os dados locais são armazenados no navegador (IndexedDB) e sincronizados com o servidor quando a conexão é restabelecida.

---

## 6. Restrições Obrigatórias (Atendendo ao SagaSENAI)

- **Baixo custo:** utilização de infraestrutura existente (computadores da recepção, servidor local ou cloud gratuita como Firebase, Supabase ou PouchDB). Software livre e código aberto priorizado.
- **Baixa complexidade de uso:** interface com botões grandes, fontes legíveis (mínimo 16px), passo a passo guiado, ícones associados a textos. Testes de usabilidade com idosos e pessoas com baixa escolaridade.
- **Não dependência total de internet:** o sistema deve funcionar completamente offline (modo local) e sincronizar quando a conexão retornar. A recepção deve poder agendar mesmo sem internet.
- **Compatibilidade com sistemas legados:** prever importação/exportação de dados (CSV, JSON) para agendas médicas e cadastros de pacientes existentes. API REST leve para integração futura.
- **Não exclusão digital:** manter canais presenciais e telefônicos como alternativas. O sistema permite que um atendente realize o agendamento em nome do paciente que não tem acesso digital.

---

## 7. Fluxo Completo do Sistema (Modo Híbrido)

1. **Solicitação:**  
   - Paciente acessa o portal web (se tiver acesso) OU contata a recepção (presencial/telefone).
2. **Validação dos dados:**  
   - Sistema verifica dados cadastrais e elegibilidade (convênio). Em modo offline, usa cópia local sincronizada.
3. **Exibição de horários disponíveis:**  
   - Mostra agenda médica conforme especialidade e data. Offline: mostra última agenda sincronizada, com aviso de "dados podem não estar atualizados".
4. **Seleção do horário:**  
   - Paciente (ou atendente) escolhe data e horário.
5. **Confirmação do agendamento:**  
   - Registro salvo localmente e marcado para sincronização. Se online, enviado imediatamente ao servidor. Comprovante gerado (exibido na tela, enviado por e-mail/WhatsApp quando possível). Em modo offline, o comprovante pode ser impresso ou anotado manualmente.
6. **Lembretes automáticos:**  
   - 48h e 2h antes da consulta, sistema envia mensagem (WhatsApp/SMS) com link para confirmar presença.
7. **Confirmação de presença:**  
   - Paciente clica em "Confirmar" ou "Cancelar". Se não houver resposta até 24h antes, a vaga é liberada para a lista de espera.
8. **Pós-consulta:**  
   - Histórico atualizado com registro de comparecimento ou falta. Médico pode adicionar anotações clínicas.

---

## 8. Diretrizes de Design e Identidade Visual

### Cores principais (fornecidas pelo cliente)

| Cor         | HEX       | Uso                                                                 |
|-------------|-----------|---------------------------------------------------------------------|
| Vermelho    | `#EE2A4F` | Ações destrutivas, cancelamento, exclusão                          |
| Rosa        | `#FF689E` | Destaques, mensagens de sucesso                                    |
| Azul        | `#449AFF` | Botões primários, links                                             |
| Azul escuro | `#5F92F4` | Cabeçalhos, navegação principal                                     |
| Marrom      | `#E45E4C` | Avisos, erros, campos obrigatórios                                 |

### Acessibilidade

- Contraste mínimo de 4.5:1 entre texto e fundo.
- Fonte padrão sem serifa (Arial, Helvetica, sistema).
- Tamanho mínimo de 16px em dispositivos móveis.
- Suporte a leitores de tela (ARIA labels, roles, keyboard navigation).
- Modo de alto contraste opcional.
- Espaçamento clicável mínimo de 44x44px para botões em touch.

---

## 9. Conclusão

O **Sistema de Marcação de Consultas Acessível** atende integralmente aos requisitos do desafio SagaSENAI, combinando inovação digital com respeito às restrições de baixo custo, inclusão digital e resiliência offline. A solução proposta reduzirá significativamente o tempo de espera, o absenteísmo e a carga administrativa, proporcionando uma experiência mais humanizada e eficiente para todos os envolvidos.

---
