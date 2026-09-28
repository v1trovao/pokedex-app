<div align="center">
  <img src="assets/pidjhin.jpg" height="70" alt="Pidjhin">
  <h1>Pokedex Web</h1>
</div>

<p align="center">
  <img src="http://img.shields.io/static/v1?label=status&message=in%20progress&color=GREEN" alt="In progress">
  <img src="https://img.shields.io/npm/v/package" alt="npm-version">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-563d7c?style=flat&logo=css3&logoColor=white" alt="CSS3">
</p>


Aplicação web que utiliza a PokeAPI para consultar informações de Pokémon e apresentar os dados na interface do usuário.

Este projeto foi criado com a finalidade de estudos em desenvolvimento web com HTML e CSS, consumo de APIs e organização de páginas web.

## Funcionalidades

- **Visualizar lista**: A tela inicial contêm a lista dos pokémons da primeira geração, o usuário consegue visualizar no formato grade, com informações de nome, imagem, tipos e ID da pokedex. 

- **Visualizar detalhes**: ao clicar em um pokemon, é carregado uma janela com mais informações sobre um pokemon. 

- **Buscar pokemon**: O usuário pode pesquisar pokemons pelo nome na barra de busca. A pagina é alterada dinamicamente ao inserir os caracteres de busca. 

- **Filtrar busca**: O usuário pode aplicar filtros na barra de busca por tipo ou geração específica.

### Expansões
- Servidor de base
- Opção de favoritos
- Comparador de Pokemon

### Ideias Futuras
- Implementação de Pokedle 
- Dashboard dos stats do Pokemon
- Montagem de equipes
- Cadastro de usuário e Login

## Tecnologias
- HTML, CSS e JavaScript: Estrutura da página
- PokeAPI: Acesso aos dados dos pokémons, disponível em: https://pokeapi.co/
- Node.js: Scripts e manipulação de dados JSON
- Semantic UI: Framework para CSS focado em responsividade e HTML semântico

## Requisitos
- Navegador de sua preferência
- VSCode atualizado
- Extensão Live Server

## Como executar

1. Clonar repositório
```
git clone https://github.com/v1trovao/pokedex-app
```
2. Navegar até a pasta
```
cd pokedex-app
```

3. Executar comando para carregamento dos dados (opcional)
```
node run load
```

4. Abra o projeto com a extensão Live Server do VsCode.

## Conceitos trabalhados
- Desenvolver páginas com HTML e CSS
- Manipulação do DOM
- Programação Assíncrona (Async/await)
- Eventos com addEventListener()
- Consumo de APIs
- JSON

### Desafios
- Reduzir a quantidade de requisições à API
- Organizar a estrutura dos dados
- Estruturar o código para facilitar manutenção
