# PetVida
PetVida – Clínica Veterinária & Petshop
Site completo para clínica veterinária e petshop com painel administrativo e banco de dados local.

Funcionalidades

Site vitrine — hero, serviços, produtos, depoimentos e contato
Agendamentos — cadastro, filtros por status e controle (confirmar, concluir, cancelar)
Produtos — cadastro completo com estoque e alerta de estoque baixo
Serviços — cadastro com preço, duração e descrição
Auto-save — todos os dados salvos automaticamente no navegador via localStorage


Como rodar
Pré-requisito: Node.js instalado (nodejs.org)
bashnpm create vite@latest petvida -- --template react
cd petvida
npm install
Substitua o conteúdo de src/App.jsx pelo arquivo do projeto e rode:
bashnpm run dev
Acesse http://localhost:5173

Tecnologias

React 18
Vite
CSS-in-JS (estilos inline)
localStorage (banco de dados)


Estrutura
petvida/
├── src/
│   └── App.jsx       # Todo o código da aplicação
├── index.html
└── package.json

📌 Observação
O projeto usa localStorage para persistir os dados. Isso significa que as informações ficam salvas no navegador do usuário e não são compartilhadas entre dispositivos diferentes.
