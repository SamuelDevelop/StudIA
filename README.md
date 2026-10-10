# StudIA
_[Projeto desenvolido com amplo uso de IA para fins estudo e de testagem de aplicação de modelos de IA local]_

Plataforma web de estudos impulsionada por Inteligência Artificial local via Ollama.

O StudIA permite criar uma conta, autenticar-se com JWT, gerar materiais de estudo didáticos personalizados a partir de qualquer tema, revisar conceitos através de flashcards interativos e testar o aprendizado com questionários avaliativos com gabarito imediato.

---

## Arquitetura e Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Lucide Icons, Axios
- **Backend**: Java 21, Spring Boot, Spring Security, JWT, PostgreSQL, JPA / Hibernate
- **IA Local**: Ollama executando modelo local (ex: `qwen2.5:1.5b` ou `llama3.2:1b`)
- **Banco de Dados**: PostgreSQL 16 via Docker

---

## Endpoints da API

### Autenticação
- `POST /api/auth/register`: Cadastro de usuário (`name`, `email`, `password`)
- `POST /api/auth/login`: Autenticação e emissão do token JWT
- `POST /api/auth/logout`: Encerramento da sessão
- `GET /api/auth/me`: Obtenção do perfil do usuário autenticado

### Estudos
- `GET /api/studies`: Lista resumida dos estudos do usuário autenticado
- `POST /api/studies/generate`: Gera estudo com Ollama, valida contrato JSON e persiste
- `GET /api/studies/{id}`: Detalhes completos do estudo (conteúdo, flashcards, questionário)
- `DELETE /api/studies/{id}`: Exclusão com validação estrita de posse
