/*
fetch ("https://pokeapi.co/api/v2/ability/1/")
.then(response => response.json())
.then(json => console.log(json))
.catch(error => console.error("Error al hacer fetch:", error));
*/


const funcionAnonima = async ()=>{
    try{ 
        const response = await fetch ("https://pokeapi.co/api/v2/")
        const json = await response.json()
        console.log(json.results[3].name)
    }
    catch(error){
        console.log(error)
    }   

}
funcionAnonima();