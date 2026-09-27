<header style="display: flex; justify-content: center; align-items: center; gap: 16px; font-size: 50px; color: #e2817b;">
    Pokedex Web
    <img src="assets/pidjhin.jpg" height=70>
</header>


## Sobre
Aplicação web que utiliza a PokeAPI para consultar informações de Pokémon e apresentar os dados na interface do usuário.

Este projeto foi criado com a finalidade de estudos em desenvolvimento web com HTML e CSS, consumo de APIs e organização de páginas web.

## Funcionalidades

- Visualizar lista: A tela inicial contêm a lista dos pokémons da primeira geração, o usuário consegue visualizar no formato grade, com informações de nome, imagem, tipos e ID da pokedex. 

- Visualizar detalhes: ao clicar em um pokemon, é carregado uma janela com mais informações sobre um pokemon. 

- Buscar pokemon: O usuário pode pesquisar pokemons pelo nome na barra de busca. A pagina é alterada dinamicamente ao inserir os caracteres de busca. 

- Filtrar dados: O usuário pode aplicar filtros por tipo ou geração específica.

### Expansões:
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
git clone
```
2. Navegar até a pasta
```
cd poke_api
```

3. Executar comando para carregamento dos dados
```
node src/scripts/dataset
```

3. Abra o projeto com a extensão Live Server do VsCode.

## Conceitos trabalhados
- Desenvolver páginas com HTML e CSS
- Manipulação do DOM
- Programação Assíncrona (Async/await)
- Eventos com addEventListener()
- Consumo de APIs
- JSON

## Desafios
- Reduzir a quantidade de requisições à API
- Organizar a estrutura dos dados
- Estruturar o código para facilitar manutenção
