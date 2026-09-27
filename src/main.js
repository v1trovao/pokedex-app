const FILEPATH_POKEDATA = "/src/pokedata.json"
const FILEPATH_POKEDETAILS = "/src/pokeDetalhes.json"
const FILEPATH_POKETEST = "/src/poketest.json"

let GENERATION = "i"
let TYPE = "all"

let pokemons = [];
let pokemonsRendered = []

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector('.fechar')
    btn.addEventListener('click', switchModal)

    window.onclick = function(event) {
        const modal = document.querySelector('.modal')
        if (event.target == modal) {
            switchModal();
        }
    }
    
    const selectType = document.getElementById("selectFilter")
    selectType.addEventListener("change", filterTypes)

    const selectGen = document.getElementById("selectGen");
    selectGen.addEventListener("change", filterGen)

    /* Teste do multiselect
    const selectBtn = document.querySelector(".select-btn"),
    items = document.querySelectorAll(".item");

    console.log(selectBtn.classList)
    selectBtn.addEventListener("click", () => {
        console.log("Clicou no select")
        selectBtn.classList.toggle("open");
        console.log(selectBtn.classList)
    })

    items.forEach((item => {
        item.addEventListener("click", () => {
            item.classList.toggle("checked");
            filterTypes2()
        })
    })) */
    loadPokedex();
})

// Função que obtem os dados de um pokemon da API
async function fetchPokemonData(pokemon){

    // O fetch() sempre retorna uma Promise
    let response = await fetch(pokemon.url);
    let pokeData = await response.json();

    return pokeData;
}

async function loadLocal(path){
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`Erro ao ler ${path}`);

        return await res.json();
    } catch (e) {
        console.error("Falha ao carregar dados do app:", erro);
        return null
    }
}

// Função de carregar do localStorage (stand-by)
function loadCache(item) {
    let cache = localStorage.getItem(item);

    if (cache) {
        console.log(`${item} carregado do cache`)
    } else {
        console.error(`${item} não encontrado`)
    }
}

// Função que obtem os dados salvos localmente
async function loadPokedex(){
    // Busca arquivo local se já possuir os dados dos pokemons
    pokemons = await loadLocal(FILEPATH_POKEDATA);
    //pokemonsDetails = await loadLocal(FILEPATH_POKEDETAILS)
    
    renderPokemons(pokemons.filter((pokemon) => pokemon.generation===GENERATION));
}

/* Visualizar Card */

// Função que carrega e renderiza o card de detalhes do pokemón
async function carregarInfoPokemon(pokemon){
    //const pokemonInfo = pokemonsDetails[pokemon.id]
    //console.log(pokemonInfo)

    const pokeInfo = document.getElementById("pokeInfo")
    const pokeHeader = document.getElementById("pokeGenus")
    const pokeContainer = document.getElementById(`poke-${pokemon.id}`)
    const pokeTypes = pokeContainer.querySelector('.type-box').innerHTML
    const type = pokeContainer.querySelector('.type-box .poke-type').innerHTML
    
    console.log(pokeContainer);
    console.log("Tipo encontrado: ", type);
    console.log(pokeTypes);

    // Transformação dos dados de altura (m) e peso (kg)
    const height = pokemon.height / 10
    const weight = pokemon.weight / 10

    document.getElementById("modal-card-genus").textContent = pokemon.genus
    document.getElementById("modal-card-id").textContent = pokemon.id
    document.getElementById("modal-card-name").innerHTML = pokemon.name;
    document.getElementById("modal-card-types").innerHTML = pokeTypes

    const pokeImg = document.getElementById(`modal-img`)
    pokeImg.src = pokemon.sprite

    pokeInfo.innerHTML = `

        <div class=poke-values>  
                
            <ul class="poke-dim">
            Abilities:
                    ${pokemon.abilities.map(item => 
                        `<li class='poke-value'> 
                            ${item}
                        </li>`).join('')}
            </li>
            </ul>

            <div class=poke-dim> 
                
                <p> Heigth:
                    <span class=poke-value> ${height} m </span>
                </p>
                <p> Weigth:
                <span class=poke-value> ${weight} kg </span>
                </p>
                
            </div>
        </div>
        
        Stats:
        <div class=poke-stats>
                ${pokemon.stats.map(item => 
                    `<div class='stat-row'> 
                        ${item.nome}
                    </div>
                    <div class='stat-value'>${item.valor} </div>
                    `).join('')}
                
        </div>
        <div class=poke-desc> 
            ${pokemon.description}
        </div>
    `
    pokeInfo.appendChild(renderEvolutionChain(pokemon))
    switchModal();

    console.log(pokemon)
    console.log(`Infos do pokemon ${pokemon.name}`)
    pokemon.types.forEach(type => {console.log(type)})
    pokemon.stats.forEach(stat => {console.log(stat.nome, stat.valor)})
    console.log("Weight: ", pokemon.weight)
    console.log("Height: ", pokemon.height)
}

// Função que renderiza a cadeia evolutiva de um pokemon (WIP)
function renderEvolutionChain(pokemon){

    // Agrupa a cadeia por estágio
    const stages = Object.groupBy(pokemon.evolutionChain, (evolution) => evolution.stage)
    console.log(stages)

    let evoContainer = document.createElement('div')
    //evoContainer.classList.add('poke-dim')
    evoContainer.classList.add('evolution-chain')
    
    evoContainer.innerHTML = "Evolution"
    
    // Itera por cada estágio
    for (let s in stages){
        
        let stageContainer = document.createElement('div')
        stageContainer.classList.add('stage-group')
        
        let stageName = document.createElement('h4');
        stageName.innerHTML = `Stage ${s}`
        
        console.log(stages[s].length)
        stages[s].forEach((stage) => {
            let pokeContainer = document.createElement('div')
            pokeContainer.classList.add('poke-card')
            let pokeName = document.createElement('p')
            pokeName.innerHTML = stage.pokemon
            
            let pokeImg = document.createElement('img')
            pokeImg.classList.add("pokeImg")
            console.log(pokemons.filter((pokemon) => pokemon.name === stage.pokemon)[0].sprite)
            pokeImg.src = pokemons.filter((pokemon) => pokemon.name === stage.pokemon)[0].sprite
            pokeImg.loading = "lazy"

            pokeContainer.append(pokeImg, pokeName)

            if (stage.current) {
                pokeContainer.classList.add('current')
            }

            stageContainer.appendChild(pokeContainer)
        })

        console.log(stages[s])
        evoContainer.append(stageName, stageContainer)
    }

    return evoContainer;
    
}

function renderPokemons(pokemonsList){
    let allPokemonContainer = document.getElementById('poke-container');

    allPokemonContainer.innerText = ""
    //console.log(pokemonsList)

    pokemonsList.forEach(pokemon => {

        /*console.log(pokemon)*/
        // Detalhes de um pokemon
        let pokeContainer = document.createElement('div')
        pokeContainer.classList.add('poke-card')
        pokeContainer.id = `poke-${pokemon.id}`
        pokeContainer.onclick = () => carregarInfoPokemon(pokemon)
        
        let pokeNumber = document.createElement('p')
        pokeNumber.innerText = `#${pokemon.id}`

        let pokeName = document.createElement('h4')
        pokeName.innerText = pokemon.name

        let pokeTypes = document.createElement('ul')
        pokeTypes.classList.add("type-box")
        createTypes(pokemon.types, pokeTypes)

        let pokeImg = document.createElement('img')
        pokeImg.classList.add("pokeImg")
        pokeImg.src = pokemon.sprite
        pokeImg.loading = "lazy"
        //pokeImg.onclick = () => carregarInfoPokemon(pokemon)
        
        // Junta todos os elementos a serem mostrado na página
        pokeContainer.append(pokeNumber, pokeImg, pokeName, pokeTypes)
        allPokemonContainer.appendChild(pokeContainer)
    })

}

function createTypes(types, ul) {
    types.forEach(function(type){
        let typeLi = document.createElement('li');
        typeLi.classList.add("poke-type")
        typeLi.classList.add(type)
        typeLi.innerText = type;
        ul.append(typeLi)
    })
}

/* Buscar Pokémon*/
// Função que filtra a lista dos pokemons pelo nome digitado

// A lógica precisa adaptar com o filtro da geração
function searchPokemonByName() {
    
    const name = document.getElementById('pokemonName').value.toLowerCase()
    
    // Verifica se a barra de busca possui caracteres
    if (name) {

        const foundPokemons = pokemons
            .filter(pokemon => pokemon.generation === GENERATION)
            .filter(pokemon => TYPE === "all" || pokemon.types.includes(TYPE))
            .filter(pokemon => pokemon.name
                .toLowerCase()
                .includes(name))
        
        console.log(foundPokemons)
        
        // Renderiza na tela apenas se encontrou 
        renderPokemons(foundPokemons)

    } else {
        return renderPokemons(pokemons
            .filter((pokemon) => pokemon.generation === GENERATION)
            .filter(pokemon => TYPE === "all" || pokemon.types.includes(TYPE))
        )
    }
}


/* Filtrar pokemons */

// Função que filtra a lista de pokemons pelo tipo selecionado
const filterTypes = (event) => {
    TYPE = event.target.value
    console.log("Tipo filtrado: ", TYPE)

    if (TYPE !== "all") {
        // Limpa a tela p fazer a busca (o filtro...)

        const filterPokemons = pokemons
        .filter(pokemon => pokemon.types.includes(TYPE))
        .filter(pokemon => pokemon.generation === GENERATION);

        renderPokemons(filterPokemons)
    }
    else {
        renderPokemons(pokemons.filter(
            pokemon => pokemon.generation === GENERATION
        ))
    }
}

// Função que filtra a lista de pokemons pela geração
const filterGen = (event) => {
    GENERATION = event.target.value
    console.log("Geração escolhida: ", GENERATION)

    renderPokemons(pokemons
        .filter((pokemon) => pokemon.generation === GENERATION)
        .filter((pokemon) => TYPE === "all" || pokemon.types.includes(TYPE))
    )
}

// Função de filtrar tipos do multi-select (stand-by)
/*const filterTypes2 = () => {
    const checked = document.querySelectorAll(".checked");
    const btnText = document.querySelector(".btn-text");
    console.log(checked)
    
    pokeContainer = document.getElementById('poke-container')
    
    const selectedTypes = []
    const foundPokemon = []

    if (checked && checked.length > 0) {
        pokeContainer.innerText = ""
        for (const value of checked.values()){
            selectedTypes.push(value.id);
        }
        console.log(selectedTypes)
        for (const pokemon of pokemons) {
            for (const type of selectedTypes) {
                if (!foundPokemon.includes(pokemon) & pokemon.types.includes(type))
                    foundPokemon.push(pokemon)
            }
        }

        console.log(foundPokemon.length)
        btnText.innerText = `${checked.length} Selected`;
        renderPokemons(foundPokemon)
    } else {
        btnText.innerText = 'Types';
        pokeContainer.innerText = ""
        renderPokemons(pokemons)
    }

    
}*/

// Função que modifica o estado visível do modal
const switchModal = () => {
    const modal = document.querySelector('.modal')
    const pokeInfo = document.querySelector('.poke-info')
    const actualStyle = modal.style.display
    
    if (actualStyle == 'block') {
        pokeInfo.scrollTop = 0;
        modal.style.display = 'none'
    } else {
        modal.style.display = 'block'
    }
}