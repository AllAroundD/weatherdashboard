let inputCityEl = document.querySelector('#searchCity')
let citydetailsEL = document.querySelector("#citydetails")
let forecastEL = document.querySelector("#forecastDiv")
let searchWeatherHistoryEL = document.querySelector("#searchWeatherHistory")
let weatherHistory = localStorage.weatherHistory ? JSON.parse(localStorage.weatherHistory) : []

// this is to set the search history list
function initialize() {
    searchWeatherHistoryEL.innerHTML = ""
    for (let i = weatherHistory.length - 1; i >= 0; i--) {
        searchWeatherHistoryEL.innerHTML +=
            `<li class="list-group-item" onclick="historyClick('${weatherHistory[i]}')">${weatherHistory[i]}</li>`
    }
}

// this is to put the city name in the search and submit when the user clicks the item from the search history
function historyClick(city) {
    inputCityEl.value = city
    mainApp(city)
}

// this is to clear the search history from local storage and the search history section
function clearHistory() {
    delete localStorage.weatherHistory
    searchWeatherHistoryEL.innerHTML = ""
}

// convert temp to celsius
function convertTemp(temp) {
    return Math.round(((temp - 32) * 5 / 9) * 10) / 10
}

// this is to set badge colour based on uvi
function checkUV(uvi) {
    if (uvi > 10) {
        return "badge-dark"
    } else if (uvi < 10 && uvi > 7) {
        return "badge-danger"
    } else if (uvi < 7 && uvi > 5) {
        return "badge-warning"
    } else {
        return "badge-success"
    }
}

// this is to display the weather data for the searched city
function displayCurrentWeather(cityData, uvData) {
    let currentDate = moment().format('D/MM/YYYY')
    let uvBadgeColour = checkUV(uvData.current.uvi)

    citydetailsEL.innerHTML =
        `<div class="card-body">
        <h5 class="card-title">${cityData.name} (${currentDate}) <img src="http://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png" width="60" height="60"></h5>
        <p class="card-text" id="temp">Temperature: ${convertTemp(cityData.main.temp)} &#176;C</p>
        <p class="card-text" id="humidity">Humidity: ${cityData.main.humidity}%</p>
        <p class="card-text" id="windSpeed">Wind Speed: ${cityData.wind.speed} MPH</p>
        <p class="card-text" id="UVIndex">UV Index: <span class="badge ${uvBadgeColour}">${uvData.current.uvi}</span></p>
    </div>`
}

// this is to display the 5 day forecast for the searched city
function displayForecast(forecastData) {
    forecastEL.innerHTML = ""
    forecastData.list.forEach(function (item, index) {
        // the forecast list is 40 items, 8 items a day
        if (index < 40 && index % 8 == 0) {
            let futureDate = moment().add(index / 8 + 1, 'days').format('D/MM/YYYY')
            forecastEL.innerHTML +=
                `<div class="card-body forecastCard">
                <h5 class="card-title">${futureDate}</h5>
                <p><img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" width="40" height="40"></p>
                <p class="forecastTemp">Temp: ${convertTemp(item.main.temp)} &#176;C</p>
                <p class="forecasthumidity">Humidity: ${item.main.humidity} %</p>
            </div>`
        }
    })
}

// this is called to build the fetch query and to fetch the data for the 3 types of api calls ('daily', 'forecast', 'uvi')
async function fetchData(property, params = '') {
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
    return await fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                return response.json()
            }
            if (response.status == "404") {
                citydetailsEL.innerHTML = "City not found. Enter a valid city and please try your search again"
                inputCityEl.value = ""
                inputCityEl.focus()
                forecastEL.innerHTML = ""
            }
        })
        .catch(error => console.warn(error))

}

// this is the main function that calls to the api and builds the html
async function mainApp(city) {
    try {
        const forecastData = await fetchData('forecast', `q=${city}&units=imperial`)
        const cityData = await fetchData('weather', `q=${city}&units=imperial`)
        const coords = { lat: cityData.coord.lat, lon: cityData.coord.lon }
        const uvData = await fetchData('uv', `lat=${cityData.coord.lat}&lon=${cityData.coord.lon}&units=imperial`)
        if (forecastData.status === "404") {
            citydetailsEL.innerHTML = "City not found. Enter a valid city and please try your search again"
            inputCityEl.value = ""
            inputCityEl.focus()
            forecastEL.innerHTML = ""
        } else {
            displayCurrentWeather(cityData, uvData)
            displayForecast(forecastData)
            // Added this logic in case user clicks reload, not to add the city again to the array and localStorage
            if (cityData.name !== weatherHistory[weatherHistory.length - 1]) {
                weatherHistory.push(cityData.name)
                localStorage.weatherHistory = JSON.stringify(weatherHistory)
                initialize()
            }
        }
    } catch (e) {
        console.warn(e);
    }
}

// function to clean up string and Init cap
function cleanInput(inputString) {
    inputString = inputString.toLowerCase()
        .split(' ')
        .map((str) => str.charAt(0).toUpperCase() + str.substring(1))
        .join(' ')
    return inputString
}

// function being called when user enters city and clicks search
function getWeatherSearch(event) {
    event.preventDefault()

    // target entry, focus, and blank
    searchQuery = inputCityEl.value
    inputCityEl.focus()
    if (inputCityEl.value == '')
        return inputCityEl.value = ''
    searchQuery = cleanInput(searchQuery)
    mainApp(searchQuery)
}

// this sets the last city searched when page loads
window.onload = mainApp(weatherHistory[weatherHistory.length - 1])
if (weatherHistory != "")
    inputCityEl.value = weatherHistory[weatherHistory.length - 1]
initialize()