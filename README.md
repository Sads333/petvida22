🐾 PetVida – Clínica Veterinária & Petshop

Site completo para clínica veterinária e petshop com painel administrativo e banco de dados local.


✨ Funcionalidades


🏠 Site vitrine — hero, serviços, produtos, depoimentos e contato
📅 Agendamentos — cadastro, filtros por status e controle completo
🛒 Produtos — cadastro com estoque e alerta de estoque baixo
🩺 Serviços — cadastro com preço, duração e descrição
💾 Auto-save — dados salvos automaticamente via localStorage
💬 WhatsApp — botão flutuante de contato



🚀 Como rodar

Pré-requisito: Node.js instalado (nodejs.org)

bash# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

Acesse http://localhost:5173 no navegador.


🛠 Tecnologias


React 18
Vite
CSS-in-JS (estilos inline)
localStorage (banco de dados)



📁 Estrutura

pet_vida/
├── src/
│   └── App.jsx        # Todo o código da aplicação
├── public/
├── index.html
├── package.json
└── vite.config.js


📌 Observação

Os dados ficam salvos no navegador via localStorage. Isso significa que as informações são salvas localmente e não são compartilhadas entre dispositivos diferentes.


👨‍💻 Como atualizar no GitHub

bashgit add .
git commit -m "descrição da mudança"
git push
