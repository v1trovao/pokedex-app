const path = require("path");
const fs = require("fs");

const LIMIT = 10; // Total de pokemons
const OFFSET = 0;   // Começar de qual ID
const FILEPATH = "../pokedata.json"

// Salvar os dados obtidos da API localmente (in-testes)
function saveLocal(item){
    let jsonData = JSON.stringify(item, null, 2);
    let blob = new Blob([jsonData], { type: "application/json"});
    let filename = "pokedata.json";

    // Salva no storage (pendente)
    /*localStorage.setItem(
        items,
        JSON.stringify(pokemons)
    )*/

    const pokePath = path.join(__dirname, FILEPATH);
    fs.writeFileSync(pokePath, jsonData);
    console.log(`\n Teste salvo em ${pokePath}`)
}

async function loadLocal(){
    
    try {
        console.log(`Tentando abrir: ${FILEPATH}`)
        const data = fs.readFileSync(FILEPATH, 'utf8')
        console.log("Carregou dados brutos...");
        const pokeData = JSON.parse(data);
        console.log("Convertido dados pokemon...")

        return pokeData;

    } catch (e) {
        return null;
    }
}

// Função que obtem os dados de um pokemon da API
async function fetchPokemonData(pokemon){

    // O fetch() sempre retorna uma Promise
    let response = await fetch(pokemon.url);
    let pokeData = await response.json();

    return pokeData;
}


// Função que obtem os pokemons (nome e url) local ou API
async function fetchPokemon(){

    // Busca arquivo local se já possuir os dados dos pokemons
    console.log("Procurando dados locais...")
    let data = await loadLocal();

    if (data) {
        console.log("Usando dados locais...");
        console.log(data);

        pokemons = data;

        return;
    }


    console.log("Buscando da API...")
    let res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${OFFSET}`);
    
    // Teste: Pegar os dados pela geração
    // https://pokeapi.co/api/v2/generation/{id or name}/
    // let res = await fetch('https://pokeapi.co/api/v2/generation/1');
    
    // Pega a resposta da API (JSON) e converte em objeto JavaScript
    let allPokemon = await res.json();
    console.log(allPokemon)

    // Cria um array separado para cada requisição feita
    let promises = allPokemon.results.map(pokemon => 
        fetchPokemonData(pokemon)
    );
    
    // Salva o array após as requisições concluírem
    pokemons = await Promise.all(promises);

    // Ordena a lista pelo índice
    pokemons.sort((a, b) => a.id - b.id);
    console.log(pokemons);


    // Depois de carregar da API, salva em arquivo local
    saveLocal(pokemons);
}

fetchPokemon();