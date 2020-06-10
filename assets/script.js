let citydetailsEL = document.querySelector("#citydetails")
let forecastEL = document.querySelector("#forecastdetails")
let searchWeatherHistoryEL = document.querySelector("#searchWeatherHistory")
const max_search_count = 9

let weatherHistory = localStorage.weatherHistory ? JSON.parse(localStorage.weatherHistory) : []
console.log(`weatherHistory: ${weatherHistory}`)


function initialize(){
    searchWeatherHistoryEL.innerHTML = ""
    // let reversehistory = weatherHistory.reverse()
/*    weatherHistory.forEach(function (item, index) {
        console.log(`item: ${item}, index: ${index}`)
        searchWeatherHistoryEL.innerHTML +=
        `<li class="list-group-item" onclick="mainApp('${item}')">${item}</li>`
    })
*/
    for (let i = weatherHistory.length - 1; i>=0; i-- ){
        searchWeatherHistoryEL.innerHTML +=
        `<li class="list-group-item" onclick="mainApp('${weatherHistory[i]}')">${weatherHistory[i]}</li>`
    }
}

function clearHistory(){
    delete localStorage.weatherHistory
    searchWeatherHistoryEL.innerHTML = ""
}

// convert temp to celsius
function convertTemp(temp){
    return Math.round( ( (temp -32) * 5 / 9) *10)/10
}

// set badge colour based on uvi
function checkUV(uvi){
    if (uvi > 10){
        return "badge-dark"
    } else if (uvi < 10 && uvi > 7){
        return "badge-danger"
    } else if (uvi < 7 && uvi > 5){
        return "badge-warning"
    } else {
        return "badge-success"
    }
}

function displayCurrentWeather(cityData, uvData){
    let currentDate = moment().format('D/MM/YYYY')
    let uvBadgeColour = checkUV(uvData.current.uvi)
    // citydetailsEL.innerHTML = ""

    citydetailsEL.innerHTML =
    `<div class="card-body">
        <h5 class="card-title">${cityData.name} (${currentDate}) <img src="http://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png" width="60" height="60" ></h5>
        <p class="card-text" id="temp">Temperature: ${convertTemp(cityData.main.temp)} &#176;C</p>
        <p class="card-text" id="humidity">Humidity: ${cityData.main.humidity}</p>
        <p class="card-text" id="windSpeed">Wind Speed: ${cityData.wind.speed} MPH</p>
        <p class="card-text" id="UVIndex">UV Index: <span class="badge ${uvBadgeColour}">${uvData.current.uvi}</span></p>
    </div>`
}

function displayForecast(forecastData){
    forecastEL.innerHTML = ""

    forecastEL.innerHTML=
    `<img src="" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>`
}

async function fetchData(property, params=''){
    const apiKey = `4154e6ff36ce5d0b69504332f5e2b708`
    let queryURL = ""
    switch (property) {
        case 'weather':
            queryURL = "https://api.openweathermap.org/data/2.5/weather?"
            break;
        case 'forecast': 
            queryURL = "https://api.openweathermap.org/data/2.5/forecast?"
            break;
        case 'uv': 
            queryURL = "https://api.openweathermap.org/data/2.5/onecall?"
    }
    queryURL += `APPID=${apiKey}` + (params ? `&${params}` : '')
    console.log( `[mainApp] queryURL=${queryURL}` )
    return await fetch( queryURL ) 
        .then(function(response){
            if (response.ok) {
                return response.json()
            }
            if (response.status == "404"){
                citydetailsEL.innerHTML = "City not found. Please try and search again"}
        })
        .catch(error => console.warn(error))

}

async function mainApp( city ){
    try{
        console.log( `[mainApp] city=${city}` )
        const forecastData = await fetchData('forecast',`q=${city}&units=imperial`)
        console.log( `forecastData: `, forecastData )
        const cityData = await fetchData('weather',`q=${city}&units=imperial`)
        const coords = {lat: cityData.coord.lat, lon: cityData.coord.lon}
        const uvData = await fetchData('uv',`lat=${cityData.coord.lat}&lon=${cityData.coord.lon}&units=imperial`)

        // console.log( `cityData: `, cityData )
        // console.log( `coords: `, coords )
        // console.log( `uvData: `, uvData )
        console.log(`forecastData.cod: ${forecastData.cod}`)
        if (forecastData.status === "404") {
            citydetailsEL.innerHTML = "City not found. Please try and search again"
        } else {
            displayCurrentWeather(cityData, uvData)
            displayForecast(forecastData)
            // Added this logic in case user clicks reload
            if (cityData.name !== weatherHistory[weatherHistory.length-1]){
                weatherHistory.push(cityData.name)
                localStorage.weatherHistory = JSON.stringify(weatherHistory)
                initialize()
            }
        }
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

    console.log(`[getWeatherSearch] getting weather for: ${searchQuery}`)


    mainApp(searchQuery)
}

window.onload = mainApp( weatherHistory[weatherHistory.length-1] )
initialize()