
let defaultCityHistory = []


let cityHistory = localStorage.cityHistory ? JSON.parse(localStorage.cityHistory) : defaultCityHistory
console.log(`cityHistory: ${cityHistory}`);

async function fetchData(property, params=''){
    const apiKey = `4154e6ff36ce5d0b69504332f5e2b708`;
    let queryURL = "";
    switch (property) {
        case 'weather':
            queryURL = "https://api.openweathermap.org/data/2.5/weather?";
            break;
        case 'forecast': 
            queryURL = "https://api.openweathermap.org/data/2.5/forecast?";
            break;
        case 'uv': 
            queryURL = "https://api.openweathermap.org/data/2.5/onecall?";
    }
    queryURL += `APPID=${apiKey}` + (params ? `&${params}` : '');
    console.log( `[mainApp] queryURL=${queryURL}` );
    return await fetch( queryURL ).then( response=>response.json() );
}

async function mainApp( city ){
    try{
        console.log( `[mainApp] city=${city}` );
        const forecastData = await fetchData('forecast',`q=${city}`);
        console.log( `forecastData: `, forecastData );
        const cityData = await fetchData('weather',`q=${city}`);
        const coords = {lat: cityData.coord.lat, lon: cityData.coord.lon}
        const uvData = await fetchData('uv',`lat=${cityData.coord.lat}&lon=${cityData.coord.lon}`)

        console.log( `cityData: `, cityData );
        console.log( `coords: `, coords );
        console.log( `uvData: `, uvData )
    } catch( e ){
        console.log( e );
    }
}

// function to clean up string and Init cap
function cleanInput(inputString){
    inputString = inputString.toLowerCase()
    .split(' ')
    .map( (str) => str.charAt(0).toUpperCase() + str.substring(1))
    .join(' ')
    return inputString
}

// function being called when user enters city and clicks search
function getWeatherSearch(event){
    event.preventDefault()

    // target entry, focus, and blank
    inputCityEl = document.querySelector('#searchCity')
    searchQuery = inputCityEl.value
    inputCityEl.focus() 
    if (inputCityEl.value == '') 
        return inputCityEl.value = ''
    searchQuery=cleanInput(searchQuery);

    console.log(`[getWeatherSearch] getting weather for: ${searchQuery}`);


    mainApp(searchQuery);
}


console.log( `starting...` );
