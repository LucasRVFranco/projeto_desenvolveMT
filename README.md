# Projeto Prático Desenvolve MT

### Dados candidato:
- **Nome:** Lucas Rondon Vieira Franco
- **E-mail:** lucasfranco.lf92@gmail.com

---

## 📖 Descrição do Projeto

SPA para consulta de pessoas desaparecidas, consumindo a API pública da Polícia Judiciária Civil de Mato Grosso.  

---

## 🏛️ Padrão
- SPA (Single Page Application)  


## 🛠️ Tecnologias
- Angular  
- TypeScript  
- CSS (estilização customizada)  

---

## ⚒️ Ferramentas
- VSCode (Visual Studio Code)  
- Git / GitHub  
- Docker  

---

## 🚀 Como rodar o projeto

### Pré-requisitos:
- Ter o [Docker] instalado e em execução  

---

### 👉 Rodando com Docker Compose

1. **Suba a aplicação com Docker Compose** 
# Na raiz do projeot rode: 
docker compose up -d 

# Acesse no navegador
http://localhost:8080

# Para remover o container
docker compose down

---

### 👉 Rodando com Docker

# Build da imagem
docker build -t desenvolvemtt:latest .

# Rodar o container
docker run --rm -p 8080:80 desenvolvemtt:latest

# Acesse
http://localhost:8080

---

