const path = require("path");
const fs = require("fs");
const { time } = require("console");

const LIMIT = 151; // Total de pokemons
const OFFSET = 0;   // Começar de qual ID

const FILEPATH_POKEDATA= "../pokedata2.json"
const FILEPATH_DETAILS = "../pokeDetalhes.json"
const FILEPATH_POKETEST="../poketest.json"

const pokeData = [];
const details = {};


let generations = {
    kanto: {limit: 151, offset: 0},
    johto: {limit: 100, offset: 151},
    hoenn: {limit: 135, offset: 251},
    sinnoh:{limit: 108, offset: 386},
    unova: {limit: 155, offset: 494},
    kalos: {limit: 72, offset: 649},
    alola: {limit: 88, offset: 721},
    galar: {limit: 96, offset: 809},
    paldea: {limit: 120, offset: 905}
}

// Salvar os dados obtidos da API localmente (in-testes)
function saveLocal(filename){
    let jsonPokeData = JSON.stringify(pokeData, null, 2);
    //let jsonDetail = JSON.stringify(details, null, 2);

    const pokePath = path.join(__dirname, filename);
    fs.writeFileSync(pokePath, jsonPokeData);
    //fs.writeFileSync(path.join(__dirname, FILEPATH_DETAILS), jsonDetail)
    console.log(`\n Teste salvo em ${pokePath}`)
}

async function fetchPokemonTest(){

        let res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=5`);
        
        // Pega a resposta da API (JSON) e converte em objeto JavaScript
        let allPokemon = await res.json();

        console.log(allPokemon)
        // Cria um array separado para cada requisição feita
        let promises = allPokemon.results.map(pokemon => 
            // Inicia a requisição dos dados de um pokemon
            fetchPokemonData(pokemon)
        );
        
        // Salva o array após as requisições concluírem
        let pokemons = await Promise.all(promises);
        //console.log(pokemons);

        // Distribui os dados para organizar a base
        pokemons.forEach(item => {
            pokeData.push(item);
        });

        // Ordena a lista pelo índice
        pokeData.sort((a, b) => a.id - b.id);
        
        console.log("Dados obtidos...")
        console.log(pokeData);
        saveLocal(FILEPATH_POKETEST)
}

/* (Stand-by) Função que retorna a cadeia evolutiva de um pokemon */
function getEvolutionChain(current, evolution, stage = 1) {
    let resultado = []
    let evoDetails = {}
    //console.log("Pokemon atual: ", evolution.species.name)
    
    const details = evolution.evolution_details[0]
    

    if (details)
    {
        evoDetails = Object.keys(details)
            .filter(k => details[k] !== null && details[k] !== false && details[k] !== '')
            .reduce((acc, k) => ({...acc, [k]: details[k] }), {})

        //console.log(evoDetails)
    }

    resultado.push({
        pokemon: evolution.species.name,
        stage: stage,
        current: current === evolution.species.name? true : false,
        evolution_details: evoDetails
    })

    for (let evo of evolution.evolves_to){
        resultado = resultado.concat(getEvolutionChain(current, evo, stage+1));
    }

    return resultado;
}

// Função que obtem os dados de um pokemon da API
async function fetchPokemonData(pokemon){
    try {
        // Primeira requisição - Id, tipos, sprites e stats
        // O fetch() sempre retorna uma Promise
        //console.log(pokemon.url)
        const resPoke = await fetch(pokemon.url);

        const poke = await resPoke.json();

        //console.log(poke.species.url)
        // Segunda requisição - Uso da URL auxiliar para buscar a descrição/evolução
        const resSpecies = await fetch(poke.species.url);
  
        const species = await resSpecies.json();

        // Terceira requisição - Obter a cadeia evolutiva d
        const resEvolution = await fetch(species.evolution_chain.url)
        //console.log(species.evolution_chain.url)
        const evo = await resEvolution.json()
        const generation = await species.generation.name;

        // Verifica se a propriedade 'name' realmente existe na raiz do objeto
        /*if (species.habitat === null) {
            console.log(`Pokemon ${pokemon.name} não tem habitat especificado...`);
        }*/
        
        return {
                id: poke?.id || "???",
                name: species.name || "Pokemon indisponível",
                types: poke.types.map(t => t.type.name),
                sprite: poke.sprites.front_default,
                stats: poke.stats.map(s => ({ nome: s.stat.name, valor: s.base_stat })),
                abilities: poke.abilities.map(a => a.ability.name),
                height: poke.height,
                weight: poke.weight,
                generation: generation.slice(11),
                color: species.color.name,
                habitat: species.habitat?.name || "N/A",
                description: species.flavor_text_entries.find(f => f.language.name === "en").flavor_text.replace(/[\n\f]/g, ' '),
                evolutionChain: getEvolutionChain(pokemon.name, evo.chain),
                genus: species.genera.find(g => g.language.name === "en").genus,
            }
        } catch (e) {
        console.error(`${e.message} ao acessar: ${pokemon.url}`);
        return null;
    }
}

async function fetchAllPokemon() {
    //console.log("Buscando da API...")

    for (const gen in generations){
        console.log(`Geração ${gen}`)
        console.log(generations[gen].limit)

        await fetchPokemon(generations[gen].limit, generations[gen].offset)
    }

    // Depois de carregar da API, salva em arquivo local
    saveLocal(FILEPATH_POKEDATA);
}

const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Função que obtem os pokemons (nome e url) local ou API
async function fetchPokemon(limit, offset){

    console.log("Buscando da API...")

    let res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    
    // Pega a resposta da API (JSON) e converte em objeto JavaScript
    let allPokemon = await res.json();

    console.log(`Obtendo dados de ${allPokemon.results.length} pokémons...`)
    
    
    // Cria um array separado para cada requisição feita
    let promises = await allPokemon.results.map(pokemon => 
        // Inicia a requisição dos dados de um pokemon
        fetchPokemonData(pokemon)
    );

    // Salva o array após as requisições concluírem
    let pokemons = await Promise.all(promises);

    // Distribui os dados para organizar a base
    pokemons.forEach(item => {
        pokeData.push(item);
    });

    /*for (const pokemon of allPokemon.results) {
        try {
            console.log(pokemon)
            let item = await fetchPokemonData(pokemon);
            pokeData.push(item);

            //await timeout(20);
        }
        catch (e) {
            console.error(`${e}, ao baixar dados de ${pokemon.name}!`)
        }
    }*/
    // Ordena a lista pelo índice
    pokeData.sort((a, b) => a.id - b.id);
    //console.log(pokeData);
}

fetchAllPokemon();
//fetchPokemonTest();