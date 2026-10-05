# BarberManager

Aplicação web para agendamento e gestão da agenda de uma barbearia.

## Sobre o projeto

O BarberManager permite criar agendamentos, bloquear horários, controlar pagamentos e acompanhar o histórico e a fidelidade dos clientes, com avisos sobre cortes e clientes sumidos.

A agenda é organizada por data selecionada e os dados são salvos em uma API local simulada com JSON Server.

## Serviços

| Serviço | Duração | Preço |
| ------- | ------- | ----- |
| Corte | 30 min | R$ 50 |
| Barba | 20 min | R$ 30 |
| Combo | 50 min | R$ 80 |

## Funcionalidades

- Criação, edição e cancelamento de agendamentos com confirmação
- Agenda do dia organizada por manhã, tarde e noite, com ocupação e total
- Navegação por data com calendário próprio e prévia do dia seguinte
- Bloqueio de horários e repetição semanal para clientes fixos
- Conclusão, falta, controle de pagamento e ação de fechar o dia
- Busca, filtros por status e ordenação dos agendamentos
- Histórico do cliente com fidelidade a cada 10 cortes e histórico geral
- Avisos de corte grátis, cliente sumido e pagamento pendente
- Modo balcão e layout responsivo

## Tecnologias

- HTML
- CSS
- JavaScript
- Webpack
- Babel
- Day.js
- JSON Server

## Estrutura do projeto

```text
src/
├── assets/
├── data/
├── libs/
├── modules/
├── services/
├── styles/
└── utils/
```

- `assets/` - ícones e imagens da interface
- `data/` - catálogo de serviços
- `modules/` - formulários, agendamentos e interface
- `services/` - comunicação com a API local
- `styles/` - estilos da aplicação
- `utils/` - datas, horários e regras auxiliares

Arquivos na raiz:

- `server.json` - base de dados local com agendamentos e bloqueios
- `webpack.config.js` - configuração de build e servidor de desenvolvimento

## Como executar

> A aplicação precisa de dois processos rodando ao mesmo tempo: a API local e o servidor de desenvolvimento.

Pré-requisito: [Node.js](https://nodejs.org) e npm instalado.


1. Clone o repositório

```bash
git clone https://github.com/kevinluann/hairday.git
cd hairday
```

2. Instale as dependências:

```bash
npm install
```

3. Em um terminal, inicie a API (roda em `http://localhost:3333`):

```bash
npm run server
```

4. Em outro terminal, inicie a aplicação (abre em `http://localhost:3000`):

```bash
npm run dev
```

Para gerar o build de produção:

```bash
npm run build
```
> Gera `dist/` (`main.js` + `index.html` + `assets/`).
