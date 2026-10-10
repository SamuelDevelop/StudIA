## Como Executar o Projeto Localmente

### 1. Iniciar o Banco de Dados (PostgreSQL)

O banco de dados roda isolado via Docker Compose:

```bash
cd src/backend/studia
docker compose up -d
```

O container PostgreSQL estará disponível em `localhost:5433` com as credenciais padrão:
- Banco: `studia`
- Usuário: `studia`
- Senha: `studia_password`

---

### 2. Iniciar o Ollama e Baixar o Modelo Local

Se o Ollama já estiver instalado no sistema ou executando em container:

```bash
docker run -d --name ollama -p 11434:11434 -v ollama_data:/root/.ollama --restart always ollama/ollama
docker exec ollama ollama pull qwen2.5:1.5b
```

O serviço da IA local responderá em `http://localhost:11434`.

---

### 3. Executar o Backend (Spring Boot)

Com o Java 21 instalado e a partir do diretório do backend:

```bash
cd src/backend/studia
./mvnw spring-boot:run
```

A API REST estará disponível em `http://localhost:8080`.

#### Principais Variáveis de Ambiente (opcionais com valores padrão prontos):
- `SPRING_DATASOURCE_URL`: `jdbc:postgresql://localhost:5433/studia`
- `SPRING_DATASOURCE_USERNAME`: `studia`
- `SPRING_DATASOURCE_PASSWORD`: `studia_password`
- `OLLAMA_BASE_URL`: `http://localhost:11434`
- `OLLAMA_MODEL`: `qwen2.5:1.5b`
- `JWT_SECRET`: chave de assinatura segura de 256 bits

---

### 4. Executar o Frontend (Next.js)

A partir do diretório do frontend:

```bash
cd src/frontend/studia
npm install
npm run dev
```

Acesse a aplicação no navegador em `http://localhost:3000`.
